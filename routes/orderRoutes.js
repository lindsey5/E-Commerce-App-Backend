import express from 'express';
import { userRequireAuth } from '../middleware/authMiddleware.js';
import { create_order, get_orders } from '../controllers/orderController.js';
const router = express.Router();

router.post('/', userRequireAuth, create_order);
router.get('/', userRequireAuth, get_orders);

export default router;