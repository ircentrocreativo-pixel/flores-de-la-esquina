/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Gift, Briefcase, MapPin, MessageCircle, ArrowRight, Clock, Info } from 'lucide-react';
import { StallConfig } from '../types';
import { createWhatsAppUrl } from '../utils/whatsapp';
import { InteractiveRevealHero } from './InteractiveRevealHero';

interface HeroProps {
  config: StallConfig;
  onNavigate: (sectionId: string) => void;
  onRecordWhatsAppClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ config, onNavigate, onRecordWhatsAppClick }) => {
  const handleGeneralWhatsApp = () => {
    onRecordWhatsAppClick();
    const text = `Hola, vi el catálogo digital de ${config.name}. Quisiera hacer una consulta sobre disponibilidad de flores y horario de retiro.`;
    const url = createWhatsAppUrl(config.phone, text);
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section className="relative overflow-hidden pt-4 pb-12 sm:pb-16 bg-[#F8F5F0]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Main Banner Hero Card */}
        <div className="relative rounded-3xl overflow-hidden shadow-md bg-white border border-[#2E8B57]/15">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
            {/* Left Column: Text & Primary Actions */}
            <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between z-10 bg-white/95 backdrop-blur-sm">
              <div>
                {/* Meta line without pill box */}
                <div className="flex items-center gap-2 text-xs text-[#2F3640]/70 mb-3 font-medium">
                  <span className="text-[#1E5A3A] font-semibold">Puesto tradicional</span>
                  <span aria-hidden="true">·</span>
                  <span>Flores frescas de estación</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#F47C48] font-semibold">Montevideo</span>
                </div>

                <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#1E5A3A] leading-[1.15] mb-4">
                  {config.name}
                </h1>

                <p className="text-lg sm:text-xl text-[#2F3640] font-serif italic mb-4 max-w-xl">
                  “{config.bannerMessage}”
                </p>

                <p className="text-sm text-[#2F3640]/80 leading-relaxed mb-6 max-w-lg">
                  Elige tus flores desde tu celular y consulta disponibilidad, composición y horario de retiro directamente por WhatsApp con el puesto.
                </p>

                {/* Quick Info Bar */}
                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-[#2F3640]/85 pb-6 border-b border-[#2E8B57]/15 mb-6">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#2E8B57] shrink-0" />
                    <span>{config.address}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#2E8B57] shrink-0" />
                    <span>{config.hours}</span>
                  </div>
                </div>
              </div>

              {/* Direct Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onNavigate('catalogo')}
                  className="bg-[#2E8B57] hover:bg-[#1E5A3A] text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all shadow-sm hover:shadow active:scale-95 flex items-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#2E8B57]"
                >
                  <span>Ver flores</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleGeneralWhatsApp}
                  className="btn-cta text-sm !min-h-[46px] !px-5"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Consultar por WhatsApp</span>
                  <span className="btn-cta__flecha" aria-hidden="true">→</span>
                </button>

                <button
                  onClick={() => onNavigate('puesto')}
                  className="bg-transparent hover:bg-[#2E8B57]/10 text-[#1E5A3A] border border-[#2E8B57]/30 px-4 py-3 rounded-xl font-medium text-sm transition-colors cursor-pointer"
                >
                  Ubicación y horario
                </button>
              </div>

              {/* Illustrative image disclaimer */}
              <div className="mt-4 flex items-center gap-1.5 text-[11px] text-[#2F3640]/60">
                <Info className="w-3.5 h-3.5 shrink-0" />
                <span>Fotografías ilustrativas orientativas · Los arreglos se arman frescos y se confirman con el puesto.</span>
              </div>
            </div>

            {/* Right Column: Hero Cover Image con Efecto de Revelación Modo Circular */}
            <div className="lg:col-span-5 relative min-h-[360px] lg:min-h-full overflow-hidden flex flex-col justify-center">
              <InteractiveRevealHero
                baseImage="/assets/aistudio/Ramo_de_seis_rosas_rojas-3_6aa1b38f.png"
                revealImage={config.coverImage || "/assets/aistudio/Puesto_de_flores_en_Montevideo_71414e2c.png"}
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: TRES OPCIONES GRANDES (Experiencia Principal) */}
        <div className="mt-10">
          <div className="text-center mb-6">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E5A3A]">
              ¿Qué deseas consultar hoy?
            </h2>
            <p className="text-sm text-[#2F3640]/80 mt-1">
              Selecciona una opción para comenzar tu consulta rápida sin registros
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Option A: Flores para regalar */}
            <button
              onClick={() => onNavigate('catalogo')}
              className="group text-left p-6 sm:p-7 rounded-2xl bg-white border border-[#2E8B57]/20 hover:border-[#2E8B57] hover:shadow-md transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#2E8B57] flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#2E8B57]/10 text-[#2E8B57] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Gift className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#F47C48] block mb-1">
                  Opción A
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1E5A3A] group-hover:text-[#2E8B57] transition-colors mb-2">
                  Flores para regalar
                </h3>
                <p className="text-sm text-[#2F3640]/75 leading-relaxed">
                  Ramos sencillos, ramos para ocasiones especiales y arreglos florales en recipientes con precios claros y opciones para dedicatoria.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#2E8B57]/15 flex items-center justify-between text-sm font-semibold text-[#2E8B57] group-hover:translate-x-1 transition-transform">
                <span>Ver catálogo y preparar encargo</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>

            {/* Option B: Flores para mi negocio u oficina */}
            <button
              onClick={() => onNavigate('negocios')}
              className="group text-left p-6 sm:p-7 rounded-2xl bg-white border border-[#2E8B57]/20 hover:border-[#2E8B57] hover:shadow-md transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#2E8B57] flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#F47C48]/10 text-[#F47C48] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Briefcase className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#2E8B57] block mb-1">
                  Opción B
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1E5A3A] group-hover:text-[#2E8B57] transition-colors mb-2">
                  Flores para negocio u oficina
                </h3>
                <p className="text-sm text-[#2F3640]/75 leading-relaxed">
                  Ambientación floral para recepciones, mostradores, mesas de cafetería o salas de reuniones. Propón tu espacio y solicita un arreglo de prueba pago.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#2E8B57]/15 flex items-center justify-between text-sm font-semibold text-[#F47C48] group-hover:translate-x-1 transition-transform">
                <span>Solicitar propuesta comercial</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>

            {/* Option C: Encontrar el puesto */}
            <button
              onClick={() => onNavigate('puesto')}
              className="group text-left p-6 sm:p-7 rounded-2xl bg-white border border-[#2E8B57]/20 hover:border-[#2E8B57] hover:shadow-md transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#2E8B57] flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#1E5A3A]/10 text-[#1E5A3A] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <MapPin className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#1E5A3A] block mb-1">
                  Opción C
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1E5A3A] group-hover:text-[#2E8B57] transition-colors mb-2">
                  Encontrar el puesto
                </h3>
                <p className="text-sm text-[#2F3640]/75 leading-relaxed">
                  Conoce nuestra esquina, referencias para ubicarnos al paso, horarios habituales de atención y enlace directo a Google Maps para llegar.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#2E8B57]/15 flex items-center justify-between text-sm font-semibold text-[#1E5A3A] group-hover:translate-x-1 transition-transform">
                <span>Ver dirección y horarios</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
