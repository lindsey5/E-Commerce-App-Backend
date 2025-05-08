import express from 'express';
import { sendSignupVerification, signup } from '../controllers/authController.js';
const router = express.Router();

router.post('/signup', signup);
router.post('/signup/verification-code', sendSignupVerification);

export default router;