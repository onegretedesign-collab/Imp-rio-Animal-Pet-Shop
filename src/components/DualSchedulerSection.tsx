import {useEffect, useRef, useState} from 'react';
import {
  BellRing,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  PawPrint,
  RotateCcw,
  Scissors,
  Stethoscope,
  X,
} from 'lucide-react';
import type {
  AppointmentShift,
  BookingCategory,
  BookingInput,
  BookingValidationErrors,
  PetSpecies,
  ServiceHistoryRecord,
} from '../types/clinic';
import {
  CLINIC_LANDLINE_DISPLAY,
  CLINIC_LANDLINE_NUMBER,
  CLINIC_PHONE_DISPLAY,
  CLINIC_WHATSAPP_NUMBER,
  buildWhatsAppBookingMessage,
  buildWhatsAppUrl,
  formatDatePtBr,
  formatPhoneMask,
  getCategoryLabel,
  getInitialRescheduleDate,
  getServicesForCategory,
  getTodayIsoDate,
  validateBookingInput,
} from '../utils/clinicLogic';

interface RescheduleRequestPayload {
  requestId: number;
  record: ServiceHistoryRecord;
}

interface DualSchedulerSectionProps {
  selectedCategory: BookingCategory;
  selectedService: string;
  rescheduleRequest: RescheduleRequestPayload | null;
  onCategoryChange: (category: BookingCategory) => void;
  onServiceChange: (service: string) => void;
  onCancelReschedule: () => void;
  onBookingConfirmed: (booking: BookingInput, enablePush: boolean) => void;
}

const SHIFTS: AppointmentShift[] = [
  'Manhã (08h às 12h)',
  'Tarde (13h30 às 18h)',
];

const SPECIES_OPTIONS: PetSpecies[] = ['Cão', 'Gato'];

