import {useState} from 'react';
import {PawPrint} from 'lucide-react';
import {
  CLINIC_ADDRESS,
  CLINIC_NAME,
  CLINIC_PHONE_DISPLAY,
  CLINIC_SHORT_NAME,
  CLINIC_WHATSAPP_NUMBER,
} from '../utils/clinicLogic';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [quickMessage, setQuickMessage] = useState('');
  const [messageHint, setMessageHint] = useState('');

  const handleQuickWhatsAppSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleaned = quickMessage.trim();
    if (cleaned.length < 3) {
      setMessageHint('Digite uma breve dúvida ou o nome do seu pet.');
      return;
    }
    setMessageHint('');
    const targetUrl = `https://wa.me/${CLINIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(
      `Olá, Império Animal! ${cleaned}`
    )}`;
    const link = document.createElement('a');
    link.href = targetUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();
    setQuickMessage('');
  };

  return (
    <footer className="bg-[#141414] text-[#E9E6DC] border-t-4 border-[#DBBD43]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 sm:pb-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-white/15">
          {/* Brand Column */}
          <div className="md:col-span-3 space-y-3">
            <p className="inline-flex items-center gap-2 font-display text-xl font-bold text-white">
              <PawPrint className="w-5 h-5 text-[#DBBD43]" aria-hidden="true" />
              <span>{CLINIC_SHORT_NAME}</span>
            </p>
            <p className="text-sm text-[#CFCAC0] leading-relaxed">
              Consultório veterinário, vacinação, farmácia pet e estética animal para manter seu
              pet saudável e feliz.
            </p>
          </div>

          {/* Centered Quick WhatsApp Contact Form */}
          <div className="md:col-span-4 space-y-2.5">
            <p className="font-display text-base font-bold text-[#DBBD43]">
              Atendimento rápido pelo WhatsApp
            </p>
            <p className="text-xs text-[#CFCAC0] leading-relaxed">
              Escreva sua dúvida ou peça orientação para nossa equipe no{' '}
              <span className="tabular-nums font-semibold text-white">{CLINIC_PHONE_DISPLAY}</span>.
            </p>
            <form onSubmit={handleQuickWhatsAppSubmit} noValidate className="pt-1">
              <div className="flex rounded-xl overflow-hidden bg-white p-1 shadow-xs">
                <label htmlFor="footer-quick-msg" className="sr-only">
                  Escreva sua mensagem para o WhatsApp
                </label>
                <input
                  id="footer-quick-msg"
                  type="text"
                  value={quickMessage}
                  onChange={(e) => {
                    setQuickMessage(e.target.value);
                    if (messageHint) setMessageHint('');
                  }}
                  placeholder="Ex.: Valor da vacina V10..."
                  className="flex-1 min-w-0 px-3 py-2 text-xs text-[#141414] placeholder:text-[#8E897D] focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-[#141414] bg-[#DBBD43] hover:bg-[#C6A832] rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  Enviar
                </button>
              </div>
              {messageHint && (
                <p role="alert" className="mt-1.5 text-xs text-[#DBBD43]">
                  {messageHint}
                </p>
              )}
            </form>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 space-y-2">
            <p className="font-display text-sm font-bold text-[#DBBD43]">Links Rápidos</p>
            <ul className="space-y-1.5 text-sm text-[#CFCAC0]">
              <li>
                <a href="#especialidades" className="hover:text-[#DBBD43] transition-colors">
                  Especialidades
                </a>
              </li>
              <li>
                <a href="#agendamento" className="hover:text-[#DBBD43] transition-colors">
                  Agendamento
                </a>
              </li>
              <li>
                <a href="#historico" className="hover:text-[#DBBD43] transition-colors">
                  Histórico e Push
                </a>
              </li>
              <li>
                <a href="#avaliacoes" className="hover:text-[#DBBD43] transition-colors">
                  Avaliações
                </a>
              </li>
              <li>
                <a href="#localizacao" className="hover:text-[#DBBD43] transition-colors">
                  Localização
                </a>
              </li>
            </ul>
          </div>

          {/* Unit Info */}
          <div className="md:col-span-3 space-y-2">
            <p className="font-display text-sm font-bold text-[#DBBD43]">Unidade Quirinópolis</p>
            <p className="text-sm text-[#CFCAC0]">{CLINIC_ADDRESS}</p>
            <p className="text-sm tabular-nums font-semibold text-white">
              WhatsApp: {CLINIC_PHONE_DISPLAY}
            </p>
            <p className="text-xs tabular-nums text-[#CFCAC0]">
              Telefone Fixo: (64) 3651-2388
            </p>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#B8B3A7]">
          <p className="inline-flex items-center gap-1.5">
            <PawPrint className="w-3.5 h-3.5 text-[#DBBD43]" aria-hidden="true" />
            <span>
              © {currentYear} {CLINIC_NAME}. Todos os direitos reservados.
            </span>
          </p>
          <p>
            Mapa integrado via Google Maps Platform — sujeito aos{' '}
            <a
              href="https://maps.google.com/help/terms_maps/?utm_campaign=gmp_mcp_codeassist_v1_aistudio"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[#DBBD43]"
            >
              Termos de Uso do Google Maps
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
