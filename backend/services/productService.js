/**
 * @fileoverview Servicio para la gestión de productos.
 * Sigue el principio SOLID de Responsabilidad Única (SRP).
 */

import Product from '../models/Product.js';
import mongoose from 'mongoose';

class ProductService {
  /**
   * Obtiene el inventario ficticio de respaldo.
   * @param {string} lang - Idioma ('es' o 'en').
   * @returns {Array} - Lista de productos.
   */
  getFallbackInventory(lang = 'es') {
    return [
      { _id: 'p1', name: lang === 'es' ? 'Silla Velvet Esmeralda' : 'Emerald Velvet Chair', price: 185, category: 'Muebles', image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=800', description: 'Confort y estilo minimalista.' },
      { _id: 'p2', name: lang === 'es' ? 'Lámpara de Pie Órbita' : 'Orbit Floor Lamp', price: 120, category: 'Iluminación', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=800', description: 'Iluminación cálida para espacios modernos.' },
      { _id: 'p3', name: lang === 'es' ? 'Mesa de Centro Roble' : 'Oak Coffee Table', price: 340, category: 'Muebles', image: 'https://images.unsplash.com/photo-1530018607912-eff2df114f11?q=80&w=800', description: 'Madera maciza con acabado natural.' },
      { _id: 'p4', name: lang === 'es' ? 'Espejo de Pared Sol' : 'Sun Wall Mirror', price: 95, category: 'Decoración', image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=800', description: 'Refleja la luz y amplía tu hogar.' },
      { _id: 'p5', name: lang === 'es' ? 'Sofá Nube Modular' : 'Cloud Modular Sofa', price: 1250, category: 'Muebles', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800', description: 'Máxima comodidad en módulos configurables.' },
      { _id: 'p6', name: lang === 'es' ? 'Jarrón de Cerámica Zen' : 'Zen Ceramic Vase', price: 45, category: 'Decoración', image: 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?q=80&w=800', description: 'Pieza artesanal hecha a mano.' },
      { _id: 'p7', name: lang === 'es' ? 'Estantería Industrial' : 'Industrial Bookshelf', price: 210, category: 'Muebles', image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?q=80&w=800', description: 'Estructura de hierro y madera recuperada.' },
      { _id: 'p8', name: lang === 'es' ? 'Alfombra de Lana Nórdica' : 'Nordic Wool Rug', price: 280, category: 'Decoración', image: 'https://images.unsplash.com/photo-1575414003591-ece8d0416c7a?q=80&w=800', description: 'Calidez para tus pies con diseño escandinavo.' },
      { _id: 'p9', name: lang === 'es' ? 'Cuadro Abstracción Azul' : 'Blue Abstraction Painting', price: 150, category: 'Decoración', image: 'https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=800', description: 'Arte contemporáneo para tu salón.' },
      { _id: 'p10', name: lang === 'es' ? 'Escritorio de Nogal' : 'Walnut Desk', price: 420, category: 'Muebles', image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=800', description: 'Espacio de trabajo elegante y funcional.' },
      { _id: 'p11', name: lang === 'es' ? 'Lámpara de Techo Cristal' : 'Crystal Ceiling Lamp', price: 310, category: 'Iluminación', image: 'https://images.unsplash.com/photo-1543198126-a8ad8e47fb21?q=80&w=800', description: 'Elegancia radiante en cada detalle.' },
      { _id: 'p12', name: lang === 'es' ? 'Puff de Cuero Vintage' : 'Vintage Leather Ottoman', price: 135, category: 'Decoración', image: 'https://images.unsplash.com/photo-1567016432779-094069958ad5?q=80&w=800', description: 'Cuero genuino envejecido a mano.' }
    ];
  }

  /**
   * Obtiene todos los productos de la base de datos o el fallback.
   * @param {string} lang - Idioma para el fallback.
   * @returns {Promise<Array>}
   */
  async getAllProducts(lang) {
    let products = [];
    if (mongoose.connection.readyState === 1) {
      products = await Product.find({});
    }

    if (products.length === 0) {
      return this.getFallbackInventory(lang);
    }
    return products;
  }

  /**
   * Obtiene un producto por su ID.
   * @param {string} id - ID del producto.
   * @param {string} lang - Idioma para el fallback.
   * @returns {Promise<Object>}
   */
  async getProductById(id, lang) {
    let product = null;
    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id);
    }

    if (!product) {
      const fallback = this.getFallbackInventory(lang).find(p => p._id === id);
      return fallback;
    }
    return product;
  }
}

export default new ProductService();
