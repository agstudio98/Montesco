/**
 * @fileoverview Modelo de Modo de Compra para Montesco.
 * Sigue el principio SOLID de Responsabilidad Única (SRP).
 */

import mongoose from 'mongoose';

const modoCompraSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'El nombre del modo de compra es obligatorio'] 
  },
  description: { 
    type: String, 
    required: [true, 'La descripción es obligatoria'] 
  },
}, { 
  timestamps: true,
  versionKey: false 
});

const ModoCompra = mongoose.model('ModoCompra', modoCompraSchema);
export default ModoCompra;
