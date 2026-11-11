import { LocationCountry } from '../types';

export const COUNTRIES: LocationCountry[] = [
  {
    code: 'BR',
    name: 'Brasil',
    flag: '🇧🇷',
    center: [-14.235, -51.9253],
    states: [
      {
        code: 'SP',
        name: 'São Paulo',
        center: [-23.5505, -46.6333],
        cities: [
          'São Paulo', 'Campinas', 'Guarulhos', 'São Bernardo do Campo', 'Santo André',
          'Osasco', 'Sorocaba', 'Ribeirão Preto', 'São José dos Campos', 'Santos',
          'Piracicaba', 'Bauru', 'Jundiaí', 'Franca', 'São Carlos', 'Barueri', 'Praia Grande'
        ]
      },
      {
        code: 'RJ',
        name: 'Rio de Janeiro',
        center: [-22.9068, -43.1729],
        cities: [
          'Rio de Janeiro', 'Niterói', 'Duque de Caxias', 'São Gonçalo', 'Nova Iguaçu',
          'Petrópolis', 'Campos dos Goytacazes', 'Volta Redonda', 'Cabo Frio', 'Macae'
        ]
      },
      {
        code: 'MG',
        name: 'Minas Gerais',
        center: [-19.9167, -43.9345],
        cities: [
          'Belo Horizonte', 'Uberlândia', 'Contagem', 'Juiz de Fora', 'Betim',
          'Montes Claros', 'Uberaba', 'Governador Valadares', 'Ipatinga', 'Poços de Caldas'
        ]
      },
      {
        code: 'PR',
        name: 'Paraná',
        center: [-25.4284, -49.2733],
        cities: [
          'Curitiba', 'Londrina', 'Maringá', 'Ponta Grossa', 'Cascavel',
          'São José dos Pinhais', 'Foz do Iguaçu', 'Toledo', 'Guarapuava', 'Colombo'
        ]
      },
      {
        code: 'SC',
        name: 'Santa Catarina',
        center: [-27.5954, -48.5480],
        cities: [
          'Florianópolis', 'Joinville', 'Blumenau', 'São José', 'Chapecó',
          'Criciúma', 'Itajaí', 'Balneário Camboriú', 'Jaraguá do Sul', 'Palhoça'
        ]
      },
      {
        code: 'RS',
        name: 'Rio Grande do Sul',
        center: [-30.0346, -51.2177],
        cities: [
          'Porto Alegre', 'Caxias do Sul', 'Canoas', 'Pelotas', 'Santa Maria',
          'Gravataí', 'Viamão', 'Novo Hamburgo', 'São Leopoldo', 'Passo Fundo'
        ]
      },
      {
        code: 'BA',
        name: 'Bahia',
        center: [-12.9714, -38.5014],
        cities: [
          'Salvador', 'Feira de Santana', 'Vitória da Conquista', 'Camaçari',
          'Juazeiro', 'Itabuna', 'Lauro de Freitas', 'Ilhéus', 'Jequié', 'Porto Seguro'
        ]
      },
      {
        code: 'GO',
        name: 'Goiás',
        center: [-16.6869, -49.2648],
        cities: [
          'Goiânia', 'Aparecida de Goiânia', 'Anápolis', 'Rio Verde', 'Luziânia',
          'Águas Lindas de Goiás', 'Valparaíso de Goiás', 'Itumbiara', 'Jataí'
        ]
      },
      {
        code: 'PE',
        name: 'Pernambuco',
        center: [-8.0476, -34.8770],
        cities: [
          'Recife', 'Jaboatão dos Guararapes', 'Olinda', 'Caruaru', 'Petrolina',
          'Paulista', 'Cabo de Santo Agostinho', 'Camaragibe', 'Garanhuns'
        ]
      },
      {
        code: 'CE',
        name: 'Ceará',
        center: [-3.7172, -38.5434],
        cities: [
          'Fortaleza', 'Caucaia', 'Juazeiro do Norte', 'Maracanaú', 'Sobral',
          'Crato', 'Itapipoca', 'Maranguape', 'Iguatu'
        ]
      },
      {
        code: 'DF',
        name: 'Distrito Federal',
        center: [-15.7975, -47.8919],
        cities: [
          'Brasília', 'Taguatinga', 'Ceilândia', 'Águas Claras', 'Samambaia', 'Guará', 'Gama'
        ]
      },
      {
        code: 'ES',
        name: 'Espírito Santo',
        center: [-20.3155, -40.3128],
        cities: [
          'Vitória', 'Vila Velha', 'Serra', 'Cariacica', 'Cachoeiro de Itapemirim', 'Linhares', 'Colatina'
        ]
      },
      {
        code: 'MT',
        name: 'Mato Grosso',
        center: [-15.6014, -56.0979],
        cities: ['Cuiabá', 'Várzea Grande', 'Rondonópolis', 'Sinop', 'Tangará da Serra']
      },
      {
        code: 'MS',
        name: 'Mato Grosso do Sul',
        center: [-20.4697, -54.6201],
        cities: ['Campo Grande', 'Dourados', 'Três Lagoas', 'Corumbá', 'Ponta Porã']
      },
      {
        code: 'AM',
        name: 'Amazonas',
        center: [-3.1190, -60.0217],
        cities: ['Manaus', 'Parintins', 'Itacoatiara', 'Manacapuru', 'Coari']
      },
      {
        code: 'PA',
        name: 'Pará',
        center: [-1.4558, -48.4902],
        cities: ['Belém', 'Ananindeua', 'Santarém', 'Marabá', 'Parauapebas', 'Castanhal']
      },
      {
        code: 'RN',
        name: 'Rio Grande do Norte',
        center: [-5.7945, -35.2110],
        cities: ['Natal', 'Mossoró', 'Parnamirim', 'São Gonçalo do Amarante', 'Macaíba']
      },
      {
        code: 'PB',
        name: 'Paraíba',
        center: [-7.1153, -34.8610],
        cities: ['João Pessoa', 'Campina Grande', 'Santa Rita', 'Patos', 'Bayeux']
      },
      {
        code: 'AL',
        name: 'Alagoas',
        center: [-9.6658, -35.7351],
        cities: ['Maceió', 'Arapiraca', 'Rio Largo', 'Palmeira dos Índios', 'Penedo']
      },
      {
        code: 'MA',
        name: 'Maranhão',
        center: [-2.5307, -44.3068],
        cities: ['São Luís', 'Imperatriz', 'São José de Ribamar', 'Timon', 'Caxias']
      },
      {
        code: 'PI',
        name: 'Piauí',
        center: [-5.0892, -42.8016],
        cities: ['Teresina', 'Parnaíba', 'Picos', 'Piripiri', 'Floriano']
      },
      {
        code: 'SE',
        name: 'Sergipe',
        center: [-10.9472, -37.0731],
        cities: ['Aracaju', 'Nossa Senhora do Socorro', 'Lagarto', 'Itabaiana', 'São Cristóvão']
      },
      {
        code: 'TO',
        name: 'Tocantins',
        center: [-10.1849, -48.3338],
        cities: ['Palmas', 'Araguaína', 'Gurupi', 'Porto Nacional', 'Paraíso do Tocantins']
      },
      {
        code: 'RO',
        name: 'Rondônia',
        center: [-8.7619, -63.9039],
        cities: ['Porto Velho', 'Ji-Paraná', 'Ariquemes', 'Vilhena', 'Cacoal']
      },
      {
        code: 'AC',
        name: 'Acre',
        center: [-9.9753, -67.8249],
        cities: ['Rio Branco', 'Cruzeiro do Sul', 'Sena Madureira', 'Tarauacá', 'Feijó']
      },
      {
        code: 'AP',
        name: 'Amapá',
        center: [0.0389, -51.0664],
        cities: ['Macapá', 'Santana', 'Laranjal do Jari', 'Oiapoque', 'Porto Grande']
      },
      {
        code: 'RR',
        name: 'Roraima',
        center: [2.8235, -60.6758],
        cities: ['Boa Vista', 'Rorainópolis', 'Caracaraí', 'Pacaraima', 'Cantá']
      }
    ]
  },
  {
    code: 'PT',
    name: 'Portugal',
    flag: '🇵🇹',
    center: [39.3999, -8.2245],
    states: [
      {
        code: 'LIS',
        name: 'Distrito de Lisboa',
        center: [38.7223, -9.1393],
        cities: ['Lisboa', 'Cascais', 'Sintra', 'Oeiras', 'Loures', 'Amadora', 'Almada', 'Odivelas']
      },
      {
        code: 'POR',
        name: 'Distrito do Porto',
        center: [41.1579, -8.6291],
        cities: ['Porto', 'Vila Nova de Gaia', 'Matosinhos', 'Maia', 'Gondomar', 'Póvoa de Varzim']
      },
      {
        code: 'BRA',
        name: 'Distrito de Braga',
        center: [41.5454, -8.4265],
        cities: ['Braga', 'Guimarães', 'Vila Nova de Famalicão', 'Barcelos', 'Fafe']
      },
      {
        code: 'SET',
        name: 'Distrito de Setúbal',
        center: [38.5244, -8.8882],
        cities: ['Setúbal', 'Seixal', 'Barreiro', 'Sesimbra', 'Montijo']
      },
      {
        code: 'FAR',
        name: 'Distrito de Faro (Algarve)',
        center: [37.0194, -7.9322],
        cities: ['Faro', 'Portimão', 'Albufeira', 'Loulé', 'Lagos', 'Tavira', 'Olhão']
      },
      {
        code: 'COI',
        name: 'Distrito de Coimbra',
        center: [40.2033, -8.4103],
        cities: ['Coimbra', 'Figueira da Foz', 'Cantanhede', 'Montemor-o-Velho']
      }
    ]
  },
  {
    code: 'US',
    name: 'Estados Unidos',
    flag: '🇺🇸',
    center: [37.0902, -95.7129],
    states: [
      {
        code: 'FL',
        name: 'Florida',
        center: [27.6648, -81.5158],
        cities: ['Miami', 'Orlando', 'Tampa', 'Fort Lauderdale', 'Jacksonville', 'St. Petersburg', 'Boca Raton']
      },
      {
        code: 'CA',
        name: 'California',
        center: [36.7783, -119.4179],
        cities: ['Los Angeles', 'San Francisco', 'San Diego', 'San Jose', 'Sacramento', 'Fresno', 'Long Beach']
      },
      {
        code: 'NY',
        name: 'New York',
        center: [40.7128, -74.0060],
        cities: ['New York City', 'Buffalo', 'Rochester', 'Yonkers', 'Syracuse', 'Albany']
      },
      {
        code: 'TX',
        name: 'Texas',
        center: [31.9686, -99.9018],
        cities: ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth', 'El Paso', 'Arlington']
      },
      {
        code: 'MA',
        name: 'Massachusetts',
        center: [42.4072, -71.3824],
        cities: ['Boston', 'Cambridge', 'Worcester', 'Springfield', 'Lowell']
      }
    ]
  },
  {
    code: 'ES',
    name: 'Espanha',
    flag: '🇪🇸',
    center: [40.4637, -3.7492],
    states: [
      {
        code: 'MAD',
        name: 'Madrid',
        center: [40.4168, -3.7038],
        cities: ['Madrid', 'Móstoles', 'Alcalá de Henares', 'Fuenlabrada', 'Leganés']
      },
      {
        code: 'CAT',
        name: 'Cataluña',
        center: [41.3879, 2.1699],
        cities: ['Barcelona', 'L\'Hospitalet de Llobregat', 'Badalona', 'Terrassa', 'Sabadell']
      },
      {
        code: 'VAL',
        name: 'Comunidad Valenciana',
        center: [39.4699, -0.3763],
        cities: ['Valencia', 'Alicante', 'Elche', 'Castellón de la Plana']
      }
    ]
  },
  {
    code: 'UK',
    name: 'Reino Unido',
    flag: '🇬🇧',
    center: [55.3781, -3.4360],
    states: [
      {
        code: 'ENG',
        name: 'England',
        center: [51.5074, -0.1278],
        cities: ['London', 'Manchester', 'Birmingham', 'Liverpool', 'Bristol', 'Leeds']
      },
      {
        code: 'SCT',
        name: 'Scotland',
        center: [55.9533, -3.1883],
        cities: ['Edinburgh', 'Glasgow', 'Aberdeen', 'Dundee']
      }
    ]
  }
];
