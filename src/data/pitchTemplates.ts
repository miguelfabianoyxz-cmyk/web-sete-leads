import { PitchTemplate } from '../types';

export const PITCH_TEMPLATES: PitchTemplate[] = [
  {
    id: 'wpp-direto-perda',
    title: '🔥 WhatsApp: Direto ao Ponto (Perda de Clientes)',
    target: 'whatsapp',
    tone: 'direto',
    description: 'Abordagem curta, amigável e com gatilho de curiosidade mostrando que o concorrente está pegando clientes da busca do Google.',
    content: `Olá, equipe da *{empresa}*! Tudo bem? 👋

Estava pesquisando por *{nicho}* aqui em *{cidade}* no Google e notei que vocês têm ótimas avaliações ⭐, mas ainda *não possuem um site ou landing page oficial* quando o cliente clica.

Hoje, dezenas de clientes da nossa cidade buscam no Google e acabam indo direto para os concorrentes que têm botão de agendamento/orçamento rápido no topo.

Eu criei uma prévia de como ficaria uma Landing Page moderna e rápida para a *{empresa}* dobrar os orçamentos no WhatsApp. 

Posso te mandar um print de 30 segundos aqui sem compromisso nenhum?`
  },
  {
    id: 'wpp-consultivo-google',
    title: '📊 WhatsApp: Auditoria e Oportunidade Google',
    target: 'whatsapp',
    tone: 'consultivo',
    description: 'Tom consultivo e profissional, focado em mostrar a oportunidade de ser #1 no Google da cidade.',
    content: `Olá! Sou o {seu_nome}, especialista em posicionamento digital para empresas de *{cidade}*.

Estava analisando o mercado de *{nicho}* da nossa região e encontrei a *{empresa}*. Parabéns pelo trabalho e atendimento!

Notei um ponto crítico de oportunidade: o link principal de vocês não leva para uma página de conversão (Landing Page), o que faz com que visitantes que clicam no perfil do Google Maps saiam sem chamar no WhatsApp.

Nós ajudamos empresas como a sua a colocarem uma Landing Page no ar em menos de 48h, já integrada com botão de WhatsApp e rastreamento de anúncios.

Você é a pessoa responsável pelo marketing ou atendimento da *{empresa}*? Gostaria de bater um papo rápido de 5 minutos!`
  },
  {
    id: 'wpp-oferta-express',
    title: '⚡ WhatsApp: Oferta Especial Landing Page Express (48h)',
    target: 'whatsapp',
    tone: 'oferta',
    description: 'Ideal para fechar contratos rápidos de R$ 800 a R$ 2.500 com entrega em poucos dias.',
    content: `Oi, tudo bem? Aqui é o {seu_nome} da {sua_agencia}.

Notei que a *{empresa}* tem um potencial gigante aqui em *{cidade}*, mas ainda não possui um site próprio para receber novos clientes.

Estamos com uma condição exclusiva nesta semana para empresas do segmento de *{nicho}*:
✅ Criação de Landing Page Completa de Alta Conversão
✅ Botão inteligente de WhatsApp e mapa de localização
✅ Carregamento ultrarrápido em celulares
✅ Entrega em até 3 dias úteis

Gostaria de ver alguns exemplos de sites que já criamos para o seu nicho? É só me responder com um "SIM"! 🚀`
  },
  {
    id: 'email-apresentacao-formal',
    title: '✉️ E-mail: Proposta Consultiva de Presença Digital',
    target: 'email',
    tone: 'auditoria',
    subject: 'Oportunidade de Novos Clientes no Google para {empresa} em {cidade}',
    description: 'E-mail frio corporativo com estrutura de problema, solução e chamada para ação clara.',
    content: `Prezada diretoria / equipe da {empresa},

Espero que este e-mail os encontre bem.

Meu nome é {seu_nome}, fundador da {sua_agencia}. Acompanho o crescimento das empresas do setor de {nicho} em {cidade} e identifiquei uma excelente oportunidade de crescimento para a {empresa}.

Ao realizar uma auditoria de busca local no Google para a cidade de {cidade}, verifiquei que a sua empresa possui excelente reputação, porém a ausência de uma Landing Page otimizada para dispositivos móveis está fazendo com que centenas de clientes em potencial migrem para concorrentes diretos.

Estimamos que um negócio do seu porte pode estar deixando de faturar cerca de {perda_estimada}/mês apenas em solicitações não capturadas no Google.

Desenvolvemos Landing Pages estratégicas que:
1. Posicionam sua marca no topo das buscas locais (Google Meu Negócio + SEO Local);
2. Direcionam o cliente diretamente para o WhatsApp de vendas com 1 clique;
3. Exibem seus serviços e provas sociais com máxima autoridade.

Gostaria de agendar uma breve conversa de 10 minutos nesta semana para apresentar uma proposta sob medida sem qualquer custo inicial?

Fico no aguardo do seu retorno.

Atenciosamente,

{seu_nome}
{sua_agencia}
{seu_telefone}
{seu_site}`
  },
  {
    id: 'wpp-insta-sem-site',
    title: '📱 WhatsApp: Para quem só tem Instagram (Link na Bio)',
    target: 'whatsapp',
    tone: 'consultivo',
    description: 'Específico para empresas que só usam perfil do Instagram ou linktree e perdem clientes do Google.',
    content: `Olá, pessoal da *{empresa}*! Tudo bem?

Adorei o Instagram de vocês! Os posts são muito bem feitos. 👏

Porém, notei que quando alguém busca por *{nicho}* no Google ou clica no link de vocês, não encontra uma página oficial que passe segurança imediata e feche vendas direto no WhatsApp.

Mais de 70% das pessoas que querem contratar um serviço urgente preferem um site profissional ao invés de navegar pelo feed do Instagram.

Podemos criar uma página moderna com o mesmo estilo visual de vocês para profissionalizar ainda mais a marca.

Gostaria de receber uma demonstração sem custo?`
  }
];
