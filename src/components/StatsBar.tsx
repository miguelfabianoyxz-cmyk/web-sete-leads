import React from 'react';
import { Globe, MessageCircle, DollarSign, Flame, AlertCircle } from 'lucide-react';
import { Lead } from '../types';
import { hasValidWhatsApp } from '../utils/phoneUtils';

interface StatsBarProps {
  leads: Lead[];
  searchMode: string;
}

export const StatsBar: React.FC<StatsBarProps> = ({ leads, searchMode }) => {
  if (leads.length === 0) return null;

  const total = leads.length;
  const withoutWebsite = leads.filter((l) => l.websiteStatus === 'NO_WEBSITE').length;
  const noLandingPageOrSocial = leads.filter((l) => l.websiteStatus === 'NO_LANDING_PAGE' || l.websiteStatus === 'SOCIAL_ONLY').length;
  const totalNoAnySite = withoutWebsite + noLandingPageOrSocial;
  const percentNoSite = Math.round((totalNoAnySite / total) * 100);

  const totalLoss = leads.reduce((acc, l) => acc + (l.estimatedMonthlyLoss || 0), 0);
  const formattedLoss = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(totalLoss);

  const hotLeads = leads.filter((l) => l.opportunityScore >= 80).length;
  const withWhatsApp = leads.filter((l) => hasValidWhatsApp(l)).length;
  const withPhone = leads.filter((l) => Boolean(l.phone || l.whatsapp)).length;

  return (
    <div className="space-y-2.5">
      {/* Search mode badge */}
      <div className="flex items-center justify-between text-xs text-zinc-400 px-1.5">
        <span className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span className="font-medium">Base de Dados: <strong className="text-white">{searchMode}</strong></span>
        </span>
        <span className="font-medium">Radar: <strong className="text-white">{total}</strong> empresas</span>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Card 1: Sem Site */}
        <div className="bg-[#0c0c0e] border border-zinc-800 hover:border-zinc-600 rounded-2xl p-4 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Sem Site / LP</span>
            <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-black text-white">{totalNoAnySite}</span>
            <span className="text-[11px] font-black text-zinc-300 bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-700">
              {percentNoSite}% do nicho
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-1 font-medium">
            {withoutWebsite} sem domínio + {noLandingPageOrSocial} só redes sociais
          </p>
        </div>

        {/* Card 2: Leads Quentes */}
        <div className="bg-[#0c0c0e] border border-zinc-800 hover:border-zinc-600 rounded-2xl p-4 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Leads Quentes</span>
            <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-black text-white">{hotLeads}</span>
            <span className="text-[11px] font-black text-zinc-300 bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-700">
              Score 80%+
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-1 font-medium">
            Boas notas no Google sem site oficial
          </p>
        </div>

        {/* Card 3: Com WhatsApp Ativo */}
        <div className="bg-[#0c0c0e] border border-zinc-800 hover:border-zinc-600 rounded-2xl p-4 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">WhatsApp Válido</span>
            <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white">
              <MessageCircle className="w-4 h-4 fill-white" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-black text-white">{withWhatsApp}</span>
            <span className="text-[11px] font-black text-zinc-300 bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-700">
              {withPhone} com fone
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-1 font-medium">
            Leads com WhatsApp móvel verificado
          </p>
        </div>

        {/* Card 4: Perda do Nicho */}
        <div className="bg-[#0c0c0e] border border-zinc-800 hover:border-zinc-600 rounded-2xl p-4 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Perda do Nicho</span>
            <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-lg sm:text-2xl font-black text-white">{formattedLoss}</span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-1 font-medium">
            Argumento de vendas para fechar contratos
          </p>
        </div>

      </div>
    </div>
  );
};
