import { Request, Response } from 'express';
import { StudentProfileRepository, CareerAssessmentRepository } from '../models';
import { AIService } from '../services/ai.service';

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
}
