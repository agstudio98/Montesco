/**
 * @fileoverview Middleware para envolver funciones asíncronas y capturar errores.
 * Elimina la necesidad de bloques try-catch repetitivos en controladores (Clean Code).
 */

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
