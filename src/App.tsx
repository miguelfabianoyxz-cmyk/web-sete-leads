import React, { useState, useEffect } from 'react';
import { 
  Building2, LayoutGrid, Table, Download, RefreshCw, Sparkles, 
  MapPin, CheckCircle2, AlertCircle, ChevronRight, SlidersHorizontal 
} from 'lucide-react';
import { Lead, SearchFilterState, ApiSettings, LeadStage } from './types';
import { COUNTRIES } from './data/locations';
import { NICHES } from './data/niches';
import { searchLeadsService } from './services/leadSearchService';
import { exportLeadsToCsv, exportLeadsToJson } from './services/exportService';

import { Header } from './components/Header';
import { SearchFilters } from './components/SearchFilters';
import { StatsBar } from './components/StatsBar';
import { LeadCard } from './components/LeadCard';
import { LeadTable } from './components/LeadTable';
import { LeadMap } from './components/LeadMap';
import { PitchModal } from './components/PitchModal';
import { LeadAuditModal } from './components/LeadAuditModal';
import { CrmKanban } from './components/CrmKanban';
import { ApiSettingsModal } from './components/ApiSettingsModal';
import { EducationalBanner } from './components/EducationalBanner';

const DEFAULT_SETTINGS: ApiSettings = {
  googlePlacesApiKey: '',
  useCustomGooglePlaces: false,
  overpassCustomEndpoint: 'https://overpass-api.de/api/interpreter',
  agencyName: 'Web Sete',
  agentName: 'Equipe Web Sete',
  agentPhone: '',
  agentWebsite: 'websete.com'
};

const loadFilters = (d: SearchFilterState): SearchFilterState => {
  try {
    const s = localStorage.getItem('leadsite_filters');
    return s ? { ...d, ...JSON.parse(s) } : d;
  } catch {
    return d;
  }
};

