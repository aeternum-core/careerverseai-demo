import mongoose, { Schema } from 'mongoose';
import { isConnectedToMongo, InMemoryStore } from '../config/db';

export interface ISkillProficiency {
  name: string;
  selfReported: number; // 0 - 100
  verified: number;     // 0 - 100
  category: string;
}

export interface IActionableBoost {
  action: string;
  boost: number; // e.g. 4 for +4%
  impactType: 'skill' | 'project' | 'internship' | 'certification';
}

export interface ICareerFitScore {
  role: string;
  score: number; // 0 - 100
  evidence: string[];
  skillGaps: string[];
  expGaps: string[];
  actionableBoosts: IActionableBoost[];
}

export interface IRiskAlert {
  id: string;
  title: string;
  message: string;
  severity: 'high' | 'medium';
  fixAction: string;
  fixRoute: string;
}

export interface IDailyMission {
  id: string;
  title: string;
  task: string;
  xpReward: number;
  skillTarget: string;
  delta: number;
  completed: boolean;
}

export interface ICareerTwin {
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
  skills: ISkillProficiency[];
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
    current: number;    // Overall 0-100
    target: number;     // e.g. 90
    knowledge: number;  // 0-100
    skills: number;     // 0-100
    experience: number; // 0-100
  };
  careerFit: ICareerFitScore[];
  riskAlerts: IRiskAlert[];
  dailyMission: IDailyMission;
  passportToken: string;
  lastBehavioralUpdate?: Date;
}

const CareerTwinSchema = new Schema<ICareerTwin>({
  userId: { type: String, required: true, unique: true },
  studentName: { type: String, default: 'Cadet Voyager' },
  targetCareer: { type: String, default: 'Machine Learning Engineer' },
  orientation: {
    technology: { type: Number, default: 85 },
    research: { type: Number, default: 72 },
    entrepreneurship: { type: Number, default: 60 },
    management: { type: Number, default: 55 },
    design: { type: Number, default: 45 },
  },
  skills: [{
    name: { type: String, required: true },
    selfReported: { type: Number, default: 70 },
    verified: { type: Number, default: 50 },
    category: { type: String, default: 'Core' }
  }],
  behavior: {
    analyticalThinking: { type: Number, default: 85 },
    riskManagement: { type: Number, default: 75 },
    qualityOrientation: { type: Number, default: 80 },
    leadership: { type: Number, default: 65 },
    adaptability: { type: Number, default: 78 }
  },
  experience: {
    projectsCount: { type: Number, default: 3 },
    internshipsCount: { type: Number, default: 1 },
    simulationsCount: { type: Number, default: 4 }
  },
  readiness: {
    current: { type: Number, default: 74 },
    target: { type: Number, default: 90 },
    knowledge: { type: Number, default: 82 },
    skills: { type: Number, default: 71 },
    experience: { type: Number, default: 60 }
  },
  careerFit: [{
    role: { type: String, required: true },
    score: { type: Number, required: true },
    evidence: [String],
    skillGaps: [String],
    expGaps: [String],
    actionableBoosts: [{
      action: String,
      boost: Number,
      impactType: String
    }]
  }],
  riskAlerts: [{
    id: String,
    title: String,
    message: String,
    severity: String,
    fixAction: String,
    fixRoute: String
  }],
  dailyMission: {
    id: String,
    title: String,
    task: String,
    xpReward: Number,
    skillTarget: String,
    delta: Number,
    completed: Boolean
  },
  passportToken: { type: String }
}, { timestamps: true });

export const CareerTwinModel = mongoose.models.CareerTwin || mongoose.model<ICareerTwin>('CareerTwin', CareerTwinSchema);

export class CareerTwinRepository {
  static async findOne(query: Record<string, any>) {
    if (isConnectedToMongo) {
      return CareerTwinModel.findOne(query).lean();
    }
    return InMemoryStore.findOne('careertwins', query);
  }

  static async create(doc: any) {
    if (isConnectedToMongo) {
      const twin = new CareerTwinModel(doc);
      return twin.save();
    }
    return InMemoryStore.insertOne('careertwins', doc);
  }

  static async findOneAndUpdate(query: Record<string, any>, update: any, options = { upsert: false }) {
    if (isConnectedToMongo) {
      return CareerTwinModel.findOneAndUpdate(query, update, { ...options, new: true }).lean();
    }
    return InMemoryStore.findOneAndUpdate('careertwins', query, update, options);
  }
}
