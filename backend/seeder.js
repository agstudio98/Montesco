/**
 * @fileoverview Script para la siembra (seeding) de la base de datos.
 * Proporciona datos iniciales para desarrollo.
 * Sigue el principio SRP al enfocarse solo en la población de datos.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Product from './models/Product.js';
import connectDB from './config/db.js';

dotenv.config();

/**
 * Importa datos iniciales a la base de datos.
 * Limpia las colecciones antes de insertar.
 */
const importData = async () => {
  try {
    await connectDB();

    // Limpieza de datos existentes
    await Product.deleteMany();
    await User.deleteMany();

    console.log('[SEEDER] Colecciones limpias...');

    // Creación de usuarios de prueba
    const users = [
      { 
        name: 'Admin Montesco', 
        email: 'admin@montesco.com', 
        password: 'password123', 
        isAdmin: true 
      },
      { 
        name: 'Cliente Demo', 
        email: 'cliente@example.com', 
        password: 'password123' 
      },
    ];

    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;

    // Productos iniciales de alta calidad
    const sampleProducts = [
      {
        user: adminUser,
        name: 'Silla Velvet Esmeralda',
        image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=800',
        brand: 'Montesco Premium',
        category: 'Muebles',
        description: 'Silla de terciopelo con patas de metal dorado, ideal para comedores modernos y elegantes.',
        price: 185,
        countInStock: 10,
      },
      {
        user: adminUser,
        name: 'Lámpara de Pie Órbita',
        image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=800',
        brand: 'Montesco Light',
        category: 'Iluminación',
        description: 'Iluminación cálida con diseño minimalista y acabado en negro mate.',
        price: 120,
        countInStock: 7,
      },
      {
        user: adminUser,
        name: 'Mesa de Centro Roble',
        image: 'https://images.unsplash.com/photo-1530018607912-eff2df114f11?q=80&w=800',
        brand: 'Montesco Wood',
        category: 'Muebles',
        description: 'Madera maciza con acabado natural, perfecta para salas de estar contemporáneas.',
        price: 340,
        countInStock: 5,
      },
      {
        user: adminUser,
        name: 'Sofá Nube Modular',
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800',
        brand: 'Montesco Comfort',
        category: 'Muebles',
        description: 'Máxima comodidad con módulos configurables y tela de alta resistencia.',
        price: 1250,
        countInStock: 3,
      },
      {
        user: adminUser,
        name: 'Espejo de Pared Sol',
        image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=800',
        brand: 'Montesco Decor',
        category: 'Decoración',
        description: 'Refleja la luz y amplía visualmente tu hogar con este diseño artesanal.',
        price: 95,
        countInStock: 12,
      },
      {
        user: adminUser,
        name: 'Alfombra de Lana Nórdica',
        image: 'https://images.unsplash.com/photo-1575414003591-ece8d0416c7a?q=80&w=800',
        brand: 'Montesco Soft',
        category: 'Decoración',
        description: 'Calidez para tus pies con fibras naturales y diseño escandinavo.',
        price: 280,
        countInStock: 15,
      }
    ];

    await Product.insertMany(sampleProducts);

    console.log('\x1b[32m%s\x1b[0m', '¡DATOS IMPORTADOS EXITOSAMENTE! 🌱');
    process.exit();
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', `[ERROR SEEDER]: ${error.message}`);
    process.exit(1);
  }
};

/**
 * Destruye todos los datos de las colecciones principales.
 */
const destroyData = async () => {
  try {
    await connectDB();

    await Product.deleteMany();
    await User.deleteMany();

    console.log('\x1b[31m%s\x1b[0m', '¡DATOS DESTRUIDOS! 🗑️');
    process.exit();
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', `[ERROR SEEDER]: ${error.message}`);
    process.exit(1);
  }
};

// Lógica de ejecución basada en argumentos de CLI
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
