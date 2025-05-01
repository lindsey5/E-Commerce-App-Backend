import express from 'express';
import { create_product, get_products, get_product, update_product } from '../controllers/productController.js';
const router = express.Router();

router.post('/', create_product);
router.get('/', get_products);
router.get('/:id', get_product);
router.put('/:id', update_product);

export default router;