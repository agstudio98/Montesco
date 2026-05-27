/**
 * @fileoverview Modal lateral del Carrito de Compras.
 * Permite visualizar productos seleccionados, eliminar items y proceder al pago.
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

/**
 * @interface CartModalProps
 * @property {boolean} isOpen - Controla la visibilidad del modal.
 * @property {function} onClose - Cierra el modal.
 * @property {function} onCheckout - Acción para confirmar la compra.
 */
interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

/**
 * Componente CartModal.
 * Utiliza Framer Motion para animaciones de entrada lateral.
 * @param {CartModalProps} props
 * @returns {JSX.Element}
 */
export const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose, onCheckout }) => {
  const { cart, removeFromCart } = useAuth();
  
  /**
   * Calcula el subtotal acumulado del carrito.
   */
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex justify-end">
          {/* Overlay con desenfoque */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          ></motion.div>
          
          {/* Contenedor del Carrito */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md bg-white dark:bg-montesco-black h-full shadow-2xl flex flex-col"
          >
            {/* Cabecera */}
            <div className="p-8 flex justify-between items-center border-b border-gray-100 dark:border-white/10">
              <h2 className="text-3xl font-anton uppercase tracking-tighter text-montesco-black dark:text-montesco-white flex items-center gap-4">
                <ShoppingBag /> Mi Carrito
              </h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-montesco-black dark:text-montesco-white">
                <X size={24} />
              </button>
            </div>

            {/* Lista de Items */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 font-rem">
                  <ShoppingBag size={64} className="mb-4 opacity-20" />
                  <p>Tu carrito está vacío.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item._id} className="flex gap-4 group">
                    <img src={item.image} className="w-20 h-24 object-cover rounded-2xl" alt={item.name} />
                    <div className="flex-1">
                      <h4 className="font-anton text-lg text-montesco-black dark:text-montesco-white uppercase">{item.name}</h4>
                      <p className="text-gray-500 font-rem">{item.quantity} x ${item.price}</p>
                      <button 
                        onClick={() => removeFromCart(item._id)}
                        className="mt-2 text-red-500 text-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={14} /> Eliminar
                      </button>
                    </div>
                    <div className="font-anton text-lg text-montesco-black dark:text-montesco-white">
                      ${item.price * item.quantity}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Total y Checkout */}
            {cart.length > 0 && (
              <div className="p-8 bg-gray-50 dark:bg-white/5 border-t border-gray-100 dark:border-white/10">
                <div className="flex justify-between items-center mb-8">
                  <span className="font-rem text-gray-500 uppercase tracking-widest text-sm">Total Estimado</span>
                  <span className="font-anton text-3xl text-montesco-black dark:text-montesco-white">${total}</span>
                </div>
                <button 
                  onClick={onCheckout}
                  className="w-full py-5 bg-montesco-brown-dark text-white rounded-2xl font-anton text-xl hover:shadow-xl transition-all flex items-center justify-center gap-3"
                >
                  Confirmar Compra <ChevronRight size={20} />
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
