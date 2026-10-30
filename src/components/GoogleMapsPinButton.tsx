/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';

interface GoogleMapsPinButtonProps {
  googleMapsUrl: string;
  address?: string;
  reference?: string;
  className?: string;
}

export const GoogleMapsPinButton: React.FC<GoogleMapsPinButtonProps> = ({
  googleMapsUrl,
  address = 'Av. 26 de Marzo, Pocitos, 11300 Montevideo',
  reference = 'Montevideo · Pocitos',
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={`relative inline-flex flex-col items-start ${className}`}>
      {/* Floating Tooltip Card based on image_28b0927e.png */}
      <a
        href={googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="google-glow-btn group relative flex items-center gap-3.5 px-5 py-3 rounded-2xl cursor-pointer select-none text-left"
        aria-label="Abrir ubicación en Google Maps"
      >
        {/* Animated Google Pin / Attached Asset with Radar Ripple */}
        <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
          {/* Radar Wave Ripple */}
          <div className="absolute inset-0 rounded-full bg-red-500/25 animate-radar pointer-events-none" />
          <div className="absolute inset-1 rounded-full bg-red-500/15 animate-ping pointer-events-none" style={{ animationDuration: '2.5s' }} />

          {/* Attached Pin Asset from user */}
          <img
            src="/assets/aistudio/image_28b0927e.png"
            alt="Google Maps Pin Montevideo"
            className="w-10 h-10 object-contain object-bottom drop-shadow-md group-hover:scale-110 transition-transform duration-300"
          />
        </div>

        {/* Text Area with Google brand color accents */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            {/* Lottie-style Animated Google Logo 4-Color Icon */}
            <svg
              className={`w-4 h-4 transition-transform duration-500 ${isHovered ? 'rotate-12 scale-110' : ''}`}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                fill="#EA4335"
              />
            </svg>

            <span className="font-bold text-sm text-[#202124] group-hover:text-[#4285F4] transition-colors">
              Cómo llegar
            </span>

            <span className="text-[11px] font-semibold text-[#5f6368] group-hover:text-[#202124]">
              (Google Maps)
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs text-[#5f6368]">
            <span className="font-semibold text-[#202124]">Montevideo · Pocitos</span>
            <span aria-hidden="true">·</span>
            <span className="truncate max-w-[170px] sm:max-w-xs">{address}</span>
          </div>
        </div>

        {/* Arrow and external indicator */}
        <div className="ml-auto pl-2 text-[#5f6368] group-hover:text-[#4285F4] group-hover:translate-x-1 transition-all">
          <ExternalLink className="w-4 h-4" />
        </div>
      </a>
    </div>
  );
};
