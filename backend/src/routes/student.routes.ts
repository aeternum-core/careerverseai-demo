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

// Career Twin Intelligence Endpoints
router.get('/career-twin', StudentController.getCareerTwin);
router.post('/career-twin/target', StudentController.updateTargetCareer);
router.post('/simulation/decision', StudentController.recordSimulationDecision);
router.post('/what-if', StudentController.runWhatIf);
router.post('/mission/complete', StudentController.completeMission);
router.post('/skill-verify', StudentController.verifySkill);

export default router;