export function DualSchedulerSection({
  selectedCategory,
  selectedService,
  rescheduleRequest,
  onCategoryChange,
  onServiceChange,
  onCancelReschedule,
  onBookingConfirmed,
}: DualSchedulerSectionProps) {
  const todayIso = getTodayIsoDate();
  const dateInputRef = useRef<HTMLInputElement | null>(null);
  const [species, setSpecies] = useState<PetSpecies>('Cão');
  const [petName, setPetName] = useState('');
  const [tutorName, setTutorName] = useState('');
  const [tutorPhone, setTutorPhone] = useState('');
  const [date, setDate] = useState(todayIso);
  const [shift, setShift] = useState<AppointmentShift>('Manhã (08h às 12h)');
  const [notes, setNotes] = useState('');
  const [notifyPush, setNotifyPush] = useState(true);
  const [errors, setErrors] = useState<BookingValidationErrors>({});
  const [confirmedBooking, setConfirmedBooking] = useState<BookingInput | null>(null);
  const [copied, setCopied] = useState(false);

  const availableServices = getServicesForCategory(selectedCategory);
  const isRescheduling = Boolean(rescheduleRequest);

  useEffect(() => {
    if (!rescheduleRequest) return;
    const {record} = rescheduleRequest;
    setSpecies(record.species);
    setPetName(record.petName);
    setTutorName(record.tutorName);
    setTutorPhone(formatPhoneMask(record.tutorPhone));
    setDate(getInitialRescheduleDate(record.date, todayIso));
    setShift(record.shift);
    setNotes(record.notes ?? '');
    setErrors({});
    setConfirmedBooking(null);
    setCopied(false);

    const focusTimer = window.setTimeout(() => {
      dateInputRef.current?.focus({preventScroll: true});
    }, 350);
    return () => window.clearTimeout(focusTimer);
  }, [rescheduleRequest, todayIso]);

  const handleCategorySwitch = (nextCategory: BookingCategory) => {
    onCategoryChange(nextCategory);
    const nextServices = getServicesForCategory(nextCategory);
    onServiceChange(nextServices[0]);
    setErrors((prev) => ({...prev, service: undefined}));
    setConfirmedBooking(null);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload: BookingInput = {
      category: selectedCategory,
      service: selectedService,
      species,
      petName,
      tutorName,
      tutorPhone,
      date,
      shift,
      notes,
      rescheduleFrom: rescheduleRequest
        ? {
            recordId: rescheduleRequest.record.id,
            previousDate: rescheduleRequest.record.date,
            previousShift: rescheduleRequest.record.shift,
          }
        : undefined,
    };

    const validationErrors = validateBookingInput(payload, todayIso);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setConfirmedBooking(payload);
    setCopied(false);
    onBookingConfirmed(payload, notifyPush);
  };

  const handleCopyMessage = async () => {
    if (!confirmedBooking) return;
    const text = buildWhatsAppBookingMessage(confirmedBooking);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  const handleReset = () => {
    setConfirmedBooking(null);
    setPetName('');
    setTutorName('');
    setTutorPhone('');
    setDate(todayIso);
    setNotes('');
    setErrors({});
    onCancelReschedule();
  };

  const whatsappUrl = confirmedBooking ? buildWhatsAppUrl(confirmedBooking) : '';
  const whatsappPreview = confirmedBooking
    ? buildWhatsAppBookingMessage(confirmedBooking)
    : '';
  const confirmedIsReschedule = Boolean(confirmedBooking?.rescheduleFrom);

  return (
    <section id="agendamento" className="scroll-mt-16 py-14 lg:py-20 bg-[#FFFDF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center justify-center gap-3 mb-2">
            <span className="h-px w-8 bg-[#DBBD43]" aria-hidden="true" />
            <PawPrint className="w-4 h-4 text-[#B5941D]" aria-hidden="true" />
            <span className="h-px w-8 bg-[#DBBD43]" aria-hidden="true" />
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#141414] mb-2">
            Agendamento <span className="text-[#AD8D16]">Dual</span>
          </h2>
          <p className="text-sm sm:text-base text-[#555147] leading-relaxed">
            Reserve consultas veterinárias ou banho e tosa. Seus dados são registrados no histórico,
            confirmados por push e formatados para o WhatsApp{' '}
            <span className="tabular-nums font-bold text-[#141414]">{CLINIC_PHONE_DISPLAY}</span>.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Booking Form Card */}
          <div className="lg:col-span-8 bg-white rounded-[26px] border border-[#E8E1C8] shadow-[0_10px_30px_rgba(20,20,20,0.06)] p-6 sm:p-8">
            {rescheduleRequest && (
              <div
                role="status"
                aria-live="polite"
                className="mb-6 rounded-2xl bg-[#141414] text-white border-2 border-[#DBBD43] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#DBBD43] text-[#141414] flex items-center justify-center shrink-0 mt-0.5">
                    <RotateCcw className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#DBBD43]">
                      Modo Reagendamento · Dados Carregados
                    </p>
                    <p className="font-display text-base font-bold text-white leading-snug">
                      {rescheduleRequest.record.petName} ({rescheduleRequest.record.species}) —{' '}
                      {rescheduleRequest.record.service}
                    </p>
                    <p className="text-xs text-[#E2DEC9] leading-relaxed">
                      Cliente: <strong className="text-white">{rescheduleRequest.record.tutorName}</strong> ·{' '}
                      Atendimento anterior:{' '}
                      <span className="tabular-nums font-semibold text-[#DBBD43]">
                        {formatDatePtBr(rescheduleRequest.record.date)} (
                        {rescheduleRequest.record.shift.split(' ')[0]})
                      </span>
                      . Escolha a nova data do reagendamento abaixo para enviar a mensagem pelo WhatsApp.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleReset}
                  className="self-start inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#DBBD43] border border-[#DBBD43]/50 hover:bg-[#DBBD43] hover:text-[#141414] rounded-full transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" aria-hidden="true" />
                  Cancelar reagendamento
                </button>
              </div>
            )}

            {/* Category Tabs */}
            <div
              role="tablist"
              aria-label="Selecione a categoria de agendamento"
              className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-1.5 bg-[#F6F2E4] rounded-full mb-8"
            >
              <button
                type="button"
                role="tab"
                id="tab-veterinario"
                aria-selected={selectedCategory === 'veterinario'}
                onClick={() => handleCategorySwitch('veterinario')}
                className={`flex items-center justify-center gap-2.5 px-4 py-3 text-sm font-bold rounded-full transition-colors duration-150 cursor-pointer whitespace-nowrap ${
                  selectedCategory === 'veterinario'
                    ? 'bg-[#141414] text-white shadow-xs'
                    : 'text-[#555147] hover:text-[#141414]'
                }`}
              >
                <Stethoscope
                  className={`w-4 h-4 shrink-0 ${
                    selectedCategory === 'veterinario' ? 'text-[#DBBD43]' : ''
                  }`}
                  aria-hidden="true"
                />
                Atendimento Veterinário
              </button>

              <button
                type="button"
                role="tab"
                id="tab-petshop"
                aria-selected={selectedCategory === 'petshop'}
                onClick={() => handleCategorySwitch('petshop')}
                className={`flex items-center justify-center gap-2.5 px-4 py-3 text-sm font-bold rounded-full transition-colors duration-150 cursor-pointer whitespace-nowrap ${
                  selectedCategory === 'petshop'
                    ? 'bg-[#141414] text-white shadow-xs'
                    : 'text-[#555147] hover:text-[#141414]'
                }`}
              >
                <Scissors
                  className={`w-4 h-4 shrink-0 ${
                    selectedCategory === 'petshop' ? 'text-[#DBBD43]' : ''
                  }`}
                  aria-hidden="true"
                />
                Pet Shop &amp; Estética
              </button>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              {/* Service selector */}
              <fieldset>
                <legend className="text-sm font-bold text-[#141414] mb-3">
                  {selectedCategory === 'veterinario'
                    ? 'Tipo de atendimento clínico'
                    : 'Serviço de estética e higiene'}
                </legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {availableServices.map((serviceOption) => {
                    const active = selectedService === serviceOption;
                    return (
                      <button
                        key={serviceOption}
                        type="button"
                        onClick={() => {
                          onServiceChange(serviceOption);
                          setErrors((prev) => ({...prev, service: undefined}));
                        }}
                        aria-pressed={active}
                        className={`text-left px-4 py-3 rounded-2xl border text-sm font-bold transition-colors duration-150 cursor-pointer ${
                          active
                            ? 'border-[#141414] bg-[#FAF4D9] text-[#141414]'
                            : 'border-[#E8E1C8] bg-[#FFFDF7] text-[#555147] hover:border-[#DBBD43]'
                        }`}
                      >
                        {serviceOption}
                      </button>
                    );
                  })}
                </div>
                {errors.service && (
                  <p role="alert" className="mt-2 text-xs font-medium text-[#B42318]">
                    {errors.service}
                  </p>
                )}
              </fieldset>

              {/* Species & Pet Name */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
                <div className="sm:col-span-5">
                  <span className="block text-sm font-bold text-[#141414] mb-2">
                    Espécie do animal
                  </span>
                  <div className="grid grid-cols-2 gap-2.5">
                    {SPECIES_OPTIONS.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setSpecies(option)}
                        aria-pressed={species === option}
                        className={`py-2.5 px-4 rounded-full border text-sm font-bold transition-colors cursor-pointer ${
                          species === option
                            ? 'border-[#141414] bg-[#DBBD43] text-[#141414]'
                            : 'border-[#E8E1C8] bg-[#FFFDF7] text-[#555147] hover:border-[#DBBD43]'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-7">
                  <label
                    htmlFor="booking-pet-name"
                    className="block text-sm font-bold text-[#141414] mb-2"
                  >
                    Nome do pet
                  </label>
                  <input
                    id="booking-pet-name"
                    type="text"
                    value={petName}
                    onChange={(e) => {
                      setPetName(e.target.value);
                      if (errors.petName) setErrors((prev) => ({...prev, petName: undefined}));
                    }}
                    placeholder="Ex.: Thor, Luna, Bento"
                    aria-invalid={Boolean(errors.petName)}
                    className={`w-full px-4 py-2.5 rounded-xl border bg-[#FFFDF7] text-sm text-[#141414] placeholder:text-[#8E897D] focus:outline-none focus:ring-2 focus:ring-[#DBBD43]/50 focus:border-[#141414] ${
                      errors.petName ? 'border-[#B42318]' : 'border-[#DFD7BC]'
                    }`}
                  />
                  {errors.petName && (
                    <p role="alert" className="mt-1.5 text-xs font-medium text-[#B42318]">
                      {errors.petName}
                    </p>
                  )}
                </div>
              </div>

              {/* Tutor Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="booking-tutor-name"
                    className="block text-sm font-bold text-[#141414] mb-2"
                  >
                    Nome do tutor
                  </label>
                  <input
                    id="booking-tutor-name"
                    type="text"
                    value={tutorName}
                    onChange={(e) => {
                      setTutorName(e.target.value);
                      if (errors.tutorName) setErrors((prev) => ({...prev, tutorName: undefined}));
                    }}
                    placeholder="Seu nome completo"
                    aria-invalid={Boolean(errors.tutorName)}
                    className={`w-full px-4 py-2.5 rounded-xl border bg-[#FFFDF7] text-sm text-[#141414] placeholder:text-[#8E897D] focus:outline-none focus:ring-2 focus:ring-[#DBBD43]/50 focus:border-[#141414] ${
                      errors.tutorName ? 'border-[#B42318]' : 'border-[#DFD7BC]'
                    }`}
                  />
                  {errors.tutorName && (
                    <p role="alert" className="mt-1.5 text-xs font-medium text-[#B42318]">
                      {errors.tutorName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="booking-tutor-phone"
                    className="block text-sm font-bold text-[#141414] mb-2"
                  >
                    Seu WhatsApp / Telefone
                  </label>
                  <input
                    id="booking-tutor-phone"
                    type="tel"
                    value={tutorPhone}
                    onChange={(e) => {
                      setTutorPhone(formatPhoneMask(e.target.value));
                      if (errors.tutorPhone) {
                        setErrors((prev) => ({...prev, tutorPhone: undefined}));
                      }
                    }}
                    placeholder="(64) 99999-0000"
                    aria-invalid={Boolean(errors.tutorPhone)}
                    className={`w-full px-4 py-2.5 rounded-xl border bg-[#FFFDF7] text-sm tabular-nums text-[#141414] placeholder:text-[#8E897D] focus:outline-none focus:ring-2 focus:ring-[#DBBD43]/50 focus:border-[#141414] ${
                      errors.tutorPhone ? 'border-[#B42318]' : 'border-[#DFD7BC]'
                    }`}
                  />
                  {errors.tutorPhone && (
                    <p role="alert" className="mt-1.5 text-xs font-medium text-[#B42318]">
                      {errors.tutorPhone}
                    </p>
                  )}
                </div>
              </div>

              {/* Date & Shift */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="booking-date"
                    className="block text-sm font-bold text-[#141414] mb-2"
                  >
                    {isRescheduling ? 'Nova data do reagendamento' : 'Data preferencial'}
                  </label>
                  <input
                    ref={dateInputRef}
                    id="booking-date"
                    type="date"
                    min={todayIso}
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value);
                      if (errors.date) setErrors((prev) => ({...prev, date: undefined}));
                    }}
                    aria-invalid={Boolean(errors.date)}
                    className={`w-full px-4 py-2.5 rounded-xl border bg-[#FFFDF7] text-sm tabular-nums text-[#141414] focus:outline-none focus:ring-2 focus:ring-[#DBBD43]/50 focus:border-[#141414] ${
                      errors.date
                        ? 'border-[#B42318]'
                        : isRescheduling
                          ? 'border-[#141414] ring-2 ring-[#DBBD43]/40'
                          : 'border-[#DFD7BC]'
                    }`}
                  />
                  {errors.date && (
                    <p role="alert" className="mt-1.5 text-xs font-medium text-[#B42318]">
                      {errors.date}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="booking-shift"
                    className="block text-sm font-bold text-[#141414] mb-2"
                  >
                    {isRescheduling ? 'Novo turno do reagendamento' : 'Turno de preferência'}
                  </label>
                  <select
                    id="booking-shift"
                    value={shift}
                    onChange={(e) => setShift(e.target.value as AppointmentShift)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#DFD7BC] bg-[#FFFDF7] text-sm text-[#141414] focus:outline-none focus:ring-2 focus:ring-[#DBBD43]/50 focus:border-[#141414]"
                  >
                    {SHIFTS.map((shiftOption) => (
                      <option key={shiftOption} value={shiftOption}>
                        {shiftOption}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label
                  htmlFor="booking-notes"
                  className="block text-sm font-bold text-[#141414] mb-2"
                >
                  Observações clínicas ou de manejo (opcional)
                </label>
                <textarea
                  id="booking-notes"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex.: alergias, vacina pendente, preferência de tosa ou comportamento do pet"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#DFD7BC] bg-[#FFFDF7] text-sm text-[#141414] placeholder:text-[#8E897D] focus:outline-none focus:ring-2 focus:ring-[#DBBD43]/50 focus:border-[#141414]"
                />
              </div>

              {/* Push Notification Confirmation Checkbox */}
              <div className="flex items-start gap-3 pt-1">
                <input
                  id="booking-push-optin"
                  type="checkbox"
                  checked={notifyPush}
                  onChange={(e) => setNotifyPush(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-[#DFD7BC] accent-[#141414] cursor-pointer"
                />
                <label
                  htmlFor="booking-push-optin"
                  className="text-sm text-[#555147] cursor-pointer"
                >
                  Ativar confirmação por notificação push neste dispositivo ao registrar o
                  agendamento.
                </label>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm sm:text-base font-bold text-[#141414] bg-[#DBBD43] hover:bg-[#C6A832] rounded-full shadow-xs transition-colors duration-150 cursor-pointer whitespace-nowrap"
                >
                  {isRescheduling && <RotateCcw className="w-4 h-4 shrink-0" aria-hidden="true" />}
                  {isRescheduling
                    ? 'Confirmar Reagendamento e Preparar WhatsApp'
                    : 'Confirmar e Preparar WhatsApp'}
                </button>
                <span className="text-xs text-[#555147]">
                  Destino: WhatsApp oficial{' '}
                  <strong className="tabular-nums text-[#141414]">{CLINIC_PHONE_DISPLAY}</strong>
                </span>
              </div>
            </form>
          </div>

          {/* Right column: Summary & Confirmed WhatsApp Dispatch Panel */}
          <aside className="lg:col-span-4 space-y-6">
            {confirmedBooking ? (
              <div
                aria-live="polite"
                className="bg-white rounded-[26px] border-2 border-[#141414] shadow-[0_12px_30px_rgba(20,20,20,0.1)] p-6 space-y-5"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    className="w-6 h-6 text-[#8C700B] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-xs font-bold text-[#8C700B]">
                      {confirmedIsReschedule
                        ? 'Reagendamento Registrado no Histórico'
                        : 'Agendamento Registrado no Histórico'}
                    </p>
                    <h3 className="font-display text-xl font-bold text-[#141414]">
                      {confirmedBooking.petName} · {confirmedBooking.service}
                    </h3>
                  </div>
                </div>

                <dl className="text-sm space-y-2 border-y border-[#E8E1C8] py-4">
                  <div className="flex justify-between gap-4">
                    <dt className="text-[#555147]">Cliente</dt>
                    <dd className="font-semibold text-[#141414] text-right">
                      {confirmedBooking.tutorName}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-[#555147]">Categoria</dt>
                    <dd className="font-semibold text-[#141414] text-right">
                      {getCategoryLabel(confirmedBooking.category)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-[#555147]">Espécie</dt>
                    <dd className="font-semibold text-[#141414]">{confirmedBooking.species}</dd>
                  </div>
                  {confirmedBooking.rescheduleFrom && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-[#555147]">Data Anterior</dt>
                      <dd className="tabular-nums text-xs font-medium text-[#555147] line-through text-right">
                        {formatDatePtBr(confirmedBooking.rescheduleFrom.previousDate)} ·{' '}
                        {confirmedBooking.rescheduleFrom.previousShift.split(' ')[0]}
                      </dd>
                    </div>
                  )}
                  <div className="flex justify-between gap-4">
                    <dt className="text-[#555147]">
                      {confirmedIsReschedule ? 'Nova Data' : 'Data e Turno'}
                    </dt>
                    <dd
                      className={`tabular-nums text-xs font-bold text-right ${
                        confirmedIsReschedule ? 'text-[#8C700B]' : 'text-[#141414]'
                      }`}
                    >
                      {formatDatePtBr(confirmedBooking.date)} · {confirmedBooking.shift.split(' ')[0]}
                    </dd>
                  </div>
                </dl>

                <div>
                  <p className="text-xs font-bold text-[#555147] mb-2">
                    {confirmedIsReschedule
                      ? `Mensagem de REAGENDAMENTO para ${CLINIC_PHONE_DISPLAY}:`
                      : `Mensagem formatada para ${CLINIC_PHONE_DISPLAY}:`}
                  </p>
                  <pre className="whitespace-pre-wrap text-xs font-mono bg-[#FFFDF7] border border-[#E8E1C8] rounded-2xl p-3.5 text-[#141414] leading-relaxed">
                    {whatsappPreview}
                  </pre>
                </div>

                <div className="space-y-2.5">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-[#141414] bg-[#DBBD43] hover:bg-[#C6A832] rounded-full transition-colors text-center"
                  >
                    {confirmedIsReschedule
                      ? `Enviar Reagendamento no WhatsApp ${CLINIC_PHONE_DISPLAY}`
                      : `Enviar pelo WhatsApp ${CLINIC_PHONE_DISPLAY}`}
                    <ExternalLink className="w-4 h-4 shrink-0" aria-hidden="true" />
                  </a>

                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={handleCopyMessage}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold text-[#141414] border border-[#141414] hover:bg-[#FAF4D9] rounded-full transition-colors cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5" aria-hidden="true" />
                          Copiada
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                          Copiar texto
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleReset}
                      className="inline-flex items-center justify-center px-3 py-2.5 text-xs font-bold text-[#555147] border border-[#E8E1C8] hover:bg-[#FFFDF7] rounded-full transition-colors cursor-pointer"
                    >
                      Novo agendamento
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-[26px] border border-[#E8E1C8] shadow-[0_10px_28px_rgba(20,20,20,0.06)] p-6 space-y-5">
                <h3 className="font-display text-xl font-bold text-[#141414]">
                  Como funciona o agendamento
                </h3>
                <ol className="space-y-4 text-sm text-[#555147]">
                  <li className="flex gap-3">
                    <span className="font-display text-sm font-bold text-[#8C700B] mt-0.5 tabular-nums">
                      01.
                    </span>
                    <span>
                      Selecione <strong className="text-[#141414]">Atendimento Veterinário</strong>{' '}
                      (consulta, vacinas, exames ou retorno) ou{' '}
                      <strong className="text-[#141414]">Pet Shop &amp; Estética</strong>.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-display text-sm font-bold text-[#8C700B] mt-0.5 tabular-nums">
                      02.
                    </span>
                    <span>
                      Informe espécie, data e turno desejados. O pedido é salvo automaticamente no
                      seu histórico de serviços.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-display text-sm font-bold text-[#8C700B] mt-0.5 tabular-nums">
                      03.
                    </span>
                    <span>
                      Receba confirmação push instantânea e envie tudo pronto pelo WhatsApp{' '}
                      <span className="tabular-nums font-bold text-[#141414]">
                        {CLINIC_PHONE_DISPLAY}
                      </span>
                      .
                    </span>
                  </li>
                </ol>

                <div className="pt-4 border-t border-[#E8E1C8] flex items-start gap-3">
                  <BellRing className="w-5 h-5 text-[#B5941D] shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="text-xs text-[#555147] leading-relaxed">
                    Envio direto dos agendamentos para o WhatsApp{' '}
                    <a
                      href={`https://wa.me/${CLINIC_WHATSAPP_NUMBER}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tabular-nums font-bold text-[#141414] underline decoration-[#DBBD43] decoration-2"
                    >
                      {CLINIC_PHONE_DISPLAY}
                    </a>{' '}
                    ou atendimento telefônico no fixo{' '}
                    <a
                      href={`tel:+${CLINIC_LANDLINE_NUMBER}`}
                      className="tabular-nums font-bold text-[#141414] underline decoration-[#DBBD43] decoration-2"
                    >
                      {CLINIC_LANDLINE_DISPLAY}
                    </a>
                    .
                  </p>
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
