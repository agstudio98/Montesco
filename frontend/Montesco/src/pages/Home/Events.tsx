/**
 * @fileoverview Sección de Eventos y Experiencias.
 * Permite a los usuarios explorar eventos futuros con un modal detallado.
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, MapPin, X, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Componente funcional Events.
 * Gestiona el estado local del evento seleccionado para mostrar en el modal.
 * @returns {JSX.Element}
 */
export const Events: React.FC = () => {
  const { t } = useTranslation();
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  /**
   * Listado de eventos próximos de la marca.
   */
  const events = [
    { 
      id: 1, 
      title: 'Summer Design Expo', 
      date: '15 Jul 2026', 
      location: 'Buenos Aires',
      details: 'Una exposición exclusiva donde presentaremos nuestra nueva colección de verano. Habrá charlas con diseñadores destacados, música en vivo y descuentos especiales para los asistentes.'
    },
    { 
      id: 2, 
      title: 'Workshop: Minimalismo', 
      date: '02 Ago 2026', 
      location: 'Online',
      details: 'Aprende los principios del diseño minimalista aplicados al hogar y al estilo de vida. Este taller intensivo cubrirá desde la selección de materiales hasta la optimización de espacios pequeños.'
    },
    { 
      id: 3, 
      title: 'Montesco Night', 
      date: '20 Sep 2026', 
      location: 'Mendoza',
      details: 'Celebramos nuestro aniversario con una noche de gala en los viñedos. Degustación de vinos seleccionados, catering premium y presentación de productos exclusivos.'
    }
  ];

  return (
    <section className="py-24 px-6 bg-montesco-brown-dark text-white relative">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl font-anton uppercase mb-16">{t('HOME.EVENTS')}</h2>
        
        {/* Grilla de Eventos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map(event => (
            <motion.div 
              whileHover={{ scale: 1.02 }}
              key={event.id} 
              onClick={() => setSelectedEvent(event)}
              className="p-8 border border-white/20 rounded-3xl flex flex-col justify-between hover:bg-white/5 transition-colors cursor-pointer group h-full"
            >
              <div>
                <h3 className="text-3xl font-anton mb-4 group-hover:text-montesco-brown-light transition-colors">{event.title}</h3>
                <div className="flex flex-col space-y-3 text-white/70">
                  <span className="flex items-center gap-2 font-rem">
                    <Calendar size={18} className="text-montesco-brown-light" /> {event.date}
                  </span>
                  <span className="flex items-center gap-2 font-rem">
                    <MapPin size={18} className="text-montesco-brown-light" /> {event.location}
                  </span>
                </div>
              </div>
              <div className="mt-8 flex justify-between items-center">
                <span className="text-xs font-anton uppercase tracking-widest text-montesco-brown-light opacity-0 group-hover:opacity-100 transition-opacity">Ver Detalles</span>
                <div className="text-4xl font-anton opacity-20 group-hover:opacity-100 transition-opacity">→</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal de Detalle de Evento */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEvent(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            ></motion.div>
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-montesco-black rounded-[40px] overflow-hidden shadow-2xl p-10 md:p-14"
            >
              <button 
                onClick={() => setSelectedEvent(null)}
                className="absolute top-8 right-8 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-montesco-black dark:text-montesco-white transition-colors"
              >
                <X size={24} />
              </button>

              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-montesco-brown-dark rounded-2xl text-white">
                  <Info size={32} />
                </div>
                <div>
                  <h4 className="text-xs font-anton uppercase tracking-widest text-montesco-brown-dark opacity-60">Detalles del Evento</h4>
                  <h3 className="text-4xl font-anton uppercase text-montesco-black dark:text-montesco-white">{selectedEvent.title}</h3>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-10">
                <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10">
                  <span className="block text-[10px] font-anton uppercase text-gray-400 mb-2">Fecha</span>
                  <div className="flex items-center gap-3 text-montesco-black dark:text-montesco-white">
                    <Calendar size={20} className="text-montesco-brown-dark" />
                    <span className="font-rem font-bold">{selectedEvent.date}</span>
                  </div>
                </div>
                <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10">
                  <span className="block text-[10px] font-anton uppercase text-gray-400 mb-2">Ubicación</span>
                  <div className="flex items-center gap-3 text-montesco-black dark:text-montesco-white">
                    <MapPin size={20} className="text-montesco-brown-dark" />
                    <span className="font-rem font-bold">{selectedEvent.location}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-10">
                <h5 className="font-anton uppercase text-montesco-black dark:text-montesco-white tracking-widest text-sm">Descripción</h5>
                <p className="text-gray-500 dark:text-gray-400 font-rem leading-relaxed">
                  {selectedEvent.details}
                </p>
              </div>

              <button 
                onClick={() => setSelectedEvent(null)}
                className="w-full py-5 bg-montesco-brown-dark text-white rounded-2xl font-anton uppercase text-xl hover:shadow-2xl transition-all"
              >
                Cerrar
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