export const App: React.FC = () => {
  // Navigation tab
  const [activeTab, setActiveTab] = useState<'search' | 'crm' | 'map' | 'playbook'>('search');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Search filter state - Defaults to All Commercial Types
  const [filters, setFilters] = useState<SearchFilterState>(() => loadFilters({
    countryCode: 'BR',
    stateCode: 'SP',
    city: 'São Paulo',
    category: 'todos_comercios',
    customKeyword: '',
    statusFilter: 'WITHOUT_ANY_SITE',
    whatsappFilter: 'ALL',
    onlyWithPhone: true,
    minRating: 0,
    searchSource: 'auto'
  }));

  // Data state
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchMode, setSearchMode] = useState<string>('Aguardando busca');
  const [searchError, setSearchError] = useState<string>('');

  // CRM State (persisted in localStorage)
  const [crmLeads, setCrmLeads] = useState<Lead[]>(() => {
    try {
      const saved = localStorage.getItem('leadsite_crm_leads');
      // descarta leads sintéticos salvos por versões antigas (modo demonstração)
      return saved ? (JSON.parse(saved) as Lead[]).filter((l) => (l.source as string) !== 'smart_generator') : [];
    } catch {
      return [];
    }
  });

  // Settings State (persisted in localStorage)
  const [settings, setSettings] = useState<ApiSettings>(() => {
    try {
      const saved = localStorage.getItem('leadsite_settings');
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Modals state
  const [pitchLead, setPitchLead] = useState<Lead | null>(null);
  const [auditLead, setAuditLead] = useState<Lead | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Save CRM to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('leadsite_crm_leads', JSON.stringify(crmLeads));
    } catch {
      // Ignore
    }
  }, [crmLeads]);

  // Lembra os últimos filtros usados
  useEffect(() => {
    try {
      localStorage.setItem('leadsite_filters', JSON.stringify(filters));
    } catch {
      // Ignore
    }
  }, [filters]);

  // Save Settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('leadsite_settings', JSON.stringify(settings));
    } catch {
      // Ignore
    }
  }, [settings]);

  // Initial automatic search on startup
  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setSearchError('');
    try {
      const result = await searchLeadsService(filters, settings);
      setLeads(result.leads);
      setSearchMode(result.searchMode);
    } catch (err) {
      console.error('Search error:', err);
      setLeads([]);
      setSearchMode('Sem resultados');
      setSearchError(err instanceof Error ? err.message : 'Falha ao buscar empresas.');
    } finally {
      setIsLoading(false);
    }
  };

  // CRM Operations
  const handleToggleCrm = (lead: Lead) => {
    const exists = crmLeads.find((l) => l.id === lead.id);
    if (exists) {
      setCrmLeads((prev) => prev.filter((l) => l.id !== lead.id));
    } else {
      setCrmLeads((prev) => [
        { ...lead, stage: 'novo', dealValue: 1500, createdAt: new Date().toISOString() },
        ...prev
      ]);
    }
  };

  const handleBatchSaveToCrm = (batchLeads: Lead[]) => {
    const existingIds = new Set(crmLeads.map((l) => l.id));
    const newOnes = batchLeads
      .filter((l) => !existingIds.has(l.id))
      .map((l) => ({ ...l, stage: 'novo' as LeadStage, dealValue: 1500, createdAt: new Date().toISOString() }));

    setCrmLeads((prev) => [...newOnes, ...prev]);
  };

  const handleUpdateLeadStage = (leadId: string, stage: LeadStage) => {
    setCrmLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, stage, contactedAt: stage === 'contatado' ? new Date().toISOString() : l.contactedAt } : l))
    );
  };

  const handleRemoveCrmLead = (leadId: string) => {
    setCrmLeads((prev) => prev.filter((l) => l.id !== leadId));
  };

  const handleUpdateDealValue = (leadId: string, dealValue: number) => {
    setCrmLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, dealValue } : l)));
  };

  const handleUpdateNotes = (leadId: string, notes: string) => {
    setCrmLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, notes } : l)));
  };

  const handleMarkContacted = (leadId: string) => {
    // If in CRM, advance to contatado or add to CRM as contatado
    const exists = crmLeads.find((l) => l.id === leadId);
    if (exists) {
      handleUpdateLeadStage(leadId, 'contatado');
    } else {
      const foundInLeads = leads.find((l) => l.id === leadId);
      if (foundInLeads) {
        setCrmLeads((prev) => [
          { ...foundInLeads, stage: 'contatado', contactedAt: new Date().toISOString(), dealValue: 1500 },
          ...prev
        ]);
      }
    }
  };

  const crmIdSet = new Set(crmLeads.map((l) => l.id));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      
      {/* Top Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        crmLeadsCount={crmLeads.length}
        totalFoundCount={leads.length}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onExportCsv={() => exportLeadsToCsv(leads)}
        leads={leads}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Tab 1: Prospecção de Empresas */}
        {activeTab === 'search' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Search Filters Bar (Country, State, City, Niche, Status) */}
            <SearchFilters
              filters={filters}
              setFilters={setFilters}
              onSearch={handleSearch}
              isLoading={isLoading}
            />

            {/* Metrics & Statistics Bar */}
            <StatsBar
              leads={leads}
              searchMode={searchMode}
            />

            {searchError && !isLoading && (
              <div role="alert" className="rounded-2xl border border-red-500/30 bg-red-500/10 text-red-200 text-sm p-4">
                ⚠️ {searchError}
              </div>
            )}

            {/* Results Header & Grid/Table Switcher */}
            {leads.length > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-white flex items-center space-x-2">
                    <span>Empresas Encontradas em {filters.city}</span>
                    <span className="text-xs font-bold text-brand-400 bg-brand-500/10 px-2.5 py-0.5 rounded-full border border-brand-500/20">
                      {leads.length} leads
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Oportunidades filtradas por ausência de site ou landing page otimizada
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  
                  {/* Grid vs Table View Toggle */}
                  <div className="bg-slate-900 border border-slate-800 p-1 rounded-xl flex items-center space-x-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
                        viewMode === 'grid'
                          ? 'bg-brand-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                      title="Visualização em Cards"
                    >
                      <LayoutGrid className="w-4 h-4" />
                      <span className="hidden sm:inline">Cards</span>
                    </button>

                    <button
                      onClick={() => setViewMode('table')}
                      className={`p-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
                        viewMode === 'table'
                          ? 'bg-brand-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                      title="Visualização em Tabela"
                    >
                      <Table className="w-4 h-4" />
                      <span className="hidden sm:inline">Tabela</span>
                    </button>
                  </div>

                  {/* Export Options */}
                  <button
                    onClick={() => exportLeadsToCsv(leads)}
                    className="p-2 sm:px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-800 flex items-center space-x-1.5 transition"
                    title="Exportar CSV (Excel)"
                  >
                    <Download className="w-4 h-4 text-emerald-400" />
                    <span className="hidden sm:inline">CSV</span>
                  </button>
                </div>
              </div>
            )}

            {/* Results Content */}
            {isLoading ? (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-16 text-center space-y-4">
                <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <h3 className="text-lg font-bold text-white">Escaneando empresas em {filters.city}...</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Analisando estabelecimentos no Google Maps e OpenStreetMap para identificar empresas sem site oficial.
                </p>
              </div>
            ) : leads.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-16 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Nenhuma empresa encontrada com os filtros atuais</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Tente alterar o status para "Todos os Estabelecimentos" ou escolher outra cidade/nicho.
                </p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {leads.map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    onOpenPitch={(l) => setPitchLead(l)}
                    onOpenAudit={(l) => setAuditLead(l)}
                    onToggleCrm={handleToggleCrm}
                    isSavedInCrm={crmIdSet.has(lead.id)}
                  />
                ))}
              </div>
            ) : (
              <LeadTable
                leads={leads}
                onOpenPitch={(l) => setPitchLead(l)}
                onOpenAudit={(l) => setAuditLead(l)}
                onToggleCrm={handleToggleCrm}
                crmLeads={crmLeads}
                onBatchSaveToCrm={handleBatchSaveToCrm}
              />
            )}

          </div>
        )}

        {/* Tab 2: Pipeline CRM Kanban */}
        {activeTab === 'crm' && (
          <div className="animate-in fade-in duration-200">
            <CrmKanban
              crmLeads={crmLeads}
              onUpdateLeadStage={handleUpdateLeadStage}
              onRemoveLead={handleRemoveCrmLead}
              onOpenPitch={(l) => setPitchLead(l)}
              onUpdateDealValue={handleUpdateDealValue}
              onUpdateNotes={handleUpdateNotes}
            />
          </div>
        )}

        {/* Tab 3: Mapa Interativo de Oportunidades */}
        {activeTab === 'map' && (
          <div className="animate-in fade-in duration-200">
            <LeadMap
              leads={leads}
              onOpenPitch={(l) => setPitchLead(l)}
              onOpenAudit={(l) => setAuditLead(l)}
            />
          </div>
        )}

        {/* Tab 4: Guia de Vendas & Playbook */}
        {activeTab === 'playbook' && (
          <div className="animate-in fade-in duration-200">
            <EducationalBanner />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p className="flex items-center justify-center space-x-1.5">
          <Building2 className="w-4 h-4 text-brand-400" />
          <span><strong>LeadSite Pro</strong> — Plataforma de Prospecção Inteligente de Empresas Sem Site</span>
        </p>
      </footer>

      {/* Modals */}
      <PitchModal
        lead={pitchLead}
        onClose={() => setPitchLead(null)}
        apiSettings={settings}
        onMarkContacted={handleMarkContacted}
      />

      <LeadAuditModal
        lead={auditLead}
        onClose={() => setAuditLead(null)}
        onOpenPitch={(l) => setPitchLead(l)}
      />

      <ApiSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={setSettings}
      />

    </div>
  );
};
export default App;
