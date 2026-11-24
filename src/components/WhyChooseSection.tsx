import {
  HeartHandshake,
  MapPin,
  PawPrint,
  PhoneCall,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react';
import {STRUCTURE_ITEMS} from '../data/seedData';
import {CLINIC_ADDRESS, CLINIC_PHONE_DISPLAY} from '../utils/clinicLogic';
import {ResilientImage} from './ResilientImage';

interface WhyChooseSectionProps {
  onScheduleNow: () => void;
}

const TRUST_HIGHLIGHTS = [
  {
    icon: Stethoscope,
    title: 'Atendimento Técnico',
    subtitle: 'Consultas clínicas com rigor veterinário',
  },
  {
    icon: ShieldCheck,
    title: 'Vacinas e Farmácia',
    subtitle: 'Estoque ético e refrigeração controlada',
  },
  {
    icon: MapPin,
    title: 'Localização Central',
    subtitle: 'Av. Santos Dumont, 92 — Centro',
  },
  {
    icon: PhoneCall,
    title: 'Atendimento Ágil',
    subtitle: `WhatsApp e fixo ${CLINIC_PHONE_DISPLAY}`,
  },
];

export function WhyChooseSection({onScheduleNow}: WhyChooseSectionProps) {
  const clinicRoomPhoto = STRUCTURE_ITEMS[0];

  return (
    <section id="diferenciais" className="scroll-mt-16 py-12 lg:py-16 bg-[#FFFDF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Luxury Black & Yellow Institutional Authority Banner */}
        <div className="relative rounded-[30px] overflow-hidden bg-gradient-to-r from-[#141414] via-[#1C1B18] to-[#26241B] border border-[#DBBD43]/40 shadow-[0_18px_40px_rgba(20,20,20,0.16)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            {/* Left image showcase */}
            <div className="lg:col-span-4 h-64 lg:h-full min-h-[260px]">
              <ResilientImage
                src={clinicRoomPhoto.imageUrl}
                alt={clinicRoomPhoto.imageAlt}
                fallbackTitle="Império Animal Quirinópolis"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Center editorial statement */}
            <div className="lg:col-span-6 p-7 sm:p-10 text-center lg:text-left">
              <p className="inline-flex items-center gap-1.5 text-xs font-bold text-[#DBBD43] mb-2">
                <PawPrint className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Por que escolher o Império Animal</span>
              </p>

              <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#DBBD43] leading-tight mb-2">
                Clínica &amp; Pet Shop no Centro
              </h2>

              <p className="font-display text-lg font-bold text-white mb-3">
                {CLINIC_ADDRESS}
              </p>

              <p className="text-sm sm:text-base text-[#DDD8C8] leading-relaxed mb-6 max-w-xl mx-auto lg:mx-0">
                Atendimento técnico qualificado com consultório veterinário, vacinação, farmácia
                pet e estética animal sob o mesmo teto — mais segurança para o seu pet e praticidade
                para o tutor em Quirinópolis.
              </p>

              <button
                type="button"
                onClick={onScheduleNow}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#DBBD43] hover:bg-[#C6A832] text-[#141414] text-sm font-bold shadow-xs transition-colors duration-150 cursor-pointer whitespace-nowrap"
              >
                <HeartHandshake className="w-4 h-4 shrink-0" aria-hidden="true" />
                Agendar Atendimento
              </button>
            </div>

            {/* Right circular yellow seal */}
            <div className="hidden lg:flex lg:col-span-2 items-center justify-center pr-8">
              <div className="w-32 h-32 rounded-full bg-[#DBBD43] text-[#141414] flex flex-col items-center justify-center text-center p-4 shadow-md border-4 border-[#141414] ring-2 ring-[#DBBD43]/60">
                <span className="font-display text-2xl font-extrabold leading-none">4 em 1</span>
                <span className="text-[11px] font-bold text-[#22211D] mt-1 leading-tight">
                  Clínica, Vacinas, Farmácia &amp; Estética
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Circular Icon Trust Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
          {TRUST_HIGHLIGHTS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-[#E8E1C8]"
              >
                <div className="w-12 h-12 rounded-full bg-[#FAF4D9] border-2 border-[#DBBD43] flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-[#141414]" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-[#141414]">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#555147] leading-snug mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
