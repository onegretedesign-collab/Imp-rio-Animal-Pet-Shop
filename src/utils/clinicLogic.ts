import type {
  BookingCategory,
  BookingInput,
  BookingValidationErrors,
  ClientReview,
  ReviewInput,
  ReviewValidationErrors,
  ServiceHistoryRecord,
} from '../types/clinic';

export const CLINIC_NAME = 'Império Animal Pet Shop - Consultório Veterinário';
export const CLINIC_SHORT_NAME = 'Império Animal';
export const CLINIC_PHONE_DISPLAY = '(64) 3651-2388';
export const CLINIC_WHATSAPP_NUMBER = '556436512388';
export const CLINIC_ADDRESS = 'Av. Santos Dumont, 92 - Centro, Quirinópolis - GO';
export const CLINIC_HOURS = 'Segunda a Sexta: 08h às 18h · Sábado: 08h às 13h';

export const VETERINARY_SERVICES = [
  'Consulta de Rotina',
  'Vacinação',
  'Exames',
  'Retorno',
] as const;

export const PETSHOP_SERVICES = [
  'Banho e Tosa',
  'Banho Terapêutico',
  'Tosa Higiênica e Corte de Unhas',
  'Banho Completo + Hidratação',
] as const;

export const APPOINTMENT_SHIFTS = [
  'Manhã (08h às 12h)',
  'Tarde (13h30 às 18h)',
] as const;

export function getServicesForCategory(category: BookingCategory): readonly string[] {
  return category === 'veterinario' ? VETERINARY_SERVICES : PETSHOP_SERVICES;
}

export function getCategoryLabel(category: BookingCategory): string {
  return category === 'veterinario' ? 'Atendimento Veterinário' : 'Pet Shop & Estética';
}

export function extractDigits(value: string): string {
  return value.replace(/\D/g, '');
}

export function formatPhoneMask(rawValue: string): string {
  const digits = extractDigits(rawValue).slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function formatDatePtBr(isoDate: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return isoDate;
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
}

export function getTodayIsoDate(referenceDate = new Date()): string {
  const year = referenceDate.getFullYear();
  const month = String(referenceDate.getMonth() + 1).padStart(2, '0');
  const day = String(referenceDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getInitialRescheduleDate(
  previousDateIso: string,
  todayIso: string = getTodayIsoDate()
): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(previousDateIso) && previousDateIso >= todayIso) {
    return previousDateIso;
  }
  return todayIso;
}

export function validateBookingInput(
  input: BookingInput,
  todayIso: string = getTodayIsoDate()
): BookingValidationErrors {
  const errors: BookingValidationErrors = {};
  const validServices = getServicesForCategory(input.category);

  if (!input.service || !validServices.includes(input.service)) {
    errors.service = 'Selecione o tipo de atendimento desejado.';
  }

  if (input.petName.trim().length < 2) {
    errors.petName = 'Informe o nome do pet (mínimo 2 caracteres).';
  }

  if (input.tutorName.trim().length < 3) {
    errors.tutorName = 'Informe o nome completo do tutor.';
  }

  const phoneDigits = extractDigits(input.tutorPhone);
  if (phoneDigits.length < 10 || phoneDigits.length > 11) {
    errors.tutorPhone = 'Informe um WhatsApp ou telefone válido com DDD.';
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date)) {
    errors.date = 'Escolha uma data válida para o atendimento.';
  } else if (input.date < todayIso) {
    errors.date = 'A data escolhida não pode ser anterior a hoje.';
  }

  return errors;
}

