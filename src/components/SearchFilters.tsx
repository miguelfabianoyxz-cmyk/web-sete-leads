import React, { useState } from 'react';
import { Search, Globe2, Map, Navigation, Briefcase, Filter, Phone, Star, Sparkles, RefreshCw } from 'lucide-react';
import { SearchFilterState } from '../types';
import { COUNTRIES } from '../data/locations';
import { NICHES } from '../data/niches';

interface SearchFiltersProps {
  filters: SearchFilterState;
  setFilters: React.Dispatch<React.SetStateAction<SearchFilterState>>;
  onSearch: () => void;
  isLoading: boolean;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  setFilters,
  onSearch,
  isLoading
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customCityMode, setCustomCityMode] = useState(false);

  const currentCountry = COUNTRIES.find((c) => c.code === filters.countryCode) || COUNTRIES[0];
  const currentState = currentCountry.states.find((s) => s.code === filters.stateCode) || currentCountry.states[0];

  const handleCountryChange = (code: string) => {
    const newCountry = COUNTRIES.find((c) => c.code === code) || COUNTRIES[0];
    const newState = newCountry.states[0];
    const newCity = newState.cities[0] || '';
    setFilters((prev) => ({
      ...prev,
      countryCode: code,
      stateCode: newState.code,
      city: newCity
    }));
  };

  const handleStateChange = (code: string) => {
    const newState = currentCountry.states.find((s) => s.code === code) || currentCountry.states[0];
    const newCity = newState.cities[0] || '';
    setFilters((prev) => ({
      ...prev,
      stateCode: code,
      city: newCity
    }));
  };

  return (
    <div className="bg-[#09090b] border border-zinc-800 rounded-3xl p-5 sm:p-7 shadow-xl relative overflow-hidden">
      <div className="relative z-10">
        
        {/* Main Location & Niche Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          
          {/* 1. Country Selector */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <Globe2 className="w-3.5 h-3.5 text-white" />
              <span>1. País</span>
            </label>
            <div className="relative">
              <select
                value={filters.countryCode}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full bg-black border border-zinc-800 hover:border-zinc-600 focus:border-white rounded-2xl px-4 py-3 text-sm text-white font-bold outline-none transition appearance-none cursor-pointer"
              >
                {COUNTRIES.map((country) => (
                  <option key={country.code} value={country.code} className="bg-black">
                    {country.flag} {country.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3.5 pointer-events-none text-zinc-400">
                <Globe2 className="w-4 h-4 opacity-50" />
              </div>
            </div>
          </div>

          {/* 2. State / UF Selector */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <Map className="w-3.5 h-3.5 text-white" />
              <span>2. Estado / Região</span>
            </label>
            <div className="relative">
              <select
                value={filters.stateCode}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full bg-black border border-zinc-800 hover:border-zinc-600 focus:border-white rounded-2xl px-4 py-3 text-sm text-white font-bold outline-none transition appearance-none cursor-pointer"
              >
                {currentCountry.states.map((st) => (
                  <option key={st.code} value={st.code} className="bg-black">
                    {st.name} ({st.code})
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3.5 pointer-events-none text-zinc-400">
                <Map className="w-4 h-4 opacity-50" />
              </div>
            </div>
          </div>

          {/* 3. City Selector (Dropdown + Custom toggle) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center space-x-1.5">
                <Navigation className="w-3.5 h-3.5 text-white" />
                <span>3. Cidade</span>
              </label>
              <button
                type="button"
                onClick={() => setCustomCityMode(!customCityMode)}
                className="text-[11px] text-zinc-400 hover:text-white font-bold transition underline"
              >
                {customCityMode ? 'Escolher da lista' : 'Digitar outra'}
              </button>
            </div>

            {customCityMode ? (
              <input
                type="text"
                placeholder="Ex: São Paulo, Santos, Lisboa..."
                value={filters.city}
                onChange={(e) => setFilters((prev) => ({ ...prev, city: e.target.value }))}
                className="w-full bg-black border border-zinc-800 hover:border-zinc-600 focus:border-white rounded-2xl px-4 py-3 text-sm text-white placeholder-zinc-600 font-bold outline-none transition"
              />
            ) : (
              <div className="relative">
                <select
                  value={filters.city}
                  onChange={(e) => setFilters((prev) => ({ ...prev, city: e.target.value }))}
                  className="w-full bg-black border border-zinc-800 hover:border-zinc-600 focus:border-white rounded-2xl px-4 py-3 text-sm text-white font-bold outline-none transition appearance-none cursor-pointer"
                >
                  {currentState.cities.map((city) => (
                    <option key={city} value={city} className="bg-black">
                      {city}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3.5 pointer-events-none text-zinc-400">
                  <Navigation className="w-4 h-4 opacity-50" />
                </div>
              </div>
            )}
          </div>

          {/* 4. Niche / Segment Selector */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <Briefcase className="w-3.5 h-3.5 text-white" />
              <span>4. Nicho / Segmento</span>
            </label>
            <div className="relative">
              <select
                value={filters.category}
                onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
                className="w-full bg-black border border-zinc-800 hover:border-zinc-600 focus:border-white rounded-2xl px-4 py-3 text-sm text-white font-bold outline-none transition appearance-none cursor-pointer"
              >
                {NICHES.map((niche) => (
                  <option key={niche.id} value={niche.id} className="bg-black">
                    {niche.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3.5 pointer-events-none text-zinc-400">
                <Briefcase className="w-4 h-4 opacity-50" />
              </div>
            </div>
          </div>

        </div>

        {/* Secondary Row: Website Presence & WhatsApp Filters */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pt-3 border-t border-zinc-800">
          
          {/* Website Status Specificity Filter */}
          <div className="md:col-span-6 lg:col-span-4">
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <Filter className="w-3.5 h-3.5 text-white" />
              <span>Presença Digital:</span>
            </label>
            <select
              value={filters.statusFilter}
              onChange={(e) => setFilters((prev) => ({ ...prev, statusFilter: e.target.value as any }))}
              className="w-full bg-black border border-zinc-800 hover:border-zinc-600 focus:border-white rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm text-white font-bold outline-none transition cursor-pointer"
            >
              <option value="WITHOUT_ANY_SITE" className="bg-black">Sem Nenhum Site ou LP (Recomendado)</option>
              <option value="NO_WEBSITE" className="bg-black">100% Sem Domínio / Sem Site</option>
              <option value="NO_LANDING_PAGE" className="bg-black">Sem Landing Page (Só Perfil/Bio)</option>
              <option value="SOCIAL_ONLY" className="bg-black">Apenas Redes Sociais</option>
              <option value="ALL" className="bg-black">Todos os Estabelecimentos</option>
            </select>
          </div>

          {/* WhatsApp Direct Filter */}
          <div className="md:col-span-6 lg:col-span-3">
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <Phone className="w-3.5 h-3.5 text-white" />
              <span>Filtro de WhatsApp:</span>
            </label>
            <select
              value={filters.whatsappFilter}
              onChange={(e) => setFilters((prev) => ({ ...prev, whatsappFilter: e.target.value as any }))}
              className="w-full bg-black border border-zinc-800 hover:border-zinc-600 focus:border-white rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm text-white font-bold outline-none transition cursor-pointer"
            >
              <option value="ALL" className="bg-black">Todos (Com ou Sem WhatsApp)</option>
              <option value="WITH_WHATSAPP" className="bg-black">Apenas COM WhatsApp Válido</option>
              <option value="WITHOUT_WHATSAPP" className="bg-black">Apenas SEM WhatsApp (Fixo / Local)</option>
            </select>
          </div>

          {/* Quick Keyword & Controls */}
          <div className="md:col-span-6 lg:col-span-2">
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
              Palavra-chave:
            </label>
            <input
              type="text"
              placeholder="Ex: Centro, Bairro..."
              value={filters.customKeyword}
              onChange={(e) => setFilters((prev) => ({ ...prev, customKeyword: e.target.value }))}
              className="w-full bg-black border border-zinc-800 hover:border-zinc-600 focus:border-white rounded-2xl px-3 py-2.5 text-xs sm:text-sm text-white placeholder:text-zinc-600 font-bold outline-none transition"
            />
          </div>

          {/* Search Trigger Button */}
          <div className="md:col-span-12 lg:col-span-3 pt-2 lg:pt-6">
            <button
              onClick={onSearch}
              disabled={isLoading}
              className="w-full bg-white hover:bg-zinc-200 text-black font-black py-3 px-5 rounded-2xl shadow-xl flex items-center justify-center space-x-2 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Escaneando Empresas...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="whitespace-nowrap">Buscar Leads</span>
                </>
              )}
            </button>
          </div>

          {/* Contact-only toggle */}
          <div className="md:col-span-12 flex flex-wrap items-center gap-x-6 gap-y-2">
            <label className="flex items-center space-x-2 text-sm text-zinc-200 font-semibold cursor-pointer select-none">
              <input
                type="checkbox"
                checked={filters.onlyWithPhone}
                onChange={(e) => setFilters((prev) => ({ ...prev, onlyWithPhone: e.target.checked }))}
                className="w-4 h-4 accent-white cursor-pointer"
              />
              <span>Só empresas com telefone ou WhatsApp</span>
            </label>
            <span className="text-xs text-zinc-500">Dica: sem esse filtro aparecem mais empresas, porém sem contato direto.</span>
          </div>

        </div>

        {/* Niche quick tags */}
        <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
          <span className="text-zinc-400 font-bold whitespace-nowrap flex items-center">
            <Sparkles className="w-3.5 h-3.5 text-white mr-1.5" /> Atalhos:
          </span>
          {NICHES.slice(0, 9).map((n) => (
            <button
              key={n.id}
              onClick={() => {
                setFilters((prev) => ({ ...prev, category: n.id }));
              }}
              className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap font-bold text-xs ${
                filters.category === n.id
                  ? 'bg-white text-black border border-white'
                  : 'bg-black text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-600'
              }`}
            >
              {n.id === 'todos_comercios' ? 'Todos os Nichos' : n.name.split('/')[0].replace('🏬 ', '').replace('🌟 ', '')}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};
