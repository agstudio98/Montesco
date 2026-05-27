/**
 * @fileoverview Modelo de Usuario para Montesco.
 * Sigue el principio SRP (Single Responsibility Principle) gestionando solo
 * la definición de datos y la seguridad básica de la cuenta (hashing de passwords).
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * @typedef {Object} PaymentMethod
 * @property {string} type - Tipo de tarjeta (visa, mastercard, mercadopago)
 * @property {string} number - Número de tarjeta enmascarado
 * @property {string} holder - Nombre del titular
 * @property {string} expiry - Fecha de vencimiento (MM/YY)
 * @property {boolean} isDefault - Indica si es el método de pago principal
 */

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'El nombre es obligatorio'] 
    },
    email: { 
        type: String, 
        required: [true, 'El correo electrónico es obligatorio'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: { 
        type: String, 
        required: [true, 'La contraseña es obligatoria'] 
    },
    isAdmin: { 
        type: Boolean, 
        required: true, 
        default: false 
    },
    profileImage: { 
        type: String, 
        default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' 
    },
    address: { 
        type: String, 
        default: '' 
    },
    paymentMethods: [{
        type: { type: String, enum: ['visa', 'mastercard', 'mercadopago'] },
        number: String,
        holder: String,
        expiry: String,
        isDefault: { type: Boolean, default: false }
    }],
    twoFactorEnabled: { 
        type: Boolean, 
        default: false 
    },
    twoFactorSecret: String
}, { 
    timestamps: true,
    versionKey: false // Limpia el campo __v interno de Mongoose
});

/**
 * Compara la contraseña ingresada con la contraseña hasheada en la BD.
 * @param {string} enteredPassword - Contraseña en texto plano.
 * @returns {Promise<boolean>} - Verdadero si coinciden.
 */
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * Middleware Pre-Save para hashear la contraseña antes de guardar.
 * Clean Code: Uso de async/await y retorno temprano (early return).
 */
userSchema.pre('save', async function() {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
export default User;
