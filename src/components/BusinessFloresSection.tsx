/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Briefcase, Building2, MapPin, Coffee, Sparkles, Send, Copy, Check, Info, AlertCircle, Phone } from 'lucide-react';
import { BusinessConsultationForm, StallConfig } from '../types';
import { buildBusinessConsultationMessage, createWhatsAppUrl, copyToClipboard } from '../utils/whatsapp';

interface BusinessFloresSectionProps {
  config: StallConfig;
  onRecordWhatsAppClick: () => void;
  onRecordBusinessInquiry: (form: BusinessConsultationForm) => void;
}

export const BusinessFloresSection: React.FC<BusinessFloresSectionProps> = ({
  config,
  onRecordWhatsAppClick,
  onRecordBusinessInquiry,
}) => {
  const [formData, setFormData] = useState<BusinessConsultationForm>({
    contactName: '',
    contactPhone: '',
    businessName: '',
    businessType: 'Cafetería / Restaurante',
    neighborhood: '',
    spaceType: 'Mostrador / Barra de atención',
    indicativeBudget: '',
    frequency: 'periodic_interest',
    deliveryPreference: 'pickup',
    comments: '',
  });

  const [copied, setCopied] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const errors: { [key: string]: string } = {};
    if (!formData.contactName.trim()) {
      errors.contactName = 'Por favor ingresa tu nombre de contacto.';
    }
    if (!formData.businessName.trim()) {
      errors.businessName = 'Por favor ingresa el nombre de tu negocio u oficina.';
    }
    if (!formData.neighborhood.trim()) {
      errors.neighborhood = 'Indica la zona o barrio de tu local.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSendWhatsApp = () => {
    if (!validate()) return;

    onRecordWhatsAppClick();
    onRecordBusinessInquiry(formData);

    const message = buildBusinessConsultationMessage(config, formData);
    const url = createWhatsAppUrl(config.phone, message);
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCopy = async () => {
    if (!validate()) return;
    const message = buildBusinessConsultationMessage(config, formData);
    const success = await copyToClipboard(message);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <section id="negocios" className="py-12 sm:py-16 bg-white border-t border-b border-[#2E8B57]/15">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Context & Value Proposition */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#F47C48] font-semibold uppercase tracking-wider mb-1">
                <span>Opción B</span>
                <span aria-hidden="true">·</span>
                <span>Atención Corporativa y Comercial</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E5A3A] leading-tight">
                Flores para mi negocio u oficina
              </h2>
              <p className="text-sm text-[#2F3640]/80 mt-2 leading-relaxed">
                Dale frescura, calidez y distinción a tu local, cafetería, hotel o estudio profesional con flores de estación directamente desde nuestro puesto tradicional.
              </p>
            </div>

            {/* Spaces Guide */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1E5A3A]">
                Espacios sugeridos:
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#F8F5F0] border border-[#2E8B57]/15">
                  <strong className="block text-[#1E5A3A] font-semibold mb-0.5">🌿 Recepciones</strong>
                  <span className="text-[#2F3640]/70">Primera impresión elegante para clientes y visitas.</span>
                </div>
                <div className="p-3 rounded-xl bg-[#F8F5F0] border border-[#2E8B57]/15">
                  <strong className="block text-[#1E5A3A] font-semibold mb-0.5">☕ Mostradores</strong>
                  <span className="text-[#2F3640]/70">Toque vivo y natural en barras y cajas de atención.</span>
                </div>
                <div className="p-3 rounded-xl bg-[#F8F5F0] border border-[#2E8B57]/15">
                  <strong className="block text-[#1E5A3A] font-semibold mb-0.5">🍽️ Mesas y Bares</strong>
                  <span className="text-[#2F3640]/70">Ramilletes bajos que no obstruyen la conversación.</span>
                </div>
                <div className="p-3 rounded-xl bg-[#F8F5F0] border border-[#2E8B57]/15">
                  <strong className="block text-[#1E5A3A] font-semibold mb-0.5">💼 Salas y Directorio</strong>
                  <span className="text-[#2F3640]/70">Arreglos serenos que aportan luz y armonía.</span>
                </div>
              </div>
            </div>

            {/* Trial proposal card (Requisito 10) */}
            <div className="p-4 rounded-2xl bg-[#F8F5F0] border border-[#2E8B57]/20 text-xs text-[#2F3640]/80 space-y-2">
              <div className="flex items-center gap-2 text-[#1E5A3A] font-semibold">
                <Sparkles className="w-4 h-4 text-[#F47C48]" />
                <span>Primer arreglo de prueba pago</span>
              </div>
              <p className="leading-relaxed">
                Sin contratos forzados ni suscripciones automáticas. Proponemos comenzar con un primer arreglo de prueba pago, adaptado a tu espacio y presupuesto acordado, para que evalúes la duración y calidad en tu propio local.
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Proposal Form */}
          <div className="lg:col-span-7 bg-[#F8F5F0] p-6 sm:p-8 rounded-3xl border border-[#2E8B57]/20 shadow-sm">
            <h3 className="font-serif text-2xl font-bold text-[#1E5A3A] mb-1">
              Solicitar propuesta por WhatsApp
            </h3>
            <p className="text-xs text-[#2F3640]/70 mb-6">
              Completa estos breves datos y te responderemos por WhatsApp con opciones y presupuesto a medida.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendWhatsApp();
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Contact Name */}
                <div>
                  <label className="block text-xs font-semibold text-[#1E5A3A] mb-1">
                    Nombre del contacto *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    placeholder="Ej. Martín Soler"
                    className="w-full px-3 py-2.5 rounded-xl border border-[#2E8B57]/20 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8B57] bg-white"
                  />
                  {formErrors.contactName && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.contactName}</p>
                  )}
                </div>

                {/* Contact Phone (WhatsApp) */}
                <div>
                  <label className="block text-xs font-semibold text-[#1E5A3A] mb-1 flex items-center justify-between">
                    <span>WhatsApp / Teléfono</span>
                    <span className="text-[10px] text-[#2F3640]/60 font-normal">Para coordinar muestra</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#25D366] absolute left-3 top-3" />
                    <input
                      type="tel"
                      value={formData.contactPhone || ''}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                      placeholder="Ej. 099 123 456"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#2E8B57]/20 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8B57] bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Business Name */}
              <div>
                <label className="block text-xs font-semibold text-[#1E5A3A] mb-1">
                  Nombre de tu negocio u oficina *
                </label>
                <input
                  type="text"
                  required
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  placeholder="Ej. Café La Ronda"
                  className="w-full px-3 py-2.5 rounded-xl border border-[#2E8B57]/20 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8B57] bg-white"
                />
                {formErrors.businessName && (
                  <p className="text-xs text-red-500 mt-1">{formErrors.businessName}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Business Type */}
                <div>
                  <label className="block text-xs font-semibold text-[#1E5A3A] mb-1">
                    Rubro del negocio
                  </label>
                  <select
                    value={formData.businessType}
                    onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#2E8B57]/20 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8B57] bg-white"
                  >
                    <option value="Cafetería / Restaurante">Cafetería / Gastronomía</option>
                    <option value="Hotel / Alojamiento">Hotel / Alojamiento</option>
                    <option value="Oficina / Estudio profesional">Oficina / Estudio profesional</option>
                    <option value="Local comercial / Boutique">Local comercial / Boutique</option>
                    <option value="Consultorio / Salud">Consultorio / Salud</option>
                    <option value="Otro rubro">Otro rubro</option>
                  </select>
                </div>

                {/* Neighborhood / Zone */}
                <div>
                  <label className="block text-xs font-semibold text-[#1E5A3A] mb-1">
                    Zona o barrio *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                    placeholder="Ej. Centro / Ciudad Vieja / Cordón"
                    className="w-full px-3 py-2.5 rounded-xl border border-[#2E8B57]/20 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8B57] bg-white"
                  />
                  {formErrors.neighborhood && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.neighborhood}</p>
                  )}
                </div>
              </div>

              {/* Space to decorate */}
              <div>
                <label className="block text-xs font-semibold text-[#1E5A3A] mb-1">
                  Espacio principal donde colocarás las flores
                </label>
                <select
                  value={formData.spaceType}
                  onChange={(e) => setFormData({ ...formData, spaceType: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#2E8B57]/20 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8B57] bg-white"
                >
                  <option value="Mostrador / Barra de atención">Mostrador / Barra de atención</option>
                  <option value="Recepción principal">Recepción principal</option>
                  <option value="Mesas de comensales">Mesas de comensales</option>
                  <option value="Sala de reuniones / Directorio">Sala de reuniones / Directorio</option>
                  <option value="Varios espacios combinados">Varios espacios combinados</option>
                  <option value="Otro espacio">Otro espacio</option>
                </select>
              </div>

              {/* Frequency and Delivery preference */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1E5A3A] mb-1">
                    Modalidad deseada
                  </label>
                  <select
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value as any })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#2E8B57]/20 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8B57] bg-white"
                  >
                    <option value="periodic_interest">Interés en renovación periódica</option>
                    <option value="single">Compra única / Ocasión especial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E5A3A] mb-1">
                    Retiro o Entrega
                  </label>
                  <select
                    value={formData.deliveryPreference}
                    onChange={(e) => setFormData({ ...formData, deliveryPreference: e.target.value as any })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#2E8B57]/20 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8B57] bg-white"
                  >
                    <option value="pickup">Retiro en el puesto (habitual)</option>
                    <option value="delivery_query">Consultar sobre entrega en mi local</option>
                  </select>
                </div>
              </div>

              {/* Indicative Budget (optional) */}
              <div>
                <label className="block text-xs font-semibold text-[#1E5A3A] mb-1">
                  Presupuesto orientativo estimado (opcional)
                </label>
                <input
                  type="text"
                  value={formData.indicativeBudget}
                  onChange={(e) => setFormData({ ...formData, indicativeBudget: e.target.value })}
                  placeholder="Ej. Aprox. $ 1.500 UYU por quincena o a evaluar"
                  className="w-full px-3 py-2.5 rounded-xl border border-[#2E8B57]/20 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8B57] bg-white"
                />
              </div>

              {/* Additional Comments */}
              <div>
                <label className="block text-xs font-semibold text-[#1E5A3A] mb-1">
                  Detalles sobre el estilo de tu local (opcional)
                </label>
                <textarea
                  rows={2}
                  value={formData.comments}
                  onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                  placeholder="Ej. Preferimos colores cálidos, floreros bajos y flores de bajo aroma para cafetería."
                  className="w-full px-3 py-2 rounded-xl border border-[#2E8B57]/20 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8B57] bg-white"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="submit"
                  className="btn-cta text-sm !min-h-[48px] !px-7"
                >
                  <Send className="w-4 h-4" />
                  <span>Solicitar propuesta por WhatsApp</span>
                  <span className="btn-cta__flecha text-lg" aria-hidden="true">→</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="w-full sm:w-auto px-4 py-3 rounded-xl border border-[#2E8B57]/30 text-[#1E5A3A] hover:bg-[#2E8B57]/10 transition-colors flex items-center justify-center gap-2 text-xs font-semibold cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? '¡Copiado!' : 'Copiar texto'}</span>
                </button>
              </div>

              <p className="text-[11px] text-[#2F3640]/60 italic mt-2">
                * Las propuestas se coordinan directamente por WhatsApp con el florista del puesto para verificar factibilidad y variedades.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
