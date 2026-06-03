/**
 * @fileoverview Punto de entrada de la aplicación Montesco.
 * Configura middleware, rutas y manejadores de errores globales.
 * Sigue el principio SOLID de Responsabilidad Única (SRP) al delegar
 * la lógica de negocio a servicios y controladores.
 */

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import connectDB from './config/db.js';

// Importación de rutas
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import supportRoutes from './routes/supportRoutes.js';

// Importación de middlewares personalizados
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

// Configuración de variables de entorno
dotenv.config();

// Conexión a la base de datos
connectDB();

const app = express();

/**
 * CONFIGURACIÓN DE PROXY PARA RENDER
 * Fundamental para que express-rate-limit obtenga la IP real del usuario
 * y no la del balanceador de carga de Render.
 */
app.set('trust proxy', 1);

/**
 * Middlewares de Seguridad y Utilidad
 */
app.use(helmet()); // Seguridad de encabezados HTTP

// Limitación de peticiones para prevenir ataques de fuerza bruta
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  message: {
    status: 'fail',
    message: 'Demasiadas peticiones desde esta IP, por favor intenta de nuevo en 15 minutos.'
  }
});

if (process.env.NODE_ENV === 'production') {
  app.use('/api/', limiter);
}

// Registro de peticiones en modo desarrollo
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

/**
 * Configuración de CORS
 * Define los orígenes permitidos para interactuar con la API.
 */
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://[::1]:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'https://montesco.onrender.com'
].filter(Boolean); // Filtra valores nulos/indefinidos si la variable no está seteada

app.use(cors({
  origin: (origin, callback) => {
    // Permite peticiones sin origen (como herramientas de postman/servidor a servidor)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`[CORS] Origen bloqueado: ${origin}`);
      callback(new Error('No permitido por la política CORS de Montesco'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
}));

// Parsing de cuerpos de petición
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

/**
 * Definición de Rutas
 */
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/support', supportRoutes);

// Ruta de salud de la API
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API Montesco está operativa',
    timestamp: new Date().toISOString()
  });
});

/**
 * Manejo de Errores Global
 * Clean Code: Centralización del manejo de excepciones.
 */
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`\x1b[32m%s\x1b[0m`, `[SERVIDOR] Montesco corriendo en puerto ${PORT}`);
  console.log(`[MODO] ${process.env.NODE_ENV}`);
});

/**
 * GRACEFUL SHUTDOWN (Apagado Limpio)
 */

// Manejo de cierres limpios enviados por Render (SIGTERM)
process.on('SIGTERM', () => {
  console.log('Señal recibida de Render. Apagando servidor Montesco de forma elegante...');
  server.close(() => {
    console.log(' Cerrado.');
    process.exit(0);
  });
});

// Manejo de errores no capturados
process.on('unhandledRejection', (err) => {
  console.error('Cerrando servidor...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
