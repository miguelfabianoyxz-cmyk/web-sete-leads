import React, { useState } from 'react';
import { X, MessageCircle, Mail, Copy, Check, Send, Sparkles, Building2, Edit3, ExternalLink, Search } from 'lucide-react';
import { Lead, PitchTemplate, ApiSettings } from '../types';
import { PITCH_TEMPLATES } from '../data/pitchTemplates';
import { buildPitchMessage } from '../services/pitchGenerator';
import { hasValidWhatsApp, getWhatsAppUrl } from '../utils/phoneUtils';

interface PitchModalProps {
  lead: Lead | null;
  onClose: () => void;
  apiSettings: ApiSettings;
  onMarkContacted?: (leadId: string) => void;
}

export const PitchModal: React.FC<PitchModalProps> = ({
  lead,
  onClose,
  apiSettings,
  onMarkContacted
}) => {
  if (!lead) return null;

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(PITCH_TEMPLATES[0].id);
  const [copied, setCopied] = useState(false);
  const [editedContent, setEditedContent] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);

  const selectedTemplate = PITCH_TEMPLATES.find((t) => t.id === selectedTemplateId) || PITCH_TEMPLATES[0];
  const generated = buildPitchMessage(selectedTemplate, lead, apiSettings);

  const currentMessage = isEditing ? editedContent : generated.content;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    if (onMarkContacted) onMarkContacted(lead.id);
  };

  const validWhatsApp = hasValidWhatsApp(lead);

  const handleOpenWhatsApp = () => {
    const url = getWhatsAppUrl(lead, currentMessage);
    if (url) {
      window.open(url, '_blank');
      if (onMarkContacted) onMarkContacted(lead.id);
    } else {
      // If no valid WhatsApp, copy message and open Google search
      handleCopy();
      const query = encodeURIComponent(`whatsapp ${lead.name} ${lead.city} telefone`);
      window.open(`https://www.google.com/search?q=${query}`, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-bold text-white">Gerador de Pitch de Vendas</h3>
                <span className="text-[10px] font-bold bg-brand-500/20 text-brand-300 px-2 py-0.5 rounded-full">
                  1-Clique
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Prospectando: <strong className="text-slate-200">{lead.name}</strong> ({lead.category} em {lead.city})
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
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          
          {/* Template Selector Pills */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Escolha o Modelo de Abordagem:</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PITCH_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => {
                    setSelectedTemplateId(tmpl.id);
                    setIsEditing(false);
                  }}
                  className={`text-left p-3 rounded-xl border text-xs transition ${
                    selectedTemplateId === tmpl.id
                      ? 'bg-brand-950/60 border-brand-500 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold mb-0.5 text-slate-200">
                    {tmpl.title}
                  </div>
                  <div className="text-[11px] text-slate-400 line-clamp-1">
                    {tmpl.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Message Preview / Editor */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-300">
                Mensagem Formatada para WhatsApp / Contato:
              </span>
              <button
                onClick={() => {
                  if (!isEditing) {
                    setEditedContent(generated.content);
                    setIsEditing(true);
                  } else {
                    setIsEditing(false);
                  }
                }}
                className="text-xs text-brand-400 hover:text-brand-300 flex items-center space-x-1"
              >
                <Edit3 className="w-3 h-3" />
                <span>{isEditing ? 'Restaurar Modelo' : 'Editar Texto'}</span>
              </button>
            </div>

            {isEditing ? (
              <textarea
                rows={10}
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full bg-slate-950 border border-brand-500/50 rounded-2xl p-4 text-xs sm:text-sm text-slate-100 font-sans focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            ) : (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs sm:text-sm text-slate-200 font-sans whitespace-pre-wrap leading-relaxed shadow-inner max-h-72 overflow-y-auto">
                {generated.content}
              </div>
            )}
          </div>

          {/* Lead Quick Phone Notice */}
          <div className={`rounded-xl p-3 flex items-center justify-between text-xs border ${
            validWhatsApp
              ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-300'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400'
          }`}>
            <span>Telefone Detectado: <strong className="text-white">{lead.phone || 'Não detectado'}</strong></span>
            <span className={`text-[11px] font-bold ${validWhatsApp ? 'text-emerald-400' : 'text-zinc-500'}`}>
              {validWhatsApp ? 'WhatsApp Móvel Verificado' : 'Telefone Fixo / Buscar no Google'}
            </span>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="bg-zinc-950 px-6 py-4 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handleCopy}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs sm:text-sm font-semibold flex items-center justify-center space-x-2 border border-zinc-700 transition"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span className="text-white font-bold">Copiado para Área de Transferência!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-zinc-400" />
                <span>Copiar Mensagem</span>
              </>
            )}
          </button>

          {validWhatsApp ? (
            <button
              onClick={handleOpenWhatsApp}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-extrabold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg transition transform active:scale-95"
            >
              <Send className="w-4 h-4 fill-black" />
              <span>Abrir WhatsApp com Mensagem Pronta 🚀</span>
            </button>
          ) : (
            <button
              onClick={handleOpenWhatsApp}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 border border-zinc-600 transition"
              title="Copiar mensagem e buscar contato oficial no Google"
            >
              <Search className="w-4 h-4 text-white" />
              <span>Copiar e Buscar Fone no Google</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
