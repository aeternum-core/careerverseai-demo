import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();

router.post('/register', AuthController.register);
router.post('/verify-otp', AuthController.verifyOTP);
router.post('/login', AuthController.login);
router.post('/google-login', AuthController.googleLogin);

export default router;
