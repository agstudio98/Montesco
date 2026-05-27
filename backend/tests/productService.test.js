import * as dbHandler from './setup.js';
import productService from '../services/productService.js';
import Product from '../models/Product.js';
import mongoose from 'mongoose';

beforeAll(async () => await dbHandler.connect());
afterEach(async () => await dbHandler.clearDatabase());
afterAll(async () => await dbHandler.closeDatabase());

describe('Product Service', () => {
  it('should return fallback products when DB is empty', async () => {
    const products = await productService.getAllProducts('es');
    expect(products.length).toBeGreaterThan(0);
    expect(products[0]._id).toMatch(/^p/); // Mock IDs start with 'p'
  });

  it('should return products from DB when available', async () => {
    const userId = new mongoose.Types.ObjectId();
    const productData = {
      user: userId,
      name: 'Real Product',
      image: 'image.jpg',
      brand: 'Brand',
      category: 'Muebles',
      description: 'Desc',
      price: 100,
      countInStock: 5
    };
    await Product.create(productData);

    const products = await productService.getAllProducts('es');
    expect(products.length).toBe(1);
    expect(products[0].name).toBe('Real Product');
  });

  it('should return a product by ID from DB', async () => {
    const userId = new mongoose.Types.ObjectId();
    const product = await Product.create({
      user: userId,
      name: 'Real Product',
      image: 'image.jpg',
      brand: 'Brand',
      category: 'Muebles',
      description: 'Desc',
      price: 100,
      countInStock: 5
    });

    const foundProduct = await productService.getProductById(product._id.toString(), 'es');
    expect(foundProduct).toBeDefined();
    expect(foundProduct.name).toBe('Real Product');
  });

  it('should return a fallback product by ID if not in DB', async () => {
    const fallbackProduct = await productService.getProductById('p1', 'es');
    expect(fallbackProduct).toBeDefined();
    expect(fallbackProduct._id).toBe('p1');
    expect(fallbackProduct.name).toBe('Silla Velvet Esmeralda');
  });
});
