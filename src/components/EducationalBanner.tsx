import React from 'react';
import { BookOpen, Sparkles, Target, DollarSign, MessageCircle, CheckCircle2, Zap, ArrowRight } from 'lucide-react';

export const EducationalBanner: React.FC = () => {
  return (
    <div className="space-y-6">
      
      {/* Hero Playbook Banner */}
      <div className="bg-gradient-to-r from-brand-900 via-indigo-900 to-slate-900 border border-brand-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Guia Prático de Vendas</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
            Como Vender Landing Pages de R$ 1.000 a R$ 3.500 para Negócios Locais
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Mais de 65% das pequenas e médias empresas no Brasil e no mundo não possuem um site otimizado para celulares ou dependem apenas de um perfil no Instagram. Aprenda o passo a passo para transformar esses leads em clientes pagantes.
          </p>
        </div>
      </div>

      {/* 4 Steps Methodology */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Step 1 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 font-extrabold flex items-center justify-center text-sm border border-brand-500/20">
            01
          </div>
          <h3 className="font-bold text-white text-base">Filtre por Cidade e Nicho</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Escolha nichos com alto ticket médio (Dentistas, Harmonização, Oficinas, Advocacia, Marcenarias). Eles recuperam o investimento do site com apenas 1 ou 2 clientes novos.
          </p>
        </div>

        {/* Step 2 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 font-extrabold flex items-center justify-center text-sm border border-emerald-500/20">
            02
          </div>
          <h3 className="font-bold text-white text-base">Abordagem de Não-Venda</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Nunca chegue oferecendo "código" ou "HTML". Mostre que os concorrentes estão captando os clientes que buscam no Google Maps enquanto o perfil deles não tem botão de ação.
          </p>
        </div>

        {/* Step 3 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 font-extrabold flex items-center justify-center text-sm border border-amber-500/20">
            03
          </div>
          <h3 className="font-bold text-white text-base">Envie um Mockup Rápido</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Gere uma prévia visual ou print de 30s mostrando o logo deles em uma página moderna com botão verde de WhatsApp piscando. A taxa de resposta sobe mais de 4x.
          </p>
        </div>

        {/* Step 4 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 font-extrabold flex items-center justify-center text-sm border border-purple-500/20">
            04
          </div>
          <h3 className="font-bold text-white text-base">Mensalidade de Manutenção</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Cobre R$ 1.200 a R$ 2.500 pela criação + R$ 100 a R$ 250/mês para hospedagem, domínio, suporte e pequenas alterações. Com 20 clientes você tem R$ 4.000/mês de renda recorrente!
          </p>
        </div>

      </div>

      {/* Pricing Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <h3 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center space-x-2">
          <DollarSign className="w-5 h-5 text-emerald-400" />
          <span>Tabela Recomendada de Preços para Landing Pages</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Plano Express (48h)
            </span>
            <div className="text-2xl font-extrabold text-white mb-2">
              R$ 800 - R$ 1.200
            </div>
            <ul className="text-xs text-slate-300 space-y-1.5">
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Página única com botão de WhatsApp</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Integração Google Meu Negócio</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Carregamento rápido no mobile</span>
              </li>
            </ul>
          </div>

          <div className="bg-brand-950/40 p-4 rounded-2xl border border-brand-500/40 relative">
            <span className="absolute -top-2.5 right-4 bg-brand-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
              Mais Vendido
            </span>
            <span className="text-xs font-bold text-brand-300 uppercase tracking-wider block mb-1">
              Plano de Alta Conversão
            </span>
            <div className="text-2xl font-extrabold text-white mb-2">
              R$ 1.500 - R$ 2.400
            </div>
            <ul className="text-xs text-slate-200 space-y-1.5">
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" />
                <span>Copywriting persuasivo e fotos tratadas</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" />
                <span>Formulário de captura / Agendamento</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" />
                <span>Depoimentos + Galeria de Serviços</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" />
                <span>Pixel do Meta & Google Ads configurados</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Plano Institucional Completo
            </span>
            <div className="text-2xl font-extrabold text-white mb-2">
              R$ 2.800 - R$ 4.500
            </div>
            <ul className="text-xs text-slate-300 space-y-1.5">
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Site multi-páginas com blog SEO</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Painel administrativo fácil para o cliente</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>E-mails corporativos (ex: contato@...)</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

    </div>
  );
};
