import {
  ArrowRight,
  CalendarCheck,
  MapPin,
  PawPrint,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import {
  CLINIC_NAME,
  CLINIC_PHONE_DISPLAY,
  CLINIC_WHATSAPP_NUMBER,
} from '../utils/clinicLogic';

const HERO_LOGO_URL = 'https://i.postimg.cc/pXKP6TGd/LOGO-ANIMAL-PET-ORIGINAL.png';

interface HeroSectionProps {
  onScheduleConsultation: () => void;
  onExplorePetShop: () => void;
}

export function HeroSection({
  onScheduleConsultation,
  onExplorePetShop,
}: HeroSectionProps) {
  return (
    <section id="inicio" className="relative overflow-hidden bg-[#FFFDF7]">
      {/* Organic wavy top transition curving down from the jet black header (inverted fill prevents subpixel hairline seams at any zoom/DPI) */}
      <div className="w-full overflow-hidden leading-none bg-[#FFFDF7] -mt-px" aria-hidden="true">
        <svg
          viewBox="0 0 1440 54"
          fill="none"
          preserveAspectRatio="none"
          className="block w-full h-7 sm:h-11"
        >
          <path
            d="M0,-2 L1440,-2 L1440,28 C1240,8 1000,52 740,26 C480,0 240,56 0,18 Z"
            fill="#141414"
          />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 lg:pt-10 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left column: Two-tone bold black + golden headline */}
          <div className="lg:col-span-6">
            <p className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#8C700B] mb-3">
              <PawPrint className="w-4 h-4 text-[#B5941D] shrink-0" aria-hidden="true" />
              <span>Consultório Veterinário e Pet Shop · Quirinópolis, GO</span>
            </p>

            <h1 className="font-display text-[clamp(2.25rem,4.2vw,3.65rem)] font-extrabold leading-[1.06] tracking-tight mb-4">
              <span className="block text-[#141414]">Saúde veterinária</span>
              <span className="block text-[#AD8D16]">de excelência</span>
            </h1>

            <p className="font-display text-xl sm:text-2xl font-semibold text-[#141414] mb-3">
              e tudo o que seu pet precisa em um só lugar
            </p>

            <p className="text-base leading-relaxed text-[#555147] max-w-xl mb-7">
              Consultas clínicas criteriosas, vacinação refrigerada, farmácia pet completa e
              estética animal na Av. Santos Dumont, 92 — unindo rigor veterinário e cuidado
              carinhoso para cães e gatos.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-9">
              <button
                type="button"
                onClick={onScheduleConsultation}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-sm sm:text-base font-bold text-white bg-[#141414] hover:bg-[#2A2822] rounded-full shadow-sm transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DBBD43]"
              >
                <CalendarCheck className="w-4 h-4 text-[#DBBD43] shrink-0" aria-hidden="true" />
                Agendar Consulta
              </button>

              <button
                type="button"
                onClick={onExplorePetShop}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm sm:text-base font-bold text-[#141414] hover:text-[#8C700B] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414]"
              >
                Conhecer o Pet Shop
                <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
              </button>
            </div>

            {/* 3 Circular Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5 border-t border-[#E8E1C8]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FAF4D9] border border-[#DBBD43] flex items-center justify-center shrink-0 shadow-2xs">
                  <ShieldCheck className="w-5 h-5 text-[#141414]" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#141414]">Cuidado Clínico</p>
                  <p className="text-[11px] text-[#555147]">Cães e gatos</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FAF4D9] border border-[#DBBD43] flex items-center justify-center shrink-0 shadow-2xs">
                  <MapPin className="w-5 h-5 text-[#141414]" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#141414]">Centro · Quirinópolis</p>
                  <p className="text-[11px] text-[#555147]">Av. Santos Dumont, 92</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FAF4D9] border border-[#DBBD43] flex items-center justify-center shrink-0 shadow-2xs">
                  <Phone className="w-5 h-5 text-[#141414]" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#141414]">WhatsApp Direto</p>
                  <a
                    href={`https://wa.me/${CLINIC_WHATSAPP_NUMBER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-[#8C700B] hover:underline tabular-nums"
                  >
                    {CLINIC_PHONE_DISPLAY}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right column: Clean official brand logo (+30% larger, no card or backdrop) */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <img
              src={HERO_LOGO_URL}
              alt={`Logo oficial ${CLINIC_NAME}`}
              className="w-[114%] sm:w-[118%] lg:w-[126%] max-w-none h-auto -my-[14%] object-contain select-none"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
