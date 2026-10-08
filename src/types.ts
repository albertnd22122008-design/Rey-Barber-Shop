export interface ServiceItem {
  id: string;
  name: string;
  tagline: string;
  category: 'corte' | 'barba' | 'combo' | 'especial';
  priceRD: number;
  priceUSD: number;
  durationMinutes: number;
  image: string;
  features: string[];
  popular?: boolean;
}

export interface Barber {
  id: string;
  name: string;
  role: string;
  experience: string;
  avatar: string;
  specialty: string;
  available: boolean;
}

export interface CourseItem {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  level: 'Principiante' | 'Intermedio' | 'Especializado';
  schedule: string;
  priceRD: number;
  priceUSD: number;
  description: string;
  modules: string[];
  includes: string[];
  image: string;
  spotsLeft: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'fade' | 'barba' | 'diseno' | 'local';
  barber: string;
  image: string;
  description: string;
}

export interface GoogleReview {
  id: string;
  author: string;
  isLocalGuide: boolean;
  guideStats?: string; // e.g. "249 opiniones · 1 foto"
  rating: number;
  timeAgo: string;
  content: string;
  likesCount?: number;
  ownerReply?: {
    author: string;
    timeAgo: string;
    content: string;
  };
  hasPhoto?: boolean;
}

export interface BookingFormData {
  serviceId: string;
  barberId: string;
  date: string;
  time: string;
  serviceType: 'local';
  clientName: string;
  clientPhone: string;
  clientNotes: string;
  address?: string;
}

export interface UserSession {
  role: 'client' | 'owner';
  name: string;
  email?: string;
}

export interface Appointment {
  id: string;
  code: string;
  clientName: string;
  clientPhone: string;
  serviceName: string;
  serviceId: string;
  servicePriceRD: number;
  durationMinutes: number;
  date: string;
  time: string;
  barberName: string;
  barberId: string;
  serviceType: 'local';
  status: 'confirmada' | 'pendiente' | 'completada' | 'cancelada' | 'disponible';
  address?: string;
  notes?: string;
  createdAt: string;
}

