import express from 'express';
import { create_item, get_item, get_items, update_item } from '../controllers/itemController.js';
const router = express.Router();

router.post('/', create_item);
router.get('/:id', get_item);
router.get('/product/:id', get_items);
router.put('/:id', update_item);

export default router;