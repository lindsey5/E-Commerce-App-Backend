import express from 'express';
import { userRequireAuth } from  '../middleware/authMiddleware.js';
import { get_user, update_user } from '../controllers/userController.js';
const router = express.Router();

router.get('/', userRequireAuth, get_user);
router.put('/', userRequireAuth, update_user);

export default router;