/**
 * @fileoverview Sección de Productos Top (Featured Products).
 * Muestra una selección de productos destacados con efectos visuales modernos.
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
 * Componente Top.
 * Utiliza generadores de formas geométricas como placeholders estilizados.
 */
class TopComponent extends React.Component<Props> {
  render() {
    const { t } = this.props;
    
    /**
     * Datos mock de productos destacados para la Home.
     */
    const products = [
      { id: 4, name: 'Sofá Nube', price: '$1250', img: 'cloud' },
      { id: 5, name: 'Espejo Arco', price: '$95', img: 'mirror' },
      { id: 6, name: 'Alfombra Zen', price: '$280', img: 'rug' },
    ];

    return (
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-16">
          <h2 className="text-5xl font-anton uppercase tracking-tighter text-montesco-black dark:text-montesco-white">
            {t('HOME.TOP')}
          </h2>
          <button className="text-montesco-brown-dark dark:text-montesco-brown-light font-rem font-bold border-b-2 border-montesco-brown-dark pb-1 hover:opacity-70 transition-opacity">
            Ver todo
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {products.map((product) => (
            <motion.div 
              key={product.id}
              whileHover={{ y: -10 }}
              className="group card-modern bg-white dark:bg-montesco-glass-dark border border-gray-100 dark:border-white/10"
            >
              {/* Contenedor de Imagen con Efecto de Formas */}
              <div className="relative overflow-hidden aspect-[4/5] bg-gray-50 dark:bg-white/5 flex items-center justify-center p-12">
                <img 
                  src={`https://api.dicebear.com/9.x/shapes/svg?seed=${product.name}&backgroundColor=transparent&shapeColor=5D4037`} 
                  alt={product.name} 
                  className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110 dark:invert-[0.8] dark:sepia-[0.2]"
                />
                <div className="absolute bottom-6 right-6 p-4 glass rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="font-anton text-xl text-montesco-black">{product.price}</span>
                </div>
              </div>
              
              {/* Información del Producto */}
              <div className="p-8">
                <h3 className="text-2xl font-anton mb-2 text-montesco-black dark:text-montesco-white">{product.name}</h3>
                <p className="font-rem text-gray-500 uppercase tracking-widest text-xs">Colección 2026</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    );
  }
}

export const Top = withTranslation()(TopComponent);
