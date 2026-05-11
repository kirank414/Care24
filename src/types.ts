export type UserRole = 'USER' | 'CAREGIVER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface Caregiver extends User {
  specialty: string;
  experience: number;
  rating: number;
  reviewsCount: number;
  hourlyRate: number;
  bio: string;
  verified: boolean;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  startingPrice: number;
  icon: string;
  duration?: string;
  category: 'NURSING' | 'PHYSIO' | 'COMPANION' | 'DEMENTIA' | 'POST_OP';
}

export interface Booking {
  id: string;
  userId: string;
  caregiverId: string;
  serviceId: string;
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  date: string;
  timeSlot: string;
  address: string;
  totalAmount: number;
}
