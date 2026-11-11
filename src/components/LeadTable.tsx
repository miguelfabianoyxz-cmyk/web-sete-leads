import React, { useState } from 'react';
import {
  Star, MessageCircle, Eye, Kanban,
  ArrowUpDown, CheckSquare, Square, Instagram, PhoneCall, Sparkles
} from 'lucide-react';
import { Lead } from '../types';
import { hasValidWhatsApp, getWhatsAppUrl } from '../utils/phoneUtils';

interface LeadTableProps {
  leads: Lead[];
  onOpenPitch: (lead: Lead) => void;
  onOpenAudit: (lead: Lead) => void;
  onToggleCrm: (lead: Lead) => void;
  crmLeads: Lead[];
  onBatchSaveToCrm: (leads: Lead[]) => void;
}

export const LeadTable: React.FC<LeadTableProps> = ({
  leads,
  onOpenPitch,
  onOpenAudit,
  onToggleCrm,
  crmLeads,
  onBatchSaveToCrm
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'score' | 'rating' | 'loss' | 'name'>('score');
  const [sortAsc, setSortAsc] = useState(false);

  const crmIdSet = new Set(crmLeads.map((l) => l.id));

  const handleSelectAll = () => {
    if (selectedIds.length === leads.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(leads.map((l) => l.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const sortedLeads = [...leads].sort((a, b) => {
    let diff = 0;
    if (sortBy === 'score') diff = b.opportunityScore - a.opportunityScore;
    if (sortBy === 'rating') diff = (b.rating || 0) - (a.rating || 0);
    if (sortBy === 'loss') diff = b.estimatedMonthlyLoss - a.estimatedMonthlyLoss;
    if (sortBy === 'name') diff = a.name.localeCompare(b.name);
    return sortAsc ? -diff : diff;
  });

  const handleBatchSave = () => {
    const selected = leads.filter((l) => selectedIds.includes(l.id));
    onBatchSaveToCrm(selected);
    setSelectedIds([]);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      
      {/* Table Actions Bar */}
      {selectedIds.length > 0 && (
        <div className="bg-brand-950/80 border-b border-brand-800 px-4 py-3 flex items-center justify-between">
          <span className="text-xs sm:text-sm font-semibold text-brand-200">
            {selectedIds.length} {selectedIds.length === 1 ? 'empresa selecionada' : 'empresas selecionadas'}
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleBatchSave}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-brand-600 text-white hover:bg-brand-500 flex items-center space-x-1.5 transition"
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Salvar Selecionadas no CRM</span>
            </button>
          </div>
        </div>
      )}

      {/* Responsive Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm text-slate-300">
          <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800 uppercase text-[11px] tracking-wider">
            <tr>
              <th className="p-3.5 w-10 text-center">
                <button onClick={handleSelectAll} className="p-1 hover:text-white">
                  {selectedIds.length === leads.length && leads.length > 0 ? (
                    <CheckSquare className="w-4 h-4 text-brand-400" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-600" />
                  )}
                </button>
              </th>
              <th 
                className="p-3.5 cursor-pointer hover:text-white transition"
                onClick={() => {
                  if (sortBy === 'name') setSortAsc(!sortAsc);
                  else { setSortBy('name'); setSortAsc(false); }
                }}
              >
                <div className="flex items-center space-x-1">
                  <span>Empresa & Categoria</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-600" />
                </div>
              </th>
              <th className="p-3.5">Status do Site</th>
              <th 
                className="p-3.5 cursor-pointer hover:text-white transition"
                onClick={() => {
                  if (sortBy === 'score') setSortAsc(!sortAsc);
                  else { setSortBy('score'); setSortAsc(false); }
                }}
              >
                <div className="flex items-center space-x-1">
                  <span>Score</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-600" />
                </div>
              </th>
              <th 
                className="p-3.5 cursor-pointer hover:text-white transition"
                onClick={() => {
                  if (sortBy === 'rating') setSortAsc(!sortAsc);
                  else { setSortBy('rating'); setSortAsc(false); }
                }}
              >
                <div className="flex items-center space-x-1">
                  <span>Google Nota</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-600" />
                </div>
              </th>
              <th className="p-3.5">Telefone / WhatsApp</th>
              <th className="p-3.5 text-right">Ações de Venda</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {sortedLeads.map((lead) => {
              const isSelected = selectedIds.includes(lead.id);
              const inCrm = crmIdSet.has(lead.id);

              return (
                <tr 
                  key={lead.id}
                  className={`hover:bg-slate-800/50 transition ${
                    isSelected ? 'bg-brand-950/40' : ''
                  }`}
                >
                  {/* Select Checkbox */}
                  <td className="p-3.5 text-center">
                    <button 
                      onClick={() => handleToggleSelect(lead.id)}
                      className="p-1 hover:text-white"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-brand-400" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-600" />
                      )}
                    </button>
                  </td>

                  {/* Company Name & Address */}
                  <td className="p-3.5">
                    <div className="font-bold text-white text-sm sm:text-base">
                      {lead.name}
                    </div>
                    <div className="text-xs text-brand-400 font-medium">
                      {lead.category} • <span className="text-slate-400">{lead.city}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate max-w-xs mt-0.5">
                      {lead.address}
                    </div>
                    {lead.closingHours && (
                      <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">
                        🕒 {lead.closingHours}
                      </div>
                    )}
                  </td>

                  {/* Website Status */}
                  <td className="p-3.5 whitespace-nowrap">
                    {renderStatusPill(lead.websiteStatus)}
                  </td>

                  {/* Opportunity Score */}
                  <td className="p-3.5 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-extrabold ${
                      lead.opportunityScore >= 85
                        ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {lead.opportunityScore}%
                    </span>
                  </td>

                  {/* Google Rating */}
                  <td className="p-3.5 whitespace-nowrap">
                    {lead.rating !== undefined ? (
                      <div className="flex items-center space-x-1 text-amber-400 font-bold text-xs">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{lead.rating}</span>
                        <span className="text-slate-500 font-normal">({lead.reviewsCount ?? 0})</span>
                      </div>
                    ) : (
                      <span className="text-slate-600 text-xs">—</span>
                    )}
                  </td>

                  {/* Phone & WhatsApp */}
                  <td className="p-3.5 whitespace-nowrap">
                    {lead.phone ? (
                      <div className="space-y-1">
                        <a
                          href={`tel:${lead.phone.replace(/\D/g, '')}`}
                          className="text-xs font-mono text-emerald-300 font-bold hover:underline block"
                          title="Clique para ligar direto"
                        >
                          {lead.phone}
                        </a>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500">Não informado</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="p-3.5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end space-x-1.5">
                      {hasValidWhatsApp(lead) ? (
                        <a
                          href={getWhatsAppUrl(lead) || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-zinc-200 text-black font-extrabold text-xs flex items-center space-x-1 transition shadow-sm"
                          title="Chamar direto no WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-black" />
                          <span className="hidden lg:inline">WhatsApp</span>
                        </a>
                      ) : lead.phone ? (
                        <a
                          href={`tel:${lead.phone.replace(/\D/g, '')}`}
                          className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs flex items-center space-x-1 transition shadow-sm"
                          title="Ligar para telefone fixo"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span className="hidden lg:inline">Ligar</span>
                        </a>
                      ) : (
                        <button
                          onClick={() => onOpenPitch(lead)}
                          className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs flex items-center space-x-1 transition shadow-sm"
                          title="Ver Pitch de Vendas"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-white" />
                          <span className="hidden lg:inline">Pitch</span>
                        </button>
                      )}

                      <a
                        href={lead.instagramUrl || `https://www.instagram.com/${lead.name.toLowerCase().replace(/[^a-z0-9]/g, '')}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 transition"
                        title="Abrir Instagram"
                      >
                        <Instagram className="w-3.5 h-3.5 text-zinc-300" />
                      </a>

                      <button
                        onClick={() => onOpenAudit(lead)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                        title="Ver Auditoria"
                      >
                        <Eye className="w-3.5 h-3.5 text-brand-400" />
                      </button>

                      <button
                        onClick={() => onToggleCrm(lead)}
                        className={`p-1.5 rounded-lg border transition ${
                          inCrm
                            ? 'bg-brand-600 text-white border-brand-500'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                        }`}
                        title={inCrm ? 'No CRM' : 'Adicionar ao CRM'}
                      >
                        <Kanban className="w-3.5 h-3.5 text-indigo-400" />
                      </button>
                    </div>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};

function renderStatusPill(status: Lead['websiteStatus']) {
  switch (status) {
    case 'NO_WEBSITE':
      return <span className="text-xs font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/30">Sem Site</span>;
    case 'NO_LANDING_PAGE':
      return <span className="text-xs font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">Sem Landing Page</span>;
    case 'SOCIAL_ONLY':
      return <span className="text-xs font-bold text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/30">Só Instagram</span>;
    case 'BROKEN_WEBSITE':
      return <span className="text-xs font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/30">Site Erro</span>;
    case 'HAS_WEBSITE':
      return <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">Tem Site</span>;
    default:
      return null;
  }
}
