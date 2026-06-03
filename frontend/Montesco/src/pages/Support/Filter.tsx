/**
 * @fileoverview Listado de Reclamos y Tickets de Soporte.
 * Muestra el historial de interacciones formales del usuario con el servicio técnico.
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

/**
 * Componente SupportFilter.
 * Sincroniza la lista de reclamos con el backend y escucha eventos de creación.
 * @returns {JSX.Element}
 */
export const SupportFilter: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [claims, setClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  /**
   * Recupera los reclamos del usuario desde la API.
   */
  const fetchClaims = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/support/claims/${user._id}`);
      const data = await response.json();
      // Estructura refactorizada: { status, results, data }
      if (response.ok) {
        setClaims(Array.isArray(data) ? data : data.data);
      }
    } catch (err) {
      console.error("Error fetching claims:", err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Inicialización y suscripción a eventos globales.
   */
  useEffect(() => {
    fetchClaims();
    // Escuchar cuando el ChatBot genera un reclamo nuevo
    window.addEventListener('claimCreated', fetchClaims);
    return () => window.removeEventListener('claimCreated', fetchClaims);
  }, [user]);

  return (
    <div className="glass dark:glass-dark p-8 rounded-[30px] shadow-2xl border border-white/5 h-[600px] overflow-hidden flex flex-col">
      <h3 className="text-3xl font-anton mb-8 uppercase tracking-tighter text-montesco-black dark:text-montesco-white">
        {t('SUPPORT.CLAIMS')}
      </h3>
      
      {/* Contenedor con scroll propio */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {loading && claims.length === 0 ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-montesco-brown-dark border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : claims.length > 0 ? claims.map((claim) => (
          <div key={claim._id} className="p-6 bg-white/5 border border-white/10 rounded-3xl flex justify-between items-center hover:bg-white/10 transition-all group">
            <div className="flex items-center gap-6">
              {/* Icono dinámico según estado */}
              <div className={`p-4 rounded-2xl ${claim.status === 'resolved' || claim.status === 'closed' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                {claim.status === 'resolved' || claim.status === 'closed' ? <CheckCircle2 size={24} /> : <Clock size={24} />}
              </div>
              <div>
                <h4 className="text-xl font-anton text-montesco-black dark:text-montesco-white group-hover:text-montesco-brown-dark dark:group-hover:text-montesco-brown-light transition-colors">
                  {claim.subject}
                </h4>
                <p className="font-rem text-gray-500 text-sm">
                  {new Date(claim.createdAt).toLocaleDateString()} • ID: {claim._id.slice(-6).toUpperCase()}
                </p>
              </div>
            </div>
            {/* Tag de estado */}
            <span className={`px-4 py-2 rounded-xl font-anton text-[10px] uppercase tracking-[0.2em] ${claim.status === 'resolved' || claim.status === 'closed' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-black'}`}>
              {claim.status === 'resolved' || claim.status === 'closed' ? t('SUPPORT.STATUS_FINISHED') : t('SUPPORT.STATUS_PROGRESS')}
            </span>
          </div>
        )) : (
          <div className="text-center py-20">
             <Clock size={48} className="mx-auto mb-4 text-gray-300 opacity-20" />
             <p className="font-rem text-gray-500">{t('SUPPORT.NO_CLAIMS')}</p>
          </div>
        )}
      </div>
    </div>
  );
};
