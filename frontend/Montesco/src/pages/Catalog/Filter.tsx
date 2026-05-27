/**
 * @fileoverview Componente de Filtro para el Catálogo.
 * Proporciona una interfaz de búsqueda y selección de criterios para productos.
 */

import React from 'react';
import { withTranslation, type WithTranslation } from 'react-i18next';
import { Search, Filter } from 'lucide-react';

/**
 * @interface Props
 * Incluye propiedades de traducción de i18next.
 */
interface Props extends WithTranslation {}

/**
 * Clase FilterComponent.
 * Renderiza una barra de búsqueda y selectores de filtrado con diseño "glassmorphism".
 */
class FilterComponent extends React.Component<Props> {
  render() {
    const { t } = this.props;
    return (
      <div className="glass dark:glass-dark p-8 rounded-[30px] flex flex-col md:flex-row gap-6 items-center">
        {/* Input de Búsqueda con Icono */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder={t('CATALOG.SEARCH')}
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-black/20 border border-gray-100 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-montesco-brown-dark transition-all text-montesco-black dark:text-montesco-white"
          />
        </div>
        
        {/* Controles de Acción y Ordenamiento */}
        <div className="flex gap-4 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-4 glass dark:glass-dark rounded-2xl hover:bg-white/10 transition-colors text-montesco-black dark:text-montesco-white">
            <Filter size={18} /> {t('CATALOG.FILTER')}
          </button>
          
          <select className="flex-1 md:flex-none px-8 py-4 glass dark:glass-dark rounded-2xl appearance-none bg-transparent text-montesco-black dark:text-montesco-white outline-none cursor-pointer">
            <option className="bg-white dark:bg-montesco-black">Precio: Bajo a Alto</option>
            <option className="bg-white dark:bg-montesco-black">Precio: Alto a Bajo</option>
            <option className="bg-white dark:bg-montesco-black">Novedades</option>
          </select>
        </div>
      </div>
    );
  }
}

export const CatalogFilter = withTranslation()(FilterComponent);
