/**
 * @fileoverview Sección de Línea de Tiempo (Timeline).
 * Representa hitos importantes o la evolución de la marca de forma visual.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { withTranslation, type WithTranslation } from 'react-i18next';

/**
 * @interface Props
 * Propiedades de traducción.
 */
interface Props extends WithTranslation {}

/**
 * Componente Timeline.
 * Utiliza una disposición horizontal en desktop y vertical en mobile.
 */
class TimelineComponent extends React.Component<Props> {
  render() {
    const { t } = this.props;
    
    /**
     * Definición de los pasos de la historia.
     */
    const steps = [
      { year: '2020', title: t('HOME.TIMELINE.STEP1_TITLE'), desc: t('HOME.TIMELINE.STEP1_DESC') },
      { year: '2022', title: t('HOME.TIMELINE.STEP2_TITLE'), desc: t('HOME.TIMELINE.STEP2_DESC') },
      { year: '2024', title: t('HOME.TIMELINE.STEP3_TITLE'), desc: t('HOME.TIMELINE.STEP3_DESC') },
      { year: '2026', title: t('HOME.TIMELINE.STEP4_TITLE'), desc: t('HOME.TIMELINE.STEP4_DESC') },
    ];

    return (
      <section className="py-24 bg-white dark:bg-montesco-black overflow-hidden px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-anton text-center mb-20 uppercase tracking-tighter text-montesco-black dark:text-montesco-white">
            {t('HOME.TIMELINE.TITLE')}
          </h2>
          
          <div className="relative">
            {/* Línea horizontal estética (solo visible en desktop) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-montesco-brown-light/30 -translate-y-1/2"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              {steps.map((step, idx) => (
                <motion.div 
                  key={idx}
                  whileInView={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 30 }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative z-10 flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-montesco-brown-dark text-white flex items-center justify-center font-anton text-xl mb-6 shadow-xl">
                    {step.year}
                  </div>
                  <h4 className="text-2xl font-anton mb-2 text-montesco-black dark:text-montesco-white">{step.title}</h4>
                  <p className="font-rem text-gray-500 max-w-[200px]">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export const Timeline = withTranslation()(TimelineComponent);
