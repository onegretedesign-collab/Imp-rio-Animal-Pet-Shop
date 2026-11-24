import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildWhatsAppBookingMessage,
  buildWhatsAppUrl,
  calculateReviewSummary,
  createServiceRecordFromBooking,
  filterServiceHistory,
  formatDatePtBr,
  formatPhoneMask,
  getInitialRescheduleDate,
  validateBookingInput,
  validateReviewInput,
} from './clinicLogic';
import type {BookingInput, ClientReview, ServiceHistoryRecord} from '../types/clinic';

const validBooking: BookingInput = {
  category: 'veterinario',
  service: 'Vacinação',
  species: 'Cão',
  petName: 'Thor',
  tutorName: 'Mariana Costa',
  tutorPhone: '(64) 99210-4455',
  date: '2026-12-10',
  shift: 'Manhã (08h às 12h)',
  notes: 'Reforço anual V10',
};

test('validateBookingInput accepts valid veterinary booking', () => {
  const errors = validateBookingInput(validBooking, '2026-11-23');
  assert.deepEqual(errors, {});
});

test('validateBookingInput catches missing fields, invalid phone, and past date', () => {
  const errors = validateBookingInput(
    {
      ...validBooking,
      petName: 'A',
      tutorName: 'Jo',
      tutorPhone: '64123',
      date: '2026-10-01',
    },
    '2026-11-23'
  );
  assert.ok(errors.petName);
  assert.ok(errors.tutorName);
  assert.ok(errors.tutorPhone);
  assert.ok(errors.date);
});

test('validateBookingInput rejects mismatched service for petshop category', () => {
  const errors = validateBookingInput(
    {
      ...validBooking,
      category: 'petshop',
      service: 'Vacinação',
    },
    '2026-11-23'
  );
  assert.ok(errors.service);
});

test('buildWhatsAppBookingMessage and URL target (64) 3651-2388 with structured data', () => {
  const message = buildWhatsAppBookingMessage(validBooking);
  assert.match(message, /Atendimento Veterinário/);
  assert.match(message, /Vacinação/);
  assert.match(message, /Thor/);
  assert.match(message, /10\/12\/2026/);
  assert.match(message, /Av\. Santos Dumont, 92/);

  const url = buildWhatsAppUrl(validBooking);
  assert.ok(url.startsWith('https://wa.me/556436512388?text='));
  assert.ok(url.includes(encodeURIComponent('Thor')));
});

test('formatPhoneMask and formatDatePtBr format Brazilian values accurately', () => {
  assert.equal(formatPhoneMask('6436512388'), '(64) 3651-2388');
  assert.equal(formatPhoneMask('64999112233'), '(64) 99911-2233');
  assert.equal(formatDatePtBr('2026-12-05'), '05/12/2026');
});

test('createServiceRecordFromBooking and filterServiceHistory work cleanly', () => {
  const recVet = createServiceRecordFromBooking(validBooking, 'rec-1', '2026-11-23T18:00:00Z');
  const recPet: ServiceHistoryRecord = createServiceRecordFromBooking(
    {
      ...validBooking,
      category: 'petshop',
      service: 'Banho e Tosa',
      species: 'Gato',
      petName: 'Milo',
    },
    'rec-2',
    '2026-11-23T18:05:00Z'
  );

  assert.equal(recVet.status, 'Confirmado');
  assert.equal(filterServiceHistory([recVet, recPet], 'todos').length, 2);
  assert.equal(filterServiceHistory([recVet, recPet], 'veterinario').length, 1);
  assert.equal(filterServiceHistory([recVet, recPet], 'petshop')[0].petName, 'Milo');
});

test('validateReviewInput and calculateReviewSummary compute accurate metrics', () => {
  const badErrors = validateReviewInput({
    authorName: 'Al',
    petInfo: '',
    category: 'veterinario',
    serviceLabel: 'Consulta de Rotina',
    rating: 0,
    comment: 'Curto',
  });
  assert.ok(badErrors.authorName);
  assert.ok(badErrors.petInfo);
  assert.ok(badErrors.rating);
  assert.ok(badErrors.comment);

  const reviews: ClientReview[] = [
    {
      id: '1',
      authorName: 'Ana Paula',
      petInfo: 'Luna · Golden',
      category: 'veterinario',
      serviceLabel: 'Consulta de Rotina',
      rating: 5,
      comment: 'Atendimento impecável.',
      dateLabel: '12/11/2026',
      verified: true,
    },
    {
      id: '2',
      authorName: 'Carlos Eduardo',
      petInfo: 'Bob · Shih Tzu',
      category: 'petshop',
      serviceLabel: 'Banho e Tosa',
      rating: 4,
      comment: 'Ótimo cuidado na tosa.',
      dateLabel: '10/11/2026',
      verified: true,
    },
  ];
  const summary = calculateReviewSummary(reviews);
  assert.equal(summary.total, 2);
  assert.equal(summary.average, 4.5);
  assert.equal(summary.fiveStarCount, 1);
});

test('getInitialRescheduleDate clamps past dates to today and preserves future dates', () => {
  assert.equal(getInitialRescheduleDate('2026-11-18', '2026-11-23'), '2026-11-23');
  assert.equal(getInitialRescheduleDate('2026-11-28', '2026-11-23'), '2026-11-28');
});

test('buildWhatsAppBookingMessage and record creation emphasize REAGENDAMENTO when rescheduling', () => {
  const rescheduleBooking: BookingInput = {
    category: 'veterinario',
    service: 'Vacinação',
    species: 'Cão',
    petName: 'Bento',
    tutorName: 'Fernanda Oliveira',
    tutorPhone: '(64) 99612-8410',
    date: '2026-12-02',
    shift: 'Tarde (13h30 às 18h)',
    notes: 'Aplicação anual V10 + Antirrábica com conferência clínica.',
    rescheduleFrom: {
      recordId: 'hist-seed-1',
      previousDate: '2026-11-18',
      previousShift: 'Manhã (08h às 12h)',
    },
  };

  const message = buildWhatsAppBookingMessage(rescheduleBooking);
  assert.match(message, /SOLICITAÇÃO DE REAGENDAMENTO/);
  assert.match(message, /\*REAGENDAR\*/);
  assert.match(message, /Tipo de Solicitação:\* REAGENDAMENTO/);
  assert.match(message, /Atendimento Anterior:\* 18\/11\/2026 \(Manhã\)/);
  assert.match(message, /NOVA DATA DE REAGENDAMENTO:\* 02\/12\/2026/);
  assert.match(message, /Fernanda Oliveira/);
  assert.match(message, /\(64\) 99612-8410/);
  assert.match(message, /Vacinação/);

  const url = buildWhatsAppUrl(rescheduleBooking);
  assert.ok(url.startsWith('https://wa.me/556436512388?text='));
  assert.ok(url.includes(encodeURIComponent('REAGENDAMENTO')));

  const record = createServiceRecordFromBooking(
    rescheduleBooking,
    'rec-resched-1',
    '2026-11-23T19:00:00Z'
  );
  assert.match(record.notes ?? '', /Reagendamento \(anterior: 18\/11\/2026\)/);
});
