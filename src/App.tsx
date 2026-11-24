import {useCallback, useEffect, useState} from 'react';
import {DualSchedulerSection} from './components/DualSchedulerSection';
import {Footer} from './components/Footer';
import {Header} from './components/Header';
import {HeroSection} from './components/HeroSection';
import {HistoryAndPushSection} from './components/HistoryAndPushSection';
import {LocationMapSection} from './components/LocationMapSection';
import {PushToastBanner} from './components/PushToastBanner';
import {QuickBookingButton} from './components/QuickBookingButton';
import {ReviewsSection} from './components/ReviewsSection';
import {StructureSection} from './components/StructureSection';
import {WhyChooseSection} from './components/WhyChooseSection';
import {INITIAL_CLIENT_REVIEWS, INITIAL_SERVICE_HISTORY} from './data/seedData';
import type {
  BookingCategory,
  BookingInput,
  ClientReview,
  PushNotificationItem,
  ReviewInput,
  ServiceHistoryRecord,
} from './types/clinic';
import {
  CLINIC_SHORT_NAME,
  CLINIC_WHATSAPP_DISPLAY,
  createServiceRecordFromBooking,
  formatDatePtBr,
  getCategoryLabel,
  getServicesForCategory,
  getTodayIsoDate,
} from './utils/clinicLogic';

const STORAGE_KEYS = {
  history: 'imperio_animal_service_history_v1',
  reviews: 'imperio_animal_client_reviews_v1',
  notifications: 'imperio_animal_push_notifications_v1',
};

function readStoredArray<T>(key: string, fallback: T[]): T[] {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : fallback;
  } catch {
    return fallback;
  }
}

