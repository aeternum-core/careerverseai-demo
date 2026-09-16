import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authenticateJWT, authorizeRoles } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateJWT);
router.use(authorizeRoles(['admin']));

router.get('/analytics', AdminController.getAnalytics);
router.post('/colleges', AdminController.addCollege);

export default router;
