import express from 'express';
import { create_tag, get_tags } from '../controllers/tagController.js';
const router = express.Router();

router.post('/', create_tag);
router.get('/', get_tags);

export default router;