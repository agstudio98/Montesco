/**
 * @fileoverview Modelo de Producto para Montesco.
 * Sigue el principio SOLID de Responsabilidad Única (SRP).
 */

import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: 'User' 
  },
  name: { 
    type: String, 
    required: [true, 'El nombre del producto es obligatorio'] 
  },
  image: { 
    type: String, 
    required: [true, 'La imagen del producto es obligatoria'] 
  },
  brand: { 
    type: String, 
    required: [true, 'La marca es obligatoria'] 
  },
  category: { 
    type: String, 
    required: [true, 'La categoría es obligatoria'] 
  },
  description: { 
    type: String, 
    required: [true, 'La descripción es obligatoria'] 
  },
  price: { 
    type: Number, 
    required: [true, 'El precio es obligatorio'], 
    default: 0 
  },
  countInStock: { 
    type: Number, 
    required: [true, 'El stock es obligatorio'], 
    default: 0 
  },
}, { 
  timestamps: true,
  versionKey: false 
});

const Product = mongoose.model('Product', productSchema);
export default Product;
