# 🚀 LeadSite Pro — Prospector de Empresas Sem Site & Landing Page

> Plataforma inteligente para prospecção de negócios locais sem presença digital ou sem landing page de conversão. Filtragem por **País**, **Estado/UF**, **Cidade** e **Nicho**.

![LeadSite Pro](https://img.shields.io/badge/Status-Online-emerald?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-6.0-646cff?style=for-the-badge&logo=vite)

---

## 🌟 Funcionalidades

- 🌍 **Filtros Geográficos Dinâmicos**: Escolha País (Brasil 🇧🇷, Portugal 🇵🇹, EUA 🇺🇸, Espanha 🇪🇸, UK 🇬🇧), Estado/UF e Cidade (dropdown ou busca livre).
- 🏢 **Segmentação por Nicho**: Dentistas, Clínicas de Estética, Restaurantes, Oficinas Mecânicas, Advocacia, Salões de Beleza, Marcenarias, Academias, Pet Shops, Imobiliárias e palavras-chave customizadas.
- ⚡ **Diagnóstico de Presença Digital**:
  - 🔴 **100% Sem Domínio / Sem Site**
  - 🟠 **Sem Landing Page (Linktree/Página Incompleta)**
  - 🟣 **Apenas Redes Sociais (Instagram/Facebook)**
  - 📊 **Score de Oportunidade (0 a 100%)** e estimativa de faturamento mensal perdido.
- 💬 **Gerador de Pitch com 1-Clique no WhatsApp**: Mensagens persuasivas personalizadas com nome da empresa, nicho e cidade para envio instantâneo.
- 📋 **Pipeline CRM Kanban**: Gerencie o funil de vendas (*Novos Leads*, *Contatados*, *Em Negociação*, *Contrato Fechado 🎉* e *Perdido*).
- 🗺️ **Mapa Interativo (Leaflet)**: Pinos coloridos por status de site diretamente na cidade pesquisada.
- 📥 **Exportação Rápida**: Baixe relatórios em **CSV** (compatível com Excel) ou **JSON**.
- 📚 **Playbook de Vendas**: Guia com tabela de preços sugeridos (R$ 800 a R$ 4.500) e roteiros de abordagem.

---

## 🚀 Como Executar Localmente

```bash
# 1. Instalar as dependências
npm install

# 2. Iniciar o servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:5173/](http://localhost:5173/) no seu navegador.

---

## 📦 Build para Produção

```bash
npm run build
```

---

## 🌐 Publicação no GitHub Pages

```bash
npm run deploy
```

---

Desenvolvido para agências, freelancers e web designers fecharem contratos de criação de sites e landing pages todos os dias! 💼✨

---

## ✅ Sobre a veracidade dos leads

- Todos os leads vêm de **fontes reais**: OpenStreetMap (gratuito) ou Google Places (com sua chave). O antigo modo "demonstração", que gerava empresas fictícias, foi **removido**.
- Nada é inventado: se a fonte não informa nota, avaliações, horário ou e-mail, o campo fica oculto.
- Cada lead tem o botão **🔗 Ver fonte** para conferir o registro original.
- WhatsApp só aparece quando o número é de celular (telefone fixo não vira WhatsApp).
- ⚠️ No OpenStreetMap, "sem site" significa *sem site cadastrado no mapa*. Confirme no Google antes de abordar. A chave do Google Places dá resultados mais completos.
- Se nenhuma fonte responder, o app mostra o erro em vez de preencher com dados falsos.
