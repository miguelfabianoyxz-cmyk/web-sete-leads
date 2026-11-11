import { Lead, SearchFilterState, ApiSettings, WebsiteStatus } from '../types';
import { COUNTRIES } from '../data/locations';
import { NICHES } from '../data/niches';
import { hasValidWhatsApp } from '../utils/phoneUtils';

type Country = typeof COUNTRIES[0];
type State = Country['states'][0];
type Niche = typeof NICHES[0];

/**
 * REGRA DE OURO: este serviço NUNCA inventa dados.
 * Só aparece o que vem do OpenStreetMap ou do Google Places. Campo que a fonte
 * não informa (nota, avaliações, horário, e-mail...) fica vazio e a UI o oculta.
 */

const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter'
];

const SOCIAL_RE = /instagram\.com|facebook\.com|fb\.com|fb\.me|linktr\.ee|linktree|wa\.me|beacons\.ai|bio\.link|taplink|campsite\.bio/i;
const CACHE_TTL = 30 * 60 * 1000;

// ---------- utilidades ----------
function readCache<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const { t, v } = JSON.parse(raw);
    return Date.now() - t < CACHE_TTL ? (v as T) : null;
  } catch {
    return null;
  }
}

function writeCache(key: string, value: unknown) {
  try {
    sessionStorage.setItem(key, JSON.stringify({ t: Date.now(), v: value }));
  } catch {
    // sem cache, sem problema
  }
}

