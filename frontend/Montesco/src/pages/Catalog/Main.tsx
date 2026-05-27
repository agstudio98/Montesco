/**
 * @fileoverview Componente Principal del Catálogo (CatalogMain).
 * Gestiona la carga de productos, filtrado reactivo, paginación y flujos de compra.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Plus, CheckCircle, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import type { Product } from '../../data/products';
import { getFallbackProducts } from '../../data/products';

/**
 * Componente funcional CatalogMain.
 * Implementa fetch resiliente con fallback local ante fallos del servidor.
 * @returns {JSX.Element}
 */
export const CatalogMain: React.FC = () => {
  const { user, addToCart, setShowAuthModal } = useAuth();
  const { t, i18n } = useTranslation();
  
  // Estados de datos y UI
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados de Filtros y Paginación
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  // Estados de Modales
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  /**
   * Efecto para cargar productos desde la API o Fallback.
   */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products', {
          headers: { 'Accept-Language': i18n.language }
        });
        
        if (response.ok && response.headers.get("content-type")?.includes("application/json")) {
          const data = await response.json();
          // Estructura de respuesta del backend refactorizado: { status, results, data }
          const products = Array.isArray(data) ? data : data.data;
          setAllProducts(products);
          setFilteredProducts(products);
        } else {
          throw new Error('Fallback required');
        }
      } catch (err: any) {
        console.warn('Backend inalcanzable, usando fallback local.');
        const fallbackData = getFallbackProducts(i18n.language);
        setAllProducts(fallbackData);
        setFilteredProducts(fallbackData);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [i18n.language]);

  /**
   * Efecto de Filtrado: Se ejecuta cuando cambian los criterios de búsqueda o categoría.
   */
  useEffect(() => {
    let result = allProducts;
    
    if (searchTerm) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'All') {
      result = result.filter(p => p.category === categoryFilter);
    }

    setFilteredProducts(result);
    setCurrentPage(1); // Reiniciar paginación al filtrar
  }, [searchTerm, categoryFilter, allProducts]);

  // Lógica de Paginación Computada
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  /**
   * Maneja el clic en un producto para ver detalles.
   * Requiere autenticación.
   */
  const handleProductClick = (product: Product) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setSelectedProduct(product);
  };

  /**
   * Valida los requisitos de compra (dirección y pago) antes de confirmar.
   */
  const handleConfirmPurchase = () => {
    const hasPayment = user?.paymentMethods && user.paymentMethods.length > 0;
    const hasAddress = user?.address && user.address.trim().length > 10;

    if (!hasPayment || !hasAddress) {
      setShowCheckout(true);
    } else {
      setPurchaseSuccess(true);
      setSelectedProduct(null);
    }
  };

  if (loading) return <div className="py-24 text-center font-anton uppercase animate-pulse text-montesco-black dark:text-montesco-white">Cargando catálogo...</div>;

  return (
    <div className="py-12">
      {/* Barra de Filtros Reactiva */}
      <div className="glass dark:glass-dark p-6 rounded-[30px] mb-12 flex flex-col md:flex-row gap-6 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder={t('CATALOG.SEARCH')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-black/20 border border-gray-100 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-montesco-brown-dark transition-all text-montesco-black dark:text-montesco-white"
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="flex-1 md:flex-none px-8 py-4 glass dark:glass-dark rounded-2xl appearance-none bg-transparent text-montesco-black dark:text-montesco-white outline-none cursor-pointer"
          >
            <option value="All" className="bg-white dark:bg-montesco-black">Todos</option>
            <option value="Muebles" className="bg-white dark:bg-montesco-black">Muebles</option>
            <option value="Decoración" className="bg-white dark:bg-montesco-black">Decoración</option>
            <option value="Iluminación" className="bg-white dark:bg-montesco-black">Iluminación</option>
          </select>
        </div>
      </div>

      {/* Grilla de Productos con animaciones de entrada */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {currentProducts.length > 0 ? currentProducts.map((product) => (
          <motion.div 
            key={product._id}
            onClick={() => handleProductClick(product)}
            whileHover={{ y: -8 }}
            className="group card-modern bg-white dark:bg-montesco-glass-dark border border-gray-100 dark:border-white/10 cursor-pointer"
          >
            <div className="aspect-[4/5] relative overflow-hidden bg-gray-50 dark:bg-white/5 flex items-center justify-center p-12">
              <img 
                src={`https://api.dicebear.com/9.x/shapes/svg?seed=${product.name}&backgroundColor=transparent&shapeColor=5D4037`} 
                alt={product.name} 
                className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110 dark:invert-[0.8] dark:sepia-[0.2]" 
              />
              <button 
                onClick={(e) => { e.stopPropagation(); if(!user) setShowAuthModal(true); else addToCart(product); }}
                className="absolute bottom-4 right-4 p-4 glass dark:glass-dark rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-montesco-brown-dark hover:text-white"
              >
                <ShoppingBag size={20} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-xs uppercase tracking-widest text-montesco-brown-dark dark:text-montesco-brown-light mb-2">{product.category}</p>
              <h3 className="text-xl font-anton text-montesco-black dark:text-montesco-white">{product.name}</h3>
              <p className="font-rem font-bold mt-2 text-2xl text-montesco-black dark:text-montesco-white">${product.price}</p>
            </div>
          </motion.div>
        )) : (
          <div className="col-span-full text-center py-24 font-rem text-gray-500">No se encontraron productos.</div>
        )}
      </div>

      {/* Navegación de Páginas */}
      {totalPages > 1 && (
        <div className="mt-20 flex justify-center items-center gap-3">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button 
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-12 h-12 rounded-full font-anton transition-all ${currentPage === page ? 'bg-montesco-brown-dark text-white shadow-xl scale-110' : 'glass dark:glass-dark hover:bg-montesco-brown-light/20 text-montesco-black dark:text-montesco-white'}`}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      {/* Modal de Detalle de Producto */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[160] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProduct(null)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-4xl bg-white dark:bg-montesco-black rounded-[50px] overflow-hidden shadow-2xl flex flex-col md:flex-row h-[600px]">
              <button onClick={() => setSelectedProduct(null)} className="absolute top-8 right-8 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 z-10 text-montesco-black dark:text-montesco-white"><X size={24} /></button>
              <div className="w-full md:w-1/2 h-full bg-gray-50 dark:bg-white/5 flex items-center justify-center p-20">
                <img 
                  src={`https://api.dicebear.com/9.x/shapes/svg?seed=${selectedProduct.name}&backgroundColor=transparent&shapeColor=5D4037`} 
                  className="w-full h-full object-contain dark:invert-[0.8] dark:sepia-[0.2]" 
                  alt={selectedProduct.name} 
                />
              </div>
              <div className="flex-1 p-12 flex flex-col justify-center">
                <h2 className="text-5xl font-anton uppercase mb-4 text-montesco-black dark:text-montesco-white tracking-tighter">{selectedProduct.name}</h2>
                <p className="text-3xl font-anton text-montesco-brown-dark dark:text-montesco-brown-light mb-6">${selectedProduct.price}</p>
                <p className="font-rem text-gray-500 mb-10 leading-relaxed text-lg">{selectedProduct.description}</p>
                <div className="flex gap-4">
                  <button onClick={handleConfirmPurchase} className="flex-1 py-5 bg-montesco-brown-dark text-white rounded-2xl font-anton text-xl hover:shadow-2xl transition-all">Confirmar Compra</button>
                  <button onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }} className="p-5 border-2 border-montesco-brown-dark text-montesco-brown-dark rounded-2xl hover:bg-montesco-brown-dark hover:text-white transition-all"><Plus size={24} /></button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal de Validación de Checkout */}
      <AnimatePresence>
        {showCheckout && (
          <div className="fixed inset-0 z-[170] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCheckout(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white dark:bg-montesco-black p-12 rounded-[50px] max-w-lg w-full shadow-2xl border border-white/10 text-center">
              <h3 className="text-4xl font-anton mb-8 text-montesco-black dark:text-montesco-white uppercase">Checkout Incompleto</h3>
              <div className="space-y-4 mb-10 text-left">
                {(!user?.paymentMethods || user.paymentMethods.length === 0) && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 font-rem">
                    <X size={20} /> Falta método de pago
                  </div>
                )}
                {(!user?.address || user.address.trim().length <= 10) && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 font-rem">
                    <X size={20} /> Falta dirección de envío
                  </div>
                )}
              </div>
              <button onClick={() => setShowCheckout(false)} className="w-full py-5 bg-montesco-brown-dark text-white rounded-2xl font-anton text-xl uppercase tracking-widest">Cerrar</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Feedback de Éxito */}
      <AnimatePresence>
        {purchaseSuccess && (
          <div className="fixed inset-0 z-[180] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPurchaseSuccess(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className="relative bg-white dark:bg-montesco-black p-12 rounded-[50px] max-w-md w-full text-center shadow-2xl">
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 text-white"><CheckCircle size={48} /></div>
              <h3 className="text-4xl font-anton mb-4 text-montesco-black dark:text-montesco-white uppercase tracking-tighter">¡Pago Exitoso!</h3>
              <button onClick={() => setPurchaseSuccess(false)} className="w-full py-5 bg-montesco-black dark:bg-white text-white dark:text-montesco-black rounded-2xl font-anton text-xl uppercase tracking-widest">Entendido</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
