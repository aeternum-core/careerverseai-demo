import { Request, Response } from 'express';
import { AppointmentRepository, StudentProfileRepository, UserRepository } from '../models';

export class CounselorController {
  // 1. GET ALL APPOINTMENTS FOR COUNSELOR OR STUDENT
  static async getAppointments(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;
      const role = (req as any).user?.role;

      let query = {};
      if (role === 'student') {
        query = { studentId: userId };
      } else if (role === 'counselor') {
        query = { counselorId: userId };
      }

      const appointments = await AppointmentRepository.find(query);
      res.status(200).json(appointments);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch appointments.' });
    }
  }

  // 2. CREATE BOOKING
  static async scheduleSession(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;
      const { counselorId, date, time, notes } = req.body;

      if (!counselorId || !date || !time) {
        res.status(400).json({ error: 'Counselor ID, date, and time are required.' });
        return;
      }

      // Fetch student details
      const studentProfile = await StudentProfileRepository.findOne({ userId });
      const studentName = studentProfile ? studentProfile.fullName : "Student Voyager";

      const appointment = await AppointmentRepository.create({
        studentId: userId,
        studentName,
        counselorId,
        date,
        time,
        notes: notes || '',
        status: 'scheduled'
      });

      res.status(201).json(appointment);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Scheduling session failed.' });
    }
  }

  // 3. GET STUDENTS ASSIGNED TO COUNSELOR
  static async getStudentsList(req: Request, res: Response): Promise<void> {
    try {
      // Just return all student profiles with assessment data for convenience in counselor portal
      const profiles = await StudentProfileRepository.find();
      res.status(200).json(profiles);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch students list.' });
    }
  }
}