async function fetchWithTimeout(url: string, init: RequestInit, ms: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

const isoOf = (code: string) => (code === 'UK' ? 'gb' : code.toLowerCase());
const errMsg = (e: unknown) => (e instanceof Error ? e.message : String(e));

function normalizeUrl(url: string): string {
  const u = url.trim();
  return /^https?:\/\//i.test(u) ? u : `https://${u}`;
}

function classifySite(url: string): WebsiteStatus {
  return SOCIAL_RE.test(url) ? 'SOCIAL_ONLY' : 'HAS_WEBSITE';
}

function instagramFrom(value: string): string | undefined {
  const v = value.trim();
  if (!v) return undefined;
  if (/^https?:\/\//i.test(v)) return v;
  const handle = v.replace(/^@/, '').replace(/^(www\.)?instagram\.com\//i, '').replace(/\/$/, '');
  return handle ? `https://www.instagram.com/${handle}/` : undefined;
}

function calculateOpportunityScore(status: WebsiteStatus, rating: number | undefined, reviews: number | undefined, hasPhone: boolean): number {
  let score = 50;
  if (status === 'NO_WEBSITE') score += 35;
  if (status === 'NO_LANDING_PAGE') score += 28;
  if (status === 'SOCIAL_ONLY') score += 25;
  if (status === 'BROKEN_WEBSITE') score += 32;
  if (rating !== undefined) score += rating >= 4.5 ? 10 : rating >= 4.0 ? 6 : 0;
  if (reviews !== undefined) score += reviews > 50 ? 8 : reviews > 20 ? 4 : 0;
  if (hasPhone) score += 5;
  return Math.min(99, score);
}

// ---------- API pública ----------
export async function searchLeadsService(
  filter: SearchFilterState,
  apiSettings: ApiSettings
): Promise<{ leads: Lead[]; searchMode: string; totalFound: number }> {
  const country = COUNTRIES.find((c) => c.code === filter.countryCode) || COUNTRIES[0];
  const state = country.states.find((s) => s.code === filter.stateCode) || country.states[0];
  const city = filter.city || state.cities[0] || 'São Paulo';
  const niche = NICHES.find((n) => n.id === filter.category) || NICHES[0];
  const errors: string[] = [];

  if (apiSettings.googlePlacesApiKey && (filter.searchSource === 'google_places' || filter.searchSource === 'auto')) {
    try {
      const raw = await fetchFromGooglePlaces(country, state, city, niche, filter, apiSettings.googlePlacesApiKey);
      if (raw.length > 0) {
        const leads = applyPostFilters(raw, filter);
        return { leads, searchMode: 'Google Places (empresas reais)', totalFound: raw.length };
      }
    } catch (e) {
      errors.push(`Google Places: ${errMsg(e)}`);
    }
  }

  if (filter.searchSource !== 'google_places' || errors.length > 0 || !apiSettings.googlePlacesApiKey) {
    try {
      const raw = await fetchFromOverpass(country, state, city, niche, apiSettings, filter.onlyWithPhone || filter.whatsappFilter === 'WITH_WHATSAPP');
      if (raw.length > 0) {
        const leads = applyPostFilters(raw, filter);
        return { leads, searchMode: 'OpenStreetMap (empresas reais)', totalFound: raw.length };
      }
      errors.push('OpenStreetMap: nenhum estabelecimento com nome cadastrado nesta busca.');
    } catch (e) {
      errors.push(`OpenStreetMap: ${errMsg(e)}`);
    }
  }

  throw new Error(
    `Nenhum lead real encontrado. ${errors.join(' ')} Tente outro nicho/cidade ou configure a chave do Google Places em Configurações.`.trim()
  );
}

// ---------- geocodificação ----------
async function geocodeCity(city: string, stateName: string, country: Country): Promise<[number, number]> {
  const key = `geo:${country.code}:${stateName}:${city}`;
  const cached = readCache<[number, number]>(key);
  if (cached) return cached;

  const params = new URLSearchParams({
    q: `${city}, ${stateName}, ${country.name}`,
    format: 'json',
    limit: '1',
    countrycodes: isoOf(country.code)
  });
  const res = await fetchWithTimeout(`https://nominatim.openstreetmap.org/search?${params}`, { headers: { Accept: 'application/json' } }, 8000);
  if (!res.ok) throw new Error('serviço de localização indisponível no momento.');
  const data = await res.json();
  const lat = parseFloat(data?.[0]?.lat);
  const lon = parseFloat(data?.[0]?.lon);
  if (isNaN(lat) || isNaN(lon)) throw new Error(`cidade "${city}" não localizada.`);

  const coords: [number, number] = [lat, lon];
  writeCache(key, coords);
  return coords;
}

// ---------- OpenStreetMap ----------
async function fetchFromOverpass(country: Country, state: State, cityName: string, niche: Niche, apiSettings: ApiSettings, onlyContact: boolean): Promise<Lead[]> {
  const [lat, lon] = await geocodeCity(cityName, state.name, country);
  const cacheKey = `osm3:${country.code}:${state.code}:${cityName}:${niche.id}:${onlyContact ? 'c' : 'a'}`;
  // exige telefone/WhatsApp cadastrado já na consulta, para não gastar o limite com empresas sem contato
  const contactSel = onlyContact ? '[~"^(phone|contact:phone|mobile|contact:mobile|phone:mobile|whatsapp|contact:whatsapp|telephone)$"~"."]' : '';
  const cached = readCache<Lead[]>(cacheKey);
  if (cached) return cached;

  const endpoints = apiSettings.overpassCustomEndpoint ? [apiSettings.overpassCustomEndpoint, ...OVERPASS_ENDPOINTS] : OVERPASS_ENDPOINTS;
  const uniqueEndpoints = endpoints.filter((e, i) => endpoints.indexOf(e) === i);

  // Consultas pequenas (várias leves em vez de uma pesada) evitam o erro 504 em cidades grandes
  let groups: string[][];
  if (niche.id === 'todos_comercios') {
    groups = [
      ['nwr["shop"]["name"]'],
      ['nwr["amenity"~"restaurant|cafe|fast_food|bar|pub"]["name"]'],
      ['nwr["amenity"~"pharmacy|dentist|beauty_salon|clinic|veterinary|car_wash|car_repair"]["name"]'],
      ['nwr["craft"]["name"]', 'nwr["office"]["name"]']
    ];
  } else {
    groups = [
      niche.osmFilter.split('|').map((pair) => {
        const [k, v] = pair.split('=');
        return `nwr["${k}"="${v}"]["name"]`;
      })
    ];
  }

  const runOverpass = async (query: string): Promise<any[]> => {
    let last = 'servidor sem resposta.';
    for (const endpoint of uniqueEndpoints) {
      try {
        const res = await fetchWithTimeout(
          endpoint,
          { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }, body: `data=${encodeURIComponent(query)}` },
          25000
        );
        if (!res.ok) {
          last = `servidor retornou ${res.status}.`;
          continue;
        }
        const data = await res.json();
        if (Array.isArray(data.elements)) return data.elements;
      } catch (e) {
        last = errMsg(e);
      }
    }
    throw new Error(last);
  };

  let elements: any[] | null = null;
  let lastError = 'servidores públicos do OpenStreetMap sobrecarregados. Tente novamente em instantes.';

  for (const radius of [6000, 3000]) {
    const results = await Promise.allSettled(
      groups.map((sels) =>
        runOverpass(`[out:json][timeout:20];(${sels.map((x) => `${x}${contactSel}(around:${radius},${lat},${lon});`).join('')});out center 80;`)
      )
    );
    const ok = results.filter((r): r is PromiseFulfilledResult<any[]> => r.status === 'fulfilled');
    const failed = results.find((r): r is PromiseRejectedResult => r.status === 'rejected');
    if (failed) lastError = errMsg(failed.reason);
    const merged = ok.flatMap((r) => r.value);
    if (merged.length > 0) {
      elements = merged;
      break;
    }
    if (ok.length === results.length) elements = []; // respondeu, mas sem empresas
  }
  if (!elements) throw new Error(lastError);

  const seen = new Set<string>();
  const leads: Lead[] = [];

  for (const el of elements) {
    const tags: Record<string, string> = el.tags || {};
    const name = tags.name;
    const elLat = el.lat ?? el.center?.lat;
    const elLng = el.lon ?? el.center?.lon;
    if (!name || elLat === undefined || elLng === undefined) continue;

    // remove duplicatas (mesmo estabelecimento como ponto e como área)
    const dedupeKey = `${name.toLowerCase()}|${elLat.toFixed(3)}|${elLng.toFixed(3)}`;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);

    const rawWebsite = tags.website || tags['contact:website'] || tags.url || '';
    const rawPhone = tags.phone || tags['contact:phone'] || tags.mobile || tags['contact:mobile'] || tags['phone:mobile'] || tags.telephone || '';
    const rawWhats = tags.whatsapp || tags['contact:whatsapp'] || '';
    const rawInstagram = tags['contact:instagram'] || tags.instagram || tags['social:instagram'] || '';
    const rawFacebook = tags['contact:facebook'] || tags.facebook || '';

    const instagramUrl = instagramFrom(rawInstagram) || (/instagram\.com/i.test(rawWebsite) ? normalizeUrl(rawWebsite) : undefined);

    let websiteStatus: WebsiteStatus = 'NO_WEBSITE';
    let detectedUrl: string | undefined;
    if (rawWebsite) {
      websiteStatus = classifySite(rawWebsite);
      detectedUrl = normalizeUrl(rawWebsite);
    } else if (instagramUrl || rawFacebook) {
      websiteStatus = 'SOCIAL_ONLY';
      detectedUrl = instagramUrl || normalizeUrl(rawFacebook);
    }

    // WhatsApp só quando o número realmente é celular/WhatsApp (nunca telefone fixo)
    const whatsDigits = (rawWhats || rawPhone).replace(/\D/g, '');
    const whatsapp = whatsDigits && hasValidWhatsApp({ whatsapp: rawWhats || undefined, phone: rawPhone || undefined }) ? whatsDigits : undefined;

    const street = tags['addr:street'] || tags['addr:place'] || '';
    const parts = [
      street ? `${street}${tags['addr:housenumber'] ? ', ' + tags['addr:housenumber'] : ''}` : '',
      tags['addr:suburb'] || tags['addr:district'] || '',
      `${cityName} - ${state.code}`
    ].filter(Boolean);

    const hours = (tags.opening_hours || '').trim();

    leads.push({
      id: `osm-${el.type}-${el.id}`,
      name,
      category: resolveDynamicCategory(tags, niche.name),
      categoryKey: niche.id,
      country: country.name,
      countryCode: country.code,
      state: state.name,
      city: cityName,
      address: parts.join(' - '),
      phone: rawPhone || undefined,
      whatsapp,
      email: tags.email || tags['contact:email'] || undefined,
      websiteStatus,
      detectedUrl,
      instagramUrl,
      lat: elLat,
      lng: elLng,
      source: 'openstreetmap',
      sourceUrl: `https://www.openstreetmap.org/${el.type}/${el.id}`,
      stage: 'novo',
      opportunityScore: calculateOpportunityScore(websiteStatus, undefined, undefined, Boolean(rawPhone)),
      estimatedMonthlyLoss: niche.estMonthlyLoss,
      missingFeatures: niche.typicalPainPoints,
      closingHours: hours ? hours.slice(0, 60) : undefined,
      googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ' ' + cityName)}`,
      createdAt: new Date().toISOString()
    });
  }

  // contatos diretos primeiro: WhatsApp, depois telefone
  leads.sort((a, b) => Number(Boolean(b.whatsapp)) - Number(Boolean(a.whatsapp)) || Number(Boolean(b.phone)) - Number(Boolean(a.phone)));
  writeCache(cacheKey, leads);
  return leads;
}

// ---------- Google Places (New) ----------
async function fetchFromGooglePlaces(country: Country, state: State, cityName: string, niche: Niche, filter: SearchFilterState, apiKey: string): Promise<Lead[]> {
  const textQuery = `${niche.keywords[0]}${filter.customKeyword ? ' ' + filter.customKeyword : ''} em ${cityName}, ${state.name}`;
  const languageCode = country.code === 'BR' || country.code === 'PT' ? 'pt' : country.code === 'ES' ? 'es' : 'en';
  const fieldMask = [
    'places.id', 'places.displayName', 'places.formattedAddress', 'places.nationalPhoneNumber', 'places.internationalPhoneNumber',
    'places.websiteUri', 'places.rating', 'places.userRatingCount', 'places.location', 'places.googleMapsUri', 'places.businessStatus',
    'places.regularOpeningHours.weekdayDescriptions', 'nextPageToken'
  ].join(',');

  const places: any[] = [];
  let pageToken: string | undefined;

  for (let page = 0; page < 3; page++) {
    const res = await fetchWithTimeout(
      'https://places.googleapis.com/v1/places:searchText',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': apiKey, 'X-Goog-FieldMask': fieldMask },
        body: JSON.stringify({ textQuery, pageSize: 20, languageCode, regionCode: isoOf(country.code), ...(pageToken ? { pageToken } : {}) })
      },
      15000
    );
    if (!res.ok) throw new Error(`a API respondeu ${res.status} (verifique a chave e se a Places API (New) está ativada).`);
    const data = await res.json();
    places.push(...(data.places || []));
    pageToken = data.nextPageToken;
    if (!pageToken) break;
  }

  const todayIdx = (new Date().getDay() + 6) % 7; // Google: 0 = segunda
  const seen = new Set<string>();
  const leads: Lead[] = [];

  for (const p of places) {
    const name: string | undefined = p.displayName?.text;
    if (!name || !p.id || seen.has(p.id)) continue;
    if (p.businessStatus && p.businessStatus !== 'OPERATIONAL') continue; // ignora fechadas
    seen.add(p.id);
    if (filter.onlyWithPhone && !p.nationalPhoneNumber && !p.internationalPhoneNumber) continue;

    const rawWebsite: string = p.websiteUri || '';
    const phone: string = p.nationalPhoneNumber || p.internationalPhoneNumber || '';
    const websiteStatus: WebsiteStatus = rawWebsite ? classifySite(rawWebsite) : 'NO_WEBSITE';
    const rating: number | undefined = typeof p.rating === 'number' ? p.rating : undefined;
    const reviewsCount: number | undefined = typeof p.userRatingCount === 'number' ? p.userRatingCount : undefined;
    const intl = (p.internationalPhoneNumber || '').replace(/\D/g, '');

    leads.push({
      id: `google-${p.id}`,
      name,
      category: niche.name,
      categoryKey: niche.id,
      country: country.name,
      countryCode: country.code,
      state: state.name,
      city: cityName,
      address: p.formattedAddress || `${cityName} - ${state.code}`,
      phone: phone || undefined,
      whatsapp: intl && hasValidWhatsApp({ phone: p.internationalPhoneNumber }) ? intl : undefined,
      rating,
      reviewsCount,
      websiteStatus,
      detectedUrl: rawWebsite || undefined,
      instagramUrl: /instagram\.com/i.test(rawWebsite) ? rawWebsite : undefined,
      lat: p.location?.latitude ?? 0,
      lng: p.location?.longitude ?? 0,
      source: 'google_places',
      sourceUrl: p.googleMapsUri || undefined,
      stage: 'novo',
      opportunityScore: calculateOpportunityScore(websiteStatus, rating, reviewsCount, Boolean(phone)),
      estimatedMonthlyLoss: niche.estMonthlyLoss,
      missingFeatures: niche.typicalPainPoints,
      closingHours: p.regularOpeningHours?.weekdayDescriptions?.[todayIdx],
      googleMapsUrl: p.googleMapsUri || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ' ' + cityName)}`,
      createdAt: new Date().toISOString()
    });
  }
  return leads;
}

