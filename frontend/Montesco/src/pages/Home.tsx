/**
 * @fileoverview Página de Inicio (Home).
 * Composición de múltiples secciones para presentar la marca Montesco.
 */

import React from 'react';
import { Main } from './Home/Main';
import { Who } from './Home/Who';
import { Slogans } from './Home/Slogans';
import { Timeline } from './Home/Timeline';
import { Top } from './Home/Top';
import { Events } from './Home/Events';
import { Pays } from './Home/Pays';
import { Carrousel } from './Home/Carrousel';

/**
 * Componente principal de la Landing Page.
 * Utiliza un layout vertical que apila las diferentes secciones de contenido.
 * @returns {JSX.Element}
 */
export const Home: React.FC = () => {
  return (
    <main className="pt-0">
      {/* Sección Hero con Hero Canvas interactivo */}
      <Main />
      
      {/* Sección 'Quiénes Somos' */}
      <Who />
      
      {/* Franjas con Slogans dinámicos */}
      <Slogans />
      
      {/* Línea de tiempo histórica de la marca */}
      <Timeline />
      
      {/* Productos Top / Destacados */}
      <Top />
      
      {/* Eventos y Blog */}
      <Events />
      
      {/* Métodos de pago aceptados */}
      <Pays />
      
      {/* Carrusel infinito de marcas/logos */}
      <Carrousel />
    </main>
  );
};