function getCurrentTimeLabel(): string {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<BookingCategory>('veterinario');
  const [selectedService, setSelectedService] = useState<string>('Consulta de Rotina');
  const [rescheduleRequest, setRescheduleRequest] = useState<{
    requestId: number;
    record: ServiceHistoryRecord;
  } | null>(null);

  const [history, setHistory] = useState<ServiceHistoryRecord[]>(() =>
    readStoredArray(STORAGE_KEYS.history, INITIAL_SERVICE_HISTORY)
  );
  const [reviews, setReviews] = useState<ClientReview[]>(() =>
    readStoredArray(STORAGE_KEYS.reviews, INITIAL_CLIENT_REVIEWS)
  );
  const [notifications, setNotifications] = useState<PushNotificationItem[]>(() =>
    readStoredArray(STORAGE_KEYS.notifications, [
      {
        id: 'notif-seed-1',
        title: 'Consulta confirmada · Mia (Gato)',
        body: 'Consulta de Rotina agendada para 26/11/2026 no turno da Manhã.',
        timestamp: '09:15',
        category: 'veterinario',
        read: true,
      },
    ])
  );
  const [activeToast, setActiveToast] = useState<PushNotificationItem | null>(null);
  const [pushPermission, setPushPermission] = useState<NotificationPermission | 'unsupported'>(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'unsupported';
    }
    return window.Notification.permission;
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(history));
    } catch {
      // Ignore storage quota errors
    }
  }, [history]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.reviews, JSON.stringify(reviews));
    } catch {
      // Ignore storage quota errors
    }
  }, [reviews]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.notifications, JSON.stringify(notifications));
    } catch {
      // Ignore storage quota errors
    }
  }, [notifications]);

  useEffect(() => {
    if (!activeToast) return;
    const timer = window.setTimeout(() => setActiveToast(null), 6500);
    return () => window.clearTimeout(timer);
  }, [activeToast]);

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({behavior: 'smooth', block: 'start'});
    }
  }, []);

  const openSchedulerWith = useCallback(
    (category: BookingCategory, service?: string) => {
      setRescheduleRequest(null);
      setSelectedCategory(category);
      const validServices = getServicesForCategory(category);
      setSelectedService(service && validServices.includes(service) ? service : validServices[0]);
      scrollToSection('agendamento');
    },
    [scrollToSection]
  );

  const handleRescheduleRecord = useCallback(
    (record: ServiceHistoryRecord) => {
      setSelectedCategory(record.category);
      const validServices = getServicesForCategory(record.category);
      setSelectedService(validServices.includes(record.service) ? record.service : validServices[0]);
      setRescheduleRequest({requestId: Date.now(), record});
      scrollToSection('agendamento');
    },
    [scrollToSection]
  );

  const dispatchPushNotification = useCallback(
    async (title: string, body: string, category: BookingCategory, requestIfDefault: boolean) => {
      const nextNotification: PushNotificationItem = {
        id: `notif-${Date.now()}`,
        title,
        body,
        timestamp: getCurrentTimeLabel(),
        category,
        read: false,
      };

      setNotifications((prev) => [nextNotification, ...prev].slice(0, 12));
      setActiveToast(nextNotification);

      if (typeof window !== 'undefined' && 'Notification' in window) {
        let currentPermission = window.Notification.permission;
        if (currentPermission === 'default' && requestIfDefault) {
          try {
            currentPermission = await window.Notification.requestPermission();
            setPushPermission(currentPermission);
          } catch {
            // Keep graceful in-app notification fallback
          }
        }
        if (currentPermission === 'granted') {
          try {
            new window.Notification(`${CLINIC_SHORT_NAME} — ${title}`, {
              body,
              lang: 'pt-BR',
            });
          } catch {
            // In-app toast already covers restricted iframe contexts
          }
        }
      }
    },
    []
  );

  const handleRequestPushPermission = useCallback(async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setPushPermission('unsupported');
      return;
    }
    try {
      const result = await window.Notification.requestPermission();
      setPushPermission(result);
      if (result === 'granted') {
        void dispatchPushNotification(
          'Notificações push ativadas',
          'Você receberá confirmações imediatas sempre que agendar consultas ou serviços de pet shop.',
          'veterinario',
          false
        );
      }
    } catch {
      setPushPermission('denied');
    }
  }, [dispatchPushNotification]);

  const handleSendTestPush = useCallback(() => {
    void dispatchPushNotification(
      'Confirmação de agendamento ativa',
      'Av. Santos Dumont, 92 · Central pronta para avisar sobre consultas, vacinas e banho e tosa.',
      'veterinario',
      true
    );
  }, [dispatchPushNotification]);

  const handleBookingConfirmed = useCallback(
    (booking: BookingInput, enablePush: boolean) => {
      const newRecord = createServiceRecordFromBooking(
        booking,
        `hist-${Date.now()}`,
        new Date().toISOString()
      );
      setHistory((prev) => [newRecord, ...prev]);

      if (enablePush) {
        const isReschedule = Boolean(booking.rescheduleFrom);
        void dispatchPushNotification(
          isReschedule
            ? `Reagendamento confirmado · ${booking.petName}`
            : `${booking.service} confirmado · ${booking.petName}`,
          isReschedule
            ? `REAGENDAMENTO de ${booking.service} (${getCategoryLabel(booking.category)}) para ${formatDatePtBr(booking.date)} (${booking.shift.split(' ')[0]}). Envie pelo WhatsApp ${CLINIC_WHATSAPP_DISPLAY} para confirmar o novo horário.`
            : `${getCategoryLabel(booking.category)} para ${formatDatePtBr(booking.date)} (${booking.shift.split(' ')[0]}). Envie os dados ao WhatsApp ${CLINIC_WHATSAPP_DISPLAY} para finalizar o horário.`,
          booking.category,
          true
        );
      }
    },
    [dispatchPushNotification]
  );

  const handleToggleRecordComplete = useCallback((id: string) => {
    setHistory((prev) =>
      prev.map((item) => (item.id === id ? {...item, status: 'Concluído'} : item))
    );
  }, []);

  const handleDeleteRecord = useCallback((id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleMarkAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((item) => ({...item, read: true})));
  }, []);

  const handleAddReview = useCallback((input: ReviewInput) => {
    const newReview: ClientReview = {
      id: `rev-${Date.now()}`,
      authorName: input.authorName.trim(),
      petInfo: input.petInfo.trim(),
      category: input.category,
      serviceLabel: input.serviceLabel,
      rating: input.rating,
      comment: input.comment.trim(),
      dateLabel: formatDatePtBr(getTodayIsoDate()),
      verified: true,
    };
    setReviews((prev) => [newReview, ...prev]);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF7] text-[#141414] print:min-h-0 print:bg-white print:text-[#141414]">
      <Header onQuickBook={() => openSchedulerWith('veterinario', 'Consulta de Rotina')} />

      <PushToastBanner
        notification={activeToast}
        onDismiss={() => setActiveToast(null)}
      />

      <main className="flex-1">
        <HeroSection
          onScheduleConsultation={() => openSchedulerWith('veterinario', 'Consulta de Rotina')}
          onExplorePetShop={() => scrollToSection('especialidades')}
        />

        <StructureSection
          onSelectSpecialty={(category, service) => openSchedulerWith(category, service)}
        />

        <DualSchedulerSection
          selectedCategory={selectedCategory}
          selectedService={selectedService}
          rescheduleRequest={rescheduleRequest}
          onCategoryChange={setSelectedCategory}
          onServiceChange={setSelectedService}
          onCancelReschedule={() => setRescheduleRequest(null)}
          onBookingConfirmed={handleBookingConfirmed}
        />

        <WhyChooseSection
          onScheduleNow={() => openSchedulerWith('veterinario', 'Consulta de Rotina')}
        />

        <HistoryAndPushSection
          history={history}
          notifications={notifications}
          pushPermission={pushPermission}
          onRequestPushPermission={handleRequestPushPermission}
          onSendTestPush={handleSendTestPush}
          onRescheduleRecord={handleRescheduleRecord}
          onToggleRecordComplete={handleToggleRecordComplete}
          onDeleteRecord={handleDeleteRecord}
          onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
        />

        <ReviewsSection reviews={reviews} onAddReview={handleAddReview} />

        <LocationMapSection />
      </main>

      <Footer />

      <QuickBookingButton onClick={() => openSchedulerWith(selectedCategory, selectedService)} />
    </div>
  );
}
