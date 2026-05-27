/**
 * @fileoverview Contexto para el manejo del Tema (Modo Claro/Oscuro).
 * Sincroniza la preferencia del usuario con localStorage y el DOM.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * @typedef {'light' | 'dark'} Theme
 */
type Theme = 'light' | 'dark';

/**
 * @typedef {Object} ThemeContextType
 * @property {Theme} theme - Tema actual.
 * @property {function} toggleTheme - Alterna entre claro y oscuro.
 */
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Proveedor de Tema que gestiona la clase 'dark' en el elemento raíz del DOM.
 * @param {Object} props - Hijos a renderizar.
 * @returns {JSX.Element}
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as Theme) || 'light';
  });

  /**
   * Sincroniza el estado del tema con el documento HTML.
   */
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  /**
   * Cambia el tema de claro a oscuro y viceversa.
   */
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook personalizado para acceder al contexto de tema.
 * @throws {Error} - Si se usa fuera del proveedor.
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
