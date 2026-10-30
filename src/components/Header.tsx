/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShoppingBag, MapPin, Briefcase, FileText, Lock, Share2, Sparkles } from 'lucide-react';
import { StallConfig } from '../types';

interface HeaderProps {
  config: StallConfig;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  onOpenShare: () => void;
  onNavigate: (sectionId: string) => void;
  activeSection: string;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  cartCount,
  onOpenCart,
  onOpenAdmin,
  onOpenShare,
  onNavigate,
  activeSection,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#F8F5F0]/95 backdrop-blur-md border-b border-[#2E8B57]/15">
      {/* Top micro banner for demo indication & IR Centro Creativo credit */}
      <div className="bg-[#1E5A3A] text-[#F8F5F0] text-xs py-1.5 px-4 text-center flex items-center justify-between font-sans">
        <div className="flex items-center gap-2 mx-auto">
          {config.isDemo && (
            <span className="inline-flex items-center gap-1 font-medium bg-[#F47C48] text-white px-2 py-0.5 rounded text-[11px]">
              <Sparkles className="w-3 h-3" />
              Negocio de demostración · Catálogo interactivo
            </span>
          )}
          <span className="hidden sm:inline opacity-85">|</span>
          <span className="opacity-90">Solución digital de <strong className="font-semibold">IR Centro Creativo</strong></span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Brand identity */}
        <button
          onClick={() => onNavigate('inicio')}
          className="text-left group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2E8B57] rounded-lg p-1"
          aria-label="Ir al inicio"
        >
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#2E8B57] inline-block animate-pulse" />
            <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#1E5A3A] group-hover:text-[#2E8B57] transition-colors">
              {config.name}
            </h1>
          </div>
          <p className="text-xs text-[#2F3640]/75 hidden sm:block">
            {config.tagline}
          </p>
        </button>

        {/* Navigation links (clean typography without pill enclosure) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#2F3640]">
          <button
            onClick={() => onNavigate('catalogo')}
            className={`transition-colors hover:text-[#2E8B57] pb-1 border-b-2 cursor-pointer ${
              activeSection === 'catalogo' ? 'border-[#2E8B57] text-[#1E5A3A] font-semibold' : 'border-transparent'
            }`}
          >
            Flores para regalar
          </button>
          <button
            onClick={() => onNavigate('negocios')}
            className={`transition-colors hover:text-[#2E8B57] pb-1 border-b-2 cursor-pointer ${
              activeSection === 'negocios' ? 'border-[#2E8B57] text-[#1E5A3A] font-semibold' : 'border-transparent'
            }`}
          >
            Negocios y Oficinas
          </button>
          <button
            onClick={() => onNavigate('puesto')}
            className={`transition-colors hover:text-[#2E8B57] pb-1 border-b-2 cursor-pointer ${
              activeSection === 'puesto' ? 'border-[#2E8B57] text-[#1E5A3A] font-semibold' : 'border-transparent'
            }`}
          >
            Encontrar el puesto
          </button>
          <button
            onClick={() => onNavigate('condiciones')}
            className={`transition-colors hover:text-[#2E8B57] pb-1 border-b-2 cursor-pointer ${
              activeSection === 'condiciones' ? 'border-[#2E8B57] text-[#1E5A3A] font-semibold' : 'border-transparent'
            }`}
          >
            Condiciones
          </button>
        </nav>

        {/* Action icons */}
        <div className="flex items-center gap-2">
          {/* Share button */}
          <button
            onClick={onOpenShare}
            className="p-2.5 text-[#2F3640] hover:text-[#2E8B57] hover:bg-[#2E8B57]/10 rounded-full transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#2E8B57]"
            title="Compartir catálogo o QR"
            aria-label="Compartir catálogo o código QR"
          >
            <Share2 className="w-5 h-5" />
          </button>

          {/* Admin access "Mi puesto" */}
          <button
            onClick={onOpenAdmin}
            className="p-2.5 text-[#2F3640] hover:text-[#1E5A3A] hover:bg-[#1E5A3A]/10 rounded-full transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#2E8B57]"
            title="Acceso vendedor (Mi puesto)"
            aria-label="Acceso privado del vendedor Mi puesto"
          >
            <Lock className="w-4 h-4" />
          </button>

          {/* Cart / Inquiry button */}
          <button
            onClick={onOpenCart}
            className="btn-cta-sm relative !min-h-[40px] !px-4"
            aria-label={`Ver consulta con ${cartCount} productos`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Tu Consulta</span>
            {cartCount > 0 && (
              <span className="bg-[#1f2230] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
            <span className="btn-cta__flecha" aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </header>
  );
};
