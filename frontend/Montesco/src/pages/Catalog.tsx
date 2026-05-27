/**
 * @fileoverview Página de Catálogo.
 * Punto de entrada para la visualización y filtrado de productos.
 */

import React from 'react';
import { CatalogMain } from './Catalog/Main';
import { useTranslation } from 'react-i18next';

/**
 * Componente funcional de la página de Catálogo.
 * Organiza el layout principal y el título animado.
 * @returns {JSX.Element}
 */
const CatalogPageComponent = () => {
  const { t } = useTranslation();
  return (
    <main className="pt-32 px-6 max-w-7xl mx-auto min-h-screen">
      {/* Título de la sección con tipografía Anton */}
      <h1 className="text-6xl font-anton uppercase mb-12 text-montesco-black dark:text-montesco-white">
        {t('CATALOG.TITLE')}
      </h1>
      
      {/* Grilla principal del catálogo */}
      <CatalogMain />
    </main>
  );
};

export const Catalog = CatalogPageComponent;
