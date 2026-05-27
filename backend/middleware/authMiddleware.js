/**
 * @fileoverview Middleware de autenticación y autorización.
 * Protege las rutas privadas verificando el token JWT.
 */

import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler.js';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';

/**
 * Middleware para proteger rutas.
 * Verifica si el usuario envió un token válido en los headers.
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Decodificar el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Obtener el usuario del token (excluyendo el password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        throw new AppError('El usuario perteneciente a este token ya no existe.', 401);
      }

      next();
    } catch (error) {
      console.error(error);
      throw new AppError('No autorizado, token fallido.', 401);
    }
  }

  if (!token) {
    throw new AppError('No autorizado, no hay token.', 401);
  }
});

/**
 * Middleware para restringir acceso solo a administradores.
 */
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    throw new AppError('No autorizado como administrador.', 403);
  }
};

export { protect, admin };
