import express from 'express';
import { add_to_cart, delete_cart_item, get_cart, update_cart_item } from '../controllers/cartController.js';
import { userRequireAuth } from  '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/', userRequireAuth, add_to_cart);
router.get('/', userRequireAuth, get_cart);
router.delete('/:id', userRequireAuth, delete_cart_item);
router.put('/:id', userRequireAuth, update_cart_item);

export default router;