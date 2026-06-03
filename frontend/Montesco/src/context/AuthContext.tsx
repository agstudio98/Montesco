/**
 * @fileoverview Contexto de Autenticación y Carrito de Compras.
 * Gestiona el estado global del usuario, persistencia en localStorage y lógica del carrito.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * @typedef {Object} PaymentMethod
 * @property {string} [_id] - ID único del método de pago.
 * @property {'visa' | 'mastercard' | 'mercadopago'} type - Tipo de tarjeta.
 * @property {string} number - Número de tarjeta enmascarado.
 * @property {string} holder - Titular.
 * @property {string} expiry - Vencimiento.
 * @property {boolean} isDefault - Indica si es principal.
 */
interface PaymentMethod {
  _id?: string;
  type: 'visa' | 'mastercard' | 'mercadopago';
  number: string;
  holder: string;
  expiry: string;
  isDefault: boolean;
}

/**
 * @typedef {Object} UserInfo
 * @property {string} _id - ID único del usuario.
 * @property {string} name - Nombre completo.
 * @property {string} email - Correo electrónico.
 * @property {boolean} isAdmin - Flag de administrador.
 * @property {string} token - JWT de autenticación.
 */
interface UserInfo {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  token: string;
  profileImage?: string;
  address?: string;
  paymentMethods?: PaymentMethod[];
  twoFactorEnabled?: boolean;
}

/**
 * @typedef {Object} CartItem
 * @property {string} _id - ID del producto.
 * @property {string} name - Nombre del producto.
 * @property {number} price - Precio unitario.
 * @property {string} image - URL de la imagen.
 * @property {number} quantity - Cantidad seleccionada.
 */
interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

/**
 * @typedef {Object} AuthContextType
 * @property {UserInfo | null} user - Datos del usuario logueado.
 * @property {function} login - Función para iniciar sesión.
 * @property {function} logout - Función para cerrar sesión.
 * @property {function} updateUser - Función para actualizar perfil en el servidor.
 * @property {CartItem[]} cart - Lista de productos en el carrito.
 * @property {function} addToCart - Añade producto al carrito.
 * @property {function} removeFromCart - Quita producto del carrito.
 * @property {function} clearCart - Vacía el carrito.
 * @property {boolean} loading - Estado de carga inicial.
 * @property {boolean} showAuthModal - Control del modal de acceso.
 */
interface AuthContextType {
  user: UserInfo | null;
  login: (userInfo: UserInfo) => void;
  logout: () => void;
  updateUser: (userInfo: Partial<UserInfo>) => void;
  cart: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  loading: boolean;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Proveedor de Autenticación que envuelve la aplicación.
 * @param {Object} props - Hijos a renderizar.
 * @returns {JSX.Element}
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  /**
   * Efecto de inicialización: Recupera datos de localStorage.
   */
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('userInfo');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Error parsing data from localStorage:', error);
      localStorage.removeItem('userInfo');
      localStorage.removeItem('cart');
    }
    setLoading(false);
  }, []);

  /**
   * Sincroniza el carrito con localStorage cada vez que cambia.
   */
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  /**
   * Inicia la sesión del usuario.
   * @param {UserInfo} userInfo 
   */
  const login = (userInfo: UserInfo) => {
    setUser(userInfo);
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    setShowAuthModal(false);
  };

  /**
   * Cierra la sesión y limpia el carrito.
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
    setCart([]);
  };

  /**
   * Actualiza el perfil del usuario en el backend.
   * @param {Partial<UserInfo>} updatedInfo 
   */
  const updateUser = async (updatedInfo: Partial<UserInfo>) => {
    if (!user) return;

    try {
      const response = await fetch('https://montesco.onrender.com/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          userId: user._id,
          ...updatedInfo
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar el perfil');
      }

      const data = await response.json();
      
      if (data) {
        const newUser = { ...user, ...data };
        setUser(newUser);
        localStorage.setItem('userInfo', JSON.stringify(newUser));
      }
    } catch (error: any) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  /**
   * Añade un producto al carrito o incrementa su cantidad.
   * @param {any} product 
   */
  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item._id === product._id);
      if (existing) {
        return prev.map(item => item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  /**
   * Elimina un producto por completo del carrito.
   * @param {string} productId 
   */
  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item._id !== productId));
  };

  /**
   * Vacía el carrito.
   */
  const clearCart = () => setCart([]);

  return (
    <AuthContext.Provider value={{ 
      user, login, logout, updateUser, 
      cart, addToCart, removeFromCart, clearCart,
      loading, showAuthModal, setShowAuthModal 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook personalizado para acceder al contexto de autenticación.
 * @throws {Error} - Si se usa fuera del proveedor.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
