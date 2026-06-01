import { create } from 'zustand';
import { api } from '../api';

export interface PatientProfile {
  _id: string;
  user: string | any;
  name: string;
  imageUrl?: string;
  age: number;
  gender: string;
  bloodGroup: string;
  address: string;
  phone: string;
  medicalHistory: string[];
  allergies: string[];
  currentMedications: string[];
  mobilityStatus: string;
  careRequirements: string[];
  chronicConditions: string[];
  preferredLanguage: string;
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
    notificationPreference?: string;
  };
}

export interface CaregiverProfile {
  _id: string;
  user: string | any;
  name: string;
  imageUrl?: string;
  title: string;
  experienceYears: number;
  hourlyRate: number;
  bio: string;
  specialties: string[];
  availability: boolean;
  isVerified: boolean;
  rating: number;
  cities?: string[];
  completedSessions?: number;
}

export interface ServiceCategory {
  _id: string;
  title: string;
  description: string;
  priceRange: string;
  icon: string;
  features: string[];
  isActive?: boolean;
}

export interface Booking {
  _id: string;
  patient: any;
  caregiver: any;
  service: any;
  durationType?: 'hourly' | 'daily' | 'long-term';
  startDate: string | Date;
  endDate: string | Date;
  startTime?: string;
  endTime?: string;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt?: string | Date;
}

export interface CareNote {
  _id: string;
  booking: string | any;
  caregiver: string | any;
  patient?: string | any;
  note: string;
  bloodPressure?: string;
  heartRate?: number;
  spo2?: number;
  temperature?: number;
  vitalSigns?: {
    bloodPressure?: string;
    heartRate?: number;
    oxygenSaturation?: number;
    temperature?: number;
  };
  isAlert?: boolean;
  alertReason?: string;
  createdAt?: string | Date;
}

export interface Notification {
  _id: string;
  user: string;
  type: 'new_booking' | 'booking_accepted' | 'booking_completed' | 'care_note_added' | 'alert_generated' | 'booking_cancelled' | 'new_message';
  title: string;
  message: string;
  relatedId?: string;
  relatedModel?: string;
  isRead: boolean;
  createdAt: string | Date;
}
export interface Complaint {
  _id: string;
  patient: any;
  caregiver?: any;
  booking: any;
  title: string;
  description: string;
  status: 'pending' | 'resolved' | 'escalated';
  resolution?: string;
  createdAt: string | Date;
  updatedAt?: string | Date;
}

export interface SystemSettings {
  _id?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroPrimaryCTA?: string;
  heroSecondaryCTA?: string;
  satisfactionTitle?: string;
  satisfactionDescription?: string;
  caregiverTrustTitle?: string;
  caregiverTrustDescription?: string;
  serviceCoverageTitle?: string;
  serviceCoverageDescription?: string;
  companyName?: string;
  footerDescription?: string;
  supportEmail: string;
  supportPhone: string;
  whatsappNumber?: string;
  supportHours?: string;
  officeAddress: string;
  emergencyContact?: string;
  supportedCities: string[];
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
}

interface CareStoreState {
  patient: PatientProfile | null;
  caregiver: CaregiverProfile | null;
  caregivers: CaregiverProfile[];
  services: ServiceCategory[];
  bookings: Booking[];
  careNotes: CareNote[];
  revenueData: any;
  notifications: Notification[];
  unreadNotificationCount: number;
  adminMetrics: any;
  complaints: Complaint[];
  inquiries: any[];
  settings: SystemSettings | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchPatientMe: () => Promise<void>;
  updatePatient: (data: Partial<PatientProfile>) => Promise<void>;
  fetchCaregivers: (admin?: boolean) => Promise<void>;
  fetchCaregiverMe: () => Promise<void>;
  updateCaregiver: (data: Partial<CaregiverProfile>) => Promise<void>;
  verifyCaregiver: (id: string) => Promise<void>;
  revokeCaregiver: (id: string) => Promise<void>;
  deleteCaregiverProfile: (id: string) => Promise<void>;
  toggleAvailabilityByAdmin: (id: string, availability: boolean) => Promise<void>;
  toggleAvailability: (availability: boolean) => Promise<void>;
  fetchServices: () => Promise<void>;
  createService: (data: Partial<ServiceCategory>) => Promise<void>;
  updateService: (id: string, data: Partial<ServiceCategory>) => Promise<void>;
  fetchBookings: (admin?: boolean) => Promise<void>;
  createBooking: (data: Partial<Booking>) => Promise<void>;
  updateBookingStatus: (id: string, status: Booking['status']) => Promise<void>;
  fetchCareNotes: (bookingId: string) => Promise<void>;
  fetchCaregiverNotes: () => Promise<void>;
  addCareNote: (data: Partial<CareNote>) => Promise<void>;
  fetchRevenueData: () => Promise<void>;
  // Complaints
  fetchComplaints: () => Promise<void>;
  submitComplaint: (data: Partial<Complaint>) => Promise<void>;
  updateComplaintStatus: (id: string, status: string, resolution?: string) => Promise<void>;
  // Notifications
  fetchNotifications: () => Promise<void>;
  fetchUnreadNotificationCount: () => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  // Admin
  fetchAdminMetrics: () => Promise<void>;
  fetchInquiries: (admin?: boolean) => Promise<void>;
  submitInquiry: (data: { question: string; email?: string }) => Promise<any>;
  answerInquiry: (id: string, answer: string) => Promise<void>;
  updateInquiryStatus: (id: string, status: string) => Promise<void>;
  fetchSettings: () => Promise<void>;
  updateSettings: (data: Partial<SystemSettings>) => Promise<void>;
  resetStore: () => void;
}

