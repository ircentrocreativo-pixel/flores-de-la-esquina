/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Trash2, Calendar, Clock, User, Phone, Heart, MessageSquare, AlertTriangle, Send, Copy, Check, ChevronRight, ArrowLeft } from 'lucide-react';
import { CartItem, PersonalConsultationForm, StallConfig } from '../types';
import {
  getProductPriceLabel,
  calculateSubtotal,
  buildPersonalConsultationMessage,
  createWhatsAppUrl,
  copyToClipboard,
} from '../utils/whatsapp';

interface OrderPreparationModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  config: StallConfig;
  onRecordWhatsAppClick: () => void;
  onRecordPersonalInquiry?: (form: PersonalConsultationForm, items: CartItem[]) => void;
}

export const OrderPreparationModal: React.FC<OrderPreparationModalProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  config,
  onRecordWhatsAppClick,
  onRecordPersonalInquiry,
}) => {
  const [step, setStep] = useState<'items' | 'form' | 'review'>('items');
  const [copied, setCopied] = useState(false);

  // Form State
  const [formData, setFormData] = useState<PersonalConsultationForm>({
    customerName: '',
    customerPhone: '',
    pickupDate: '',
    pickupTimeSlot: 'Mañana (10:00 a 13:00)',
    dedication: '',
    comments: '',
    pickupPersonName: '',
  });

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  if (!isOpen) return null;

  // Min date for pickup is today (prevents past dates)
  const todayStr = new Date().toISOString().split('T')[0];

  const { subtotal, allFixed, hasFromOrConsult, pendingItemsCount } = calculateSubtotal(items);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!formData.customerName.trim()) {
      errors.customerName = 'Por favor ingresa tu nombre para que el florista sepa con quién habla.';
    }
    if (!formData.customerPhone.trim()) {
      errors.customerPhone = 'Por favor ingresa tu número de WhatsApp para avisarte ante cualquier inconveniente o cambio.';
    }
    if (!formData.pickupDate) {
      errors.pickupDate = 'Por favor selecciona el día deseado para el retiro.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextToForm = () => {
    if (items.length === 0) return;
    setStep('form');
  };

  const handleNextToReview = () => {
    if (validateForm()) {
      setStep('review');
    }
  };

  const generatedWhatsAppText = buildPersonalConsultationMessage(config, items, formData);
  const whatsAppUrl = createWhatsAppUrl(config.phone, generatedWhatsAppText);

  const handleOpenWhatsApp = () => {
    if (!whatsAppUrl) return;
    onRecordWhatsAppClick();
    onRecordPersonalInquiry?.(formData, items);
    window.open(whatsAppUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyText = async () => {
    const success = await copyToClipboard(generatedWhatsAppText);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  // Deposit calculation if configured
  const depositActive = config.depositType === 'percentage' && config.depositPercentage > 0;
  const depositAmount = allFixed && depositActive ? Math.round((subtotal * config.depositPercentage) / 100) : null;
  const remainingAmount = depositAmount !== null ? subtotal - depositAmount : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#2E8B57]/20 flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#2E8B57]/15 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            {step !== 'items' && (
              <button
                onClick={() => setStep(step === 'review' ? 'form' : 'items')}
                className="p-1 text-[#2F3640]/70 hover:text-[#2F3640] rounded-lg cursor-pointer"
                title="Volver al paso anterior"
                aria-label="Volver al paso anterior"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1E5A3A]">
                {step === 'items' && 'Tu selección de flores'}
                {step === 'form' && 'Datos para coordinar retiro'}
                {step === 'review' && 'Revisión antes de consultar'}
              </h2>
              <div className="flex items-center gap-2 text-xs text-[#2F3640]/70">
                <span className={step === 'items' ? 'font-bold text-[#2E8B57]' : ''}>1. Arreglos</span>
                <span>›</span>
                <span className={step === 'form' ? 'font-bold text-[#2E8B57]' : ''}>2. Datos de retiro</span>
                <span>›</span>
                <span className={step === 'review' ? 'font-bold text-[#2E8B57]' : ''}>3. WhatsApp</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#2F3640]/70 hover:text-[#2F3640] hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content depending on step */}
        <div className="p-5 sm:p-6 flex-1 space-y-6">
          {/* STEP 1: ITEMS & QUANTITIES */}
          {step === 'items' && (
            <div>
              {items.length === 0 ? (
                <div className="text-center py-12 px-4 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#2E8B57]/10 text-[#2E8B57] flex items-center justify-center mx-auto">
                    <Heart className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#1E5A3A]">
                    Aún no has agregado flores
                  </h3>
                  <p className="text-sm text-[#2F3640]/75 max-w-md mx-auto">
                    Recorre nuestro catálogo y haz clic en “Añadir” en los ramos que desees para armar tu encargo.
                  </p>
                  <button
                    onClick={onClose}
                    className="bg-[#2E8B57] hover:bg-[#1E5A3A] text-white px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer"
                  >
                    Ver catálogo
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="divide-y divide-[#2E8B57]/10 border border-[#2E8B57]/15 rounded-2xl overflow-hidden bg-white">
                    {items.map(({ product, quantity }) => (
                      <div key={product.id} className="p-3.5 sm:p-4 flex items-center justify-between gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl shrink-0 bg-[#F8F5F0]"
                        />

                        <div className="flex-1 min-w-0">
                          <h4 className="font-serif text-base sm:text-lg font-bold text-[#1E5A3A] truncate">
                            {product.name}
                          </h4>
                          <span className="text-xs text-[#2E8B57] font-medium block">
                            {getProductPriceLabel(product, config.currency)}
                          </span>
                          <span className="text-[11px] text-[#2F3640]/60 block truncate">
                            {product.packagingOrContainer}
                          </span>
                        </div>

                        {/* Quantity and Remove */}
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="flex items-center border border-[#2E8B57]/30 rounded-lg bg-white">
                            <button
                              onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                              className="px-2 py-0.5 text-xs font-bold text-[#2F3640] hover:bg-[#2E8B57]/10 cursor-pointer"
                              aria-label="Restar uno"
                            >
                              -
                            </button>
                            <span className="px-2.5 py-0.5 text-xs font-semibold text-[#1E5A3A]">
                              {quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                              className="px-2 py-0.5 text-xs font-bold text-[#2F3640] hover:bg-[#2E8B57]/10 cursor-pointer"
                              aria-label="Sumar uno"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => onRemoveItem(product.id)}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Quitar arreglo"
                            aria-label={`Quitar ${product.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Subtotal Calculation Box */}
                  <div className="p-4 rounded-2xl bg-[#F8F5F0] border border-[#2E8B57]/20 space-y-2">
                    <div className="flex items-center justify-between text-sm sm:text-base">
                      <span className="font-medium text-[#2F3640]">
                        Subtotal orientativo de tu consulta:
                      </span>
                      <span className="font-serif text-xl sm:text-2xl font-bold text-[#1E5A3A]">
                        {allFixed
                          ? `$ ${subtotal.toLocaleString('es-UY')} ${config.currency}`
                          : subtotal > 0
                          ? `Desde aprox. $ ${subtotal.toLocaleString('es-UY')} ${config.currency}`
                          : 'A convenir con el puesto'}
                      </span>
                    </div>

                    {hasFromOrConsult && (
                      <p className="text-xs text-[#F47C48] leading-relaxed">
                        * Tu selección incluye arreglos con precio "Desde" o a consultar. El importe final se acordará con el florista según la composición y flores frescas del día.
                      </p>
                    )}

                    {/* Deposit breakdown if active */}
                    {depositActive && allFixed && depositAmount !== null && (
                      <div className="pt-2 border-t border-[#2E8B57]/15 text-xs space-y-1 text-[#2F3640]/80">
                        <div className="flex justify-between">
                          <span>Información del puesto sobre abonos ({config.depositPercentage}%):</span>
                          <span className="font-medium">$ {depositAmount.toLocaleString('es-UY')} {config.currency}</span>
                        </div>
                        <div className="flex justify-between text-[11px] text-[#2F3640]/60">
                          <span>Saldo restante a pagar al retirar en el puesto:</span>
                          <span>$ {remainingAmount?.toLocaleString('es-UY')} {config.currency}</span>
                        </div>
                        <span className="text-[10px] text-[#2F3640]/60 block italic">
                          (El abono forma parte del precio final. La confirmación y método habitual se acuerdan por WhatsApp).
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: FORM (Día, franja horaria, dedicatoria, etc.) */}
          {step === 'form' && (
            <div className="space-y-4">
              <div className="p-3 bg-[#2E8B57]/10 rounded-xl text-xs text-[#1E5A3A] flex items-center gap-2">
                <Clock className="w-4 h-4 shrink-0" />
                <span>
                  <strong>Modalidad de servicio:</strong> Retiro en el puesto ({config.address}). No se solicita dirección particular.
                </span>
              </div>

              {/* Nombre y WhatsApp del comprador */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1E5A3A] mb-1">
                    Tu nombre y apellido *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#2E8B57] absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={formData.customerName}
                      onChange={(e) => {
                        setFormData({ ...formData, customerName: e.target.value });
                        if (formErrors.customerName) setFormErrors({ ...formErrors, customerName: '' });
                      }}
                      placeholder="Ej. Carolina Rossi"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#2E8B57]/20 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                    />
                  </div>
                  {formErrors.customerName && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.customerName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E5A3A] mb-1 flex items-center justify-between">
                    <span>Tu WhatsApp (para avisos) *</span>
                    <span className="text-[10px] text-[#2F3640]/60 font-normal">Por cambios o entrega</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#25D366] absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      value={formData.customerPhone}
                      onChange={(e) => {
                        setFormData({ ...formData, customerPhone: e.target.value });
                        if (formErrors.customerPhone) setFormErrors({ ...formErrors, customerPhone: '' });
                      }}
                      placeholder="Ej. 099 123 456"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#2E8B57]/20 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                    />
                  </div>
                  {formErrors.customerPhone && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.customerPhone}</p>
                  )}
                </div>
              </div>

              {/* Fecha y Franja deseada */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1E5A3A] mb-1">
                    Día deseado de retiro *
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-[#2E8B57] absolute left-3 top-3" />
                    <input
                      type="date"
                      required
                      min={todayStr}
                      value={formData.pickupDate}
                      onChange={(e) => {
                        setFormData({ ...formData, pickupDate: e.target.value });
                        if (formErrors.pickupDate) setFormErrors({ ...formErrors, pickupDate: '' });
                      }}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#2E8B57]/20 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                    />
                  </div>
                  {formErrors.pickupDate && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.pickupDate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E5A3A] mb-1">
                    Franja horaria deseada *
                  </label>
                  <select
                    value={formData.pickupTimeSlot}
                    onChange={(e) => setFormData({ ...formData, pickupTimeSlot: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#2E8B57]/20 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8B57] bg-white"
                  >
                    <option value="Mañana (09:00 a 13:00)">Mañana (09:00 a 13:00)</option>
                    <option value="Mediodía (13:00 a 15:00)">Mediodía (13:00 a 15:00)</option>
                    <option value="Tarde (15:00 a 19:00)">Tarde (15:00 a 19:00)</option>
                    <option value="Horario a coordinar con el puesto">Horario a coordinar con el puesto</option>
                  </select>
                  <span className="text-[10px] text-[#2F3640]/60 block mt-0.5">
                    Horario habitual: {config.hours}
                  </span>
                </div>
              </div>

              {/* Persona autorizada (opcional) */}
              <div>
                <label className="block text-xs font-semibold text-[#1E5A3A] mb-1">
                  Si retira otra persona, indica su nombre (opcional)
                </label>
                <input
                  type="text"
                  value={formData.pickupPersonName}
                  onChange={(e) => setFormData({ ...formData, pickupPersonName: e.target.value })}
                  placeholder="Ej. Retirará mi hermano Juan"
                  className="w-full px-3 py-2.5 rounded-xl border border-[#2E8B57]/20 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                />
              </div>

              {/* Dedicatoria (máximo 200 caracteres) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-[#1E5A3A] flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-[#F47C48]" />
                    <span>Dedicatoria para tarjeta de regalo (opcional)</span>
                  </label>
                  <span className={`text-[11px] ${formData.dedication.length > 190 ? 'text-red-500 font-bold' : 'text-[#2F3640]/60'}`}>
                    {formData.dedication.length}/200
                  </span>
                </div>
                <textarea
                  maxLength={200}
                  rows={2}
                  value={formData.dedication}
                  onChange={(e) => setFormData({ ...formData, dedication: e.target.value })}
                  placeholder="Ej. ¡Feliz cumpleaños mamá! Con todo mi amor..."
                  className="w-full px-3 py-2 rounded-xl border border-[#2E8B57]/20 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                />
              </div>

              {/* Comentarios (máximo 300 caracteres) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-[#1E5A3A] flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-[#2E8B57]" />
                    <span>Comentario o preferencia de flores (opcional)</span>
                  </label>
                  <span className={`text-[11px] ${formData.comments.length > 290 ? 'text-red-500 font-bold' : 'text-[#2F3640]/60'}`}>
                    {formData.comments.length}/300
                  </span>
                </div>
                <textarea
                  maxLength={300}
                  rows={2}
                  value={formData.comments}
                  onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                  placeholder="Ej. Si tienen eucalipto aromático se agradece. Llegaré en bicicleta sobre las 11."
                  className="w-full px-3 py-2 rounded-xl border border-[#2E8B57]/20 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                />
              </div>
            </div>
          )}

          {/* STEP 3: REVIEW & WHATSAPP ACTION */}
          {step === 'review' && (
            <div className="space-y-4">
              {/* Mandatory Section 9 disclaimer */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong>Aviso importante:</strong> Esta consulta <strong>no confirma un pedido ni reserva flores</strong>. El florista del puesto debe confirmar disponibilidad, importe final acordado y horario exacto de retiro.
                </div>
              </div>

              {/* Buyer Contact Badge */}
              <div className="p-3 bg-[#2E8B57]/10 rounded-2xl border border-[#2E8B57]/20 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-[#1E5A3A]">
                  <User className="w-4 h-4 text-[#2E8B57]" />
                  <span><strong>Comprador:</strong> {formData.customerName}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#1E5A3A] bg-white px-2.5 py-1 rounded-lg border border-[#2E8B57]/20">
                  <Phone className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>WhatsApp de aviso: <strong>{formData.customerPhone}</strong></span>
                </div>
              </div>

              {/* Preview of consultation message */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-[#1E5A3A]">
                    Mensaje que se enviará a WhatsApp ({config.phoneDisplay}):
                  </span>
                  <button
                    onClick={handleCopyText}
                    className="text-xs text-[#2E8B57] font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? '¡Copiado!' : 'Copiar texto'}</span>
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F8F5F0] border border-[#2E8B57]/20 text-xs font-mono whitespace-pre-line text-[#2F3640] max-h-48 overflow-y-auto">
                  {generatedWhatsAppText}
                </div>
              </div>

              {/* Phone config check */}
              {!config.phone && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                  El número de WhatsApp del puesto está pendiente de configuración en el acceso del vendedor. Puedes copiar el texto manualmente.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-[#2E8B57]/15 bg-[#F8F5F0] flex flex-wrap items-center justify-between gap-3 sticky bottom-0">
          {step === 'items' && (
            <>
              {items.length > 0 && (
                <button
                  onClick={onClearCart}
                  className="text-xs text-red-600 hover:underline cursor-pointer font-medium"
                >
                  Vaciar consulta
                </button>
              )}
              <div className="ml-auto">
                <button
                  disabled={items.length === 0}
                  onClick={handleNextToForm}
                  className="btn-cta text-sm !min-h-[46px] !px-6 disabled:opacity-50"
                >
                  <span>Continuar con mis datos</span>
                  <span className="btn-cta__flecha" aria-hidden="true">→</span>
                </button>
              </div>
            </>
          )}

          {step === 'form' && (
            <>
              <button
                onClick={() => setStep('items')}
                className="text-xs text-[#2F3640]/75 hover:text-[#2F3640] font-medium cursor-pointer"
              >
                ← Modificar arreglos
              </button>
              <button
                onClick={handleNextToReview}
                className="btn-cta text-sm !min-h-[46px] !px-6"
              >
                <span>Revisar antes de consultar</span>
                <span className="btn-cta__flecha" aria-hidden="true">→</span>
              </button>
            </>
          )}

          {step === 'review' && (
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={handleCopyText}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[#2E8B57]/30 text-[#1E5A3A] hover:bg-[#2E8B57]/10 transition-colors flex items-center justify-center gap-2 text-xs font-semibold cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Consulta copiada' : 'Copiar consulta'}</span>
              </button>

              <button
                disabled={!config.phone}
                onClick={handleOpenWhatsApp}
                className="btn-cta text-sm !min-h-[48px] !px-7 disabled:opacity-50"
              >
                <span>Abrir consulta en WhatsApp</span>
                <span className="btn-cta__flecha text-lg" aria-hidden="true">→</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
