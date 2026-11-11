import { Lead } from '../types';

/**
 * Checks if a phone number or lead has a genuine, valid WhatsApp/mobile number.
 * Filters out synthetic demo placeholders (e.g. 5500, 95500) and landlines (fixos).
 */
export function hasValidWhatsApp(lead?: Partial<Lead> | { phone?: string; whatsapp?: string } | null): boolean {
  if (!lead) return false;
  
  const raw = lead.whatsapp || lead.phone || '';
  if (!raw) return false;

  const clean = raw.replace(/\D/g, '');
  if (!clean || clean.length < 9) return false;

  // Filter out mock/synthetic generated dummy patterns
  if (clean.includes('5500') || clean.includes('95500') || clean.includes('999999') || clean.includes('123456')) {
    return false;
  }

  // Brazil verification
  if (clean.startsWith('55')) {
    const withoutCountry = clean.slice(2);
    // 11 digits: 2 digits DDD + 9 digits starting with 9 (e.g. 11987654321)
    if (withoutCountry.length === 11 && withoutCountry.charAt(2) === '9') {
      return true;
    }
    // If 10 digits (e.g. 1132210000), it's a landline (fixo), not mobile WhatsApp
    return false;
  }

  // Without 55 prefix: 11 digits starting with DDD + 9
  if (clean.length === 11 && clean.charAt(2) === '9') {
    return true;
  }

  // Portugal (+351): 9 digits starting with 9
  if (clean.startsWith('351') && clean.length === 12 && clean.charAt(3) === '9') {
    return true;
  }
  if (clean.length === 9 && clean.startsWith('9')) {
    return true;
  }

  // USA (+1): 10 or 11 digits
  if (clean.startsWith('1') && clean.length === 11) {
    return true;
  }

  return false;
}

/**
 * Formats a valid WhatsApp URL with direct encoded message
 */
export function getWhatsAppUrl(lead: Partial<Lead>, pitchText?: string): string | null {
  if (!hasValidWhatsApp(lead)) return null;

  const raw = lead.whatsapp || lead.phone || '';
  const clean = raw.replace(/\D/g, '');
  const fullNum = clean.startsWith('55') || clean.startsWith('351') || clean.startsWith('1') ? clean : '55' + clean;

  const defaultPitch = `Olá, tudo bem? Notei que a ${lead.name || 'sua empresa'} atende em ${lead.city || 'sua cidade'}, mas não encontrei um site oficial ou landing page para captar clientes pelo Google. Vocês têm interesse em criar uma página profissional?`;
  const message = pitchText || defaultPitch;

  return `https://wa.me/${fullNum}?text=${encodeURIComponent(message)}`;
}

/**
 * Check if the phone is a Brazilian landline (telefone fixo)
 */
export function isLandlinePhone(phone?: string): boolean {
  if (!phone) return false;
  const clean = phone.replace(/\D/g, '');
  if (!clean) return false;

  const digits = clean.startsWith('55') ? clean.slice(2) : clean;
  // Landlines have 10 digits and start with 2, 3, 4 or 5 after DDD
  if (digits.length === 10) {
    const firstDigitAfterDdd = digits.charAt(2);
    return ['2', '3', '4', '5'].includes(firstDigitAfterDdd);
  }
  return false;
}
