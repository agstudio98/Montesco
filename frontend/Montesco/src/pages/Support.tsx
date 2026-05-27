/**
 * @fileoverview Página de Soporte al Cliente.
 * Centraliza el acceso al Asistente Virtual y la gestión de reclamos.
 */

import React from 'react';
import { SupportChat } from './Support/Chat';
import { SupportFilter } from './Support/Filter'; // Importación implícita correcta
import { useTranslation } from 'react-i18next';

/**
 * Componente funcional de la página de Soporte.
 * Estructura en dos columnas: Chat interactivo y Listado de Tickets.
 * @returns {JSX.Element}
 */
export const Support: React.FC = () => {
  const { t } = useTranslation();

  return (
    <main className="pt-32 px-6 max-w-7xl mx-auto min-h-screen">
      <h1 className="text-6xl font-anton uppercase mb-12 text-center text-montesco-black dark:text-montesco-white">
        {t('SUPPORT.TITLE')}
      </h1>
      
      {/* Layout de Soporte: Chat + Historial de Reclamos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        <SupportChat />
        <SupportFilter />
      </div>
    </main>
  );
};
