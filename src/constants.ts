import { Service } from './types';
import nursingCareImg from './assets/nursing-care.png';
import physiotherapyImg from './assets/physiotherapy.jpg';
import elderlyAttendantImg from './assets/elderly-attendant.jpg';
import dementiaCareImg from './assets/dementia-care.jpg';

export const SERVICES: Service[] = [
  {
    id: '1',
    title: 'Nursing Care',
    description: 'Post-hospitalization support, wound care, and medication management by certified nurses.',
    startingPrice: 45,
    icon: 'Stethoscope',
    image: nursingCareImg,
    category: 'NURSING',
    duration: 'Min 2 hours'
  },
  {
    id: '2',
    title: 'Physiotherapy',
    description: 'Specialized mobility and strength rehabilitation for stroke recovery and joint pain.',
    startingPrice: 55,
    icon: 'Activity',
    image: physiotherapyImg,
    category: 'PHYSIO',
    duration: '45 mins'
  },
  {
    id: '3',
    title: 'Elderly Attendant',
    description: 'Trained attendants for daily assistance, bathing, feeding, and physical support.',
    startingPrice: 25,
    icon: 'UserPlus',
    image: elderlyAttendantImg,
    category: 'COMPANION',
    duration: 'Daily/Weekly'
  },
  {
    id: '4',
    title: 'Dementia Care',
    description: 'Compassionate, specialized care for patients with Alzheimer’s or dementia.',
    startingPrice: 40,
    icon: 'Brain',
    image: dementiaCareImg,
    category: 'DEMENTIA',
    duration: 'Long-term'
  }
];

export const APP_THEME = {
  colors: {
    primary: '#0F52BA', // Royal Medical Blue
    secondary: '#E6F0FF', // Soft Sky Blue
    accent: '#00A86B', // Health Green
    background: '#FFFFFF',
    text: '#1A1A1A',
  }
};
