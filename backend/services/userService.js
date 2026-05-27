/**
 * @fileoverview Servicio para la gestión de usuarios.
 * Aplica principios SOLID: SRP y DIP.
 */

import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import AppError from '../utils/AppError.js';

class UserService {
  /**
   * Verifica si la base de datos está lista.
   * @private
   */
  _checkDatabase() {
    if (mongoose.connection.readyState !== 1) {
      throw new AppError('La base de datos no está lista. Intenta más tarde.', 503);
    }
  }

  /**
   * Genera un token JWT.
   * @param {string} id - ID del usuario.
   * @returns {string}
   */
  generateToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });
  }

  /**
   * Autentica un usuario.
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<Object>}
   */
  async login(email, password) {
    this._checkDatabase();

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const userResponse = user.toObject();
      delete userResponse.password;
      return {
        ...userResponse,
        token: this.generateToken(user._id),
      };
    }

    throw new AppError('Credenciales inválidas. Por favor, revisa tu email y contraseña.', 401);
  }

  /**
   * Registra un nuevo usuario.
   * @param {Object} userData 
   * @returns {Promise<Object>}
   */
  async register(userData) {
    this._checkDatabase();

    const { name, email, password } = userData;
    const userExists = await User.findOne({ email });

    if (userExists) {
      throw new AppError('Este correo electrónico ya está registrado.', 400);
    }

    const user = await User.create({ name, email, password });

    if (user) {
      const userResponse = user.toObject();
      delete userResponse.password;
      return {
        ...userResponse,
        token: this.generateToken(user._id),
      };
    }

    throw new AppError('Datos de usuario inválidos.', 400);
  }

  /**
   * Actualiza el perfil de un usuario.
   * @param {string} id 
   * @param {Object} updateData 
   * @returns {Promise<Object>}
   */
  async updateProfile(id, updateData) {
    const user = await User.findById(id);

    if (!user) {
      throw new AppError('Usuario no encontrado', 404);
    }

    // Campos permitidos para actualización
    const allowedUpdates = ['name', 'email', 'address', 'profileImage', 'password', 'paymentMethods', 'twoFactorEnabled'];
    
    allowedUpdates.forEach((field) => {
      if (updateData[field] !== undefined) {
        user[field] = updateData[field];
      }
    });

    const updatedUser = await user.save();
    const userResponse = updatedUser.toObject();
    delete userResponse.password;

    return {
      ...userResponse,
      token: this.generateToken(updatedUser._id),
    };
  }
}

export default new UserService();