// ---------- categorias e filtros ----------
function resolveDynamicCategory(tags: Record<string, string>, defaultName: string): string {
  const shop: Record<string, string> = {
    supermarket: 'Supermercado / Mercearia', convenience: 'Supermercado / Mercearia', grocery: 'Supermercado / Mercearia',
    clothes: 'Loja de Roupas & Moda', boutique: 'Loja de Roupas & Moda', fashion: 'Loja de Roupas & Moda',
    shoes: 'Loja de Calçados', bakery: 'Padaria & Confeitaria', pastry: 'Padaria & Confeitaria',
    hairdresser: 'Salão de Beleza / Barbearia', beauty: 'Clínica de Estética & Beleza', cosmetics: 'Clínica de Estética & Beleza',
    car_repair: 'Oficina Mecânica & Auto', pet: 'Pet Shop', optician: 'Ótica & Óculos', jewelry: 'Joalheria & Acessórios',
    florist: 'Floricultura & Decoração', furniture: 'Móveis & Decoração'
  };
  const amenity: Record<string, string> = {
    restaurant: 'Restaurante & Gastronomia', cafe: 'Cafeteria & Bistrô', fast_food: 'Lanchonete & Fast Food', bar: 'Bar, Pub & Chopp',
    pub: 'Bar, Pub & Chopp', pharmacy: 'Farmácia & Drogaria', dentist: 'Clínica Odontológica', clinic: 'Clínica Médica & Saúde',
    doctors: 'Clínica Médica & Saúde', veterinary: 'Clínica Veterinária', car_wash: 'Lava Rápido & Estética Auto',
    school: 'Escola & Cursos', language_school: 'Escola & Cursos'
  };
  const craft: Record<string, string> = {
    carpenter: 'Marcenaria & Móveis Planejados', glaziery: 'Vidraçaria', electrician: 'Instalações & Elétrica', plumber: 'Encanador & Reformas'
  };
  const office: Record<string, string> = { lawyer: 'Escritório de Advocacia', accountant: 'Contabilidade & Consultoria', estate_agent: 'Imobiliária' };

  if (tags.shop) return shop[tags.shop] || `Loja de ${tags.shop.charAt(0).toUpperCase() + tags.shop.slice(1)}`;
  if (tags.amenity && amenity[tags.amenity]) return amenity[tags.amenity];
  if (tags.craft) return craft[tags.craft] || 'Serviços Especializados';
  if (tags.office) return office[tags.office] || 'Escritório & Consultoria';
  return defaultName;
}

