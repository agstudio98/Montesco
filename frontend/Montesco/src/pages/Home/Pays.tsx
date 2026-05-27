/**
 * @fileoverview Sección de Métodos de Pago Aceptados.
 * Informa sobre beneficios y opciones de financiación disponibles.
 */

import React from 'react';
import { withTranslation, type WithTranslation } from 'react-i18next';
import { CreditCard, Banknote, Landmark } from 'lucide-react';

/**
 * @interface Props
 * Propiedades de traducción.
 */
interface Props extends WithTranslation {}

/**
 * Componente Pays.
 * Muestra tarjetas informativas sobre pagos con diseño minimalista.
 */
class PaysComponent extends React.Component<Props> {
  render() {
    const { t } = this.props;
    
    /**
     * Configuración de métodos de pago y sus promociones.
     */
    const paymentMethods = [
      { icon: <CreditCard size={32} />, name: 'Tarjeta de Crédito', promo: '3 Cuotas sin interés' },
      { icon: <Landmark size={32} />, name: 'Transferencia', promo: '15% de Descuento' },
      { icon: <Banknote size={32} />, name: 'Efectivo', promo: '10% de Descuento' },
    ];

    return (
      <section className="py-24 px-6 bg-white dark:bg-montesco-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-anton uppercase mb-16 text-center text-montesco-black dark:text-montesco-white">
            {t('HOME.PAYS')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {paymentMethods.map((method, idx) => (
              <div 
                key={idx} 
                className="p-10 border border-gray-100 dark:border-white/5 rounded-3xl bg-gray-50/50 dark:bg-white/5 text-center flex flex-col items-center transition-transform hover:scale-105"
              >
                <div className="mb-6 text-montesco-brown-dark dark:text-montesco-brown-light">
                  {method.icon}
                </div>
                <h4 className="text-2xl font-anton mb-2 text-montesco-black dark:text-montesco-white">
                  {method.name}
                </h4>
                <p className="text-montesco-brown-dark dark:text-montesco-brown-light font-bold font-rem">
                  {method.promo}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
}

export const Pays = withTranslation()(PaysComponent);
