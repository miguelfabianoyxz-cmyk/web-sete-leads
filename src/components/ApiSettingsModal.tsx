import React, { useState } from 'react';
import { X, Settings, Key, Building, User, Phone, Globe, Save, Check, ShieldCheck } from 'lucide-react';
import { ApiSettings } from '../types';

interface ApiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ApiSettings;
  onSaveSettings: (settings: ApiSettings) => void;
}

export const ApiSettingsModal: React.FC<ApiSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings
}) => {
  if (!isOpen) return null;

  const [form, setForm] = useState<ApiSettings>(settings);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(form);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-400 border border-brand-500/20">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">Configurações & Agência</h3>
              <p className="text-xs text-slate-400">Personalize os dados usados nas mensagens automáticas</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/60 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 flex-1">
          
          <div className="border-b border-slate-800 pb-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <User className="w-4 h-4 text-brand-400" />
              <span>Seus Dados de Contato (Para o Pitch):</span>
            </h4>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Seu Nome / Apelido:</label>
                <input
                  type="text"
                  placeholder="Ex: Miguel, Lucas, Ana..."
                  value={form.agentName}
                  onChange={(e) => setForm({ ...form, agentName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-100 focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Nome da sua Agência ou Marca:</label>
                <input
                  type="text"
                  placeholder="Ex: Agência Digital Pro, Studio Web..."
                  value={form.agencyName}
                  onChange={(e) => setForm({ ...form, agencyName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-100 focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Seu WhatsApp:</label>
                  <input
                    type="text"
                    placeholder="Ex: (11) 98765-4321"
                    value={form.agentPhone}
                    onChange={(e) => setForm({ ...form, agentPhone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Seu Site / Portfólio:</label>
                  <input
                    type="text"
                    placeholder="Ex: www.suaagencia.com"
                    value={form.agentWebsite}
                    onChange={(e) => setForm({ ...form, agentWebsite: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Integrations */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <Key className="w-4 h-4 text-emerald-400" />
              <span>Fontes de Dados Reais:</span>
            </h4>

            <div className="space-y-3">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">OpenStreetMap Live (Padrão):</span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center">
                    <ShieldCheck className="w-3 h-3 mr-1" /> Ativo & Dados Reais
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Busca estabelecimentos físicos reais registrados no OpenStreetMap na cidade selecionada.
                </p>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">Google Places API Key (Opcional):</span>
                  <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">
                    Empresas Google
                  </span>
                </div>
                <input
                  type="password"
                  placeholder="Cole sua API Key do Google Places aqui..."
                  value={form.googlePlacesApiKey || ''}
                  onChange={(e) => setForm({ ...form, googlePlacesApiKey: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:ring-2 focus:ring-brand-500 outline-none font-mono"
                />
                <p className="text-[10px] text-slate-400">
                  Se inserida, a aplicação buscará empresas verificadas diretamente no Google Maps com telefones reais e avaliações.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Save */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-brand-600/30 transition"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Configurações Salvas!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Salvar Dados</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
