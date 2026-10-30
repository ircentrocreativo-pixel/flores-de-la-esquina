/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MapPin, Phone, Clock, Lock, Sparkles, Heart } from 'lucide-react';
import { StallConfig } from '../types';

interface FooterProps {
  config: StallConfig;
  onNavigate: (sectionId: string) => void;
  onOpenAdmin: () => void;
  onOpenShare: () => void;
}

export const Footer: React.FC<FooterProps> = ({ config, onNavigate, onOpenAdmin, onOpenShare }) => {
  return (
    <footer className="bg-[#1E5A3A] text-[#F8F5F0] pt-12 pb-10 border-t border-[#2E8B57]/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-white/10">
          {/* Col 1: Identity */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2E8B57]" />
              <h3 className="font-serif text-2xl font-bold tracking-tight text-white">
                {config.name}
              </h3>
            </div>
            <p className="text-xs text-white/80 max-w-sm leading-relaxed">
              Elige tus flores y consulta tu encargo por WhatsApp. La forma más ágil y cálida de encargar ramos frescos y arreglos para regalar o para tu negocio.
            </p>
            <div className="pt-2 text-xs text-white/70">
              <span>{config.address}</span> · <span>{config.reference}</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="md:col-span-3 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F47C48] mb-3">
              Navegación
            </h4>
            <ul className="space-y-2 text-xs text-white/85">
              <li>
                <button
                  onClick={() => onNavigate('catalogo')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Flores para regalar
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('negocios')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Flores para mi negocio u oficina
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('puesto')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Encontrar el puesto y horarios
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('condiciones')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Condiciones del servicio y retiro
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenShare}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Código QR y Compartir
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Stall contact & Private Seller Access */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F47C48] mb-3">
              Atención y Retiro
            </h4>
            <p className="text-xs text-white/80 leading-relaxed">
              <strong>Horarios de retiro:</strong> {config.hours}
            </p>
            <p className="text-xs text-white/80">
              <strong>WhatsApp directo:</strong> {config.phoneDisplay}
            </p>

            <div className="pt-3">
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Acceso del vendedor ("Mi puesto")</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Credits Line */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/70">
          <div>
            © {new Date().getFullYear()} {config.name}. Todos los derechos reservados.
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span>Solución digital de</span>
            <strong className="text-white font-semibold">IR Centro Creativo</strong>
          </div>
        </div>
      </div>
    </footer>
  );
};
