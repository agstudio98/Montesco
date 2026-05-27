/**
 * @fileoverview Rutas de Soporte y Chat para Montesco.
 */

import express from 'express';
import { chatWithGemini, getClaims } from '../controllers/supportController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route   POST /api/support/chat
 * @desc    Chat con el asistente virtual
 * @access  Público
 */
router.post('/chat', chatWithGemini);

/**
 * @route   GET /api/support/claims/:userId
 * @desc    Obtener reclamos de un usuario
 * @access  Privado
 */
router.get('/claims/:userId', protect, getClaims);

export default router;
