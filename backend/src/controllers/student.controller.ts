import { Request, Response } from 'express';
import { StudentProfileRepository, CareerAssessmentRepository } from '../models';
import { AIService } from '../services/ai.service';
import { CareerIntelligenceService } from '../services/careerIntelligence.service';

export class StudentController {
  // Get profile
  static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;
      const profile = await StudentProfileRepository.findOne({ userId });
      if (!profile) {
        res.status(404).json({ error: 'Profile not found' });
        return;
      }
      res.status(200).json(profile);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch profile' });
    }
  }

  // Update profile
  static async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;
      const { fullName, grade, school, skills, interests, cgpa } = req.body;

      const profile = await StudentProfileRepository.findOneAndUpdate(
        { userId },
        { fullName, grade, school, skills, interests, cgpa }
      );
      res.status(200).json(profile);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update profile' });
    }
  }

  // Submit assessment answers
  static async submitAssessment(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;
      const { answers } = req.body; // Map of question index -> 'A', 'B', 'C' etc.

      if (!answers) {
        res.status(400).json({ error: 'Answers are required.' });
        return;
      }

      const report = await AIService.evaluateDNA(answers);

      // Save assessment details
      const assessment = await CareerAssessmentRepository.findOneAndUpdate(
        { userId },
        {
          personality: report.personality,
          learningStyle: report.learningStyle,
          strengths: report.strengths,
          weaknesses: report.weaknesses,
          interestAreas: report.interestAreas,
          careerFit: report.careerFit
        },
        { upsert: true }
      );

      // Award XP points for completing assessment
      const profile = await StudentProfileRepository.findOne({ userId });
      if (profile) {
        let currentBadges = profile.badges || [];
        if (!currentBadges.includes('DNA Decoded')) {
          currentBadges.push('DNA Decoded');
        }
        await StudentProfileRepository.findOneAndUpdate(
          { userId },
          { 
            xp: (profile.xp || 0) + 150, 
            badges: currentBadges 
          }
        );
      }

      res.status(200).json({
        message: 'Assessment evaluated and recorded.',
        assessment: report
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to submit assessment.' });
    }
  }

  // Get assessment details
  static async getAssessment(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;
      const assessment = await CareerAssessmentRepository.findOne({ userId });
      if (!assessment) {
        res.status(404).json({ error: 'Assessment not found. Please complete the DNA assessment first.' });
        return;
      }
      res.status(200).json(assessment);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch assessment.' });
    }
  }

  // Increment XP for completing tasks (Gamification)
  static async awardXP(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;
      const { xp, badge } = req.body;

      const profile = await StudentProfileRepository.findOne({ userId });
      if (!profile) {
        res.status(404).json({ error: 'Profile not found.' });
        return;
      }

      const updatedBadges = [...(profile.badges || [])];
      if (badge && !updatedBadges.includes(badge)) {
        updatedBadges.push(badge);
      }

      const updatedProfile = await StudentProfileRepository.findOneAndUpdate(
        { userId },
        {
          xp: (profile.xp || 0) + (xp || 50),
          badges: updatedBadges,
          streak: (profile.streak || 0) + 1
        }
      );

      res.status(200).json({
        message: 'XP and streak updated!',
        profile: updatedProfile
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to award XP.' });
    }
  }

  // ----------------------------------------------------------------
  // 🧬 CAREER TWIN INTELLIGENCE CONTROLLERS
  // ----------------------------------------------------------------

  // Get active Career Twin
  static async getCareerTwin(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;
      const twin = await CareerIntelligenceService.getCareerTwin(userId);
      res.status(200).json(twin);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch Career Twin: ' + err.message });
    }
  }

  // Set Target Career
  static async updateTargetCareer(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;
      const { targetCareer } = req.body;
      if (!targetCareer) {
        res.status(400).json({ error: 'targetCareer is required' });
        return;
      }
      const twin = await CareerIntelligenceService.updateTargetCareer(userId, targetCareer);
      res.status(200).json(twin);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update target career: ' + err.message });
    }
  }

  // Process Behavioral Simulation Decision
  static async recordSimulationDecision(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;
      const { id, title, choice, choiceText, latencySeconds } = req.body;

      if (!choice) {
        res.status(400).json({ error: 'choice (A, B, or C) is required' });
        return;
      }

      const result = await CareerIntelligenceService.processSimulationDecision(userId, {
        id: id || 'sim-1',
        title: title || 'Production Incident',
        choice,
        choiceText: choiceText || '',
        latencySeconds: latencySeconds || 15
      });

      res.status(200).json(result);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to record simulation decision: ' + err.message });
    }
  }

  // What-If Career Trajectory Simulator
  static async runWhatIf(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;
      const { projectsDelta, internshipsDelta, verifiedSkillDelta } = req.body;

      const twin = await CareerIntelligenceService.getCareerTwin(userId);
      const projection = CareerIntelligenceService.simulateWhatIf(twin, {
        projectsDelta: Number(projectsDelta) || 0,
        internshipsDelta: Number(internshipsDelta) || 0,
        verifiedSkillDelta: Number(verifiedSkillDelta) || 0
      });

      res.status(200).json(projection);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to run What-If simulation: ' + err.message });
    }
  }

  // Complete Daily Mission
  static async completeMission(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;
      const twin = await CareerIntelligenceService.completeMission(userId);
      res.status(200).json({ message: 'Daily Mission completed!', twin });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to complete mission: ' + err.message });
    }
  }

  // Skill Verification
  static async verifySkill(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;
      const { skillName, score } = req.body;
      if (!skillName || typeof score !== 'number') {
        res.status(400).json({ error: 'skillName and score are required' });
        return;
      }
      const twin = await CareerIntelligenceService.verifySkill(userId, skillName, score);
      res.status(200).json({ message: 'Skill verified successfully!', twin });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to verify skill: ' + err.message });
    }
  }
}
