/**
 * @fileoverview Componente principal de la aplicación Montesco.
 * Configura el enrutamiento, proveedores de contexto y estructura base (Navbar, Footer).
 */

import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { Support } from './pages/Support';
import { User } from './pages/User';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './i18n';

/**
 * Modal informativo que aparece cuando se requiere autenticación.
 * Sigue el patrón de diseño de feedback interactivo.
 * @returns {JSX.Element}
 */
const AuthRequiredModal = () => {
  const { showAuthModal, setShowAuthModal } = useAuth();
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {showAuthModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAuthModal(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          ></motion.div>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-white dark:bg-montesco-black p-10 rounded-[40px] max-w-md w-full text-center border border-white/10 shadow-2xl"
          >
            <div className="w-20 h-20 bg-montesco-brown-light/20 text-montesco-brown-dark rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={40} />
            </div>
            <h3 className="text-3xl font-anton mb-4 text-montesco-black dark:text-montesco-white uppercase">Acceso Restringido</h3>
            <p className="font-rem text-gray-500 leading-relaxed mb-8">Debes registrarte o iniciar sesión para continuar con esta acción.</p>
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => { setShowAuthModal(false); navigate('/user'); }}
                className="w-full py-4 bg-montesco-brown-dark text-white rounded-2xl font-anton text-xl"
              >
                Ir al Login
              </button>
              <button 
                onClick={() => setShowAuthModal(false)}
                className="w-full py-4 border border-gray-300 dark:border-gray-700 text-montesco-black dark:text-montesco-white rounded-2xl font-anton text-xl"
              >
                Cancelar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

/**
 * Componente raíz de la UI.
 * Implementa Suspense para carga perezosa y rutas dinámicas.
 * @returns {JSX.Element}
 */
const AppComponent = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-grow">
              <Suspense fallback={<div className="pt-32 text-center font-anton text-3xl">Cargando Montesco...</div>}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/catalog" element={<Catalog />} />
                  <Route path="/support" element={<Support />} />
                  <Route path="/user" element={<User />} />
                </Routes>
              </Suspense>
            </div>
            <Footer />
          </div>
          <AuthRequiredModal />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default AppComponent;
