import express from 'express';
import { createPaymentCheckout } from '../controllers/paymentController.js';
const router = express.Router();

router.post('/', createPaymentCheckout);

export default router;