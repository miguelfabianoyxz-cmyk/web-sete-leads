import React, { useState } from 'react';
import {
  Globe, MessageCircle, MapPin, Star, Flame,
  Instagram, ExternalLink, Copy, Check, ShieldAlert, Kanban, Eye, AlertCircle,
  Clock, PhoneCall, Sparkles, Phone, Search
} from 'lucide-react';
import { Lead } from '../types';
import { hasValidWhatsApp, getWhatsAppUrl, isLandlinePhone } from '../utils/phoneUtils';

interface LeadCardProps {
  lead: Lead;
  onOpenPitch: (lead: Lead) => void;
  onOpenAudit: (lead: Lead) => void;
  onToggleCrm: (lead: Lead) => void;
  isSavedInCrm: boolean;
}

export const LeadCard: React.FC<LeadCardProps> = ({
  lead,
  onOpenPitch,
  onOpenAudit,
  onToggleCrm,
  isSavedInCrm
}) => {
  const [copied, setCopied] = useState(false);

  const copyQuickInfo = () => {
    const text = `${lead.name} | ${lead.category} em ${lead.city}-${lead.state}\nTelefone: ${lead.phone || 'N/A'}\nHorário: ${lead.closingHours || 'Horário Comercial'}\nStatus: ${getStatusText(lead.websiteStatus)}\nGoogle Maps: ${lead.googleMapsUrl || ''}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const validWhatsApp = hasValidWhatsApp(lead);
  const isLandline = isLandlinePhone(lead.phone);

  const handleDirectWhatsApp = () => {
    const url = getWhatsAppUrl(lead);
    if (url) {
      window.open(url, '_blank');
    }
  };

  const formattedLoss = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(lead.estimatedMonthlyLoss);

  return (
    <div className={`glass-card rounded-3xl p-5 sm:p-6 transition-all duration-300 relative group flex flex-col justify-between hover:-translate-y-1 ${
      lead.opportunityScore >= 85
        ? 'border-amber-500/30 hover:border-amber-400/60 shadow-xl shadow-amber-500/5 hover:shadow-amber-500/15'
        : 'border-white/[0.08] hover:border-brand-500/50 shadow-xl'
    }`}>
      
      {/* Top Header: Category & Opportunity Score */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          
          {/* Status Badge & Real Source Badge */}
          <div className="flex flex-wrap items-center gap-1.5">
            {getStatusBadge(lead.websiteStatus)}
            {lead.source === 'openstreetmap' && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/10" title="Estabelecimento Real Verificado no OpenStreetMap">
                🌐 Real (OSM)
              </span>
            )}
            {lead.source === 'google_places' && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 shadow-sm shadow-emerald-500/10" title="Estabelecimento Real Verificado no Google Places">
                ⭐ Real (Google)
              </span>
            )}
            {lead.sourceUrl && (
              <a href={lead.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-dark-950 text-slate-300 border border-white/[0.08] hover:text-white" title="Abrir o registro original desta empresa">
                🔗 Ver fonte
              </a>
            )}
          </div>

          {/* Opportunity Score Pill */}
          <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-black shadow-inner ${
            lead.opportunityScore >= 85
              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-amber-500/10'
              : lead.opportunityScore >= 70
              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-emerald-500/10'
              : 'bg-dark-950 text-slate-300 border border-white/[0.08]'
          }`} title="Score de Oportunidade para Venda de Site / Landing Page">
            <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Score {lead.opportunityScore}%</span>
          </div>

        </div>

        {/* Business Name */}
        <h3 className="text-lg font-black text-white group-hover:text-cyan-300 transition-colors duration-200 line-clamp-1 tracking-tight">
          {lead.name}
        </h3>

        {/* Category & Location */}
        <p className="text-xs font-bold text-brand-400 mb-3 uppercase tracking-wider">
          {lead.category}
        </p>

        {/* Rating, Reviews & Loss */}
        <div className="flex items-center space-x-2 text-xs text-slate-300 mb-2.5 bg-dark-950/70 p-2.5 rounded-2xl border border-white/[0.06] shadow-inner">
          {lead.rating !== undefined && (
            <>
              <div className="flex items-center text-amber-400 font-black">
                <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                <span>{lead.rating}</span>
              </div>
              <span className="text-slate-400 font-medium">({lead.reviewsCount ?? 0} avaliações)</span>
              <span className="text-slate-600">•</span>
            </>
          )}
          <span className="text-red-400 font-bold text-[11px]" title="Estimativa média do nicho, não um dado da empresa">Perde ~{formattedLoss}/mês (est.)</span>
        </div>

        {/* Closing Hours Badge */}
        {lead.closingHours && (
          <div className="flex items-center space-x-2 text-xs text-emerald-400 font-bold mb-2.5 bg-emerald-950/30 border border-emerald-500/30 px-3 py-1.5 rounded-2xl shadow-sm">
            <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">{lead.closingHours}</span>
          </div>
        )}

        {/* Address */}
        <div className="flex items-start space-x-2 text-xs text-slate-400 mb-3">
          <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
          <span className="line-clamp-2">{lead.address}</span>
        </div>

        {/* Contact Channels Grid */}
        <div className="space-y-1.5 mb-2">
          
          {/* 1. WhatsApp Box - Only rendered if lead has verified WhatsApp */}
          {validWhatsApp ? (
            <div className="bg-emerald-950/30 hover:bg-emerald-950/50 border border-emerald-500/30 rounded-xl p-2 flex items-center justify-between text-xs transition">
              <div className="flex items-center space-x-2 truncate">
                <div className="w-5 h-5 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <MessageCircle className="w-3.5 h-3.5 fill-emerald-400" />
                </div>
                <div className="truncate">
                  <span className="text-zinc-400 font-medium text-[11px] block">WhatsApp Comercial:</span>
                  <span className="font-mono text-emerald-300 font-bold truncate">
                    {lead.whatsapp || lead.phone}
                  </span>
                </div>
              </div>

              <button
                onClick={handleDirectWhatsApp}
                className="text-[11px] font-extrabold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 px-2.5 py-1 rounded-lg flex items-center space-x-1 shrink-0 ml-1 shadow-sm transition"
                title="Abrir WhatsApp com pitch"
              >
                <span>Chamar</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </button>
            </div>
          ) : (
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-2 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 truncate">
                <div className="w-5 h-5 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 shrink-0">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <span className="text-zinc-500 font-medium text-[11px] block">
                    {isLandline ? 'Telefone Fixo (Sem WhatsApp):' : 'Canal de Contato:'}
                  </span>
                  <span className="font-mono text-zinc-300 font-bold truncate text-[11px]">
                    {lead.phone || 'Ver ficha no Google Maps'}
                  </span>
                </div>
              </div>

              {lead.phone ? (
                <a
                  href={`tel:${lead.phone.replace(/\D/g, '')}`}
                  className="text-[11px] font-extrabold text-white bg-zinc-800 hover:bg-zinc-700 px-2.5 py-1 rounded-lg flex items-center space-x-1 shrink-0 ml-1 transition"
                  title="Ligar para telefone fixo"
                >
                  <PhoneCall className="w-3 h-3" />
                  <span>Ligar</span>
                </a>
              ) : (
                <a
                  href={lead.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lead.name + ' ' + lead.city)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold text-zinc-300 bg-zinc-800 hover:bg-zinc-700 px-2 py-1 rounded-lg shrink-0 ml-1 transition"
                >
                  Ver no Maps ↗
                </a>
              )}
            </div>
          )}

          {/* 2. Instagram Box */}
          <div className="bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 rounded-xl p-2 flex items-center justify-between text-xs transition">
            <div className="flex items-center space-x-2 truncate">
              <div className="w-5 h-5 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-200 shrink-0">
                <Instagram className="w-3.5 h-3.5" />
              </div>
              <div className="truncate">
                <span className="text-zinc-400 font-medium text-[11px] block">
                  {lead.instagramUrl ? 'Instagram Verificado:' : 'Instagram / Redes:'}
                </span>
                <span className="text-zinc-200 font-semibold truncate text-[11px]">
                  {lead.instagramUrl
                    ? lead.instagramUrl.replace('https://www.instagram.com/', '@').replace('https://instagram.com/', '@').replace(/\/$/, '')
                    : 'Buscar Perfil Oficial'}
                </span>
              </div>
            </div>

            {lead.instagramUrl ? (
              <a
                href={lead.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-extrabold text-black bg-white hover:bg-zinc-200 px-2.5 py-1 rounded-lg flex items-center space-x-1 shrink-0 ml-1 shadow-sm transition"
                title="Abrir perfil verificado no Instagram"
              >
                <span>Abrir</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>
            ) : (
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent('instagram ' + lead.name + ' ' + lead.city)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-bold text-zinc-300 bg-zinc-800 hover:bg-zinc-700 px-2.5 py-1 rounded-lg flex items-center space-x-1 shrink-0 ml-1 transition"
                title="Buscar perfil oficial no Instagram"
              >
                <Search className="w-3 h-3" />
                <span>Buscar @</span>
              </a>
            )}
          </div>

        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="pt-3 border-t border-zinc-800 mt-2 space-y-2">
        
        {/* Main Action Buttons Grid */}
        <div className="grid grid-cols-2 gap-2">
          
          {validWhatsApp ? (
            /* Direct WhatsApp Call */
            <button
              onClick={handleDirectWhatsApp}
              className="bg-white hover:bg-zinc-200 text-black font-black text-xs py-3 px-3.5 rounded-2xl flex items-center justify-center space-x-1.5 shadow-lg transition-all transform active:scale-[0.98] cursor-pointer"
              title="Abrir conversa direta no WhatsApp"
            >
              <MessageCircle className="w-4 h-4 fill-black" />
              <span>WhatsApp Direto</span>
            </button>
          ) : lead.phone ? (
            /* Landline Call */
            <a
              href={`tel:${lead.phone.replace(/\D/g, '')}`}
              className="bg-white hover:bg-zinc-200 text-black font-black text-xs py-3 px-3.5 rounded-2xl flex items-center justify-center space-x-1.5 shadow-lg transition-all transform active:scale-[0.98]"
              title="Ligar para o telefone fixo do estabelecimento"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Ligar Fixo</span>
            </a>
          ) : (
            /* Google Search Contact */
            <a
              href={`https://www.google.com/search?q=${encodeURIComponent(lead.name + ' ' + lead.city + ' telefone')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs py-3 px-3.5 rounded-2xl flex items-center justify-center space-x-1.5 border border-zinc-700 transition"
              title="Buscar Telefone no Google"
            >
              <Search className="w-4 h-4" />
              <span>Buscar Fone</span>
            </a>
          )}

          {/* Custom Pitch button */}
          <button
            onClick={() => onOpenPitch(lead)}
            className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs py-3 px-3.5 rounded-2xl flex items-center justify-center space-x-1.5 border border-zinc-700 hover:border-zinc-500 transition"
            title="Ver Modelos de Pitch e Copiar Mensagem"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>Ver Pitch</span>
          </button>

        </div>

        {/* Secondary Tool Buttons */}
        <div className="grid grid-cols-5 gap-1.5 pt-1">
          
          {/* Pitch Editor Modal Button */}
          <button
            onClick={() => onOpenPitch(lead)}
            title="Modelos de Mensagem e Pitch"
            className="p-2.5 rounded-2xl bg-dark-850 hover:bg-dark-800 text-slate-300 text-xs font-bold flex items-center justify-center space-x-1 border border-white/[0.08] hover:border-white/20 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Pitch</span>
          </button>

          {/* Audit Button */}
          <button
            onClick={() => onOpenAudit(lead)}
            title="Ver Auditoria de Falhas & Argumentos de Vendas"
            className="p-2.5 rounded-2xl bg-dark-850 hover:bg-dark-800 text-slate-300 text-xs font-bold flex items-center justify-center space-x-1 border border-white/[0.08] hover:border-white/20 transition cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Auditoria</span>
          </button>

          {/* Instagram Button */}
          <a
            href={lead.instagramUrl || `https://www.google.com/search?q=${encodeURIComponent('instagram ' + lead.name + ' ' + lead.city)}`}
            target="_blank"
            rel="noopener noreferrer"
            title={lead.instagramUrl ? 'Abrir Instagram Verificado' : 'Buscar Instagram Oficial no Google'}
            className="p-2.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-bold flex items-center justify-center border border-zinc-800 hover:border-zinc-600 transition"
          >
            <Instagram className="w-3.5 h-3.5 text-zinc-300" />
          </a>

          {/* Google Maps link */}
          <a
            href={lead.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lead.name + ' ' + lead.city)}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Abrir no Google Maps"
            className="p-2.5 rounded-2xl bg-dark-850 hover:bg-dark-800 text-slate-300 text-xs font-bold flex items-center justify-center border border-white/[0.08] hover:border-white/20 transition"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>

          {/* CRM Toggle */}
          <button
            onClick={() => onToggleCrm(lead)}
            title={isSavedInCrm ? 'Salvo no CRM' : 'Adicionar ao Pipeline CRM'}
            className={`p-2.5 rounded-2xl text-xs font-bold flex items-center justify-center space-x-1 border transition cursor-pointer ${
              isSavedInCrm
                ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white border-brand-400/50 shadow-md shadow-brand-500/20'
                : 'bg-dark-850 hover:bg-dark-800 text-slate-300 border-white/[0.08] hover:border-white/20'
            }`}
          >
            <Kanban className="w-3.5 h-3.5 text-cyan-400" />
          </button>

        </div>

      </div>

    </div>
  );
};

function getStatusBadge(status: Lead['websiteStatus']) {
  switch (status) {
    case 'NO_WEBSITE':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/30">
          <AlertCircle className="w-3 h-3 mr-1" /> Sem Site Oficial
        </span>
      );
    case 'NO_LANDING_PAGE':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
          <ShieldAlert className="w-3 h-3 mr-1" /> Sem Landing Page
        </span>
      );
    case 'SOCIAL_ONLY':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-purple-500/10 text-purple-300 border border-purple-500/30">
          <Globe className="w-3 h-3 mr-1" /> Só Instagram / Redes
        </span>
      );
    case 'BROKEN_WEBSITE':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-orange-500/10 text-orange-400 border border-orange-500/30">
          <AlertCircle className="w-3 h-3 mr-1" /> Site Inativo / Erro
        </span>
      );
    case 'HAS_WEBSITE':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <Globe className="w-3 h-3 mr-1" /> Possui Site
        </span>
      );
    default:
      return null;
  }
}

function getStatusText(status: Lead['websiteStatus']): string {
  switch (status) {
    case 'NO_WEBSITE': return 'Sem Site Oficial (Oportunidade Ouro)';
    case 'NO_LANDING_PAGE': return 'Sem Landing Page de Conversão';
    case 'SOCIAL_ONLY': return 'Possui apenas Instagram';
    case 'BROKEN_WEBSITE': return 'Site com Erro / Inativo';
    case 'HAS_WEBSITE': return 'Possui Site';
  }
}
