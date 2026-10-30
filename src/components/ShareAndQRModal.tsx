/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { X, QrCode, Share2, Smartphone, Instagram, Copy, Check, Download, ExternalLink, HelpCircle } from 'lucide-react';
import { StallConfig } from '../types';
import { copyToClipboard } from '../utils/whatsapp';

interface ShareAndQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: StallConfig;
}

export const ShareAndQRModal: React.FC<ShareAndQRModalProps> = ({ isOpen, onClose, config }) => {
  const [activeTab, setActiveTab] = useState<'qr' | 'share' | 'nfc' | 'instagram'>('qr');
  const [copied, setCopied] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Current clean base URL
  const currentUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}`
    : 'https://floresdemiesquina.uy';

  const defaultShareText = `Te comparto nuestro catálogo de flores. Puedes ver opciones para regalar, consultar un arreglo para tu negocio y acordar el retiro por WhatsApp:\n${currentUrl}`;

  const [customShareText, setCustomShareText] = useState(defaultShareText);

  // Generate QR Code with high contrast and appropriate quiet zone margins
  useEffect(() => {
    if (isOpen) {
      QRCode.toDataURL(currentUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: '#1E5A3A', // Brand dark green
          light: '#FFFFFF', // High contrast white
        },
        errorCorrectionLevel: 'M',
      })
        .then((url) => {
          setQrDataUrl(url);
        })
        .catch((err) => {
          console.error('Error generating QR', err);
        });
    }
  }, [isOpen, currentUrl]);

  if (!isOpen) return null;

  const handleCopy = async (text: string, label: string) => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(label);
      setTimeout(() => setCopied(null), 3000);
    }
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;

    // Create a high resolution printable banner canvas
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 760;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#F8F5F0';
    ctx.fillRect(0, 0, 600, 760);

    // Border
    ctx.strokeStyle = '#2E8B57';
    ctx.lineWidth = 8;
    ctx.strokeRect(20, 20, 560, 720);

    // Title
    ctx.fillStyle = '#1E5A3A';
    ctx.font = 'bold 32px serif';
    ctx.textAlign = 'center';
    ctx.fillText(config.name, 300, 80);

    // Subtitle
    ctx.fillStyle = '#2F3640';
    ctx.font = '18px sans-serif';
    ctx.fillText('Escanea, elige tus flores y consulta por WhatsApp', 300, 120);

    // Draw QR code image
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 125, 160, 350, 350);

      // Footnote
      ctx.fillStyle = '#2E8B57';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(`WhatsApp: ${config.phoneDisplay}`, 300, 560);

      ctx.fillStyle = '#2F3640';
      ctx.font = '16px sans-serif';
      ctx.fillText(config.address, 300, 600);

      ctx.font = 'italic 14px sans-serif';
      ctx.fillStyle = '#666666';
      ctx.fillText('Solución digital de IR Centro Creativo', 300, 670);

      const link = document.createElement('a');
      link.download = `QR-Flores-de-mi-Esquina.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = qrDataUrl;
  };

  const handleShareWhatsAppChat = () => {
    const waUrl = `https://wa.me/?text=${encodeURIComponent(customShareText)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#2E8B57]/20 flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#2E8B57]/15 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-[#2E8B57]" />
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1E5A3A]">
              Difusión, QR y Conexión
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#2F3640]/70 hover:text-[#2F3640] hover:bg-slate-100 rounded-full cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-[#2E8B57]/15 bg-[#F8F5F0] px-4 pt-2 gap-1 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('qr')}
            className={`px-3 py-2 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'qr'
                ? 'border-[#2E8B57] text-[#1E5A3A]'
                : 'border-transparent text-[#2F3640]/70 hover:text-[#2F3640]'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>Código QR</span>
          </button>

          <button
            onClick={() => setActiveTab('share')}
            className={`px-3 py-2 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'share'
                ? 'border-[#2E8B57] text-[#1E5A3A]'
                : 'border-transparent text-[#2F3640]/70 hover:text-[#2F3640]'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>Compartir</span>
          </button>

          <button
            onClick={() => setActiveTab('instagram')}
            className={`px-3 py-2 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'instagram'
                ? 'border-[#2E8B57] text-[#1E5A3A]'
                : 'border-transparent text-[#2F3640]/70 hover:text-[#2F3640]'
            }`}
          >
            <Instagram className="w-4 h-4" />
            <span>Instagram Bio</span>
          </button>

          <button
            onClick={() => setActiveTab('nfc')}
            className={`px-3 py-2 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'nfc'
                ? 'border-[#2E8B57] text-[#1E5A3A]'
                : 'border-transparent text-[#2F3640]/70 hover:text-[#2F3640]'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Etiqueta NFC</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-5 sm:p-6 space-y-5 flex-1">
          {/* TAB: CÓDIGO QR */}
          {activeTab === 'qr' && (
            <div className="text-center space-y-4">
              <div className="p-4 bg-[#F8F5F0] rounded-2xl border border-[#2E8B57]/15 inline-block mx-auto shadow-xs">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="Código QR del catálogo Flores de mi Esquina"
                    className="w-56 h-56 mx-auto rounded-lg"
                  />
                ) : (
                  <div className="w-56 h-56 flex items-center justify-center text-xs text-[#2F3640]/60">
                    Generando QR...
                  </div>
                )}
                <p className="font-serif text-sm font-bold text-[#1E5A3A] mt-2">
                  “Escanea, elige tus flores y consulta por WhatsApp”
                </p>
              </div>

              <div className="text-xs text-[#2F3640]/80 max-w-sm mx-auto leading-relaxed">
                Este código QR apunta directamente a la URL pública de tu catálogo digital. Puedes imprimirlo para colocarlo en tu cartel, baldes, mostrador o tarjetas.
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleDownloadQr}
                  className="bg-[#2E8B57] hover:bg-[#1E5A3A] text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar cartel listo para imprimir (PNG)</span>
                </button>

                <button
                  onClick={() => handleCopy(currentUrl, 'url')}
                  className="px-4 py-2.5 rounded-xl border border-[#2E8B57]/30 text-[#1E5A3A] hover:bg-[#2E8B57]/10 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copied === 'url' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copied === 'url' ? 'URL copiada' : 'Copiar URL'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB: COMPARTIR POR WHATSAPP Y GRUPOS */}
          {activeTab === 'share' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1E5A3A] mb-1">
                  Texto editable para compartir en WhatsApp o grupos:
                </label>
                <textarea
                  rows={4}
                  value={customShareText}
                  onChange={(e) => setCustomShareText(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#2E8B57]/20 text-xs text-[#2F3640] focus:outline-none focus:ring-2 focus:ring-[#2E8B57] bg-[#F8F5F0]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleShareWhatsAppChat}
                  className="bg-[#25D366] hover:bg-[#1EBE5D] text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Compartir en WhatsApp</span>
                </button>

                <button
                  onClick={() => handleCopy(customShareText, 'share')}
                  className="px-4 py-2.5 rounded-xl border border-[#2E8B57]/30 text-[#1E5A3A] hover:bg-[#2E8B57]/10 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  {copied === 'share' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copied === 'share' ? '¡Texto copiado!' : 'Copiar texto'}</span>
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed">
                <strong>Consejo de difusión responsable:</strong> El usuario elige manualmente a quién compartir. Para difundir en grupos vecinales o comerciales, asegúrate de respetar las normas del grupo y la previa autorización de sus administradores.
              </div>
            </div>
          )}

          {/* TAB: INSTAGRAM BIO */}
          {activeTab === 'instagram' && (
            <div className="space-y-4 text-xs text-[#2F3640]">
              <div className="p-4 rounded-2xl bg-[#F8F5F0] border border-[#2E8B57]/15 space-y-2">
                <strong className="text-sm font-bold text-[#1E5A3A] block">
                  Enlace para el perfil de Instagram (Bio):
                </strong>
                <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-[#2E8B57]/20 font-mono text-[11px] truncate">
                  <span className="truncate flex-1">{currentUrl}</span>
                  <button
                    onClick={() => handleCopy(currentUrl, 'insta')}
                    className="p-1 text-[#2E8B57] hover:text-[#1E5A3A] shrink-0 cursor-pointer"
                    title="Copiar enlace"
                  >
                    {copied === 'insta' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-[#1E5A3A] text-xs uppercase tracking-wide">
                  Beneficios del diseño optimizado para Instagram:
                </h4>
                <ul className="list-disc pl-4 space-y-1.5 leading-relaxed text-[#2F3640]/80">
                  <li><strong>Apertura instantánea:</strong> Diseñado específicamente para cargar rápido dentro del navegador integrado de Instagram sin ventanas emergentes molestas ni bloqueos.</li>
                  <li><strong>Copiar consulta de respaldo:</strong> Si el navegador de Instagram no abre directamente WhatsApp en algún teléfono, el comprador siempre tiene el botón "Copiar consulta" para pegarlo en WhatsApp fácilmente.</li>
                  <li><strong>Enlaces directos a productos:</strong> Puedes promocionar un arreglo individual en historias o publicaciones agregando <code className="bg-slate-100 px-1 py-0.5 rounded">#producto-[id]</code> al final del enlace.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB: ETIQUETA NFC */}
          {activeTab === 'nfc' && (
            <div className="space-y-4 text-xs text-[#2F3640]">
              <div className="p-4 rounded-2xl bg-[#F8F5F0] border border-[#2E8B57]/15 space-y-2">
                <strong className="text-sm font-bold text-[#1E5A3A] block">
                  URL para grabar en la etiqueta NFC física:
                </strong>
                <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-[#2E8B57]/20 font-mono text-[11px] truncate">
                  <span className="truncate flex-1">{currentUrl}</span>
                  <button
                    onClick={() => handleCopy(currentUrl, 'nfc')}
                    className="p-1 text-[#2E8B57] hover:text-[#1E5A3A] shrink-0 cursor-pointer"
                    title="Copiar enlace para NFC"
                  >
                    {copied === 'nfc' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-[#1E5A3A] text-xs uppercase tracking-wide">
                  Paso a paso para programar tu chip NFC:
                </h4>
                <ol className="list-decimal pl-4 space-y-1.5 leading-relaxed text-[#2F3640]/80">
                  <li>Adquiere una etiqueta NFC adhesiva compatible estándar (como <strong>NTAG213 o NTAG215</strong>).</li>
                  <li>Descarga la aplicación gratuita <strong>NFC Tools</strong> (disponible para Android e iPhone).</li>
                  <li>Abre la app, selecciona <strong>Escribir</strong> › <strong>Añadir un registro</strong> › <strong>URL / Enlace web</strong> y pega la dirección copiada arriba.</li>
                  <li>Acerca tu celular a la etiqueta para escribirla. <em>Precaución: No selecciones la opción de "bloquear permanentemente" durante las pruebas iniciales.</em></li>
                  <li>Prueba acercar otro celular para verificar que abre el catálogo sin necesidad de instalar ninguna aplicación extra.</li>
                </ol>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[#2F3640]/70 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#2E8B57] shrink-0" />
                <span>
                  Para clientes con teléfonos que no dispongan de lector NFC, exhibe siempre el código QR junto al chip como alternativa infalible.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#2E8B57]/15 bg-[#F8F5F0] flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#2E8B57] hover:bg-[#1E5A3A] text-white px-5 py-2 rounded-xl text-xs font-semibold cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
