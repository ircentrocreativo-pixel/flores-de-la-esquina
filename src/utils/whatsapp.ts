/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CartItem, PersonalConsultationForm, BusinessConsultationForm, Product, StallConfig } from '../types';

export function formatPrice(amount: number | null | undefined, currency: string = 'UYU'): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'Consultar precio';
  }
  return `$ ${amount.toLocaleString('es-UY')} ${currency}`;
}

export function getProductPriceLabel(product: Product, currency: string = 'UYU'): string {
  if (product.priceType === 'fixed' && product.price !== null) {
    return formatPrice(product.price, currency);
  }
  if (product.priceType === 'from' && product.price !== null) {
    return `Desde ${formatPrice(product.price, currency)}`;
  }
  return 'Consultar precio por WhatsApp';
}

export function calculateSubtotal(items: CartItem[]): {
  subtotal: number;
  allFixed: boolean;
  hasFromOrConsult: boolean;
  pendingItemsCount: number;
} {
  let subtotal = 0;
  let allFixed = true;
  let hasFromOrConsult = false;
  let pendingItemsCount = 0;

  for (const item of items) {
    if (item.product.priceType === 'fixed' && item.product.price !== null) {
      subtotal += item.product.price * item.quantity;
    } else {
      allFixed = false;
      hasFromOrConsult = true;
      pendingItemsCount += item.quantity;
      if (item.product.priceType === 'from' && item.product.price !== null) {
        subtotal += item.product.price * item.quantity; // Base mínima
      }
    }
  }

  return { subtotal, allFixed, hasFromOrConsult, pendingItemsCount };
}

export function buildPersonalConsultationMessage(
  config: StallConfig,
  items: CartItem[],
  form: PersonalConsultationForm
): string {
  const { subtotal, allFixed, hasFromOrConsult } = calculateSubtotal(items);

  let productsText = '';
  items.forEach((item, index) => {
    const priceText = getProductPriceLabel(item.product, config.currency);
    productsText += `${index + 1}. ${item.quantity}x ${item.product.name} (${priceText})\n`;
  });

  let subtotalText = '';
  if (allFixed) {
    subtotalText = `Subtotal orientativo de tu consulta: $ ${subtotal.toLocaleString('es-UY')} ${config.currency}`;
  } else if (hasFromOrConsult) {
    subtotalText = `Subtotal orientativo: Base aprox. $ ${subtotal > 0 ? subtotal.toLocaleString('es-UY') + ' ' + config.currency : 'Pendiente'} (*El importe final incluye productos con precio "Desde" o a consultar, sujeto a confirmación del florista).`;
  }

  const lines = [
    `Hola, vi su catálogo ${config.name} y quisiera consultar este encargo:`,
    '',
    `*Nombre:* ${form.customerName.trim()}`,
  ];

  if (form.customerPhone && form.customerPhone.trim()) {
    lines.push(`*WhatsApp de contacto (para avisos):* ${form.customerPhone.trim()}`);
  }

  lines.push(
    '',
    `*Productos y cantidades:*`,
    productsText.trim(),
    '',
    `*Precios publicados:* Informados según catálogo`,
    `*${subtotalText}*`,
    '',
    `*Día deseado de retiro:* ${form.pickupDate || 'A coordinar'}`,
    `*Franja horaria deseada:* ${form.pickupTimeSlot || 'A coordinar con el puesto'}`
  );

  if (form.pickupPersonName.trim()) {
    lines.push(`*Persona autorizada para retirar:* ${form.pickupPersonName.trim()}`);
  }

  if (form.dedication.trim()) {
    lines.push('', `*Dedicatoria para tarjeta:* "${form.dedication.trim()}"`);
  }

  if (form.comments.trim()) {
    lines.push('', `*Comentario:* ${form.comments.trim()}`);
  }

  lines.push('', '¿Me confirman disponibilidad, importe final y horario de retiro?');

  return lines.join('\n');
}

export function buildBusinessConsultationMessage(
  config: StallConfig,
  form: BusinessConsultationForm
): string {
  const lines = [
    `Hola, vi su catálogo ${config.name} y quisiera solicitar una propuesta de flores para negocio u oficina:`,
    '',
    `*Contacto:* ${form.contactName.trim()}`,
  ];

  if (form.contactPhone && form.contactPhone.trim()) {
    lines.push(`*WhatsApp / Teléfono de contacto:* ${form.contactPhone.trim()}`);
  }

  lines.push(
    `*Negocio:* ${form.businessName.trim()} (${form.businessType})`,
    `*Zona / Barrio:* ${form.neighborhood.trim()}`,
    `*Espacio a decorar:* ${form.spaceType}`,
    form.indicativeBudget.trim() ? `*Presupuesto orientativo mensual/puntual:* ${form.indicativeBudget.trim()}` : '*Presupuesto orientativo:* A conversar según propuesta',
    `*Interés:* ${form.frequency === 'periodic_interest' ? 'Interés en renovación periódica (sujeto a viabilidad del puesto)' : 'Compra o ambientación puntual'}`,
    `*Preferencia:* ${form.deliveryPreference === 'pickup' ? 'Retiro en el puesto' : 'Consulta sobre posibilidad de entrega en la zona'}`
  );

  if (form.comments.trim()) {
    lines.push('', `*Detalles o requerimientos:* ${form.comments.trim()}`);
  }

  lines.push(
    '',
    '¿Podríamos coordinar un primer arreglo de prueba pago, sujeto a presupuesto y disponibilidad?'
  );

  return lines.join('\n');
}

export function buildSingleProductInquiryMessage(
  config: StallConfig,
  product: Product
): string {
  const priceInfo = getProductPriceLabel(product, config.currency);
  return [
    `Hola, vi su catálogo ${config.name} y quisiera consultar por:`,
    `*${product.name}* (${priceInfo})`,
    '',
    '¿Tienen disponibilidad para estos días y cuál sería el horario de retiro en el puesto?',
  ].join('\n');
}

export function createWhatsAppUrl(phone: string, text: string): string | null {
  const cleanPhone = phone.replace(/\D/g, '');
  if (!cleanPhone) return null;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fallback below
  }

  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    textArea.remove();
    return successful;
  } catch (err) {
    console.error('Error al copiar texto', err);
    return false;
  }
}
