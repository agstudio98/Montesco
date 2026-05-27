/**
 * @fileoverview Componente de Carrusel de Imágenes para la Home.
 * Implementa una transición automática de banners con controles visuales.
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { withTranslation, type WithTranslation } from 'react-i18next';

/**
 * @interface Props
 * Propiedades de traducción.
 */
interface Props extends WithTranslation {}

/**
 * Componente Carrousel (Clase).
 * Maneja su propio ciclo de vida para el temporizador de auto-scroll.
 */
class CarrouselComponent extends React.Component<Props, { current: number }> {
  timer: any = null;

  constructor(props: Props) {
    super(props);
    this.state = { current: 0 };
  }

  /**
   * Imágenes destacadas del carrusel.
   */
  images = [
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2000',
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=2000',
  ];

  /**
   * Inicia el temporizador de cambio de imagen al montar el componente.
   */
  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState({ current: (this.state.current + 1) % this.images.length });
    }, 5000);
  }

  /**
   * Limpia el temporizador para evitar fugas de memoria.
   */
  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    const { t } = this.props;
    return (
      <section className="py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto h-[600px] rounded-[40px] relative overflow-hidden shadow-2xl">
          {/* Animación de Transición de Imagen */}
          <AnimatePresence mode="wait">
            <motion.img 
              key={this.state.current}
              src={this.images[this.state.current]}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>
          
          {/* Overlay y Contenido de Texto */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-16 left-16 text-white max-w-lg">
            <h4 className="text-4xl font-anton uppercase mb-4">{t('HOME.CARROUSEL.TITLE')}</h4>
            <p className="font-rem text-white/80">{t('HOME.CARROUSEL.SUBTITLE')}</p>
          </div>
          
          {/* Indicadores de Posición */}
          <div className="absolute bottom-16 right-16 flex space-x-4">
             {this.images.map((_, i) => (
               <div 
                 key={i} 
                 className={`h-2 transition-all duration-300 rounded-full ${i === this.state.current ? 'w-12 bg-white' : 'w-2 bg-white/30'}`}
               ></div>
             ))}
          </div>
        </div>
      </section>
    );
  }
}

export const Carrousel = withTranslation()(CarrouselComponent);
