/**
 * @fileoverview Componente de Barra de Navegación (Navbar).
 * Incluye navegación principal, controles de idioma, tema, carrito y acceso de usuario.
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, Sun, Moon, Globe, Menu, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { GestorUser } from './User/GestorUser';
import { CartModal } from './Cart/CartModal';

/**
 * Componente Navbar reactivo.
 * Soporta modo móvil con menú hamburguesa y persistencia de estado del usuario.
 * @returns {JSX.Element}
 */
export const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { user, cart } = useAuth();
  
  // Estados para controlar los modales y el menú móvil
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isGestorOpen, setIsGestorOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  /**
   * Alterna la visibilidad del menú móvil.
   */
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  /**
   * Calcula la cantidad total de items en el carrito.
   */
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <nav className="fixed w-full z-50 transition-all duration-300 glass dark:glass-dark px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-3xl font-arsenal font-bold tracking-tighter hover:opacity-80 transition-opacity">
            MONTESCO
          </Link>

          {/* Navegación Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/catalog" className="hover:text-montesco-brown-dark dark:hover:text-montesco-brown-light transition-colors">
              {t('NAVBAR.CATALOG')}
            </Link>
            <Link to="/support" className="hover:text-montesco-brown-dark dark:hover:text-montesco-brown-light transition-colors">
              {t('NAVBAR.SUPPORT')}
            </Link>
            
            <div className="flex items-center space-x-4 border-l pl-8 border-gray-300 dark:border-gray-700">
              {/* Cambiador de Idioma */}
              <button 
                onClick={() => i18n.changeLanguage(i18n.language === 'es' ? 'en' : 'es')}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                title="Cambiar Idioma"
              >
                <Globe size={20} />
              </button>

              {/* Cambiador de Tema */}
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                title="Cambiar Tema"
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>

              {/* Sección de Usuario / Login */}
              {user ? (
                <div className="flex items-center gap-6">
                  {/* Carrito */}
                  <button 
                    onClick={() => setIsCartOpen(true)}
                    className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                  >
                    <ShoppingBag size={20} />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-montesco-brown-dark text-white text-[10px] font-anton w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-montesco-black">
                        {cartCount}
                      </span>
                    )}
                  </button>
                  {/* Perfil */}
                  <button 
                    onClick={() => setIsGestorOpen(true)}
                    className="w-10 h-10 rounded-full border-2 border-montesco-brown-dark overflow-hidden hover:scale-110 transition-transform bg-gray-200 flex items-center justify-center"
                  >
                    <img 
                      src={user.profileImage || `https://api.dicebear.com/9.x/avataaars/svg?seed=${user.name}`} 
                      className="w-full h-full object-cover" 
                      alt={user.name} 
                    />
                  </button>
                </div>
              ) : (
                <Link to="/user" className="px-6 py-2 bg-montesco-brown-dark text-white rounded-xl font-anton uppercase tracking-widest text-xs hover:shadow-lg transition-all">
                  {t('NAVBAR.LOGIN')}
                </Link>
              )}
            </div>
          </div>

          {/* Controles Móviles */}
          <div className="md:hidden flex items-center space-x-4">
             {user && (
               <button onClick={() => setIsCartOpen(true)} className="relative p-2">
                 <ShoppingBag size={22} />
                 {cartCount > 0 && (
                   <span className="absolute -top-1 -right-1 bg-montesco-brown-dark text-white text-[10px] font-anton w-4 h-4 flex items-center justify-center rounded-full">
                     {cartCount}
                   </span>
                 )}
               </button>
             )}
             <button onClick={toggleMenu} className="p-2">
               {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
             </button>
          </div>
        </div>

        {/* Menú Móvil Desplegable */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full glass dark:glass-dark border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col p-6 space-y-4">
              <Link to="/catalog" onClick={toggleMenu} className="text-xl font-anton uppercase">{t('NAVBAR.CATALOG')}</Link>
              <Link to="/support" onClick={toggleMenu} className="text-xl font-anton uppercase">{t('NAVBAR.SUPPORT')}</Link>
              {user ? (
                <button onClick={() => { setIsGestorOpen(true); toggleMenu(); }} className="text-xl font-anton uppercase text-left">{t('NAVBAR.MY_PROFILE')}</button>
              ) : (
                <Link to="/user" onClick={toggleMenu} className="text-xl font-anton uppercase">{t('NAVBAR.LOGIN')}</Link>
              )}

              <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                <button 
                  onClick={() => i18n.changeLanguage(i18n.language === 'es' ? 'en' : 'es')}
                  className="flex-1 flex items-center justify-center gap-2 p-4 glass dark:glass-dark rounded-2xl text-sm font-anton uppercase"
                >
                  <Globe size={20} /> {i18n.language.toUpperCase()}
                </button>
                <button 
                  onClick={toggleTheme}
                  className="flex-1 flex items-center justify-center gap-2 p-4 glass dark:glass-dark rounded-2xl text-sm font-anton uppercase"
                >
                  {theme === 'light' ? <><Moon size={20} /> DARK</> : <><Sun size={20} /> LIGHT</>}
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Modales Compartidos */}
      <GestorUser isOpen={isGestorOpen} onClose={() => setIsGestorOpen(false)} />
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onCheckout={() => { setIsCartOpen(false); }} />
    </>
  );
};
