import {PawPrint} from 'lucide-react';
import {STRUCTURE_ITEMS} from '../data/seedData';
import type {BookingCategory} from '../types/clinic';
import {ResilientImage} from './ResilientImage';

interface StructureSectionProps {
  onSelectSpecialty: (category: BookingCategory, service: string) => void;
}

export function StructureSection({onSelectSpecialty}: StructureSectionProps) {
  return (
    <section id="especialidades" className="scroll-mt-16 py-14 lg:py-20 bg-[#FFFDF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered two-tone heading with delicate paw accents */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center justify-center gap-3 mb-2">
            <span className="h-px w-8 bg-[#DBBD43]" aria-hidden="true" />
            <PawPrint className="w-4 h-4 text-[#B5941D]" aria-hidden="true" />
            <span className="h-px w-8 bg-[#DBBD43]" aria-hidden="true" />
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#141414] mb-2">
            Especialidades e <span className="text-[#AD8D16]">Estrutura</span>
          </h2>
          <p className="text-sm sm:text-base text-[#555147] leading-relaxed">
            Consultório veterinário, farmácia pet, vacinação controlada e loja completa integrados
            para cuidar do seu companheiro em todas as fases.
          </p>
        </div>

        {/* 4-column symmetrical cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STRUCTURE_ITEMS.map((item) => (
            <article
              key={item.id}
              className="group bg-white rounded-[26px] border border-[#E8E1C8] shadow-[0_10px_28px_rgba(20,20,20,0.06)] p-4 flex flex-col justify-between transition-transform duration-200 hover:-translate-y-0.5 hover:border-[#DBBD43]"
            >
              <div>
                <div className="h-48 w-full rounded-[18px] overflow-hidden bg-[#F6F2E4] mb-4">
                  <ResilientImage
                    src={item.imageUrl}
                    alt={item.imageAlt}
                    fallbackTitle={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>

                <div className="px-1 text-center">
                  <p className="text-xs font-bold text-[#8C700B] mb-1">
                    {item.indexLabel}. · {item.kicker}
                  </p>
                  <h3 className="font-display text-xl font-bold text-[#141414] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#555147] leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                <ul className="px-2 pb-4 space-y-1.5 border-t border-[#EFEAD6] pt-3 text-xs text-[#38352E] text-left">
                  {item.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-baseline gap-2">
                      <span className="text-[#B5941D] font-bold" aria-hidden="true">
                        •
                      </span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 px-1">
                <button
                  type="button"
                  onClick={() => onSelectSpecialty(item.targetCategory, item.targetService)}
                  className="w-full py-2.5 px-4 rounded-full bg-[#DBBD43] hover:bg-[#141414] text-[#141414] hover:text-[#DBBD43] text-xs sm:text-sm font-bold transition-colors duration-150 cursor-pointer whitespace-nowrap"
                >
                  {item.actionLabel}
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
