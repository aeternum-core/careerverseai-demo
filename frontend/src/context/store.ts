import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  role: 'student' | 'counselor' | 'admin';
  profile: {
    fullName: string;
    grade?: string;
    school?: string;
    skills?: string[];
    interests?: string[];
    cgpa?: number;
    xp?: number;
    badges?: string[];
    streak?: number;
  };
}

interface AssessmentReport {
  personality: string;
  learningStyle: string;
  strengths: string[];
  weaknesses: string[];
  interestAreas: string[];
  careerFit: Record<string, number>;
}

interface CareerVerseState {
  token: string | null;
  user: User | null;
  assessment: AssessmentReport | null;
  apiUrl: string;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
  updateProfile: (profile: any) => void;
  setAssessment: (report: AssessmentReport) => void;
  awardXP: (xp: number, badge?: string) => void;
}

export const useStore = create<CareerVerseState>((set, get) => ({
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  user: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null,
  assessment: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('assessment') || 'null') : null,
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',

  setAuth: (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ token, user });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('assessment');
    set({ token: null, user: null, assessment: null });
  },

  updateProfile: (updatedProfile) => {
    const currentUser = get().user;
    if (currentUser) {
      const newUser = {
        ...currentUser,
        profile: { ...currentUser.profile, ...updatedProfile }
      };
      localStorage.setItem('user', JSON.stringify(newUser));
      set({ user: newUser });
    }
  },

  setAssessment: (assessment) => {
    localStorage.setItem('assessment', JSON.stringify(assessment));
    set({ assessment });
  },

  awardXP: (xpAwarded, badge) => {
    const currentUser = get().user;
    if (currentUser) {
      const currentXP = currentUser.profile.xp || 0;
      const currentBadges = currentUser.profile.badges || [];
      const updatedBadges = [...currentBadges];
      if (badge && !updatedBadges.includes(badge)) {
        updatedBadges.push(badge);
      }
      
      const newUser = {
        ...currentUser,
        profile: {
          ...currentUser.profile,
          xp: currentXP + xpAwarded,
          badges: updatedBadges,
          streak: (currentUser.profile.streak || 0) + 1
        }
      };
      
      localStorage.setItem('user', JSON.stringify(newUser));
      set({ user: newUser });
    }
  }
}));
