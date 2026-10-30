/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PriceType = 'fixed' | 'from' | 'consult';

export type ProductCategory = 
  | 'Ramos sencillos'
  | 'Ramos para regalar'
  | 'Arreglos en recipientes';

export interface Product {
  id: string;
  slotNumber: number; // 01 to 15
  name: string;
  category: ProductCategory;
  briefDescription: string;
  fullDescription: string;
  priceType: PriceType;
  price: number | null; // null if consult or pending
  isAvailable: boolean;
  isPublished: boolean; // Slots 11-15 are drafts by default
  image: string;
  imagePending?: boolean;
  approximateSize: string;
  composition: string;
  packagingOrContainer: string;
  priceIncludes: string;
}

export interface StallConfig {
  name: string;
  tagline: string;
  bannerMessage: string;
  phone: string; // international digits only, e.g. "59899123456"
  phoneDisplay: string; // "+598 99 123 456"
  address: string;
  reference: string;
  hours: string;
  googleMapsUrl: string;
  coverImage: string;
  currency: string; // "UYU"
  depositType: 'none' | 'agreed' | 'percentage';
  depositPercentage: number; // e.g. 10
  adminPin: string;
  isDemo: boolean;
  theme: {
    marfil: string;
    verde: string;
    verdeOscuro: string;
    coral: string;
    texto: string;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface PersonalConsultationForm {
  customerName: string;
  customerPhone: string; // WhatsApp del comprador para avisar imprevistos o cambios
  pickupDate: string;
  pickupTimeSlot: string;
  dedication: string; // max 200 chars
  comments: string; // max 300 chars
  pickupPersonName: string;
}

export interface BusinessConsultationForm {
  contactName: string;
  contactPhone?: string; // WhatsApp o teléfono de contacto para coordinar propuesta
  businessName: string;
  businessType: string;
  neighborhood: string;
  spaceType: string;
  indicativeBudget: string;
  frequency: 'single' | 'periodic_interest';
  deliveryPreference: 'pickup' | 'delivery_query';
  comments: string;
}

export interface InquiryLogItem {
  id: string;
  createdAt: string;
  customerName: string;
  type: 'personal' | 'business';
  summary: string;
  totalEstimated?: string;
  status: 'consultado' | 'confirmado' | 'entregado' | 'cancelado';
  notes: string;
}
