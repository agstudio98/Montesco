/**
 * @fileoverview Rutas de Productos para Montesco.
 */

import express from 'express';
import { getProducts, getProductById } from '../controllers/productController.js';

const router = express.Router();

/**
 * @route   GET /api/products
 * @desc    Obtener lista de productos
 * @access  Público
 */
router.route('/').get(getProducts);

/**
 * @route   GET /api/products/:id
 * @desc    Obtener detalle de un producto
 * @access  Público
 */
router.route('/:id').get(getProductById);

export default router;
