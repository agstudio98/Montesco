/**
 * @fileoverview Modelo de Soporte/Reclamo para Montesco.
 * Sigue el principio SOLID de Responsabilidad Única (SRP).
 */

import mongoose from 'mongoose';

const supportSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  name: { 
    type: String, 
    required: [true, 'El nombre es obligatorio'] 
  },
  email: { 
    type: String, 
    required: [true, 'El correo electrónico es obligatorio'] 
  },
  subject: { 
    type: String, 
    required: [true, 'El asunto es obligatorio'] 
  },
  message: { 
    type: String, 
    required: [true, 'El mensaje es obligatorio'] 
  },
  status: { 
    type: String, 
    required: true, 
    enum: ['pending', 'in-progress', 'resolved', 'closed'],
    default: 'pending' 
  },
}, { 
  timestamps: true,
  versionKey: false 
});

const Support = mongoose.model('Support', supportSchema);
export default Support;
