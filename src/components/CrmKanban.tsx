import React, { useState } from 'react';
import { 
  Kanban, MessageCircle, DollarSign, Trash2, ArrowRight, ArrowLeft, 
  CheckCircle, Plus, Edit2, Flame, MapPin, Star, Sparkles, Trophy 
} from 'lucide-react';
import { Lead, LeadStage } from '../types';

interface CrmKanbanProps {
  crmLeads: Lead[];
  onUpdateLeadStage: (leadId: string, stage: LeadStage) => void;
  onRemoveLead: (leadId: string) => void;
  onOpenPitch: (lead: Lead) => void;
  onUpdateDealValue: (leadId: string, value: number) => void;
  onUpdateNotes: (leadId: string, notes: string) => void;
}

const STAGES: { key: LeadStage; title: string; color: string; border: string; icon: string }[] = [
  { key: 'novo', title: '📥 Novos Leads', color: 'bg-slate-800 text-slate-200', border: 'border-slate-700', icon: '📥' },
  { key: 'contatado', title: '💬 Contatados', color: 'bg-blue-500/10 text-blue-300', border: 'border-blue-500/30', icon: '💬' },
  { key: 'em_negociacao', title: '📊 Em Proposta / Negociação', color: 'bg-amber-500/10 text-amber-300', border: 'border-amber-500/30', icon: '📊' },
  { key: 'ganho', title: '🎉 Contrato Fechado', color: 'bg-emerald-500/10 text-emerald-300', border: 'border-emerald-500/30', icon: '🎉' },
  { key: 'perdido', title: '❌ Perdido / Sem Resposta', color: 'bg-red-500/10 text-red-300', border: 'border-red-500/30', icon: '❌' },
];

