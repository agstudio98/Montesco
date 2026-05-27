/**
 * @fileoverview Punto de entrada principal de la aplicación React.
 * Inicializa el DOM de React y renderiza el componente raíz dentro de StrictMode.
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

/**
 * Montaje de la aplicación en el elemento 'root'.
 * Se utiliza el operador '!' para asegurar a TypeScript que el elemento existe.
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
