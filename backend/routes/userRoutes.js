/**
 * @fileoverview Rutas de Usuario para Montesco.
 */

import express from 'express';
import { authUser, registerUser, updateUserProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rutas públicas
router.post('/', registerUser);
router.post('/login', authUser);

// Rutas protegidas
router.route('/profile').put(protect, updateUserProfile);
router.route('/profile/:id').put(protect, updateUserProfile);

export default router;
