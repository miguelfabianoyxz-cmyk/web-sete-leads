import React from 'react';
import { Search, Kanban, MapPin, BookOpen, Download, Settings, Sparkles, Building2 } from 'lucide-react';
import { Lead } from '../types';

interface HeaderProps {
  activeTab: 'search' | 'crm' | 'map' | 'playbook';
  setActiveTab: (tab: 'search' | 'crm' | 'map' | 'playbook') => void;
  crmLeadsCount: number;
  totalFoundCount: number;
  onOpenSettings: () => void;
  onExportCsv: () => void;
  leads: Lead[];
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  crmLeadsCount,
  totalFoundCount,
  onOpenSettings,
  onExportCsv,
  leads
}) => {
  return (
    <header className="sticky top-0 z-40 bg-black border-b border-zinc-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Web Sete Official Logo & Brand */}
          <div className="flex items-center space-x-3.5 cursor-pointer group" onClick={() => setActiveTab('search')}>
            {/* W7 Stylized Monogram */}
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-md ring-1 ring-white/40 group-hover:scale-105 transition-transform">
                <svg viewBox="0 0 40 40" className="w-7 h-7 text-black fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 10 L12 28 L17 14 L22 28 L28 10 L24 10 L20 22 L16 11 L13 22 L9 10 Z" fill="#000000" />
                  <path d="M26 10 L35 10 L30 28 L26 28 L30.5 13.5 L26 13.5 Z" fill="#000000" />
                </svg>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center space-x-1.5">
                  <span className="text-lg sm:text-xl font-black tracking-widest text-white uppercase leading-none">
                    WEB SETE
                  </span>
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black bg-zinc-800 text-zinc-300 border border-zinc-700 uppercase tracking-wider">
                    Leads
                  </span>
                </div>
                <span className="text-[10px] text-zinc-400 font-semibold tracking-wider uppercase mt-0.5">
                  Área Interna • Prospecção
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-1.5 bg-zinc-950 p-1 rounded-2xl border border-zinc-800">
            <button
              onClick={() => setActiveTab('search')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-200 ${
                activeTab === 'search'
                  ? 'bg-white text-black shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Prospectar</span>
              {totalFoundCount > 0 && (
                <span className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  activeTab === 'search' ? 'bg-zinc-200 text-black' : 'bg-zinc-800 text-white'
                }`}>
                  {totalFoundCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('crm')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-200 ${
                activeTab === 'crm'
                  ? 'bg-white text-black shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <Kanban className="w-4 h-4" />
              <span className="hidden sm:inline">CRM</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                activeTab === 'crm' ? 'bg-black text-white' : 'bg-zinc-800 text-zinc-300'
              }`}>
                {crmLeadsCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-200 ${
                activeTab === 'map'
                  ? 'bg-white text-black shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">Mapa</span>
            </button>

            <button
              onClick={() => setActiveTab('playbook')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-200 ${
                activeTab === 'playbook'
                  ? 'bg-white text-black shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Playbook</span>
            </button>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-2">
            {leads.length > 0 && (
              <button
                onClick={onExportCsv}
                title="Exportar para CSV (Excel)"
                className="hidden sm:inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 shadow-sm transition"
              >
                <Download className="w-3.5 h-3.5 text-white" />
                <span>Exportar CSV</span>
              </button>
            )}

            <button
              onClick={onOpenSettings}
              title="Configurações e Dados da Agência"
              className="p-2 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 flex items-center space-x-1.5 shadow-sm transition"
            >
              <Settings className="w-4 h-4 text-zinc-300" />
              <span className="hidden md:inline">Configurações</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
