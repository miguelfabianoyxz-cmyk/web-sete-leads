import React from 'react';
import { X, ShieldAlert, CheckCircle2, TrendingDown, DollarSign, Target, Star, Flame, MessageCircle, Lightbulb } from 'lucide-react';
import { Lead } from '../types';

interface LeadAuditModalProps {
  lead: Lead | null;
  onClose: () => void;
  onOpenPitch: (lead: Lead) => void;
}

export const LeadAuditModal: React.FC<LeadAuditModalProps> = ({
  lead,
  onClose,
  onOpenPitch
}) => {
  if (!lead) return null;

  const formattedLoss = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(lead.estimatedMonthlyLoss);
  const formattedAnnualLoss = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(lead.estimatedMonthlyLoss * 12);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-bold text-white">Auditoria de Oportunidade Digital</h3>
                <span className="text-[10px] font-extrabold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">
                  Score {lead.opportunityScore}%
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Diagnóstico de Presença Web: <strong className="text-slate-200">{lead.name}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/60 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* Estimated Loss Banner */}
          <div className="bg-gradient-to-r from-red-950/40 via-red-900/20 to-slate-900 border border-red-500/30 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-red-400 uppercase tracking-wider block mb-0.5">
                Estimativa de Faturamento Perdido
              </span>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-white">{formattedLoss}</span>
                <span className="text-xs text-slate-400">/ mês (~{formattedAnnualLoss}/ano)</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Clientes em {lead.city} buscam no Google e acabam fechando com concorrentes que têm site com agendamento online.
              </p>
            </div>
          </div>

          {/* Missing Conversion Features */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center space-x-1.5">
              <TrendingDown className="w-4 h-4 text-red-400" />
              <span>Gargalos e Falhas Críticas Detectadas:</span>
            </h4>
            <div className="space-y-2">
              {lead.missingFeatures.map((feature, idx) => (
                <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex items-start space-x-2.5">
                  <div className="w-5 h-5 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    ✕
                  </div>
                  <span className="text-xs sm:text-sm text-slate-300 leading-snug">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sales Talking Points for Web Designers / Agencies */}
          <div className="bg-brand-950/40 border border-brand-800/60 rounded-2xl p-4">
            <h4 className="text-xs font-bold text-brand-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <Lightbulb className="w-4 h-4 text-brand-400" />
              <span>Argumentos de Fechamento Recomendados:</span>
            </h4>
            <ul className="text-xs sm:text-sm text-slate-300 space-y-2 list-disc list-inside">
              {lead.rating !== undefined && (
                <li>
                  <strong>Prova Social do Google:</strong> "Vocês já têm {lead.reviewsCount ?? 0} avaliações com nota {lead.rating}, mas sem site próprio muitos visitantes do Google Maps desistem antes de chamar."
                </li>
              )}
              <li>
                <strong>Velocidade de Conversão:</strong> "Uma Landing Page Express com botão de WhatsApp no topo dobra o volume de orçamentos semanais sem precisar gastar mais em anúncios."
              </li>
              <li>
                <strong>Entrega Rápida:</strong> "Podemos colocar a estrutura completa no ar em 48 a 72 horas com layout exclusivo para o setor de {lead.category}."
              </li>
            </ul>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-semibold transition"
          >
            Fechar Diagnóstico
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenPitch(lead);
            }}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center space-x-2 shadow-lg shadow-emerald-600/20 transition"
          >
            <MessageCircle className="w-4 h-4 fill-slate-950" />
            <span>Enviar Mensagem de Venda Agora</span>
          </button>
        </div>

      </div>
    </div>
  );
};
