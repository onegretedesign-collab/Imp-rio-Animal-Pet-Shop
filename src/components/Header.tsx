import {useState} from 'react';
import {CalendarCheck, Menu, X} from 'lucide-react';
import {CLINIC_SHORT_NAME} from '../utils/clinicLogic';

interface HeaderProps {
  onQuickBook: () => void;
}

const MENU_LOGO_URL = 'https://i.postimg.cc/P5LQjgDw/LOGO-ANIMAL-PET-BRANCA.png';

const NAV_LINKS = [
  {href: '#especialidades', label: 'Especialidades'},
  {href: '#agendamento', label: 'Agendamento'},
  {href: '#historico', label: 'Histórico'},
  {href: '#avaliacoes', label: 'Avaliações'},
  {href: '#localizacao', label: 'Localização'},
];

export function Header({onQuickBook}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#141414] text-white shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between gap-6 sm:gap-8">
        {/* Zone 1: Official white brand logo replacing text */}
        <a
          href="#inicio"
          aria-label={`${CLINIC_SHORT_NAME} Pet Shop — Ir para o início`}
          className="inline-flex items-center justify-center h-[72px] w-[124px] sm:w-[138px] overflow-hidden shrink-0 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#DBBD43]"
        >
          <img
            src={MENU_LOGO_URL}
            alt={`${CLINIC_SHORT_NAME} Pet Shop`}
            className="h-[108px] sm:h-[116px] w-auto max-w-none object-contain select-none translate-y-[6.5%]"
          />
        </a>

        {/* Zone 2: 5 single-line clean navigation links */}
        <nav
          aria-label="Navegação principal"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#E9E6DC]"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="whitespace-nowrap shrink-0 py-1 border-b-2 border-transparent hover:border-[#DBBD43] hover:text-[#DBBD43] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#DBBD43]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1 primary yellow CTA + mobile toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onQuickBook}
            className="hidden sm:inline-flex items-center justify-center gap-2 px-5 py-2 text-sm font-bold text-[#141414] bg-[#DBBD43] hover:bg-[#C6A832] rounded-full transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <CalendarCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
            Agendar Agora
          </button>

          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/10 text-[#DBBD43] hover:bg-white/20 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <nav
          aria-label="Navegação móvel"
          className="md:hidden bg-[#0D0D0C] border-t border-[#DBBD43]/25 px-4 py-4 space-y-1.5"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 px-3 text-base font-medium text-[#F5F2E8] hover:bg-white/10 hover:text-[#DBBD43] rounded-xl transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2.5 border-t border-white/15">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onQuickBook();
              }}
              className="w-full py-3 px-4 text-sm font-bold text-[#141414] bg-[#DBBD43] hover:bg-[#C6A832] rounded-full transition-colors cursor-pointer"
            >
              Agendar Agora
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
