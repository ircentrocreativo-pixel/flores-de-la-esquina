/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldCheck, ChevronDown, ChevronUp, Lock, HelpCircle } from 'lucide-react';
import { StallConfig } from '../types';

interface ConditionsSectionProps {
  config: StallConfig;
}

export const ConditionsSection: React.FC<ConditionsSectionProps> = ({ config }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const conditionsList = [
    {
      title: '1. Disponibilidad sujeta a confirmación del florista',
      content:
        'El catálogo digital muestra composiciones y ramos habituales de nuestro puesto. Al enviar una consulta por WhatsApp, el florista verifica en el momento el stock fresco de corte disponible para el día solicitado antes de dar por acordado el encargo.',
    },
    {
      title: '2. Variaciones naturales de las flores de estación',
      content:
        'Las flores son productos vivos y naturales. Pueden presentar ligeras variaciones de tonalidad, tamaño de botón o grado de apertura respecto a las fotografías ilustrativas, respondiendo siempre al estándar de frescura del día.',
    },
    {
      title: '3. Sustituciones acordadas previamente',
      content:
        'Si por cuestiones de temporada o cosecha una variedad específica no estuviera disponible, el florista te consultará previamente por WhatsApp y propondrá una alternativa de igual o superior calidad y valor estético. Nunca realizamos cambios sin tu visto bueno.',
    },
    {
      title: '4. Qué incluye cada producto',
      content:
        'Cada ficha detalla con precisión lo que incluye el arreglo: flores frescas limpias de tallos, verdes botánicos, envoltura (kraft, papel seda o recipiente indicado) y tarjeta para dedicatoria escrita.',
    },
    {
      title: '5. Precio final confirmado antes de preparar',
      content:
        'Para productos con precio fijo, se respetará el valor publicado. En productos con precio "Desde" o "A consultar", el florista te comunicará el importe final exacto antes de que confirmes tu encargo. La consulta inicial no te compromete a pagar.',
    },
    {
      title: '6. Día y horario de retiro en el puesto',
      content:
        `El retiro se efectúa personalmente o por quien autorices en nuestro puesto ubicado en ${config.address}, dentro de la franja horaria acordada (${config.hours}).`,
    },
    {
      title: '7. Procedimiento en caso de demora',
      content:
        'Si surge algún imprevisto y te demoras en pasar a retirar, avísanos con un mensaje de WhatsApp. Mantendremos tus flores hidratadas en agua fresca en el puesto hasta el horario de cierre convenido.',
    },
    {
      title: '8. Cambios y cancelaciones de consultas',
      content:
        'Puedes modificar o cancelar tu encargo conversándolo por WhatsApp con la mayor anticipación posible antes del armado de las flores cortadas.',
    },
    {
      title: '9. Información sobre abonos (cuando aplique)',
      content:
        config.depositType === 'none'
          ? 'Actualmente el puesto no exige abono previo para la mayoría de los ramos estándar. El pago se realiza al momento de retirar en el puesto por el medio habitual acordado.'
          : config.depositType === 'percentage'
          ? `Para encargos especiales o de gran porte, el puesto puede solicitar un abono del ${config.depositPercentage} % para reservar las flores, el cual forma parte del precio final y se deduce al retirar.`
          : 'Para arreglos especiales o recipientes de cristal/cerámica, el florista acordará contigo si requiere una seña previa, según la magnitud del encargo.',
    },
    {
      title: '10. Contacto directo y dudas',
      content:
        `Para cualquier inquietud antes o después de tu visita, estamos a tu disposición directa en nuestro WhatsApp ${config.phoneDisplay}.`,
    },
    {
      title: '11. Aviso de privacidad y uso de datos',
      content:
        'Tu privacidad es prioritaria. Esta aplicación web no recopila contraseñas, no exige registro de usuario, no utiliza cookies publicitarias ni comparte tu información con terceros. Los datos que ingresas en el formulario (nombre, dedicatoria y fecha) se usan exclusivamente para redactar el mensaje de consulta que tú mismo decides enviar desde tu propio WhatsApp.',
    },
  ];

  return (
    <section id="condiciones" className="py-12 sm:py-16 bg-white border-t border-[#2E8B57]/15">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 text-xs text-[#2E8B57] font-semibold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Transparencia y Confianza</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E5A3A]">
            Condiciones del servicio y retiro
          </h2>
          <p className="text-sm text-[#2F3640]/75 mt-2 max-w-xl mx-auto">
            Reglas claras y cercanas para que disfrutes de tus flores sin sorpresas ni letra chica.
          </p>
        </div>

        {/* Accordions */}
        <div className="space-y-3">
          {conditionsList.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-[#2E8B57]/15 bg-[#F8F5F0]/60 overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-3 cursor-pointer hover:bg-[#F8F5F0] transition-colors focus-visible:ring-2 focus-visible:ring-[#2E8B57]"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif text-base sm:text-lg font-bold text-[#1E5A3A]">
                    {item.title}
                  </span>
                  <div className="p-1 rounded-full bg-white text-[#2E8B57] shrink-0 border border-[#2E8B57]/20">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#2F3640]/85 leading-relaxed border-t border-[#2E8B57]/10 bg-white">
                    {item.content}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
