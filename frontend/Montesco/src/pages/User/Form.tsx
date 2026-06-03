/**
 * @fileoverview Formulario Unificado de Autenticación (Login / Registro).
 * Gestiona peticiones al backend, estados de carga, errores y sesiones.
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Globe, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

/**
 * Componente UserForm.
 * Implementa lógica de validación simple y manejo resiliente de errores de red.
 * @returns {JSX.Element}
 */
export const UserForm: React.FC = () => {
  const { t } = useTranslation();
  const { login, user, logout } = useAuth();
  
  // Estados de control de flujo
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMaintenanceOpen, setIsMaintenanceOpen] = useState(false);

  // Estados de los campos del formulario
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  /**
   * Ejecuta la acción de Login o Registro contra la API.
   * @param {React.FormEvent} e 
   */
  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const endpoint = isLogin ? '/api/users/login' : '/api/users';
    const body = isLogin ? { email, password } : { name, email, password };

    try {
      const response = await fetch(`https://montesco.onrender.com${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const contentType = response.headers.get("content-type");
      let data;
      
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        throw new Error("El servidor no respondió correctamente. Intenta de nuevo.");
      }

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Email o contraseña incorrectos.");
        }
        // Soporte para estructura de error del backend: { status, message }
        throw new Error(data.message || `Error ${response.status}`);
      }

      // El backend devuelve los datos en { status, data }
      const userInfo = data.data || data;
      login(userInfo);
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message === 'Failed to fetch' 
        ? "No se pudo conectar con el servidor Montesco. Verifica tu conexión." 
        : err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cambia entre modo Login y modo Registro.
   */
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
  };

  // Renderizado condicional si el usuario ya está logueado
  if (user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass dark:glass-dark p-12 rounded-[50px] text-center max-w-md w-full"
        >
          <h2 className="text-4xl font-anton uppercase mb-4 text-montesco-black dark:text-montesco-white">¡Bienvenido, {user.name}!</h2>
          <p className="font-rem text-gray-500 mb-8">Has iniciado sesión correctamente.</p>
          <button 
            onClick={logout}
            className="w-full py-4 bg-montesco-black text-white dark:bg-white dark:text-montesco-black rounded-2xl font-anton text-xl hover:opacity-80 transition-opacity"
          >
            {t('NAVBAR.LOGOUT')}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] py-12">
      <motion.div 
        key={isLogin ? 'login' : 'signup'}
        initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full max-w-lg glass dark:glass-dark p-12 rounded-[50px] shadow-2xl relative overflow-hidden"
      >
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-montesco-brown-light/10 rounded-full blur-3xl"></div>
        
        <h2 className="text-5xl font-anton uppercase text-center mb-10 tracking-tighter text-montesco-black dark:text-montesco-white">
          {isLogin ? t('USER.LOGIN_TITLE') : t('USER.SIGNUP_TITLE')}
        </h2>
        
        {/* Alerta de Error */}
        {error && !isMaintenanceOpen && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-2xl text-red-500 text-sm font-rem flex items-center gap-3">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleAction} className="space-y-6">
          {!isLogin && (
            <div className="relative">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Nombre completo" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-montesco-brown-dark text-montesco-black dark:text-montesco-white"
                required
              />
            </div>
          )}
          
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="email" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-montesco-brown-dark text-montesco-black dark:text-montesco-white"
              required
            />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="password" 
              placeholder="Contraseña" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-montesco-brown-dark text-montesco-black dark:text-montesco-white"
              required
            />
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-montesco-brown-dark text-white rounded-2xl font-anton text-xl hover:shadow-xl transition-shadow flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : (isLogin ? t('NAVBAR.LOGIN') : t('USER.REGISTER_BUTTON'))}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="font-rem text-gray-500">
            {isLogin ? t('USER.NO_ACCOUNT') : t('USER.HAVE_ACCOUNT')}{' '}
            <button 
              onClick={toggleMode}
              className="text-montesco-brown-dark dark:text-montesco-brown-light font-bold hover:underline"
            >
              {isLogin ? t('USER.SIGNUP_LINK') : t('USER.LOGIN_LINK')}
            </button>
          </p>
        </div>

        <div className="mt-8 flex items-center gap-4">
          <div className="h-[1px] bg-white/10 flex-1"></div>
          <span className="font-rem text-gray-500 text-sm uppercase">{t('USER.CONTINUE_WITH')}</span>
          <div className="h-[1px] bg-white/10 flex-1"></div>
        </div>

        {/* Acceso con Google (Placeholder de Mantenimiento) */}
        <button 
          onClick={() => setIsMaintenanceOpen(true)}
          className="w-full mt-8 py-4 border border-white/10 rounded-2xl font-rem flex items-center justify-center gap-3 hover:bg-white/5 transition-colors text-montesco-black dark:text-montesco-white"
        >
          <Globe size={20} /> {t('USER.GOOGLE_LOGIN')}
        </button>
      </motion.div>

      {/* Modal de Mantenimiento de Servicios Externos */}
      <AnimatePresence>
        {isMaintenanceOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMaintenanceOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            ></motion.div>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white dark:bg-montesco-black p-10 rounded-[40px] max-w-md w-full text-center border border-white/10 shadow-2xl"
            >
              <div className="w-20 h-20 bg-yellow-500/20 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={40} />
              </div>
              <h3 className="text-3xl font-anton mb-4 text-montesco-black dark:text-montesco-white">AVISO</h3>
              <p className="font-rem text-gray-500 leading-relaxed mb-8">{t('USER.MAINTENANCE')}</p>
              <button 
                onClick={() => setIsMaintenanceOpen(false)}
                className="w-full py-4 bg-montesco-brown-dark text-white rounded-2xl font-anton text-xl"
              >
                Entendido
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
