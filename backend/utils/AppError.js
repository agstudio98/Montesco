/**
 * @fileoverview Clase personalizada para el manejo de errores operacionales.
 * Sigue el principio de Responsabilidad Única (SRP).
 */

class AppError extends Error {
  /**
   * @param {string} message - Mensaje de error.
   * @param {number} statusCode - Código de estado HTTP.
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
