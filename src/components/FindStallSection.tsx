/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MapPin, Clock, MessageCircle, Info, Sparkles } from 'lucide-react';
import { StallConfig } from '../types';
import { createWhatsAppUrl } from '../utils/whatsapp';
import { GoogleMapsPinButton } from './GoogleMapsPinButton';

interface FindStallSectionProps {
  config: StallConfig;
  onRecordWhatsAppClick: () => void;
}

export const FindStallSection: React.FC<FindStallSectionProps> = ({ config, onRecordWhatsAppClick }) => {
  const handleConsultPickupWhatsApp = () => {
    onRecordWhatsAppClick();
    const text = `Hola, vi la ubicación del puesto ${config.name} (${config.address}) y quisiera consultar si hoy puedo pasar a retirar flores en el horario habitual.`;
    const url = createWhatsAppUrl(config.phone, text);
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section id="puesto" className="py-12 sm:py-16 bg-[#F8F5F0]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl bg-white border border-[#2E8B57]/15 overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[420px]">
            {/* Left: Info & Action Buttons */}
            <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs text-[#2E8B57] font-semibold uppercase tracking-wider mb-2">
                  <span>Opción C</span>
                  <span aria-hidden="true">·</span>
                  <span>Encontrar el puesto</span>
                </div>

                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E5A3A] mb-3">
                  Puesto de flores en tu esquina
                </h2>

                <p className="text-sm text-[#2F3640]/80 leading-relaxed mb-6">
                  Flores frescas todos los días en el corazón de la ciudad. Puedes armar tu consulta previa o visitarnos directamente en nuestro puesto tradicional.
                </p>

                {/* Details list */}
                <div className="space-y-4 pb-6 border-b border-[#2E8B57]/15">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-[#2E8B57]/10 text-[#2E8B57] shrink-0 mt-0.5">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <strong className="text-xs font-bold text-[#1E5A3A] uppercase tracking-wide block">
                        Ubicación y Esquina
                      </strong>
                      <span className="text-sm text-[#2F3640] font-medium block">
                        {config.address}
                      </span>
                      <span className="text-xs text-[#2F3640]/70 block mt-0.5">
                        {config.reference}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-[#2E8B57]/10 text-[#2E8B57] shrink-0 mt-0.5">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <strong className="text-xs font-bold text-[#1E5A3A] uppercase tracking-wide block">
                        Horarios de atención para retiro
                      </strong>
                      <span className="text-sm text-[#2F3640] font-medium block">
                        {config.hours}
                      </span>
                      <span className="text-xs text-[#2F3640]/60 block mt-0.5">
                        * Sujeto a condiciones climáticas y disponibilidad del puesto.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 flex flex-col sm:flex-row sm:items-center gap-4">
                <GoogleMapsPinButton
                  googleMapsUrl={config.googleMapsUrl}
                  address={config.address}
                  reference={config.reference}
                />

                <button
                  onClick={handleConsultPickupWhatsApp}
                  className="btn-cta text-sm !min-h-[48px] !px-6"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Consultar retiro por WhatsApp</span>
                  <span className="btn-cta__flecha text-base" aria-hidden="true">→</span>
                </button>
              </div>

              {/* Embedded Live Google Map in Pocitos, Montevideo */}
              <div className="pt-5">
                <div className="rounded-2xl overflow-hidden border border-[#2E8B57]/20 shadow-xs bg-[#F8F5F0]">
                  <iframe
                    src="https://maps.google.com/maps?q=Av.+26+de+Marzo,+Pocitos,+Montevideo,+Uruguay&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    width="100%"
                    height="170"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Ubicación del puesto en Pocitos, Av. 26 de Marzo, Montevideo"
                  />
                </div>
              </div>
            </div>

            {/* Right: Stall Photo and Notice */}
            <div className="lg:col-span-6 relative bg-[#F8F5F0] min-h-[300px] lg:min-h-full">
              <img
                src={config.coverImage}
                alt="Puesto tradicional de flores en esquina"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-xs p-3 rounded-xl border border-[#2E8B57]/20 text-xs text-[#2F3640] shadow-sm flex items-center gap-2">
                <Info className="w-4 h-4 text-[#2E8B57] shrink-0" />
                <span>
                  <strong>Puesto en tu esquina:</strong> Puesto tradicional en esquina de Montevideo con flores frescas del día y atención cercana.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