export const CrmKanban: React.FC<CrmKanbanProps> = ({
  crmLeads,
  onUpdateLeadStage,
  onRemoveLead,
  onOpenPitch,
  onUpdateDealValue,
  onUpdateNotes
}) => {
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState('');

  const totalWon = crmLeads
    .filter((l) => l.stage === 'ganho')
    .reduce((acc, l) => acc + (l.dealValue || 1500), 0);

  const totalInPipeline = crmLeads
    .filter((l) => l.stage === 'em_negociacao' || l.stage === 'contatado')
    .reduce((acc, l) => acc + (l.dealValue || 1500), 0);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-4">
      
      {/* Pipeline Summary Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-500 flex items-center justify-center text-white shadow">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">Pipeline de Vendas de Sites</h3>
            <p className="text-xs text-slate-400">
              Acompanhe suas prospecções desde o primeiro contato até o fechamento de contrato
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-xs sm:text-sm">
          <div className="bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Em Negociação</span>
            <strong className="text-amber-300 font-bold text-sm sm:text-base">{formatCurrency(totalInPipeline)}</strong>
          </div>
          <div className="bg-emerald-950/40 px-3.5 py-2 rounded-xl border border-emerald-800/40">
            <span className="text-emerald-400 block text-[11px]">Total Fechado 🎉</span>
            <strong className="text-emerald-300 font-bold text-sm sm:text-base">{formatCurrency(totalWon)}</strong>
          </div>
        </div>
      </div>

      {/* Kanban Board Columns */}
      {crmLeads.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-400">
            <Kanban className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-white mb-1">Nenhuma empresa salva no CRM ainda</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">
            Volte para a aba de prospecção e clique no botão <strong>"Salvar"</strong> ou envie uma mensagem no WhatsApp para adicionar leads ao seu funil.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {STAGES.map((stage) => {
            const stageLeads = crmLeads.filter((l) => l.stage === stage.key);

            return (
              <div
                key={stage.key}
                className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 flex flex-col min-w-[260px] max-h-[750px]"
              >
                {/* Column Header */}
                <div className={`p-2.5 rounded-xl border mb-3 flex items-center justify-between ${stage.color} ${stage.border}`}>
                  <span className="font-bold text-xs">{stage.title}</span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-black/40">
                    {stageLeads.length}
                  </span>
                </div>

                {/* Column Leads List */}
                <div className="space-y-3 overflow-y-auto flex-1 pr-1">
                  {stageLeads.map((lead) => {
                    const isNotesEditing = editingNotesId === lead.id;

                    return (
                      <div
                        key={lead.id}
                        className="bg-slate-900 border border-slate-800 rounded-xl p-3 hover:border-slate-700 transition shadow-sm space-y-2.5"
                      >
                        {/* Lead Title & City */}
                        <div>
                          <div className="flex items-start justify-between gap-1 mb-1">
                            <span className="text-[10px] font-bold text-brand-400 uppercase tracking-wider">
                              {lead.category.split('/')[0]}
                            </span>
                            <span className="text-[10px] font-extrabold text-amber-300 bg-amber-500/10 px-1.5 py-0.2 rounded">
                              Score {lead.opportunityScore}%
                            </span>
                          </div>
                          <h5 className="font-bold text-white text-xs sm:text-sm line-clamp-1">
                            {lead.name}
                          </h5>
                          <span className="text-[11px] text-slate-400">
                            {lead.city} • {lead.state}
                          </span>
                        </div>

                        {/* Deal Value Input */}
                        <div className="flex items-center justify-between bg-slate-950 p-1.5 rounded-lg border border-slate-800 text-xs">
                          <span className="text-[11px] text-slate-400">Valor Proposta:</span>
                          <div className="flex items-center space-x-1">
                            <span className="text-slate-500 text-[11px]">R$</span>
                            <input
                              type="number"
                              defaultValue={lead.dealValue || 1500}
                              onBlur={(e) => onUpdateDealValue(lead.id, Number(e.target.value) || 1500)}
                              className="w-16 bg-transparent text-right font-bold text-white text-xs focus:outline-none focus:ring-1 focus:ring-brand-500 rounded px-1"
                            />
                          </div>
                        </div>

                        {/* Notes Section */}
                        <div className="text-[11px]">
                          {isNotesEditing ? (
                            <div className="space-y-1">
                              <textarea
                                rows={2}
                                value={tempNotes}
                                onChange={(e) => setTempNotes(e.target.value)}
                                placeholder="Anotações sobre a negociação..."
                                className="w-full bg-slate-950 border border-brand-500 rounded p-1.5 text-slate-200 text-xs focus:outline-none"
                              />
                              <div className="flex justify-end space-x-1">
                                <button
                                  onClick={() => setEditingNotesId(null)}
                                  className="px-2 py-0.5 text-[10px] bg-slate-800 text-slate-300 rounded"
                                >
                                  Cancelar
                                </button>
                                <button
                                  onClick={() => {
                                    onUpdateNotes(lead.id, tempNotes);
                                    setEditingNotesId(null);
                                  }}
                                  className="px-2 py-0.5 text-[10px] bg-brand-600 text-white rounded font-bold"
                                >
                                  Salvar
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div
                              onClick={() => {
                                setTempNotes(lead.notes || '');
                                setEditingNotesId(lead.id);
                              }}
                              className="p-1.5 bg-slate-950/60 rounded border border-slate-800/80 text-slate-400 hover:text-slate-200 cursor-pointer flex items-center justify-between"
                            >
                              <span className="truncate italic">
                                {lead.notes ? `📝 ${lead.notes}` : '+ Adicionar anotação...'}
                              </span>
                              <Edit2 className="w-3 h-3 opacity-50 shrink-0 ml-1" />
                            </div>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                          
                          {/* WhatsApp Pitch */}
                          <button
                            onClick={() => onOpenPitch(lead)}
                            className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-[11px] font-bold flex items-center space-x-1"
                            title="Enviar WhatsApp"
                          >
                            <MessageCircle className="w-3 h-3 fill-slate-950" />
                            <span>WhatsApp</span>
                          </button>

                          {/* Stage Transition Arrows */}
                          <div className="flex items-center space-x-1">
                            {stage.key !== 'novo' && (
                              <button
                                onClick={() => {
                                  const idx = STAGES.findIndex((s) => s.key === stage.key);
                                  if (idx > 0) onUpdateLeadStage(lead.id, STAGES[idx - 1].key);
                                }}
                                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                                title="Voltar Etapa"
                              >
                                <ArrowLeft className="w-3 h-3" />
                              </button>
                            )}

                            {stage.key !== 'perdido' && stage.key !== 'ganho' && (
                              <button
                                onClick={() => {
                                  const idx = STAGES.findIndex((s) => s.key === stage.key);
                                  if (idx < STAGES.length - 1) onUpdateLeadStage(lead.id, STAGES[idx + 1].key);
                                }}
                                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                                title="Avançar Etapa"
                              >
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}

                            <button
                              onClick={() => onRemoveLead(lead.id)}
                              className="p-1 rounded bg-slate-800 hover:bg-red-900/60 text-slate-400 hover:text-red-300 transition"
                              title="Remover do CRM"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>

                        </div>

                      </div>
                    );
                  })}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
