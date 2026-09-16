import { Request, Response } from 'express';
import { AIService } from '../services/ai.service';
import { ChatHistoryRepository, RoadmapRepository, CollegeRepository } from '../models';

export class AIController {
  // 1. CHAT
  static async chat(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;
      const { message, history } = req.body;

      if (!message) {
        res.status(400).json({ error: 'Message is required.' });
        return;
      }

      // Read history from DB if not provided in payload
      let finalHistory = history || [];
      if (finalHistory.length === 0) {
        const record = await ChatHistoryRepository.findOne({ userId });
        if (record) {
          finalHistory = record.messages || [];
        }
      }

      // Add user message
      finalHistory.push({ role: 'user', content: message, timestamp: new Date() });

      // Run AI Chat
      const reply = await AIService.chat(finalHistory);

      // Add assistant response
      finalHistory.push({ role: 'assistant', content: reply, timestamp: new Date() });

      // Save History
      await ChatHistoryRepository.findOneAndUpdate(
        { userId },
        { messages: finalHistory },
        { upsert: true }
      );

      res.status(200).json({ reply, history: finalHistory });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Chatbot evaluation failed.' });
    }
  }

  // 2. SIMULATION SCENARIO
  static async getSimulation(req: Request, res: Response): Promise<void> {
    try {
      const { career } = req.params;
      const stepIndex = parseInt(req.query.step as string) || 0;

      const step = AIService.getSimulationStep(career, stepIndex);
      if (!step) {
        res.status(404).json({ error: 'Simulation step not found.' });
        return;
      }

      res.status(200).json(step);
    } catch (err) {
      res.status(500).json({ error: 'Simulation scenario loading failed.' });
    }
  }

  // 3. PLACEMENT PREDICTOR
  static async predictPlacement(req: Request, res: Response): Promise<void> {
    try {
      const { cgpa, skills, projects, internships } = req.body;
      if (cgpa === undefined || !skills) {
        res.status(400).json({ error: 'CGPA and skills are required.' });
        return;
      }

      const prediction = AIService.predictPlacement({
        cgpa: parseFloat(cgpa),
        skills,
        projects: parseInt(projects) || 0,
        internships: parseInt(internships) || 0
      });

      res.status(200).json(prediction);
    } catch (err) {
      res.status(500).json({ error: 'Placement model evaluation failed.' });
    }
  }

  // 4. SKILL GAP ANALYZER
  static async analyzeSkills(req: Request, res: Response): Promise<void> {
    try {
      const { resumeText, targetRole } = req.body;
      if (!resumeText || !targetRole) {
        res.status(400).json({ error: 'Resume text and target role are required.' });
        return;
      }

      const report = AIService.analyzeSkillGap(resumeText, targetRole);
      res.status(200).json(report);
    } catch (err) {
      res.status(500).json({ error: 'Skill analysis failed.' });
    }
  }

  // 5. ROADMAP GENERATION
  static async generateRoadmap(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;
      const { career } = req.body;

      if (!career) {
        res.status(400).json({ error: 'Career domain is required.' });
        return;
      }

      const roadmapData = AIService.generateRoadmap(career);

      // Save roadmap details
      const record = await RoadmapRepository.findOneAndUpdate(
        { userId },
        { roadmapData },
        { upsert: true }
      );

      res.status(200).json({
        message: 'Roadmap generated successfully.',
        roadmap: roadmapData
      });
    } catch (err) {
      res.status(500).json({ error: 'Roadmap generation failed.' });
    }
  }

  // Get active roadmap
  static async getRoadmap(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;
      const record = await RoadmapRepository.findOne({ userId });
      if (!record) {
        res.status(404).json({ error: 'Roadmap not found.' });
        return;
      }
      res.status(200).json(record.roadmapData);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch roadmap.' });
    }
  }

  // 6. FUTURE CAREERS LIST
  static getFutureCareers(req: Request, res: Response): void {
    res.status(200).json(AIService.getFutureCareers());
  }

  // 7. GET COLLEGES BY FILTER
  static async matchColleges(req: Request, res: Response): Promise<void> {
    try {
      const { domain, maxFees, preferredLocation } = req.query;

      const matched = await AIService.searchColleges({
        domain: domain as string,
        maxFees: maxFees ? parseInt(maxFees as string) : undefined,
        location: preferredLocation as string
      });

      res.status(200).json(matched);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Colleges matching failed.' });
    }
  }
}
