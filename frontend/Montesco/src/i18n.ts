/**
 * @fileoverview Configuración de i18next para la internacionalización (i18n).
 * Soporta detección automática de idioma, carga de archivos backend y modo desarrollo.
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend) // Carga traducciones desde archivos externos
  .use(LanguageDetector) // Detecta el idioma del navegador
  .use(initReactI18next) // Integra i18n con React
  .init({
    fallbackLng: 'es', // Idioma por defecto
    debug: false, // Desactivar logs en producción
    interpolation: {
      escapeValue: false, // React ya protege contra XSS
    },
    backend: {
      // Ruta de los archivos de traducción en la carpeta public
      loadPath: '/locales/{{lng}}/translation.json',
    },
    react: {
      useSuspense: false, // Evita pantallazos blancos mientras carga
    },
  });

export default i18n;
