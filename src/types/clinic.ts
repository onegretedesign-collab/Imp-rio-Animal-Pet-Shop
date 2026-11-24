export type BookingCategory = 'veterinario' | 'petshop';

export type PetSpecies = 'Cão' | 'Gato';

export type AppointmentShift = 'Manhã (08h às 12h)' | 'Tarde (13h30 às 18h)';

export type ServiceStatus = 'Confirmado' | 'Concluído' | 'Aguardando WhatsApp';

export interface RescheduleMetadata {
  recordId: string;
  previousDate: string; // YYYY-MM-DD
  previousShift: AppointmentShift;
}

export interface BookingInput {
  category: BookingCategory;
  service: string;
  species: PetSpecies;
  petName: string;
  tutorName: string;
  tutorPhone: string;
  date: string; // YYYY-MM-DD
  shift: AppointmentShift;
  notes: string;
  rescheduleFrom?: RescheduleMetadata;
}

export interface BookingValidationErrors {
  service?: string;
  petName?: string;
  tutorName?: string;
  tutorPhone?: string;
  date?: string;
}

export interface ServiceHistoryRecord {
  id: string;
  category: BookingCategory;
  service: string;
  species: PetSpecies;
  petName: string;
  tutorName: string;
  tutorPhone: string;
  date: string; // YYYY-MM-DD
  shift: AppointmentShift;
  status: ServiceStatus;
  professional: string;
  notes?: string;
  createdAt: string;
}

export interface ClientReview {
  id: string;
  authorName: string;
  petInfo: string;
  category: BookingCategory;
  serviceLabel: string;
  rating: number;
  comment: string;
  dateLabel: string;
  verified: boolean;
}

export interface ReviewInput {
  authorName: string;
  petInfo: string;
  category: BookingCategory;
  serviceLabel: string;
  rating: number;
  comment: string;
}

export interface ReviewValidationErrors {
  authorName?: string;
  petInfo?: string;
  comment?: string;
  rating?: string;
}

export interface PushNotificationItem {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  category: BookingCategory;
  read: boolean;
}
