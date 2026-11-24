import {CalendarPlus} from 'lucide-react';

interface QuickBookingButtonProps {
  onClick: () => void;
}

export function QuickBookingButton({onClick}: QuickBookingButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-print-hide="true"
      aria-label="Agendamento rápido: ir para o formulário de agendamento"
      className="fixed bottom-4 right-4 z-40 h-12 px-5 inline-flex items-center gap-2.5 rounded-full bg-[#DBBD43] hover:bg-[#C6A832] text-[#141414] border-2 border-[#141414] text-sm font-bold shadow-lg transition-colors duration-150 cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414] print:hidden"
    >
      <CalendarPlus className="w-4 h-4 shrink-0" aria-hidden="true" />
      <span>Agendamento Rápido</span>
    </button>
  );
}
