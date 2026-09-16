import { Router } from 'express';
import { StudentController } from '../controllers/student.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateJWT);

router.get('/profile', StudentController.getProfile);
router.put('/profile', StudentController.updateProfile);
router.post('/assessment', StudentController.submitAssessment);
router.get('/assessment', StudentController.getAssessment);
router.post('/xp', StudentController.awardXP);

export default router;
