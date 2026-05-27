/**
 * @fileoverview Componente de Pie de Página (Footer).
 * Implementado como un componente de clase para demostrar versatilidad y compatibilidad con i18n HOC.
 */

import React from 'react';
import { withTranslation, type WithTranslation } from 'react-i18next';

/**
 * @interface FooterProps
 * Incluye las propiedades de traducción inyectadas por withTranslation.
 */
interface FooterProps extends WithTranslation {}

/**
 * Clase FooterComponent.
 * Renderiza información de contacto, redes sociales y copyright.
 */
class FooterComponent extends React.Component<FooterProps> {
  render() {
    const { t } = this.props;
    const year = new Date().getFullYear();

    return (
      <footer className="w-full glass dark:glass-dark mt-20 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Logo y Descripción */}
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-2xl font-arsenal font-bold tracking-tighter text-montesco-black dark:text-montesco-white">MONTESCO</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 max-w-xs text-center md:text-left">
              {t('FOOTER.DESCRIPTION')}
            </p>
          </div>

          {/* Copyright y Redes */}
          <div className="flex flex-col items-center md:items-end">
             <p className="font-rem text-sm text-montesco-black dark:text-montesco-white">
               © {year} Ag Studio's. {t('FOOTER.RIGHTS')}
             </p>
             <div className="flex space-x-6 mt-4">
               <a href="#" className="hover:opacity-70 transition-opacity">Instagram</a>
               <a href="#" className="hover:opacity-70 transition-opacity">Pinterest</a>
               <a href="#" className="hover:opacity-70 transition-opacity">Twitter</a>
             </div>
          </div>
        </div>
      </footer>
    );
  }
}

/**
 * Exportación del componente envuelto en el HOC de traducción.
 */
export const Footer = withTranslation()(FooterComponent);
