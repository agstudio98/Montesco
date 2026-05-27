/**
 * @fileoverview Gestor de Perfil de Usuario (GestorUser).
 * Interfaz centralizada para manejar información personal, seguridad y métodos de pago.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Shield, CreditCard, LogOut, Camera, Plus, Trash2, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

/**
 * @interface GestorUserProps
 * @property {boolean} isOpen - Indica si el modal está abierto.
 * @property {function} onClose - Cierra el modal.
 */
interface GestorUserProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Componente principal GestorUser.
 * Implementa pestañas dinámicas y retroalimentación interactiva (Feedback Modal).
 * @param {GestorUserProps} props
 * @returns {JSX.Element | null}
 */
export const GestorUser: React.FC<GestorUserProps> = ({ isOpen, onClose }) => {
  const { user, logout, updateUser } = useAuth();
  const { t } = useTranslation();
  
  // Estados de navegación y carga
  const [activeTab, setActiveTab] = useState<'info' | 'security' | 'payment'>('info');
  const [isUpdating, setIsUpdating] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Estado del modal de feedback interno
  const [feedback, setFeedback] = useState<{ 
    type: 'success' | 'error' | 'confirm', 
    message: string, 
    onConfirm?: () => void 
  } | null>(null);

  if (!user) return null;

  // Funciones de utilidad para feedback
  const showSuccess = (msg: string) => setFeedback({ type: 'success', message: msg });
  const showError = (msg: string) => setFeedback({ type: 'error', message: msg });
  const showConfirm = (msg: string, onConfirm: () => void) => setFeedback({ type: 'confirm', message: msg, onConfirm });

  const defaultAvatar = `https://api.dicebear.com/9.x/avataaars/svg?seed=${user.name}`;

  /**
   * Maneja la subida y procesamiento de la imagen de perfil.
   * Convierte el archivo a Base64 para sincronización inmediata con el servidor.
   */
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        setIsUpdating(true);
        try {
          await updateUser({ profileImage: reader.result as string });
          showSuccess("¡Foto de perfil actualizada con éxito!");
        } catch (err: any) {
          showError(`Error al actualizar la foto: ${err.message}`);
        } finally {
          setIsUpdating(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          ></motion.div>
          
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-6xl bg-white dark:bg-montesco-black rounded-[40px] overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[700px]"
          >
            {/* Sidebar de Navegación del Perfil */}
            <div className="w-full md:w-1/4 bg-gray-50 dark:bg-white/5 p-10 border-r border-gray-100 dark:border-white/10">
              <div className="flex flex-col items-center mb-10 text-center">
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <img 
                    src={user.profileImage || defaultAvatar} 
                    className={`w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-xl transition-all ${isUpdating ? 'opacity-50 animate-pulse scale-95' : 'group-hover:scale-105'}`}
                    alt={user.name}
                  />
                  {!isUpdating && (
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera size={24} className="text-white" />
                    </div>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                    className="hidden" 
                    accept="image/*"
                  />
                </div>
                <h3 className="mt-6 text-3xl font-anton text-montesco-black dark:text-montesco-white uppercase">{user.name}</h3>
                <p className="text-gray-500 font-rem text-base">{user.email}</p>
              </div>

              <nav className="space-y-2">
                <TabButton 
                  active={activeTab === 'info'} 
                  onClick={() => setActiveTab('info')} 
                  icon={<User size={20} />} 
                  label={t('GESTOR.TABS.INFO')} 
                />
                <TabButton 
                  active={activeTab === 'security'} 
                  onClick={() => setActiveTab('security')} 
                  icon={<Shield size={20} />} 
                  label={t('GESTOR.TABS.SECURITY')} 
                />
                <TabButton 
                  active={activeTab === 'payment'} 
                  onClick={() => setActiveTab('payment')} 
                  icon={<CreditCard size={20} />} 
                  label={t('GESTOR.TABS.PAYMENT')} 
                />
                <button 
                  onClick={() => { logout(); onClose(); }}
                  className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-red-500 hover:bg-red-500/10 transition-colors font-anton uppercase tracking-widest text-sm"
                >
                  <LogOut size={20} /> {t('GESTOR.LOGOUT')}
                </button>
              </nav>
            </div>

            {/* Contenido Dinámico según pestaña activa */}
            <div className="flex-1 p-10 overflow-y-auto relative">
              <button onClick={onClose} className="absolute top-8 right-8 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-montesco-black dark:text-montesco-white">
                <X size={24} />
              </button>

              {activeTab === 'info' && (
                <InfoSection 
                  user={user} 
                  updateUser={updateUser} 
                  isUpdating={isUpdating} 
                  setIsUpdating={setIsUpdating}
                  showSuccess={showSuccess}
                  showError={showError}
                />
              )}
              {activeTab === 'security' && (
                <SecuritySection 
                  user={user} 
                  updateUser={updateUser} 
                  isUpdating={isUpdating} 
                  setIsUpdating={setIsUpdating}
                  showSuccess={showSuccess}
                  showError={showError}
                />
              )}
              {activeTab === 'payment' && (
                <PaymentSection 
                  user={user} 
                  updateUser={updateUser} 
                  isUpdating={isUpdating} 
                  setIsUpdating={setIsUpdating}
                  showSuccess={showSuccess}
                  showError={showError}
                  showConfirm={showConfirm}
                />
              )}

              {/* Modal de Feedback Inline */}
              <AnimatePresence>
                {feedback && (
                  <div className="absolute inset-0 z-[200] flex items-center justify-center p-10 bg-white/20 dark:bg-black/20 backdrop-blur-sm">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 20 }}
                      className="w-full max-w-md bg-white dark:bg-gray-900 rounded-[35px] shadow-2xl border border-gray-100 dark:border-white/10 p-10 text-center"
                    >
                      <div className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center ${
                        feedback.type === 'success' ? 'bg-green-100 text-green-500' : 
                        feedback.type === 'error' ? 'bg-red-100 text-red-500' : 
                        'bg-montesco-brown-light/20 text-montesco-brown-dark'
                      }`}>
                        {feedback.type === 'success' && <CheckCircle size={40} />}
                        {feedback.type === 'error' && <X size={40} />}
                        {feedback.type === 'confirm' && <CreditCard size={40} />}
                      </div>
                      
                      <h4 className="text-2xl font-anton uppercase text-montesco-black dark:text-montesco-white mb-4">
                        {feedback.type === 'success' ? 'Éxito' : 
                         feedback.type === 'error' ? 'Error' : 
                         'Confirmación'}
                      </h4>
                      <p className="text-gray-500 font-rem mb-8">{feedback.message}</p>
                      
                      <div className="flex gap-4">
                        {feedback.type === 'confirm' ? (
                          <>
                            <button 
                              onClick={() => { feedback.onConfirm?.(); setFeedback(null); }}
                              className="flex-1 py-4 bg-montesco-brown-dark text-white rounded-2xl font-anton uppercase text-sm"
                            >
                              Confirmar
                            </button>
                            <button 
                              onClick={() => setFeedback(null)}
                              className="flex-1 py-4 bg-gray-100 dark:bg-white/5 text-gray-500 rounded-2xl font-anton uppercase text-sm"
                            >
                              Cancelar
                            </button>
                          </>
                        ) : (
                          <button 
                            onClick={() => setFeedback(null)}
                            className="w-full py-4 bg-montesco-brown-dark text-white rounded-2xl font-anton uppercase text-sm"
                          >
                            Entendido
                          </button>
                        )}
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

/**
 * Componente interno para los botones de la barra lateral.
 */
const TabButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-anton uppercase tracking-widest text-sm ${active ? 'bg-montesco-brown-dark text-white shadow-lg' : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-white/5'}`}
  >
    {icon} {label}
  </button>
);

/**
 * Sección de Información Personal.
 */
const InfoSection = ({ user, updateUser, isUpdating, setIsUpdating, showSuccess, showError }: any) => {
  const { t } = useTranslation();
  const [name, setName] = useState(user.name);
  const [address, setAddress] = useState(user.address || '');

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await updateUser({ name, address });
      showSuccess("¡Perfil actualizado con éxito!");
    } catch (err: any) {
      showError(`Error al actualizar el perfil: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-4xl font-anton text-montesco-black dark:text-montesco-white uppercase">{t('GESTOR.INFO.TITLE')}</h2>
        <span className="px-4 py-2 bg-montesco-brown-light/20 text-montesco-brown-dark rounded-full font-anton text-xs uppercase tracking-widest">
          {isUpdating ? 'Actualizando...' : t('GESTOR.INFO.STATUS')}
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="space-y-2">
          <label className="block text-xs font-anton uppercase text-gray-400 ml-2">{t('GESTOR.INFO.USERNAME')}</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            className="w-full p-6 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 text-montesco-black dark:text-montesco-white focus:outline-none focus:ring-4 focus:ring-montesco-brown-dark/20 transition-all text-lg"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-xs font-anton uppercase text-gray-400 ml-2">{t('GESTOR.INFO.EMAIL')}</label>
          <input type="email" value={user.email} disabled className="w-full p-6 rounded-3xl bg-gray-100 dark:bg-white/5 border border-gray-100 dark:border-white/10 text-gray-400 cursor-not-allowed text-lg" />
        </div>
      </div>

      <div className="space-y-2 mb-12">
        <label className="block text-xs font-anton uppercase text-gray-400 ml-2">{t('GESTOR.INFO.ADDRESS')}</label>
        <input 
          type="text" 
          value={address} 
          onChange={(e) => setAddress(e.target.value)}
          placeholder={t('GESTOR.INFO.ADDRESS_PH')}
          className="w-full p-6 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 text-montesco-black dark:text-montesco-white focus:outline-none focus:ring-4 focus:ring-montesco-brown-dark/20 transition-all text-lg"
        />
      </div>

      <div className="p-8 border border-montesco-brown-dark/10 rounded-3xl bg-montesco-brown-light/5 mb-12">
        <h4 className="font-anton text-montesco-black dark:text-montesco-white mb-2 uppercase">{t('GESTOR.INFO.PRIVACY_TITLE')}</h4>
        <p className="text-sm font-rem text-gray-500">{t('GESTOR.INFO.PRIVACY_DESC')}</p>
      </div>

      <button 
        onClick={handleUpdate}
        disabled={isUpdating}
        className="px-12 py-5 bg-montesco-brown-dark text-white rounded-2xl font-anton text-xl hover:shadow-2xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:scale-100"
      >
        {isUpdating ? 'Guardando...' : t('GESTOR.INFO.SUBMIT')}
      </button>
    </motion.div>
  );
};

/**
 * Sección de Seguridad y Contraseña.
 */
const SecuritySection = ({ user, updateUser, isUpdating, setIsUpdating, showSuccess, showError }: any) => {
  const { t } = useTranslation();
  const [showPwdForm, setShowPwdForm] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordUpdate = async () => {
    if (password !== confirmPassword) {
      showError("Las contraseñas no coinciden");
      return;
    }
    setIsUpdating(true);
    try {
      await updateUser({ password });
      setShowPwdForm(false);
      setPassword('');
      setConfirmPassword('');
      showSuccess("Contraseña actualizada con éxito");
    } catch (err: any) {
      showError(`Error: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const toggle2FA = async () => {
    setIsUpdating(true);
    try {
      await updateUser({ twoFactorEnabled: !user.twoFactorEnabled });
      showSuccess(`2FA ${!user.twoFactorEnabled ? 'activado' : 'desactivado'}`);
    } catch (err: any) {
      showError(`Error: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
      <h2 className="text-4xl font-anton mb-12 text-montesco-black dark:text-montesco-white uppercase">{t('GESTOR.SECURITY.TITLE')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Card 2FA */}
        <div className="p-8 border border-gray-100 dark:border-white/10 rounded-[35px] bg-gray-50 dark:bg-white/5">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h4 className="text-2xl font-anton text-montesco-black dark:text-montesco-white uppercase">{t('GESTOR.SECURITY.TFA_TITLE')}</h4>
              <p className="text-sm font-rem text-gray-500 mt-2">{t('GESTOR.SECURITY.TFA_DESC')}</p>
            </div>
            <button 
              onClick={toggle2FA}
              disabled={isUpdating}
              className={`w-16 h-9 rounded-full transition-colors relative ${user.twoFactorEnabled ? 'bg-green-500' : 'bg-gray-300'}`}
            >
               <div className={`absolute top-1.5 w-6 h-6 bg-white rounded-full transition-all ${user.twoFactorEnabled ? 'left-8' : 'left-1.5'}`}></div>
            </button>
          </div>
          <button className="px-6 py-3 border border-montesco-brown-dark/30 text-montesco-brown-dark dark:text-montesco-brown-light rounded-xl font-anton text-sm uppercase hover:bg-montesco-brown-dark hover:text-white transition-all">{t('GESTOR.SECURITY.TFA_BTN')}</button>
        </div>

        {/* Card Contraseña */}
        <div className="p-8 border border-gray-100 dark:border-white/10 rounded-[35px] bg-gray-50 dark:bg-white/5">
          <h4 className="text-2xl font-anton text-montesco-black dark:text-montesco-white uppercase mb-2">{t('GESTOR.SECURITY.PWD_TITLE')}</h4>
          <p className="text-sm font-rem text-gray-500 mb-6">{t('GESTOR.SECURITY.PWD_DESC')}</p>
          {!showPwdForm ? (
            <button 
              onClick={() => setShowPwdForm(true)}
              className="px-6 py-3 bg-montesco-brown-dark text-white rounded-xl font-anton text-sm uppercase hover:shadow-lg transition-all"
            >
              {t('GESTOR.SECURITY.PWD_BTN')}
            </button>
          ) : (
            <div className="space-y-4">
              <input 
                type="password" 
                placeholder="Nueva Contraseña" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 rounded-xl bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 text-sm"
              />
              <input 
                type="password" 
                placeholder="Confirmar Contraseña" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-4 rounded-xl bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 text-sm"
              />
              <div className="flex gap-2">
                <button 
                  onClick={handlePasswordUpdate}
                  disabled={isUpdating}
                  className="px-4 py-2 bg-montesco-brown-dark text-white rounded-lg font-anton text-xs uppercase"
                >
                  Guardar
                </button>
                <button 
                  onClick={() => setShowPwdForm(false)}
                  className="px-4 py-2 bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-white rounded-lg font-anton text-xs uppercase"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Sección de Métodos de Pago.
 */
const PaymentSection = ({ user, updateUser, isUpdating, setIsUpdating, showSuccess, showError, showConfirm }: any) => {
  const { t } = useTranslation();
  const [showAddForm, setShowAddForm] = useState(false);
  const [cardBlocks, setCardBlocks] = useState(['', '', '', '']);
  const [cvv, setCvv] = useState('');
  const [expiry, setExpiry] = useState('');
  const [holder, setHolder] = useState('');
  const [type, setType] = useState('visa');

  const handleCardChange = (index: number, value: string) => {
    const onlyNums = value.replace(/\D/g, '').slice(0, 4);
    const newBlocks = [...cardBlocks];
    newBlocks[index] = onlyNums;
    setCardBlocks(newBlocks);

    // Salto automático al siguiente input
    if (onlyNums.length === 4 && index < 3) {
      const nextInput = document.getElementById(`card-block-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleAddMethod = async () => {
    const cardNumber = cardBlocks.join(' ');
    if (cardBlocks.some(b => b.length < 4) || cvv.length < 3 || expiry.length < 4 || !holder) {
      showError("Por favor, completa todos los campos correctamente.");
      return;
    }

    const updatedMethods = [...(user.paymentMethods || []), { 
      type, 
      number: `**** **** **** ${cardBlocks[3]}`, 
      fullNumber: cardNumber,
      holder: holder.toUpperCase(), 
      expiry: `${expiry.slice(0, 2)}/${expiry.slice(2, 4)}` 
    }];

    setIsUpdating(true);
    try {
      await updateUser({ paymentMethods: updatedMethods });
      setShowAddForm(false);
      setCardBlocks(['', '', '', '']);
      setCvv('');
      setExpiry('');
      setHolder('');
      showSuccess("¡Método de pago añadido!");
    } catch (err: any) {
      showError(`Error al guardar el método de pago: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteMethod = (index: number) => {
    showConfirm("¿Estás seguro de eliminar este método de pago?", async () => {
      setIsUpdating(true);
      try {
        await updateUser({ paymentMethods: user.paymentMethods.filter((_: any, i: number) => i !== index) });
        showSuccess("Método de pago eliminado.");
      } catch (err: any) {
        showError(`Error al eliminar: ${err.message}`);
      } finally {
        setIsUpdating(false);
      }
    });
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-4xl font-anton text-montesco-black dark:text-montesco-white uppercase">{t('GESTOR.PAYMENT.TITLE')}</h2>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-3 px-6 py-4 bg-montesco-brown-dark text-white rounded-2xl hover:shadow-xl transition-all font-anton uppercase text-sm"
        >
          <Plus size={20} /> {showAddForm ? 'Cancelar' : t('GESTOR.PAYMENT.ADD')}
        </button>
      </div>

      {/* Formulario para añadir nueva tarjeta */}
      {showAddForm && (
        <div className="space-y-6 mb-12 p-8 border border-montesco-brown-dark/20 rounded-[35px] bg-montesco-brown-light/5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-anton uppercase text-gray-400 ml-2">Tipo de Tarjeta</label>
              <select 
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full p-4 rounded-xl bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 font-rem"
              >
                <option value="visa">Visa</option>
                <option value="mastercard">Mastercard</option>
                <option value="mercadopago">Mercado Pago</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-anton uppercase text-gray-400 ml-2">Nombre del Titular</label>
              <input 
                type="text" 
                placeholder="EJ. JUAN PEREZ" 
                value={holder}
                onChange={(e) => setHolder(e.target.value)}
                className="w-full p-4 rounded-xl bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 font-rem uppercase"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-anton uppercase text-gray-400 ml-2">Número de Tarjeta (16 dígitos)</label>
            <div className="flex gap-2">
              {[0, 1, 2, 3].map(i => (
                <input 
                  key={i}
                  id={`card-block-${i}`}
                  type="text"
                  maxLength={4}
                  placeholder="0000"
                  value={cardBlocks[i]}
                  onChange={(e) => handleCardChange(i, e.target.value)}
                  className="w-1/4 p-4 text-center rounded-xl bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 font-rem tracking-widest"
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-anton uppercase text-gray-400 ml-2">Fecha (MMYY)</label>
              <input 
                type="text" 
                maxLength={4}
                placeholder="1228" 
                value={expiry}
                onChange={(e) => setExpiry(e.target.value.replace(/\D/g, '').slice(0, 4))}
                className="w-full p-4 rounded-xl bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 font-rem text-center tracking-widest"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-anton uppercase text-gray-400 ml-2">CVV (3 dígitos)</label>
              <input 
                type="password" 
                maxLength={3}
                placeholder="***" 
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                className="w-full p-4 rounded-xl bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 font-rem text-center tracking-widest"
              />
            </div>
          </div>

          <button 
            onClick={handleAddMethod}
            disabled={isUpdating}
            className="w-full py-5 bg-montesco-brown-dark text-white rounded-2xl font-anton uppercase text-xl hover:shadow-2xl transition-all disabled:opacity-50"
          >
            {isUpdating ? 'Procesando...' : 'Confirmar y Agregar Tarjeta'}
          </button>
        </div>
      )}

      {/* Grid de Tarjetas Guardadas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(user.paymentMethods || []).map((method: any, idx: number) => (
          <div key={idx} className="p-8 border border-gray-100 dark:border-white/10 rounded-[35px] flex justify-between items-center bg-white dark:bg-white/5 group relative overflow-hidden">
             <div className="flex items-center gap-6 z-10">
               <div className="w-20 h-12 bg-gray-100 dark:bg-white/10 rounded-xl flex items-center justify-center font-anton text-sm uppercase italic">
                 {method.type}
               </div>
               <div>
                 <h4 className="text-xl font-anton text-montesco-black dark:text-montesco-white">{method.number}</h4>
                 <p className="text-xs text-gray-500 uppercase font-rem tracking-widest">{method.holder} • {method.expiry}</p>
               </div>
             </div>
             <button 
              onClick={() => handleDeleteMethod(idx)}
              className="p-3 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all z-10"
             >
               <Trash2 size={24} />
             </button>
             <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-montesco-brown-light/5 rounded-full blur-2xl group-hover:bg-montesco-brown-light/10 transition-colors"></div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