function applyPostFilters(leads: Lead[], filter: SearchFilterState): Lead[] {
  const kw = filter.customKeyword.trim().toLowerCase();
  return leads.filter((l) => {
    if (filter.statusFilter === 'NO_WEBSITE' && l.websiteStatus !== 'NO_WEBSITE') return false;
    if (filter.statusFilter === 'NO_LANDING_PAGE' && l.websiteStatus !== 'NO_LANDING_PAGE') return false;
    if (filter.statusFilter === 'SOCIAL_ONLY' && l.websiteStatus !== 'SOCIAL_ONLY') return false;
    if (filter.statusFilter === 'WITHOUT_ANY_SITE' && l.websiteStatus === 'HAS_WEBSITE') return false;
    if (filter.whatsappFilter === 'WITH_WHATSAPP' && !hasValidWhatsApp(l)) return false;
    if (filter.whatsappFilter === 'WITHOUT_WHATSAPP' && hasValidWhatsApp(l)) return false;
    if (filter.onlyWithPhone && !l.phone && !l.whatsapp) return false;
    if (filter.minRating > 0 && (l.rating ?? 0) < filter.minRating) return false;
    if (kw && !l.name.toLowerCase().includes(kw) && !l.address.toLowerCase().includes(kw)) return false;
    return true;
  });
}
