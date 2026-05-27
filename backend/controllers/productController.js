/**
 * @fileoverview Controlador de Productos para Montesco.
 * Sigue el principio SOLID de Responsabilidad Única (SRP).
 */

import productService from '../services/productService.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';

/**
 * @desc    Obtener todos los productos
 * @route   GET /api/products
 * @access  Público
 */
const getProducts = asyncHandler(async (req, res) => {
  const lang = req.headers['accept-language']?.includes('en') ? 'en' : 'es';
  const products = await productService.getAllProducts(lang);
  
  res.status(200).json({
    status: 'success',
    results: products.length,
    data: products
  });
});

/**
 * @desc    Obtener producto por ID
 * @route   GET /api/products/:id
 * @access  Público
 */
const getProductById = asyncHandler(async (req, res) => {
  const lang = req.headers['accept-language']?.includes('en') ? 'en' : 'es';
  const product = await productService.getProductById(req.params.id, lang);

  if (!product) {
    throw new AppError('Producto no encontrado', 404);
  }

  res.status(200).json({
    status: 'success',
    data: product
  });
});

export { getProducts, getProductById };
