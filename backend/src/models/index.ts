import mongoose, { Schema } from 'mongoose';
import { isConnectedToMongo, InMemoryStore } from '../config/db';

// -------------------------------------------------------------
// 1. Mongoose Schemas & Mock Interfaces
// -------------------------------------------------------------

// USER
const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'counselor', 'admin'], default: 'student' },
  otp: { type: String },
  otpExpiry: { type: Date },
  isVerified: { type: Boolean, default: false },
}, { timestamps: true });

export const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);

// STUDENT PROFILE
const StudentProfileSchema = new Schema({
  userId: { type: String, required: true },
  fullName: { type: String, required: true },
  grade: { type: String },
  school: { type: String },
  skills: [String],
  interests: [String],
  cgpa: { type: Number, default: 0 },
  xp: { type: Number, default: 0 },
  badges: [String],
  streak: { type: Number, default: 0 },
}, { timestamps: true });

export const StudentProfileModel = mongoose.models.StudentProfile || mongoose.model('StudentProfile', StudentProfileSchema);

// ASSESSMENT
const CareerAssessmentSchema = new Schema({
  userId: { type: String, required: true },
  personality: { type: String },
  learningStyle: { type: String },
  strengths: [String],
  weaknesses: [String],
  interestAreas: [String],
  careerFit: { type: Map, of: Number },
}, { timestamps: true });

export const CareerAssessmentModel = mongoose.models.CareerAssessment || mongoose.model('CareerAssessment', CareerAssessmentSchema);

// COLLEGES
const CollegeSchema = new Schema({
  name: { type: String, required: true },
  domain: { type: String, required: true }, // Technology, Law, Commerce, Arts, Science
  ranking: { type: Number },
  fees: { type: Number },
  placementRate: { type: Number },
  location: { type: String },
  facilities: [String],
  reviews: [{ user: String, rating: Number, comment: String }],
});

export const CollegeModel = mongoose.models.College || mongoose.model('College', CollegeSchema);

// ROADMAP
const RoadmapSchema = new Schema({
  userId: { type: String, required: true },
  roadmapData: { type: Object, required: true }, // Contains 1, 3, 5 year details
}, { timestamps: true });

export const RoadmapModel = mongoose.models.Roadmap || mongoose.model('Roadmap', RoadmapSchema);

// APPOINTMENT
const AppointmentSchema = new Schema({
  studentId: { type: String, required: true },
  studentName: { type: String, required: true },
  counselorId: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  notes: { type: String },
  status: { type: String, enum: ['scheduled', 'completed', 'cancelled'], default: 'scheduled' }
}, { timestamps: true });

export const AppointmentModel = mongoose.models.Appointment || mongoose.model('Appointment', AppointmentSchema);

// CHAT HISTORY
const ChatHistorySchema = new Schema({
  userId: { type: String, required: true },
  messages: [{ role: String, content: String, timestamp: Date }],
}, { timestamps: true });

export const ChatHistoryModel = mongoose.models.ChatHistory || mongoose.model('ChatHistory', ChatHistorySchema);

// -------------------------------------------------------------
// 2. Generic Repository Pattern Wrapper
// -------------------------------------------------------------
class BaseRepository<T extends mongoose.Document> {
  constructor(private model: mongoose.Model<any>, private collectionName: string) {}

  async find(query: Record<string, any> = {}): Promise<any[]> {
    if (isConnectedToMongo) {
      return this.model.find(query).lean();
    } else {
      return InMemoryStore.find(this.collectionName, query);
    }
  }

  async findOne(query: Record<string, any>): Promise<any | null> {
    if (isConnectedToMongo) {
      return this.model.findOne(query).lean();
    } else {
      return InMemoryStore.findOne(this.collectionName, query);
    }
  }

  async create(doc: any): Promise<any> {
    if (isConnectedToMongo) {
      return (await this.model.create(doc)).toObject();
    } else {
      return InMemoryStore.insertOne(this.collectionName, doc);
    }
  }

  async findOneAndUpdate(query: Record<string, any>, update: any, options = { upsert: false }): Promise<any | null> {
    if (isConnectedToMongo) {
      return this.model.findOneAndUpdate(query, update, { ...options, new: true }).lean();
    } else {
      return InMemoryStore.findOneAndUpdate(this.collectionName, query, update, options);
    }
  }

  async deleteOne(query: Record<string, any>): Promise<boolean> {
    if (isConnectedToMongo) {
      const res = await this.model.deleteOne(query);
      return res.deletedCount > 0;
    } else {
      return InMemoryStore.deleteOne(this.collectionName, query);
    }
  }
}

// -------------------------------------------------------------
// 3. Exported Repositories
// -------------------------------------------------------------
export const UserRepository = new BaseRepository<any>(UserModel, 'users');
export const StudentProfileRepository = new BaseRepository<any>(StudentProfileModel, 'studentProfiles');
export const CareerAssessmentRepository = new BaseRepository<any>(CareerAssessmentModel, 'careerAssessments');
export const CollegeRepository = new BaseRepository<any>(CollegeModel, 'colleges');
export const RoadmapRepository = new BaseRepository<any>(RoadmapModel, 'roadmaps');
export const AppointmentRepository = new BaseRepository<any>(AppointmentModel, 'appointments');
export const ChatHistoryRepository = new BaseRepository<any>(ChatHistoryModel, 'chatHistory');

// Career Twin
export * from './careerTwin.model';
