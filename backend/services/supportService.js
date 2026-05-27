/**
 * @fileoverview Servicio para el sistema de soporte y chat.
 * Sigue el principio SOLID de Responsabilidad Única (SRP).
 */

import Support from '../models/Support.js';
import User from '../models/User.js';
import mongoose from 'mongoose';
import AppError from '../utils/AppError.js';

class SupportService {
  constructor() {
    this.responses = {
      es: [
        {
          keywords: ['pago', 'pagar', 'metodo', 'tarjeta', 'visa', 'mastercard', 'mercadopago'],
          text: 'En Montesco aceptamos Visa, Mastercard y Mercado Pago. Puedes gestionar tus métodos de pago desde tu perfil en la sección "Pagos".'
        },
        {
          keywords: ['funcionamiento', 'funciona', 'como', 'ayuda', 'guia'],
          text: '¡Es muy simple! Navega por nuestro catálogo, añade tus productos al carrito y finaliza la compra. Si tienes cuenta, tus datos se guardarán para futuras compras.'
        },
        {
          keywords: ['sucursal', 'donde', 'ubicacion', 'tienda', 'fisica'],
          text: 'Contamos con varias sucursales. Puedes ver la lista completa en la sección de "Sucursales" en nuestro sitio web.'
        },
        {
          keywords: ['envio', 'demora', 'pedido', 'entrega', 'cuanto'],
          text: 'Los envíos suelen demorar entre 2 y 5 días hábiles dependiendo de tu ubicación. Recibirás un correo con el seguimiento una vez despachado.'
        },
        {
          keywords: ['hola', 'buen', 'dia', 'tarde', 'noche', 'saludos'],
          text: '¡Hola! Soy el asistente virtual de Montesco. ¿En qué puedo ayudarte hoy? (Prueba preguntando sobre pagos, envíos o funcionamiento).'
        }
      ],
      en: [
        {
          keywords: ['payment', 'pay', 'method', 'card', 'visa', 'mastercard', 'mercadopago'],
          text: 'At Montesco we accept Visa, Mastercard, and Mercado Pago. You can manage your payment methods from your profile in the "Payments" section.'
        },
        {
          keywords: ['operation', 'how it works', 'help', 'guide', 'works'],
          text: "It's very simple! Browse our catalog, add products to your cart, and checkout. If you have an account, your details will be saved for future purchases."
        },
        {
          keywords: ['branch', 'where', 'location', 'store', 'physical'],
          text: 'We have several branches. You can see the full list in the "Branches" section on our website.'
        },
        {
          keywords: ['shipping', 'delay', 'order', 'delivery', 'how long'],
          text: 'Shipping usually takes between 2 and 5 business days depending on your location. You will receive a tracking email once dispatched.'
        },
        {
          keywords: ['hello', 'hi', 'morning', 'afternoon', 'evening', 'greetings'],
          text: 'Hello! I am Montesco\'s virtual assistant. How can I help you today? (Try asking about payments, shipping, or how it works).'
        }
      ]
    };

    this.claimKeywords = {
      es: ['reclamo', 'problema', 'falla', 'error', 'roto', 'dañado', 'mal estado'],
      en: ['claim', 'problem', 'fault', 'error', 'broken', 'damaged', 'bad condition']
    };
  }

  /**
   * Procesa un mensaje de chat y devuelve una respuesta.
   * @param {string} message 
   * @param {string} userId 
   * @param {string} lang 
   * @returns {Promise<Object>}
   */
  async processChatMessage(message, userId, lang = 'es') {
    const currentLang = this.responses[lang] ? lang : 'es';
    const lowerMsg = message.toLowerCase();

    let botResponse = currentLang === 'es'
      ? 'Lo siento, no entiendo tu consulta. Prueba con palabras como "pago", "envío" o "ayuda".'
      : 'I am sorry, I do not understand your inquiry. Try using words like "payment", "shipping", or "help".';

    for (const item of this.responses[currentLang]) {
      if (item.keywords.some(k => lowerMsg.includes(k))) {
        botResponse = item.text;
        break;
      }
    }

    const isClaim = this.claimKeywords[currentLang].some(k => lowerMsg.includes(k));

    if (isClaim) {
      botResponse = currentLang === 'es'
        ? 'He detectado que tienes un problema. He generado un reporte automático y un agente se pondrá en contacto pronto.'
        : 'I have detected that you have a problem. I have generated an automatic report and an agent will contact you soon.';

      if (userId && mongoose.Types.ObjectId.isValid(userId)) {
        const user = await User.findById(userId);
        if (user) {
          await Support.create({
            user: userId,
            name: user.name,
            email: user.email,
            subject: currentLang === 'es' ? 'Reporte Automático Chat' : 'Chat Automatic Report',
            message: message,
            status: 'pending'
          });
        }
      }
    }

    return { text: botResponse };
  }

  /**
   * Obtiene los reclamos de un usuario.
   * @param {string} userId 
   * @returns {Promise<Array>}
   */
  async getUserClaims(userId) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new AppError('ID de usuario inválido', 400);
    }
    return await Support.find({ user: userId }).sort({ createdAt: -1 });
  }
}

export default new SupportService();