export function buildWhatsAppBookingMessage(input: BookingInput): string {
  const categoryTitle = getCategoryLabel(input.category);
  const formattedDate = formatDatePtBr(input.date);
  const cleanNotes = input.notes.trim();

  if (input.rescheduleFrom) {
    const previousFormattedDate = formatDatePtBr(input.rescheduleFrom.previousDate);
    const previousShiftShort = input.rescheduleFrom.previousShift.split(' ')[0];

    const rescheduleLines = [
      `*SOLICITAÇÃO DE REAGENDAMENTO — IMPÉRIO ANIMAL*`,
      '',
      `Olá, Império Animal! Gostaria de *REAGENDAR* um atendimento já registrado:`,
      '',
      `*Tipo de Solicitação:* REAGENDAMENTO`,
      `*Categoria:* ${categoryTitle}`,
      `*Serviço Solicitado:* ${input.service}`,
      `*Espécie:* ${input.species}`,
      `*Nome do Pet:* ${input.petName.trim()}`,
      `*Tutor:* ${input.tutorName.trim()}`,
      `*Contato:* ${input.tutorPhone.trim()}`,
      `*Atendimento Anterior:* ${previousFormattedDate} (${previousShiftShort})`,
      `*NOVA DATA DE REAGENDAMENTO:* ${formattedDate}`,
      `*Novo Turno:* ${input.shift}`,
    ];

    if (cleanNotes) {
      rescheduleLines.push(`*Observações:* ${cleanNotes}`);
    }

    rescheduleLines.push(
      '',
      `Aguardo a confirmação do reagendamento.`,
      `Unidade: ${CLINIC_ADDRESS}`
    );
    return rescheduleLines.join('\n');
  }

  const lines = [
    `Olá, Império Animal! Gostaria de confirmar um agendamento:`,
    '',
    `*Categoria:* ${categoryTitle}`,
    `*Serviço:* ${input.service}`,
    `*Espécie:* ${input.species}`,
    `*Nome do Pet:* ${input.petName.trim()}`,
    `*Tutor:* ${input.tutorName.trim()}`,
    `*Contato:* ${input.tutorPhone.trim()}`,
    `*Data Preferencial:* ${formattedDate}`,
    `*Turno:* ${input.shift}`,
  ];

  if (cleanNotes) {
    lines.push(`*Observações:* ${cleanNotes}`);
  }

  lines.push('', `Unidade: ${CLINIC_ADDRESS}`);
  return lines.join('\n');
}

export function buildWhatsAppUrl(input: BookingInput): string {
  const message = buildWhatsAppBookingMessage(input);
  return `https://wa.me/${CLINIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function createServiceRecordFromBooking(
  input: BookingInput,
  id: string,
  createdAtIso: string
): ServiceHistoryRecord {
  const cleanNotes = input.notes.trim();
  const reschedulePrefix = input.rescheduleFrom
    ? `Reagendamento (anterior: ${formatDatePtBr(input.rescheduleFrom.previousDate)})`
    : '';
  const combinedNotes = reschedulePrefix
    ? cleanNotes && !cleanNotes.startsWith('Reagendamento (anterior:')
      ? `${reschedulePrefix} · ${cleanNotes}`
      : cleanNotes || reschedulePrefix
    : cleanNotes || undefined;

  return {
    id,
    category: input.category,
    service: input.service,
    species: input.species,
    petName: input.petName.trim(),
    tutorName: input.tutorName.trim(),
    tutorPhone: input.tutorPhone.trim(),
    date: input.date,
    shift: input.shift,
    status: 'Confirmado',
    professional:
      input.category === 'veterinario'
        ? 'Equipe Clínica Veterinária Império Animal'
        : 'Centro de Estética Império Animal',
    notes: combinedNotes,
    createdAt: createdAtIso,
  };
}

export function filterServiceHistory(
  records: ServiceHistoryRecord[],
  filter: 'todos' | BookingCategory
): ServiceHistoryRecord[] {
  if (filter === 'todos') return records;
  return records.filter((record) => record.category === filter);
}

export function validateReviewInput(input: ReviewInput): ReviewValidationErrors {
  const errors: ReviewValidationErrors = {};

  if (input.authorName.trim().length < 3) {
    errors.authorName = 'Informe seu nome completo.';
  }

  if (input.petInfo.trim().length < 2) {
    errors.petInfo = 'Informe o nome ou raça do seu pet.';
  }

  if (input.rating < 1 || input.rating > 5 || !Number.isInteger(input.rating)) {
    errors.rating = 'Selecione uma nota entre 1 e 5 estrelas.';
  }

  if (input.comment.trim().length < 12) {
    errors.comment = 'Escreva um breve relato da sua experiência (mínimo 12 caracteres).';
  }

  return errors;
}

export function calculateReviewSummary(reviews: ClientReview[]): {
  average: number;
  total: number;
  fiveStarCount: number;
} {
  if (reviews.length === 0) {
    return {average: 0, total: 0, fiveStarCount: 0};
  }
  const sum = reviews.reduce((acc, item) => acc + item.rating, 0);
  const fiveStarCount = reviews.filter((item) => item.rating === 5).length;
  return {
    average: Math.round((sum / reviews.length) * 10) / 10,
    total: reviews.length,
    fiveStarCount,
  };
}
