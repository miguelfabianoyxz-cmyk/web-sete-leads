import { Lead } from '../types';

export function exportLeadsToCsv(leads: Lead[], filename = 'leads-empresas-sem-site.csv'): void {
  const headers = [
    'ID',
    'Nome da Empresa',
    'Nicho / Categoria',
    'País',
    'Estado',
    'Cidade',
    'Endereço',
    'Telefone',
    'WhatsApp',
    'Status do Site',
    'URL Detectada',
    'Nota Google',
    'Total Avaliações',
    'Score de Oportunidade',
    'Perda Mensal Estimada (R$)',
    'Status CRM',
    'Link Google Maps'
  ];

  const rows = leads.map((l) => [
    `"${l.id}"`,
    `"${l.name.replace(/"/g, '""')}"`,
    `"${l.category}"`,
    `"${l.country}"`,
    `"${l.state}"`,
    `"${l.city}"`,
    `"${l.address.replace(/"/g, '""')}"`,
    `"${l.phone || ''}"`,
    `"${l.whatsapp || ''}"`,
    `"${translateStatus(l.websiteStatus)}"`,
    `"${l.detectedUrl || ''}"`,
    `"${l.rating || ''}"`,
    `"${l.reviewsCount || ''}"`,
    `"${l.opportunityScore}"`,
    `"${l.estimatedMonthlyLoss}"`,
    `"${l.stage.toUpperCase()}"`,
    `"${l.googleMapsUrl || ''}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportLeadsToJson(leads: Lead[], filename = 'leads-prospeccao.json'): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(leads, null, 2));
  const link = document.createElement('a');
  link.setAttribute('href', dataStr);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function translateStatus(status: Lead['websiteStatus']): string {
  switch (status) {
    case 'NO_WEBSITE': return 'Sem Site (Nenhum Domínio)';
    case 'NO_LANDING_PAGE': return 'Sem Landing Page (Apenas Perfil/Linktree)';
    case 'SOCIAL_ONLY': return 'Apenas Instagram/Facebook';
    case 'BROKEN_WEBSITE': return 'Site com Erro / Inativo';
    case 'HAS_WEBSITE': return 'Possui Site';
    default: return status;
  }
}
