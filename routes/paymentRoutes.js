import express from 'express';
import { createPaymentCheckout } from '../controllers/paymentController.js';
import { userRequireAuth } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/', userRequireAuth, createPaymentCheckout);

export default router;