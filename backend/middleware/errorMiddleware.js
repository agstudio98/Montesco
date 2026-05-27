/**
 * @fileoverview Manejador global de errores.
 * Centraliza la lógica de respuesta ante fallos.
 */

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    // Modo Producción: No filtrar detalles internos
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      // Error de programación o desconocido: No filtrar detalles al cliente
      console.error('ERROR 💥', err);
      res.status(500).json({
        status: 'error',
        message: 'Algo salió muy mal.',
      });
    }
  }
};

const notFound = (req, res, next) => {
  const error = new Error(`Ruta no encontrada - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export { errorHandler, notFound };
