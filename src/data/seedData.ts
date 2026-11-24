import type {BookingCategory, ClientReview, ServiceHistoryRecord} from '../types/clinic';

export interface StructureSpecialtyItem {
  id: string;
  indexLabel: string;
  kicker: string;
  title: string;
  description: string;
  highlights: string[];
  imageUrl: string;
  imageAlt: string;
  actionLabel: string;
  targetCategory: BookingCategory;
  targetService: string;
  featured?: boolean;
}

export const HERO_IMAGE = {
  url: '/src/assets/images/hero_veterinary_clinic_1795475617112.jpg',
  alt: 'Médica veterinária realizando exame clínico cuidadoso em um Golden Retriever no consultório do Império Animal',
};

export const STRUCTURE_ITEMS: StructureSpecialtyItem[] = [
  {
    id: 'consultorio',
    indexLabel: '01',
    kicker: 'Clínica Médica de Pequenos Animais',
    title: 'Consultório Veterinário',
    description:
      'Avaliação clínica minuciosa para cães e gatos, diagnósticos preventivos, acompanhamento geriátrico e protocolos terapêuticos individualizados em ambiente tranquilo.',
    highlights: [
      'Consultas de rotina e retorno clínico',
      'Solicitação e interpretação de exames laboratoriais',
      'Acompanhamento de filhotes, adultos e pets seniores',
    ],
    imageUrl: '/src/assets/images/structure_vet_consultation_1795475617216.jpg',
    imageAlt: 'Sala de atendimento veterinário do Império Animal com mesa clínica e equipamentos de diagnóstico',
    actionLabel: 'Agendar Consulta',
    targetCategory: 'veterinario',
    targetService: 'Consulta de Rotina',
    featured: true,
  },
  {
    id: 'farmacia-vacinas',
    indexLabel: '02',
    kicker: 'Imunização & Farmácia Veterinária',
    title: 'Farmácia Pet e Vacinas',
    description:
      'Carteira vacinal completa com vacinas éticas armazenadas sob controle rigoroso de temperatura, além de farmácia veterinária abastecida para continuidade imediata do tratamento.',
    highlights: [
      'Vacinas importadas (V8/V10, Antirrábica, Felinas)',
      'Vermífugos, antiparasitários e medicamentos prescritos',
      'Orientação farmacológica direta após a consulta',
    ],
    imageUrl: '/src/assets/images/structure_pet_pharmacy_1795475617259.jpg',
    imageAlt: 'Farmácia veterinária organizada com refrigeração controlada para vacinas',
    actionLabel: 'Agendar Vacinação',
    targetCategory: 'veterinario',
    targetService: 'Vacinação',
  },
  {
    id: 'estetica',
    indexLabel: '03',
    kicker: 'Higiene com Supervisão Técnica',
    title: 'Banho, Tosa e Estética Animal',
    description:
      'Protocolo higiênico de alto padrão com cosméticos hipoalergênicos, secagem com temperatura controlada e manejo respeitoso para reduzir o estresse do animal.',
    highlights: [
      'Banho e tosa na tesoura ou máquina',
      'Banhos terapêuticos conforme prescrição veterinária',
      'Higienização de ouvidos e corte seguro de unhas',
    ],
    imageUrl: '/src/assets/images/structure_pet_grooming_1795475617429.jpg',
    imageAlt: 'Estúdio de banho e tosa higienizado com cão recém-tosado em ambiente calmo',
    actionLabel: 'Agendar Banho e Tosa',
    targetCategory: 'petshop',
    targetService: 'Banho e Tosa',
  },
  {
    id: 'loja',
    indexLabel: '04',
    kicker: 'Nutrição Clínica & Bem-Estar',
    title: 'Loja Completa Pet Shop',
    description:
      'Seleção criteriosa de rações super premium, dietas terapêuticas prescritas, guias, comedouros ergonômicos e itens de enriquecimento ambiental para o dia a dia do seu pet.',
    highlights: [
      'Rações medicamentosas e linhas super premium',
      'Acessórios duráveis para passeio e descanso',
      'Indicação nutricional orientada pela equipe',
    ],
    imageUrl: '/src/assets/images/structure_pet_store_1795475617937.jpg',
    imageAlt: 'Interior organizado da loja pet shop com nutrição e acessórios selecionados',
    actionLabel: 'Reservar Atendimento',
    targetCategory: 'petshop',
    targetService: 'Banho Completo + Hidratação',
    featured: true,
  },
];

