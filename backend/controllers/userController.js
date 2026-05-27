/**
 * @fileoverview Controlador de Usuarios para Montesco.
 * Sigue el principio SOLID de Responsabilidad Única (SRP).
 */

import userService from '../services/userService.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Autenticar usuario y obtener token
 * @route   POST /api/users/login
 * @access  Público
 */
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await userService.login(email, password);

  res.status(200).json({
    status: 'success',
    data: user
  });
});

/**
 * @desc    Registrar un nuevo usuario
 * @route   POST /api/users
 * @access  Público
 */
const registerUser = asyncHandler(async (req, res) => {
  const user = await userService.register(req.body);

  res.status(201).json({
    status: 'success',
    data: user
  });
});

/**
 * @desc    Actualizar perfil de usuario
 * @route   PUT /api/users/profile
 * @access  Privado
 */
const updateUserProfile = asyncHandler(async (req, res) => {
  const userId = req.body.userId || req.params.id || req.user?._id;
  const updatedUser = await userService.updateProfile(userId, req.body);

  res.status(200).json({
    status: 'success',
    data: updatedUser
  });
});

export { authUser, registerUser, updateUserProfile };
