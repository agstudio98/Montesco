/**
 * @fileoverview Sección "Quiénes Somos" (Who) de la Landing Page.
 * Combina narrativa visual con estadísticas clave de la marca.
 */

import React from 'react';
import { withTranslation, type WithTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

/**
 * @interface Props
 * Propiedades de traducción.
 */
interface Props extends WithTranslation {}

/**
 * Componente Who.
 * Utiliza animaciones 'whileInView' para activarse al hacer scroll.
 */
class WhoComponent extends React.Component<Props> {
  render() {
    const { t } = this.props;
    return (
      <section className="py-24 px-6 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
        {/* Lado Izquierdo: Imagen Narrativa */}
        <motion.div 
           whileInView={{ opacity: 1, x: 0 }}
           initial={{ opacity: 0, x: -50 }}
           transition={{ duration: 0.6 }}
           className="w-full md:w-1/2"
        >
          <img 
            src="https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e?q=80&w=1000" 
            alt="Interior Montesco" 
            className="rounded-3xl shadow-2xl object-cover h-[500px] w-full"
          />
        </motion.div>
        
        {/* Lado Derecho: Texto y Estadísticas */}
        <motion.div 
           whileInView={{ opacity: 1, x: 0 }}
           initial={{ opacity: 0, x: 50 }}
           transition={{ duration: 0.6 }}
           className="w-full md:w-1/2"
        >
          <h2 className="text-5xl font-anton mb-6 text-montesco-black dark:text-montesco-white">
            {t('HOME.WHO.TITLE')}
          </h2>
          <p className="text-xl font-rem text-gray-600 dark:text-gray-300 leading-relaxed">
            {t('HOME.WHO.DESCRIPTION')}
          </p>
          
          <div className="mt-8 grid grid-cols-2 gap-6">
            <div className="p-6 glass dark:glass-dark rounded-2xl">
              <span className="text-3xl font-anton block text-montesco-black dark:text-montesco-white">10+</span>
              <span className="text-sm uppercase tracking-widest text-gray-500">Años de Exp</span>
            </div>
            <div className="p-6 glass dark:glass-dark rounded-2xl">
               <span className="text-3xl font-anton block text-montesco-black dark:text-montesco-white">5k+</span>
               <span className="text-sm uppercase tracking-widest text-gray-500">Clientes</span>
            </div>
          </div>
        </motion.div>
      </section>
    );
  }
}

export const Who = withTranslation()(WhoComponent);
