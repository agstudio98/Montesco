/**
 * @fileoverview Sección Hero (Main) de la Landing Page.
 * Presenta el título principal y slogan con una imagen de fondo inmersiva.
 */

import React from 'react';
import { withTranslation, type WithTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

/**
 * @interface Props
 * Propiedades inyectadas por i18next.
 */
interface Props extends WithTranslation {}

/**
 * Componente Hero de la Home.
 * Utiliza Framer Motion para una entrada suave y efectos de fondo con desenfoque.
 */
class MainComponent extends React.Component<Props> {
  render() {
    const { t } = this.props;
    return (
      <section className="min-h-screen flex flex-col justify-center items-center text-center p-6 bg-[url('https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2000')] bg-cover bg-center relative">
        {/* Overlay oscuro para mejorar la legibilidad del texto */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <h1 className="text-7xl md:text-9xl font-arsenal font-bold text-white tracking-tighter mb-4">
            {t('HOME.MAIN.TITLE')}
          </h1>
          <p className="text-xl md:text-3xl font-rem text-white/90 max-w-2xl mx-auto">
            {t('HOME.MAIN.SLOGAN')}
          </p>
        </motion.div>
      </section>
    );
  }
}

export const Main = withTranslation()(MainComponent);
