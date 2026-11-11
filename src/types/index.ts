export type WebsiteStatus = 
  | 'NO_WEBSITE'          // Nenhum site encontrado
  | 'NO_LANDING_PAGE'     // Tem linktree/página simples sem foco em conversão
  | 'SOCIAL_ONLY'         // Possui apenas Instagram / Facebook
  | 'BROKEN_WEBSITE'      // Domínio expirado ou erro HTTP
  | 'HAS_WEBSITE';        // Já possui site completo

export type LeadStage = 'novo' | 'contatado' | 'em_negociacao' | 'ganho' | 'perdido';

export interface Lead {
  id: string;
  name: string;
  category: string;
  categoryKey?: string;
  country: string;
  countryCode: string;
  state: string;
  city: string;
  address: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  rating?: number;
  reviewsCount?: number;
  websiteStatus: WebsiteStatus;
  detectedUrl?: string; // ex: instagram.com/loja ou vazio
  instagramUrl?: string; // URL direta do Instagram
  lat: number;
  lng: number;
  source: 'openstreetmap' | 'google_places' | 'imported';
  sourceUrl?: string; // link verificável do registro original (OSM / Google Maps)
  stage: LeadStage;
  notes?: string;
  opportunityScore: number; // 0 to 100
  estimatedMonthlyLoss: number; // ex: R$ 3.500/mês
  missingFeatures: string[];
  closingHours?: string; // ex: Fecha às 19:00 ou Seg-Sáb 08:00-19:00
  isOpenNow?: boolean;
  googleMapsUrl?: string;
  createdAt: string;
  contactedAt?: string;
  dealValue?: number;
}

export interface LocationCountry {
  code: string;
  name: string;
  flag: string;
  states: LocationState[];
  center: [number, number];
}

export interface LocationState {
  code: string;
  name: string;
  cities: string[];
  center: [number, number];
}

export interface SearchFilterState {
  countryCode: string;
  stateCode: string;
  city: string;
  category: string;
  customKeyword: string;
  statusFilter: 'ALL' | 'NO_WEBSITE' | 'NO_LANDING_PAGE' | 'SOCIAL_ONLY' | 'WITHOUT_ANY_SITE';
  whatsappFilter: 'ALL' | 'WITH_WHATSAPP' | 'WITHOUT_WHATSAPP';
  onlyWithPhone: boolean;
  minRating: number;
  searchSource: 'auto' | 'openstreetmap' | 'google_places';
}

export interface PitchTemplate {
  id: string;
  title: string;
  target: 'whatsapp' | 'email';
  tone: 'direto' | 'consultivo' | 'oferta' | 'auditoria';
  subject?: string;
  content: string;
  description: string;
}

export interface ApiSettings {
  googlePlacesApiKey: string;
  useCustomGooglePlaces: boolean;
  overpassCustomEndpoint: string;
  agencyName: string;
  agentName: string;
  agentPhone: string;
  agentWebsite: string;
}
