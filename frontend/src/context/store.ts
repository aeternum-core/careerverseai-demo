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

export interface ICareerTwinState {
  userId: string;
  studentName: string;
  targetCareer: string;
  orientation: {
    technology: number;
    research: number;
    entrepreneurship: number;
    management: number;
    design: number;
  };
  skills: Array<{
    name: string;
    selfReported: number;
    verified: number;
    category: string;
  }>;
  behavior: {
    analyticalThinking: number;
    riskManagement: number;
    qualityOrientation: number;
    leadership: number;
    adaptability: number;
  };
  experience: {
    projectsCount: number;
    internshipsCount: number;
    simulationsCount: number;
  };
  readiness: {
    current: number;
    target: number;
    knowledge: number;
    skills: number;
    experience: number;
  };
  careerFit: Array<{
    role: string;
    score: number;
    evidence: string[];
    skillGaps: string[];
    expGaps: string[];
    actionableBoosts: Array<{ action: string; boost: number; impactType: string }>;
  }>;
  riskAlerts: Array<{
    id: string;
    title: string;
    message: string;
    severity: string;
    fixAction: string;
    fixRoute: string;
  }>;
  dailyMission: {
    id: string;
    title: string;
    task: string;
    xpReward: number;
    skillTarget: string;
    delta: number;
    completed: boolean;
  };
  passportToken: string;
}

interface CareerVerseState {
  token: string | null;
  user: User | null;
  assessment: AssessmentReport | null;
  careerTwin: ICareerTwinState | null;
  apiUrl: string;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
  updateProfile: (profile: any) => void;
  setAssessment: (report: AssessmentReport) => void;
  setCareerTwin: (twin: ICareerTwinState) => void;
  awardXP: (xp: number, badge?: string) => void;
}

export const useStore = create<CareerVerseState>((set, get) => ({
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  user: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null,
  assessment: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('assessment') || 'null') : null,
  careerTwin: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('careerTwin') || 'null') : null,
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

  setCareerTwin: (careerTwin) => {
    localStorage.setItem('careerTwin', JSON.stringify(careerTwin));
    set({ careerTwin });
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
