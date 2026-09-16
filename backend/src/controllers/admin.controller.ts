import { Request, Response } from 'express';
import { CollegeRepository, UserRepository, StudentProfileRepository, AppointmentRepository } from '../models';

export class AdminController {
  // 1. GET ANALYTICS OVERVIEW
  static async getAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const usersCount = (await UserRepository.find()).length;
      const profiles = await StudentProfileRepository.find();
      const appointments = await AppointmentRepository.find();
      
      const totalXP = profiles.reduce((sum, p) => sum + (p.xp || 0), 0);
      const activeStreaks = profiles.filter(p => p.streak > 1).length;

      res.status(200).json({
        totalUsers: usersCount,
        totalAppointments: appointments.length,
        accumulatedXP: totalXP,
        activeStreaks,
        registrationsTrend: [
          { month: 'Jan', count: 12 },
          { month: 'Feb', count: 19 },
          { month: 'Mar', count: 32 },
          { month: 'Apr', count: 56 },
          { month: 'May', count: 85 },
          { month: 'Jun', count: 120 }
        ],
        domainDistribution: [
          { name: 'Technology', value: 45 },
          { name: 'Science', value: 25 },
          { name: 'Commerce', value: 15 },
          { name: 'Arts', value: 10 },
          { name: 'Law', value: 5 }
        ]
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch analytics.' });
    }
  }

  // 2. CREATE NEW COLLEGE
  static async addCollege(req: Request, res: Response): Promise<void> {
    try {
      const { name, domain, ranking, fees, placementRate, location, facilities } = req.body;
      if (!name || !domain) {
        res.status(400).json({ error: 'Name and domain are required.' });
        return;
      }
      const newCollege = await CollegeRepository.create({
        name,
        domain,
        ranking: parseInt(ranking) || 10,
        fees: parseInt(fees) || 50000,
        placementRate: parseInt(placementRate) || 80,
        location: location || 'Unknown',
        facilities: facilities || []
      });
      res.status(201).json(newCollege);
    } catch (err) {
      res.status(500).json({ error: 'Failed to add college.' });
    }
  }
}
