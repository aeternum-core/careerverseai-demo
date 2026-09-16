import { Router } from 'express';
import { CounselorController } from '../controllers/counselor.controller';
import { authenticateJWT, authorizeRoles } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateJWT);

router.get('/appointments', CounselorController.getAppointments);
router.post('/schedule', CounselorController.scheduleSession);
router.get('/students', authorizeRoles(['counselor', 'admin']), CounselorController.getStudentsList);

export default router;
