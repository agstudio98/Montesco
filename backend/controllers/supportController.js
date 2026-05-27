/**
 * @fileoverview Controlador de Soporte para Montesco.
 * Sigue el principio SOLID de Responsabilidad Única (SRP).
 */

import supportService from '../services/supportService.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Chat con el asistente virtual (Gemini Fallback)
 * @route   POST /api/support/chat
 * @access  Público
 */
const chatWithGemini = asyncHandler(async (req, res) => {
  const { message, userId, lang } = req.body;
  const response = await supportService.processChatMessage(message, userId, lang);

  res.status(200).json(response);
});

/**
 * @desc    Obtener reclamos de un usuario
 * @route   GET /api/support/claims/:userId
 * @access  Privado/Admin
 */
const getClaims = asyncHandler(async (req, res) => {
  const claims = await supportService.getUserClaims(req.params.userId);

  res.status(200).json({
    status: 'success',
    results: claims.length,
    data: claims
  });
});

export { chatWithGemini, getClaims };
