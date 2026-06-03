/**
 * @fileoverview Interfaz de Chat de Soporte con el Asistente Virtual.
 * Permite comunicación fluida y generación automática de reportes de reclamo.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, Bot } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

/**
 * @typedef {Object} Message
 * @property {string} id - Identificador único.
 * @property {string} text - Contenido del mensaje.
 * @property {'user' | 'bot'} sender - Quién envió el mensaje.
 */

/**
 * Componente SupportChat.
 * Gestiona el envío de mensajes al servidor y el scroll automático al final.
 * @returns {JSX.Element}
 */
export const SupportChat: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  
  // Estado del historial de mensajes
  const [messages, setMessages] = useState<{ id: string; text: string; sender: 'user' | 'bot' }[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  /**
   * Carga el mensaje de bienvenida inicial.
   */
  useEffect(() => {
    setMessages([{ id: 'initial-1', text: t('SUPPORT.WELCOME_MSG'), sender: 'bot' }]);
  }, [t]);

  /**
   * Mantiene el scroll al final del chat cuando hay nuevos mensajes.
   */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  /**
   * Procesa el envío del mensaje del usuario y obtiene la respuesta del Bot.
   */
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { id: generateId(), text: userMessage, sender: 'user' }]);
    setInput('');
    setIsSending(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/support/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: messages,
          userId: user?._id || null,
          lang: i18n.language.split('-')[0]
        })
      });

      const data = await response.json();
      if (response.ok) {
        setMessages(prev => [...prev, { id: generateId(), text: data.text, sender: 'bot' }]);
        
        /**
         * Detección de reclamo: Si el bot genera un reporte, avisamos al componente Filter
         * para que actualice la lista de reclamos del usuario.
         */
        const keywords = ['reclamo', 'problema', 'falla', 'error', 'roto', 'dañado', 'demora', 'claim', 'broken'];
        if (keywords.some(k => userMessage.toLowerCase().includes(k))) {
           setTimeout(() => window.dispatchEvent(new Event('claimCreated')), 500);
        }
      } else {
        throw new Error(data.details || data.message);
      }
    } catch (err: any) {
      console.error('Chat Error:', err);
      setMessages(prev => [...prev, { 
        id: generateId(), 
        text: `Error: No se pudo conectar con el servidor de soporte. Intenta de nuevo más tarde.`, 
        sender: 'bot' 
      }]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="glass dark:glass-dark rounded-[40px] flex flex-col h-[600px] overflow-hidden shadow-2xl border border-white/5">
      {/* Cabecera del Chat */}
      <div className="p-8 border-b border-white/10 flex items-center gap-4 bg-montesco-brown-dark text-white">
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
          <Bot size={24} />
        </div>
        <div>
          <h3 className="font-anton uppercase tracking-widest">{t('SUPPORT.CHAT')}</h3>
          <p className="text-xs text-white/60 font-rem uppercase tracking-tighter">{t('SUPPORT.BOT_HINT')}</p>
        </div>
      </div>

      {/* Área de Mensajes */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 scroll-smooth">
        {messages.map((msg) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            key={msg.id} 
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] p-5 rounded-[30px] font-rem text-sm shadow-xl ${msg.sender === 'user' ? 'bg-montesco-brown-dark text-white rounded-tr-none' : 'bg-white dark:bg-white/10 text-montesco-black dark:text-montesco-white rounded-tl-none border border-white/5'}`}>
              {msg.text}
            </div>
          </motion.div>
        ))}
        {isSending && (
          <div className="flex justify-start">
             <div className="bg-white/5 dark:bg-white/10 text-montesco-brown-dark dark:text-montesco-brown-light p-4 rounded-3xl text-xs font-anton uppercase tracking-widest animate-pulse border border-white/5">
               {t('SUPPORT.SENDING')}
             </div>
          </div>
        )}
      </div>

      {/* Input de Mensaje */}
      <form onSubmit={handleSend} className="p-6 bg-white/5 border-t border-white/10 flex gap-4">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('SUPPORT.MESSAGE_PLACEHOLDER')}
          className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-montesco-brown-dark text-montesco-black dark:text-montesco-white font-rem"
        />
        <button 
          type="submit"
          disabled={isSending}
          className="p-4 bg-montesco-brown-dark text-white rounded-2xl hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100 shadow-lg"
        >
          <Send size={24} />
        </button>
      </form>
    </div>
  );
};
