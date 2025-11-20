
export enum AppView {
  HOME = 'HOME',
  DASHBOARD = 'DASHBOARD', // New User Home
  STUDIO = 'STUDIO',
  GO = 'GO',
  LIFE = 'LIFE',
  JOURNAL = 'JOURNAL',
  MERCH = 'MERCH',
  CART = 'CART', // New Cart View
  ADMIN = 'ADMIN',
  BODY_SCAN = 'BODY_SCAN', // New Onboarding Step
  SUPPORT = 'SUPPORT', // New AI Support Center
  LEGAL = 'LEGAL' // New Legal Center
}

export interface Step {
  id: string;
  title: string;
  duration: string;
  description: string;
}

export interface Routine {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  steps: Step[]; // 9 steps per routine
}

export interface Area {
  id: string;
  title: string;
  routines: Routine[]; // 9 routines per area
}

export interface Discipline {
  id: string;
  title: string;
  description: string;
  image: string;
  areas: Area[]; // 5 areas per discipline
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  city: string;
  state: string;
  country: string;
  dob: string; // Date of Birth
  joinDate: string;
  idVerified: boolean;
}
