import { Lead, PitchTemplate, ApiSettings } from '../types';

export function buildPitchMessage(
  template: PitchTemplate,
  lead: Lead,
  settings: ApiSettings
): { subject?: string; content: string; whatsappUrl: string } {
  const agentName = settings.agentName || 'Especialista Web';
  const agencyName = settings.agencyName || 'Agência Digital';
  const agentPhone = settings.agentPhone || '(11) 99999-9999';
  const agentWebsite = settings.agentWebsite || 'www.agenciadigital.com.br';

  const formatLoss = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(lead.estimatedMonthlyLoss);

  const replacements: Record<string, string> = {
    '{empresa}': lead.name,
    '{nicho}': lead.category,
    '{cidade}': lead.city,
    '{estado}': lead.state,
    '{pais}': lead.country,
    '{seu_nome}': agentName,
    '{sua_agencia}': agencyName,
    '{seu_telefone}': agentPhone,
    '{seu_site}': agentWebsite,
    '{perda_estimada}': formatLoss,
    '{avaliacao}': lead.rating ? `${lead.rating} estrelas` : 'presença local'
  };

  let content = template.content;
  for (const [key, val] of Object.entries(replacements)) {
    content = content.split(key).join(val);
  }

  let subject: string | undefined = undefined;
  if (template.subject) {
    let sub = template.subject;
    for (const [key, val] of Object.entries(replacements)) {
      sub = sub.split(key).join(val);
    }
    subject = sub;
  }

  // Build clean WhatsApp link
  const rawPhone = lead.whatsapp || lead.phone || '';
  const cleanPhone = rawPhone.replace(/\D/g, '');
  const encodedText = encodeURIComponent(content);
  const whatsappUrl = cleanPhone 
    ? `https://wa.me/${cleanPhone.startsWith('55') || cleanPhone.startsWith('351') || cleanPhone.startsWith('1') ? cleanPhone : '55' + cleanPhone}?text=${encodedText}`
    : `https://wa.me/?text=${encodedText}`;

  return {
    subject,
    content,
    whatsappUrl
  };
}
