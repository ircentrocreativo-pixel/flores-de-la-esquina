/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { Sparkles, ArrowLeftRight } from 'lucide-react';

interface InteractiveRevealHeroProps {
  baseImage?: string;
  revealImage?: string;
  className?: string;
}

export const InteractiveRevealHero: React.FC<InteractiveRevealHeroProps> = ({
  baseImage = '/assets/aistudio/Ramo_de_seis_rosas_rojas-3_6aa1b38f.png',
  revealImage = '/assets/aistudio/Puesto_de_flores_en_Montevideo_71414e2c.png',
  className = '',
}) => {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const maskRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [swapped, setSwapped] = useState(false);
  const RADIUS = 150; // 300px diameter lens

  const currentBase = swapped ? revealImage : baseImage;
  const currentReveal = swapped ? baseImage : revealImage;

  const updatePosition = (clientX: number, clientY: number) => {
    if (!heroRef.current || !maskRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    maskRef.current.style.clipPath = `circle(${RADIUS}px at ${x}px ${y}px)`;
    if (ringRef.current) {
      ringRef.current.style.opacity = '1';
      ringRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsHovered(true);
    updatePosition(e.clientX, e.clientY);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsHovered(true);
    updatePosition(e.clientX, e.clientY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (maskRef.current) {
      maskRef.current.style.clipPath = 'circle(0px at 50% 50%)';
    }
    if (ringRef.current) {
      ringRef.current.style.opacity = '0';
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches && e.touches[0]) {
      setIsHovered(true);
      updatePosition(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches && e.touches[0]) {
      setIsHovered(true);
      updatePosition(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchEnd = () => {
    setIsHovered(false);
    if (maskRef.current) {
      maskRef.current.style.clipPath = 'circle(0px at 50% 50%)';
    }
    if (ringRef.current) {
      ringRef.current.style.opacity = '0';
    }
  };

  return (
    <div
      ref={heroRef}
      id="revealHero"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={`interactive-reveal-hero relative w-full h-[400px] sm:h-[460px] lg:h-[500px] overflow-hidden select-none cursor-crosshair group ${className}`}
      style={{ userSelect: 'none' }}
    >
      {/* IMAGEN 1: Capa Base (Fondo Permanente) */}
      <img
        src={currentBase}
        alt="Base: Ramo de seis rosas rojas"
        className="absolute inset-0 w-full h-full object-cover object-center z-[1]"
        loading="eager"
      />

      {/* IMAGEN 2: Capa Superior (Máscara Circular) */}
      <div
        ref={maskRef}
        id="revealMask"
        className="absolute inset-0 w-full h-full z-[2] pointer-events-none transition-[clip-path] duration-75 ease-out"
        style={{
          clipPath: 'circle(0px at 50% 50%)',
          willChange: 'clip-path',
        }}
      >
        <img
          src={currentReveal}
          alt="Revelada: Puesto de flores en Montevideo"
          className="w-full h-full object-cover object-center"
          loading="eager"
        />
      </div>

      {/* ARO VISUAL DEL LENTE CIRCULAR */}
      <div
        ref={ringRef}
        id="revealRing"
        className="absolute top-0 left-0 w-[300px] h-[300px] rounded-full pointer-events-none z-[3] opacity-0 transition-opacity duration-150 ease-out"
        style={{
          border: '1.5px solid rgba(251, 191, 36, 0.85)',
          boxShadow: '0 0 25px rgba(251, 191, 36, 0.45)',
          transform: 'translate(-50%, -50%)',
          willChange: 'transform, opacity',
        }}
      />

      {/* Floating Interactive Badge Helper */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSwapped((prev) => !prev);
          }}
          className="bg-black/50 hover:bg-black/70 text-white backdrop-blur-md p-1.5 rounded-lg border border-white/20 text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
          title="Invertir capas del efecto lente"
          aria-label="Invertir capas del efecto lente"
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Invertir</span>
        </button>

        <div className="bg-black/60 backdrop-blur-md text-amber-300 px-3 py-1.5 rounded-xl border border-amber-400/30 text-xs font-medium shadow-md flex items-center gap-1.5 pointer-events-none">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
          <span>{isHovered ? 'Lente de revelación activo' : 'Pasa el cursor o dedo para revelar'}</span>
        </div>
      </div>

      {/* Bottom subtle caption */}
      <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between text-white text-xs font-medium drop-shadow-md pointer-events-none bg-gradient-to-t from-black/60 to-transparent p-2 rounded-lg">
        <span>{swapped ? 'Base: Puesto · Lente: Rosas Rojas' : 'Base: Rosas Rojas · Lente: Puesto de Flores'}</span>
        <span className="text-amber-300 text-[11px] font-mono">Modo Circular 300px</span>
      </div>
    </div>
  );
};
