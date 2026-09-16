import { Router } from 'express';
import { AIController } from '../controllers/ai.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateJWT);

router.post('/chat', AIController.chat);
router.get('/simulation/:career', AIController.getSimulation);
router.post('/predict-placement', AIController.predictPlacement);
router.post('/analyze-skills', AIController.analyzeSkills);
router.post('/roadmap', AIController.generateRoadmap);
router.get('/roadmap', AIController.getRoadmap);
router.get('/future-careers', AIController.getFutureCareers);
router.get('/colleges', AIController.matchColleges);

export default router;
