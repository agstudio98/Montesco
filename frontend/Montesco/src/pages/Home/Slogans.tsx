/**
 * @fileoverview Sección de Slogans y Valores de Marca.
 * Muestra iconos y textos que resumen la propuesta de valor de Montesco.
 */

import React from 'react';
import { withTranslation, type WithTranslation } from 'react-i18next';
import { ShieldCheck, Star, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * @interface Props
 * Propiedades de traducción.
 */
interface Props extends WithTranslation {}

/**
 * Componente Slogans.
 * Implementa micro-interacciones de escala al pasar el ratón por encima.
 */
class SlogansComponent extends React.Component<Props> {
  render() {
    const { t } = this.props;
    
    /**
     * Lista de valores con sus respectivos iconos.
     */
    const slogans = [
      { icon: <ShieldCheck size={40} />, key: 'QUALITY' },
      { icon: <Zap size={40} />, key: 'PRICE' },
      { icon: <Star size={40} />, key: 'DESIGN' },
    ];

    return (
      <section className="py-20 bg-montesco-brown-light/10 dark:bg-montesco-black">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {slogans.map((slogan, index) => (
            <motion.div 
              key={index}
              whileHover={{ scale: 1.05 }}
              className="p-8 rounded-3xl glass dark:glass-dark flex flex-col items-center"
            >
              <div className="mb-6 text-montesco-brown-dark dark:text-montesco-brown-light">
                {slogan.icon}
              </div>
              <h3 className="text-2xl font-anton uppercase tracking-widest mb-2 text-montesco-black dark:text-montesco-white">
                {t(`HOME.SLOGANS.${slogan.key}`)}
              </h3>
            </motion.div>
          ))}
        </div>
      </section>
    );
  }
}

export const Slogans = withTranslation()(SlogansComponent);
