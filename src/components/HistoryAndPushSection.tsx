import {useState} from 'react';
import {
  Bell,
  BellRing,
  CalendarClock,
  CheckCircle2,
  Clock,
  PawPrint,
  Printer,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import type {
  BookingCategory,
  PushNotificationItem,
  ServiceHistoryRecord,
} from '../types/clinic';
import {
  CLINIC_ADDRESS,
  CLINIC_HOURS,
  CLINIC_NAME,
  CLINIC_PHONE_DISPLAY,
  filterServiceHistory,
  formatDatePtBr,
  getCategoryLabel,
  getTodayIsoDate,
} from '../utils/clinicLogic';

interface HistoryAndPushSectionProps {
  history: ServiceHistoryRecord[];
  notifications: PushNotificationItem[];
  pushPermission: NotificationPermission | 'unsupported';
  onRequestPushPermission: () => void;
  onSendTestPush: () => void;
  onRescheduleRecord: (record: ServiceHistoryRecord) => void;
  onToggleRecordComplete: (id: string) => void;
  onDeleteRecord: (id: string) => void;
  onMarkAllNotificationsRead: () => void;
}

export function HistoryAndPushSection({
  history,
  notifications,
  pushPermission,
  onRequestPushPermission,
  onSendTestPush,
  onRescheduleRecord,
  onToggleRecordComplete,
  onDeleteRecord,
  onMarkAllNotificationsRead,
}: HistoryAndPushSectionProps) {
  const [filter, setFilter] = useState<'todos' | BookingCategory>('todos');

  const filteredHistory = filterServiceHistory(history, filter);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const filterScopeLabel =
    filter === 'todos'
      ? 'Todos os serviços (Clínica Veterinária e Pet Shop)'
      : getCategoryLabel(filter);

  const issuedDateLabel = formatDatePtBr(getTodayIsoDate());

  const handlePrintHistory = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <section id="historico" className="scroll-mt-16 py-14 lg:py-20 bg-[#F6F2E4]">
      <div className="print-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Print-only Clinical Document Letterhead */}
        <div
          data-print-only="true"
          className="hidden print:block pb-5 mb-5 border-b-2 border-[#141414]"
        >
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-[10pt] font-bold uppercase tracking-wider text-[#8C700B] mb-1">
                Prontuário de Serviços &amp; Registros Pet
              </p>
              <h1 className="font-display text-[17pt] font-bold text-[#141414] leading-tight">
                {CLINIC_NAME}
              </h1>
              <p className="text-[9.5pt] text-[#4B5563] mt-1">{CLINIC_ADDRESS}</p>
              <p className="text-[9.5pt] text-[#4B5563]">
                Tel. / WhatsApp: <strong className="text-[#141414]">{CLINIC_PHONE_DISPLAY}</strong>{' '}
                · {CLINIC_HOURS}
              </p>
            </div>
            <div className="text-right shrink-0 border border-[#DBBD43] rounded-lg px-3.5 py-2.5 bg-[#FFFDF7]">
              <p className="text-[8.5pt] uppercase tracking-wide text-[#8C700B] font-bold">
                Emissão do Relatório
              </p>
              <p className="text-[10.5pt] font-bold tabular-nums text-[#141414]">
                {issuedDateLabel}
              </p>
              <p className="text-[8.5pt] text-[#4B5563] mt-0.5 tabular-nums">
                {filteredHistory.length}{' '}
                {filteredHistory.length === 1 ? 'registro listado' : 'registros listados'}
              </p>
            </div>
          </div>
          <p className="mt-3 pt-2.5 border-t border-[#E8E1C8] text-[9pt] text-[#374151]">
            <strong className="text-[#141414]">Filtro aplicado:</strong> {filterScopeLabel}
          </p>
        </div>

        {/* Screen-only Section Header + Filter Tabs */}
        <div
          data-print-hide="true"
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 print:hidden"
        >
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8C700B] mb-2">
              <PawPrint className="w-3.5 h-3.5 text-[#B5941D]" aria-hidden="true" />
              <span>Área do Tutor · Acompanhamento e Alertas</span>
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#141414] mb-2">
              Histórico de serviços e <span className="text-[#AD8D16]">notificações push</span>
            </h2>
            <p className="text-sm sm:text-base text-[#555147] leading-relaxed">
              Consulte atendimentos veterinários e banhos registrados para o seu pet, imprima ou
              salve em PDF e gerencie os alertas push de confirmação no seu dispositivo.
            </p>
          </div>

          {/* Interactive Filter Tabs */}
          <div
            role="group"
            aria-label="Filtrar histórico por categoria"
            className="inline-flex items-center gap-1 p-1 bg-white border border-[#E8E1C8] rounded-full self-start lg:self-auto"
          >
            {(
              [
                {id: 'todos', label: 'Todos'},
                {id: 'veterinario', label: 'Veterinário'},
                {id: 'petshop', label: 'Pet Shop'},
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                aria-pressed={filter === tab.id}
                className={`px-4 py-2 text-xs font-bold rounded-full transition-colors cursor-pointer whitespace-nowrap ${
                  filter === tab.id
                    ? 'bg-[#141414] text-[#DBBD43] shadow-2xs'
                    : 'text-[#555147] hover:text-[#141414]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="print-grid grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Service History List */}
          <div className="print-sheet lg:col-span-8 bg-white rounded-[26px] border border-[#E8E1C8] shadow-[0_10px_28px_rgba(20,20,20,0.06)] overflow-hidden">
            <div
              data-print-hide="true"
              className="px-6 py-4 border-b border-[#E8E1C8] flex flex-wrap items-center justify-between gap-3 print:hidden"
            >
              <div className="flex items-center gap-3">
                <h3 className="font-display text-lg font-bold text-[#141414]">
                  Registros de Atendimento
                </h3>
                <span className="text-xs font-semibold tabular-nums text-[#555147]">
                  {filteredHistory.length}{' '}
                  {filteredHistory.length === 1 ? 'registro' : 'registros'}
                </span>
              </div>

              <button
                type="button"
                onClick={handlePrintHistory}
                disabled={filteredHistory.length === 0}
                aria-label="Imprimir ou salvar histórico de serviços em PDF"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#141414] bg-[#FAF4D9] hover:bg-[#DBBD43] border border-[#DBBD43] rounded-full transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414]"
              >
                <Printer className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>Imprimir / Salvar PDF</span>
              </button>
            </div>

            {filteredHistory.length === 0 ? (
              <div className="p-10 text-center">
                <CalendarClock
                  className="w-8 h-8 text-[#B5941D] mx-auto mb-3 print:hidden"
                  aria-hidden="true"
                />
                <p className="text-sm font-bold text-[#141414] mb-1">
                  Nenhum serviço encontrado nesta categoria
                </p>
                <p className="text-xs text-[#555147]">
                  Realize um agendamento acima para registrar consultas ou banhos no histórico.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-[#EFEAD6]" data-testid="service-history-list">
                {filteredHistory.map((record, index) => {
                  const isCompleted = record.status === 'Concluído';
                  return (
                    <li
                      key={record.id}
                      data-print-record="true"
                      className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4 print:flex-row print:items-start"
                    >
                      <div className="space-y-1.5 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#555147] print:text-[#4B5563]">
                          <span className="hidden print:inline font-mono text-[9pt] font-semibold text-[#8C700B]">
                            #{String(index + 1).padStart(2, '0')}
                          </span>
                          <span className="font-bold text-[#8C700B]">
                            {getCategoryLabel(record.category)}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums font-medium">
                            {formatDatePtBr(record.date)}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{record.shift.split(' ')[0]}</span>
                        </div>

                        <h4 className="text-base font-bold text-[#141414] print:text-[#111827]">
                          {record.petName} ({record.species}) — {record.service}
                        </h4>

                        <p className="text-xs text-[#555147] print:text-[#374151]">
                          Tutor:{' '}
                          <span className="text-[#141414] print:text-[#111827] font-semibold">
                            {record.tutorName}
                          </span>
                          {' · '}
                          <span>{record.professional}</span>
                        </p>

                        {record.notes && (
                          <p className="text-xs text-[#555147] print:text-[#374151] pt-0.5 leading-relaxed">
                            <span className="hidden print:inline font-semibold text-[#141414]">
                              Observações:{' '}
                            </span>
                            {record.notes}
                          </p>
                        )}
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0">
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold print:border print:border-[#D4CDB6] print:rounded-full print:px-2.5 print:py-0.5">
                          {isCompleted ? (
                            <>
                              <CheckCircle2
                                className="w-4 h-4 text-[#141414]"
                                aria-hidden="true"
                              />
                              <span className="text-[#141414]">Concluído</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-4 h-4 text-[#8C700B]" aria-hidden="true" />
                              <span className="text-[#8C700B]">{record.status}</span>
                            </>
                          )}
                        </div>

                        <div
                          data-print-hide="true"
                          className="flex items-center gap-2 print:hidden"
                        >
                          {!isCompleted && (
                            <button
                              type="button"
                              onClick={() => onToggleRecordComplete(record.id)}
                              aria-label={`Marcar atendimento de ${record.petName} como concluído`}
                              className="px-3 py-1.5 text-xs font-bold text-[#141414] bg-[#FAF4D9] hover:bg-[#DBBD43] border border-[#DBBD43] rounded-full transition-colors cursor-pointer whitespace-nowrap"
                            >
                              Concluir
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => onRescheduleRecord(record)}
                            aria-label={`Reagendar ${record.service} para ${record.petName}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-[#38352E] hover:text-[#141414] hover:bg-[#FFFDF7] border border-[#DFD7BC] rounded-full transition-colors cursor-pointer whitespace-nowrap"
                          >
                            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                            Reagendar
                          </button>

                          <button
                            type="button"
                            onClick={() => onDeleteRecord(record.id)}
                            aria-label={`Remover registro de ${record.petName}`}
                            className="p-1.5 text-[#757063] hover:text-[#B42318] hover:bg-[#FEF3F2] rounded-full transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}

            {/* Print-only Clinical Authenticity Footer */}
            <div
              data-print-only="true"
              className="hidden print:block mt-8 pt-4 border-t border-[#D4CDB6] text-[8.5pt] text-[#4B5563]"
            >
              <div className="flex items-end justify-between gap-8">
                <div className="max-w-md space-y-1">
                  <p className="font-semibold text-[#141414]">
                    Documento informativo de acompanhamento do tutor
                  </p>
                  <p>
                    Este extrato reúne os atendimentos e agendamentos registrados no portal do{' '}
                    {CLINIC_NAME}. Para laudos oficiais, receitas assinadas ou atestados de vacina,
                    solicite validação presencial na unidade.
                  </p>
                </div>
                <div className="text-center shrink-0 w-52 pt-6">
                  <div className="border-t border-[#141414] pt-1.5">
                    <p className="font-semibold text-[#141414]">Responsável Técnico / Recepção</p>
                    <p className="text-[8pt] text-[#6B7280]">{CLINIC_PHONE_DISPLAY}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Push Notifications Center (hidden in print/PDF output) */}
          <aside
            data-print-hide="true"
            className="lg:col-span-4 bg-white rounded-[26px] border border-[#E8E1C8] shadow-[0_10px_28px_rgba(20,20,20,0.06)] p-6 space-y-5 print:hidden"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#141414] flex items-center justify-center shrink-0">
                  <BellRing className="w-4 h-4 text-[#DBBD43]" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-[#141414]">
                    Notificações Push
                  </h3>
                  <p className="text-xs text-[#555147]">
                    Confirmações instantâneas de agendamento
                  </p>
                </div>
              </div>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={onMarkAllNotificationsRead}
                  className="text-xs font-bold text-[#8C700B] hover:text-[#141414] cursor-pointer whitespace-nowrap"
                >
                  Ler ({unreadCount})
                </button>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-[#FFFDF7] border border-[#E8E1C8] space-y-3">
              <p className="text-xs text-[#555147] leading-relaxed">
                {pushPermission === 'granted'
                  ? 'Permissão ativa no navegador. Você receberá alertas push ao confirmar cada consulta ou banho.'
                  : pushPermission === 'denied'
                    ? 'As notificações do navegador estão bloqueadas nas preferências do dispositivo. Os avisos continuam aparecendo nesta central.'
                    : pushPermission === 'unsupported'
                      ? 'Este navegador usa notificações internas na tela para confirmar seus agendamentos.'
                      : 'Ative as notificações push do navegador para receber lembretes e confirmações em tempo real.'}
              </p>

              <div className="flex flex-wrap gap-2">
                {pushPermission !== 'granted' && pushPermission !== 'unsupported' && (
                  <button
                    type="button"
                    onClick={onRequestPushPermission}
                    className="px-4 py-2 text-xs font-bold text-white bg-[#141414] hover:bg-[#2A2822] rounded-full transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Ativar push no navegador
                  </button>
                )}

                <button
                  type="button"
                  onClick={onSendTestPush}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[#141414] border border-[#DBBD43] bg-[#FAF4D9] hover:bg-[#DBBD43] rounded-full transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Bell className="w-3.5 h-3.5" aria-hidden="true" />
                  Testar confirmação push
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-bold text-[#555147]">Alertas recentes</p>
              {notifications.length === 0 ? (
                <p className="text-xs text-[#555147]">
                  Nenhuma confirmação disparada ainda nesta sessão.
                </p>
              ) : (
                <ul className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                  {notifications.map((item) => (
                    <li
                      key={item.id}
                      className={`p-3.5 rounded-2xl border text-xs space-y-1 ${
                        item.read
                          ? 'bg-[#FFFDF7] border-[#E8E1C8] text-[#555147]'
                          : 'bg-[#FAF4D9] border-[#DBBD43] text-[#141414]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-[#141414]">{item.title}</span>
                        <span className="tabular-nums text-[11px] text-[#555147] shrink-0">
                          {item.timestamp}
                        </span>
                      </div>
                      <p className="leading-relaxed">{item.body}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
