/**
 * @fileoverview Modelo de Método de Pago para Montesco.
 * Sigue el principio SOLID de Responsabilidad Única (SRP).
 */

import mongoose from 'mongoose';

const pagoSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'El nombre del método de pago es obligatorio'] 
  },
  description: { 
    type: String, 
    required: [true, 'La descripción es obligatoria'] 
  },
  enabled: { 
    type: Boolean, 
    default: true 
  },
}, { 
  timestamps: true,
  versionKey: false 
});

const Pago = mongoose.model('Pago', pagoSchema);
export default Pago;
