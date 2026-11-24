import {useCallback, useEffect, useState} from 'react';
import {
  APILoadingStatus,
  APIProvider,
  AdvancedMarker,
  InfoWindow,
  Map as GoogleMap,
  Pin,
  useAdvancedMarkerRef,
  useApiLoadingStatus,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import {Clock, ExternalLink, MapPin, Navigation, PawPrint, Phone} from 'lucide-react';
import {
  CLINIC_ADDRESS,
  CLINIC_HOURS,
  CLINIC_NAME,
  CLINIC_PHONE_DISPLAY,
  CLINIC_WHATSAPP_NUMBER,
} from '../utils/clinicLogic';

const MAPS_API_KEY = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined) || '';

const FALLBACK_DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  `${CLINIC_NAME}, ${CLINIC_ADDRESS}`
)}`;

interface ResolvedClinicPlace {
  position: {lat: number; lng: number};
  title: string;
  formattedAddress: string;
  mapsUri: string;
}

function ClinicMapCanvas({
  onPlaceResolved,
}: {
  onPlaceResolved: (place: ResolvedClinicPlace) => void;
}) {
  const map = useMap();
  const placesLib = useMapsLibrary('places');
  const status = useApiLoadingStatus();
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [resolvedPlace, setResolvedPlace] = useState<ResolvedClinicPlace | null>(null);
  const [infoOpen, setInfoOpen] = useState(true);
  const [lookupError, setLookupError] = useState<string | null>(null);

  const resolveClinicLocation = useCallback(async () => {
    if (!placesLib) return;

    const queries = [
      'Império Animal Pet Shop Av. Santos Dumont, 92 Centro Quirinópolis GO Brasil',
      'Av. Santos Dumont, 92, Centro, Quirinópolis - GO, Brasil',
    ];

    for (const textQuery of queries) {
      try {
        const {places} = await placesLib.Place.searchByText({
          textQuery,
          fields: ['location', 'displayName', 'formattedAddress', 'googleMapsURI'],
          maxResultCount: 1,
          language: 'pt-BR',
          region: 'BR',
        });

        const match = places?.[0];
        if (match?.location) {
          const position = {
            lat: match.location.lat(),
            lng: match.location.lng(),
          };
          const nextPlace: ResolvedClinicPlace = {
            position,
            title: CLINIC_NAME,
            formattedAddress: match.formattedAddress || CLINIC_ADDRESS,
            mapsUri: match.googleMapsURI || FALLBACK_DIRECTIONS_URL,
          };
          setResolvedPlace(nextPlace);
          onPlaceResolved(nextPlace);
          setLookupError(null);
          if (map) {
            map.panTo(position);
            map.setZoom(17);
          }
          return;
        }
      } catch {
        // Try fallback query
      }
    }

    setLookupError(
      'Não foi possível localizar o endereço automaticamente no mapa. Utilize o botão de rotas ao lado.'
    );
  }, [map, onPlaceResolved, placesLib]);

  useEffect(() => {
    void resolveClinicLocation();
  }, [resolveClinicLocation]);

  if (status === APILoadingStatus.FAILED || status === APILoadingStatus.AUTH_FAILURE) {
    return (
      <div className="h-[420px] w-full rounded-[26px] bg-[#FAF4D9] border border-[#E8E1C8] flex flex-col items-center justify-center p-8 text-center">
        <MapPin className="w-8 h-8 text-[#141414] mb-3" aria-hidden="true" />
        <p className="font-display text-lg font-bold text-[#141414] mb-1">
          {CLINIC_ADDRESS}
        </p>
        <p className="text-sm text-[#555147] max-w-md mb-5">
          Não foi possível carregar o mapa interativo neste momento. Abra diretamente no Google
          Maps para traçar sua rota.
        </p>
        <a
          href={FALLBACK_DIRECTIONS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-[#141414] hover:bg-[#2A2822] rounded-full transition-colors"
        >
          Abrir no Google Maps
          <ExternalLink className="w-4 h-4 text-[#DBBD43]" aria-hidden="true" />
        </a>
      </div>
    );
  }

  return (
    <div className="relative h-[420px] w-full rounded-[26px] overflow-hidden border border-[#E8E1C8] shadow-[0_10px_28px_rgba(20,20,20,0.08)] bg-[#FAF4D9]">
      <GoogleMap
        mapId="DEMO_MAP_ID"
        defaultCenter={{lat: -15.7939, lng: -47.8828}}
        defaultZoom={6}
        gestureHandling="cooperative"
        mapTypeControl={false}
        streetViewControl={true}
        fullscreenControl={true}
        internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
        style={{width: '100%', height: '100%'}}
      >
        {resolvedPlace && (
          <>
            <AdvancedMarker
              ref={markerRef}
              position={resolvedPlace.position}
              title={resolvedPlace.title}
              onClick={() => setInfoOpen(true)}
            >
              <Pin
                background="#DBBD43"
                borderColor="#141414"
                glyphColor="#141414"
                scale={1.2}
              />
            </AdvancedMarker>

            {infoOpen && marker && (
              <InfoWindow
                anchor={marker}
                maxWidth={270}
                headerContent={
                  <span className="font-bold text-sm text-[#141414]">
                    Império Animal
                  </span>
                }
                onCloseClick={() => setInfoOpen(false)}
              >
                <div className="pt-0.5 text-[#141414]">
                  <p className="text-xs text-[#555147] mb-2 leading-relaxed">
                    {resolvedPlace.formattedAddress}
                  </p>
                  <a
                    href={resolvedPlace.mapsUri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#8C700B] hover:underline"
                  >
                    Ver rotas no Google Maps
                    <ExternalLink className="w-3 h-3" aria-hidden="true" />
                  </a>
                </div>
              </InfoWindow>
            )}
          </>
        )}
      </GoogleMap>

      {lookupError && (
        <div
          role="status"
          className="absolute bottom-3 left-3 right-3 bg-white/95 border border-[#E8E1C8] rounded-xl px-4 py-2.5 text-xs text-[#555147]"
        >
          {lookupError}
        </div>
      )}
    </div>
  );
}

export function LocationMapSection() {
  const [resolvedUri, setResolvedUri] = useState<string>(FALLBACK_DIRECTIONS_URL);
  const [resolvedAddress, setResolvedAddress] = useState<string>(CLINIC_ADDRESS);

  const handlePlaceResolved = useCallback((place: ResolvedClinicPlace) => {
    setResolvedUri(place.mapsUri);
    setResolvedAddress(place.formattedAddress);
  }, []);

  return (
    <section id="localizacao" className="scroll-mt-16 py-14 lg:py-20 bg-[#F6F2E4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center justify-center gap-3 mb-2">
            <span className="h-px w-8 bg-[#DBBD43]" aria-hidden="true" />
            <PawPrint className="w-4 h-4 text-[#B5941D]" aria-hidden="true" />
            <span className="h-px w-8 bg-[#DBBD43]" aria-hidden="true" />
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#141414] mb-2">
            Contato e <span className="text-[#AD8D16]">Localização</span>
          </h2>
          <p className="text-sm sm:text-base text-[#555147] leading-relaxed">
            Fácil acesso pela Av. Santos Dumont, 92 no Centro de Quirinópolis. Trace sua rota
            diretamente pelo mapa ou fale conosco pelo WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Contact Card */}
          <div className="lg:col-span-5 bg-white rounded-[26px] border border-[#E8E1C8] shadow-[0_10px_28px_rgba(20,20,20,0.06)] p-6 sm:p-8 flex flex-col justify-between gap-8">
            <div className="space-y-6">
              <div>
                <p className="text-xs font-bold text-[#8C700B] mb-1">Endereço</p>
                <p className="text-base font-bold text-[#141414] flex items-start gap-2.5">
                  <MapPin
                    className="w-5 h-5 text-[#B5941D] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>{resolvedAddress}</span>
                </p>
              </div>

              <div className="border-t border-[#E8E1C8] pt-5">
                <p className="text-xs font-bold text-[#8C700B] mb-1">
                  Telefone Fixo e WhatsApp
                </p>
                <a
                  href={`tel:+${CLINIC_WHATSAPP_NUMBER}`}
                  className="text-xl tabular-nums font-bold text-[#141414] hover:text-[#8C700B] transition-colors inline-flex items-center gap-2.5"
                >
                  <Phone className="w-5 h-5 text-[#B5941D] shrink-0" aria-hidden="true" />
                  {CLINIC_PHONE_DISPLAY}
                </a>
              </div>

              <div className="border-t border-[#E8E1C8] pt-5">
                <p className="text-xs font-bold text-[#8C700B] mb-1">
                  Horário de Atendimento
                </p>
                <p className="text-sm text-[#555147] flex items-start gap-2.5 leading-relaxed">
                  <Clock
                    className="w-5 h-5 text-[#B5941D] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>{CLINIC_HOURS}</span>
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-[#E8E1C8]">
              <a
                href={resolvedUri}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold text-white bg-[#141414] hover:bg-[#2A2822] rounded-full transition-colors"
              >
                <Navigation className="w-4 h-4 text-[#DBBD43] shrink-0" aria-hidden="true" />
                Traçar rota no Google Maps
              </a>

              <a
                href={`https://wa.me/${CLINIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(
                  'Olá, Império Animal! Gostaria de falar com a recepção.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold text-[#141414] border border-[#DBBD43] bg-[#FAF4D9] hover:bg-[#DBBD43] rounded-full transition-colors"
              >
                Chamar no WhatsApp {CLINIC_PHONE_DISPLAY}
                <ExternalLink className="w-4 h-4 shrink-0" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Interactive Google Map */}
          <div className="lg:col-span-7">
            {MAPS_API_KEY ? (
              <APIProvider
                apiKey={MAPS_API_KEY}
                language="pt-BR"
                region="BR"
                libraries={['places', 'marker']}
              >
                <ClinicMapCanvas onPlaceResolved={handlePlaceResolved} />
              </APIProvider>
            ) : (
              <div className="h-[420px] w-full rounded-[26px] bg-[#FAF4D9] border border-[#E8E1C8] flex flex-col items-center justify-center p-8 text-center">
                <MapPin className="w-9 h-9 text-[#141414] mb-3" aria-hidden="true" />
                <h3 className="font-display text-xl font-bold text-[#141414] mb-1">
                  {CLINIC_ADDRESS}
                </h3>
                <p className="text-sm text-[#555147] max-w-md mb-5 leading-relaxed">
                  Localização central em Quirinópolis, GO. Clique abaixo para abrir o trajeto
                  diretamente no Google Maps.
                </p>
                <a
                  href={FALLBACK_DIRECTIONS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-[#141414] hover:bg-[#2A2822] rounded-full transition-colors"
                >
                  <Navigation className="w-4 h-4 text-[#DBBD43] shrink-0" aria-hidden="true" />
                  Abrir localização no Google Maps
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
