/**
 * @fileoverview Modelo de Sucursal para Montesco.
 * Sigue el principio SOLID de Responsabilidad Única (SRP).
 */

import mongoose from 'mongoose';

const sucursalSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'El nombre de la sucursal es obligatorio'] 
  },
  address: { 
    type: String, 
    required: [true, 'La dirección es obligatoria'] 
  },
  phone: { 
    type: String, 
    required: [true, 'El teléfono es obligatorio'] 
  },
  city: { 
    type: String, 
    required: [true, 'La ciudad es obligatoria'] 
  },
}, { 
  timestamps: true,
  versionKey: false 
});

const Sucursal = mongoose.model('Sucursal', sucursalSchema);
export default Sucursal;