export const useCareStore = create<CareStoreState>((set) => ({
  patient: null,
  caregiver: null,
  caregivers: [],
  services: [],
  bookings: [],
  careNotes: [],
  revenueData: null,
  notifications: [],
  unreadNotificationCount: 0,
  adminMetrics: null,
  complaints: [],
  inquiries: [],
  settings: null,
  loading: false,
  error: null,

  fetchPatientMe: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get('/patients/me');
      set({ patient: res.data, loading: false });
    } catch (err: any) {
      if (err.response?.status === 404) {
        set({ patient: null, loading: false });
      } else {
        set({ error: err.response?.data?.message || err.message, loading: false });
      }
    }
  },

  updatePatient: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/patients', data);
      set({ patient: res.data, loading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message, loading: false });
      throw err;
    }
  },

  fetchCaregivers: async (admin = false) => {
    set({ loading: true, error: null });
    try {
      const endpoint = admin ? '/caregivers/admin' : '/caregivers';
      const res = await api.get(endpoint);
      set({ caregivers: Array.isArray(res.data) ? res.data : [], loading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message, loading: false });
    }
  },

  fetchCaregiverMe: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get('/caregivers/me');
      set({ caregiver: res.data, loading: false });
    } catch (err: any) {
      if (err.response?.status === 404) {
        set({ caregiver: null, loading: false });
      } else {
        set({ error: err.response?.data?.message || err.message, loading: false });
      }
    }
  },

  updateCaregiver: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/caregivers', data);
      set({ caregiver: res.data, loading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message, loading: false });
      throw err;
    }
  },

  verifyCaregiver: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await api.put(`/caregivers/${id}/verify`);
      set((state) => ({
        caregivers: state.caregivers.map((cg) => (cg._id === id ? { ...cg, ...res.data } : cg)),
        loading: false,
      }));
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message, loading: false });
      throw err;
    }
  },

  revokeCaregiver: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await api.put(`/caregivers/${id}/revoke`);
      set((state) => ({
        caregivers: state.caregivers.map((cg) => (cg._id === id ? { ...cg, ...res.data } : cg)),
        loading: false,
      }));
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message, loading: false });
      throw err;
    }
  },

  deleteCaregiverProfile: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/caregivers/${id}`);
      set((state) => ({
        caregivers: state.caregivers.filter((cg) => cg._id !== id),
        loading: false,
      }));
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message, loading: false });
      throw err;
    }
  },

  toggleAvailabilityByAdmin: async (id, availability) => {
    set({ loading: true, error: null });
    try {
      const res = await api.put(`/caregivers/${id}/availability`, { availability });
      set((state) => ({
        caregivers: state.caregivers.map((cg) => (cg._id === id ? { ...cg, ...res.data } : cg)),
        loading: false,
      }));
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message, loading: false });
      throw err;
    }
  },

  toggleAvailability: async (availability) => {
    set({ loading: true, error: null });
    try {
      const res = await api.put('/caregivers/me/availability', { availability });
      set({ caregiver: res.data, loading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message, loading: false });
    }
  },

  fetchServices: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get('/services');
      set({ services: Array.isArray(res.data) ? res.data : [], loading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message, loading: false });
    }
  },

  createService: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/services', data);
      set((state) => ({ services: [...state.services, res.data], loading: false }));
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message, loading: false });
    }
  },

  updateService: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const res = await api.put(`/services/${id}`, data);
      set((state) => ({
        services: state.services.map((s) => (s._id === id ? res.data : s)),
        loading: false,
      }));
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message, loading: false });
      throw err;
    }
  },

  fetchBookings: async (admin = false) => {
    set({ loading: true, error: null });
    try {
      const endpoint = admin ? '/bookings' : '/bookings/me';
      const res = await api.get(endpoint);
      set({ bookings: Array.isArray(res.data) ? res.data : [], loading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message, loading: false });
    }
  },

  createBooking: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/bookings', data);
      set((state) => ({ bookings: [res.data, ...state.bookings], loading: false }));
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message, loading: false });
      throw err;
    }
  },

  updateBookingStatus: async (id, status) => {
    set({ loading: true, error: null });
    try {
      const res = await api.put(`/bookings/${id}/status`, { status });
      set((state) => ({
        bookings: state.bookings.map((b) => (b._id === id ? res.data : b)),
        loading: false,
      }));
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message, loading: false });
    }
  },

  fetchCareNotes: async (bookingId) => {
    set({ loading: true, error: null });
    try {
      const res = await api.get(`/notes/booking/${bookingId}`);
      set({ careNotes: Array.isArray(res.data) ? res.data : [], loading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message, loading: false });
    }
  },

  fetchCaregiverNotes: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get('/notes/me');
      set({ careNotes: Array.isArray(res.data) ? res.data : [], loading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message, loading: false });
    }
  },

  addCareNote: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/notes', data);
      set((state) => ({ careNotes: [res.data, ...state.careNotes], loading: false }));
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message, loading: false });
      throw err;
    }
  },

  fetchRevenueData: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get('/bookings/revenue/me');
      set({ revenueData: res.data, loading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message, loading: false });
    }
  },


  // Notification actions
  fetchNotifications: async () => {
    try {
      const res = await api.get('/notifications');
      const notifications = Array.isArray(res.data) ? res.data : [];
      const unread = notifications.filter((n: Notification) => !n.isRead).length;
      set({ notifications, unreadNotificationCount: unread });
    } catch (err: any) {
      console.error('Failed to fetch notifications:', err.message);
    }
  },

  fetchUnreadNotificationCount: async () => {
    try {
      const res = await api.get('/notifications/unread-count');
      set({ unreadNotificationCount: res.data.count || 0 });
    } catch (err: any) {
      console.error('Failed to fetch unread count:', err.message);
    }
  },



  markNotificationRead: async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n._id === id ? { ...n, isRead: true } : n
        ),
        unreadNotificationCount: Math.max(0, state.unreadNotificationCount - 1),
      }));
    } catch (err: any) {
      console.error('Failed to mark notification read:', err.message);
    }
  },

  markAllNotificationsRead: async () => {
    try {
      await api.put('/notifications/read-all');
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        unreadNotificationCount: 0,
      }));
    } catch (err: any) {
      console.error('Failed to mark all notifications read:', err.message);
    }
  },

  deleteNotification: async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      set((state) => ({
        notifications: state.notifications.filter((n) => n._id !== id),
        unreadNotificationCount: state.notifications.find((n) => n._id === id && !n.isRead)
          ? Math.max(0, state.unreadNotificationCount - 1)
          : state.unreadNotificationCount,
      }));
    } catch (err: any) {
      console.error('Failed to delete notification:', err.message);
    }
  },



  // Admin metrics
  fetchAdminMetrics: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get('/bookings/admin/metrics');
      set({ adminMetrics: res.data, loading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message, loading: false });
    }
  },

  fetchComplaints: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get('/complaints');
      set({ complaints: Array.isArray(res.data) ? res.data : [], loading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message, loading: false });
    }
  },

  submitComplaint: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/complaints', data);
      set((state) => ({ complaints: [res.data, ...state.complaints], loading: false }));
      return res.data;
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message, loading: false });
      throw err;
    }
  },

  updateComplaintStatus: async (id, status, resolution) => {
    set({ loading: true, error: null });
    try {
      const res = await api.put(`/complaints/${id}`, { status, resolution });
      set((state) => ({
        complaints: state.complaints.map((c) => (c._id === id ? res.data : c)),
        loading: false,
      }));
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message, loading: false });
      throw err;
    }
  },

  fetchInquiries: async (admin = false) => {
    set({ loading: true, error: null });
    try {
      const endpoint = admin ? '/inquiries' : '/inquiries/my';
      const res = await api.get(endpoint);
      set({ inquiries: Array.isArray(res.data) ? res.data : [], loading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message, loading: false });
    }
  },

  submitInquiry: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/inquiries', data);
      set((state) => ({ inquiries: [res.data, ...state.inquiries], loading: false }));
      return res.data;
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message, loading: false });
      throw err;
    }
  },

  answerInquiry: async (id, answer) => {
    set({ loading: true, error: null });
    try {
      const res = await api.put(`/inquiries/${id}/answer`, { answer });
      set((state) => ({
        inquiries: state.inquiries.map((inq) => (inq._id === id ? res.data : inq)),
        loading: false,
      }));
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message, loading: false });
      throw err;
    }
  },

  updateInquiryStatus: async (id, status) => {
    set({ loading: true, error: null });
    try {
      const res = await api.put(`/inquiries/${id}/status`, { status });
      set((state) => ({
        inquiries: state.inquiries.map((inq) => (inq._id === id ? res.data : inq)),
        loading: false,
      }));
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message, loading: false });
      throw err;
    }
  },

  fetchSettings: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get('/settings');
      set({ settings: res.data, loading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message, loading: false });
    }
  },

  updateSettings: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await api.put('/settings', data);
      set({ settings: res.data, loading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message, loading: false });
      throw err;
    }
  },

  resetStore: () => {
    set({
      patient: null,
      caregiver: null,
      caregivers: [],
      services: [],
      bookings: [],
      careNotes: [],
      revenueData: null,
      notifications: [],
      unreadNotificationCount: 0,
      adminMetrics: null,
      complaints: [],
      inquiries: [],
      settings: null,
      loading: false,
      error: null,
    });
  },
}));