export const INITIAL_SERVICE_HISTORY: ServiceHistoryRecord[] = [
  {
    id: 'hist-seed-1',
    category: 'veterinario',
    service: 'Vacinação',
    species: 'Cão',
    petName: 'Bento',
    tutorName: 'Fernanda Oliveira',
    tutorPhone: '(64) 99612-8410',
    date: '2026-11-18',
    shift: 'Manhã (08h às 12h)',
    status: 'Concluído',
    professional: 'Equipe Clínica Veterinária Império Animal',
    notes: 'Aplicação anual V10 + Antirrábica com conferência clínica.',
    createdAt: '2026-11-16T14:20:00Z',
  },
  {
    id: 'hist-seed-2',
    category: 'petshop',
    service: 'Banho e Tosa',
    species: 'Cão',
    petName: 'Amora',
    tutorName: 'Lucas Rezende',
    tutorPhone: '(64) 99244-1190',
    date: '2026-11-20',
    shift: 'Tarde (13h30 às 18h)',
    status: 'Concluído',
    professional: 'Centro de Estética Império Animal',
    notes: 'Tosa higiênica, hidratação e shampoo dermatológico suave.',
    createdAt: '2026-11-19T09:10:00Z',
  },
  {
    id: 'hist-seed-3',
    category: 'veterinario',
    service: 'Consulta de Rotina',
    species: 'Gato',
    petName: 'Mia',
    tutorName: 'Patrícia Nogueira',
    tutorPhone: '(64) 99801-3342',
    date: '2026-11-26',
    shift: 'Manhã (08h às 12h)',
    status: 'Confirmado',
    professional: 'Equipe Clínica Veterinária Império Animal',
    notes: 'Check-up renal preventivo e avaliação odontológica.',
    createdAt: '2026-11-22T16:45:00Z',
  },
];

export const INITIAL_CLIENT_REVIEWS: ClientReview[] = [
  {
    id: 'rev-1',
    authorName: 'Renata Magalhães',
    petInfo: 'Theo · Golden Retriever (6 anos)',
    category: 'veterinario',
    serviceLabel: 'Consulta de Rotina e Exames',
    rating: 5,
    comment:
      'O Theo tinha dermatite recorrente há meses. Na consulta aqui no Império Animal ajustaram o diagnóstico com exames, já saí com o medicamento na farmácia interna e em duas semanas a pele dele cicatrizou completamente.',
    dateLabel: '14/11/2026',
    verified: true,
  },
  {
    id: 'rev-2',
    authorName: 'Gustavo Henrique Silva',
    petInfo: 'Nina · Gata SRD (3 anos)',
    category: 'veterinario',
    serviceLabel: 'Vacinação',
    rating: 5,
    comment:
      'A Nina costumava ficar muito estressada em clínicas. O manejo calmo no consultório e a agilidade no agendamento pela Av. Santos Dumont fizeram toda a diferença para manter as vacinas dela em dia.',
    dateLabel: '09/11/2026',
    verified: true,
  },
  {
    id: 'rev-3',
    authorName: 'Camila Borges',
    petInfo: 'Mel · Shih Tzu (4 anos)',
    category: 'petshop',
    serviceLabel: 'Banho e Tosa',
    rating: 5,
    comment:
      'Trazemos a Mel para o banho e tosa toda quinzena. Ela volta tranquila, cheirosa, com os ouvidos bem limpos e sem irritação na pele. Saber que há veterinário na mesma estrutura traz muita segurança.',
    dateLabel: '03/11/2026',
    verified: true,
  },
];
