/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, StallConfig, InquiryLogItem } from '../types';
import { INITIAL_STALL_CONFIG, INITIAL_PRODUCTS, INITIAL_INQUIRIES } from '../data/initialData';

const STORAGE_KEYS = {
  CONFIG: 'flores_esquina_config_v3',
  PRODUCTS: 'flores_esquina_products_v3',
  INQUIRIES: 'flores_esquina_inquiries_v3',
  STATS: 'flores_esquina_stats_v3',
};

export interface AppStats {
  catalogVisits: number;
  whatsAppClicks: number;
  confirmedOrders: number;
  businessInquiries: number;
}

export function loadStoredConfig(): StallConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CONFIG);
    if (raw) {
      return { ...INITIAL_STALL_CONFIG, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error('Error loading config from localStorage', e);
  }
  return INITIAL_STALL_CONFIG;
}

export function saveStoredConfig(config: StallConfig): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
  } catch (e) {
    console.error('Error saving config to localStorage', e);
  }
}

export function loadStoredProducts(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (raw) {
      const parsed: Product[] = JSON.parse(raw);
      // Ensure all initial products exist or updated
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading products from localStorage', e);
  }
  return INITIAL_PRODUCTS;
}

export function saveStoredProducts(products: Product[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  } catch (e) {
    console.error('Error saving products to localStorage', e);
  }
}

export function loadStoredInquiries(): InquiryLogItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error loading inquiries from localStorage', e);
  }
  return INITIAL_INQUIRIES;
}

export function saveStoredInquiries(inquiries: InquiryLogItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
  } catch (e) {
    console.error('Error saving inquiries to localStorage', e);
  }
}

export function loadStats(): AppStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STATS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error loading stats', e);
  }
  return {
    catalogVisits: 1,
    whatsAppClicks: 0,
    confirmedOrders: 1,
    businessInquiries: 1,
  };
}

export function recordStatEvent(event: keyof AppStats, incrementBy: number = 1): AppStats {
  const current = loadStats();
  current[event] = (current[event] || 0) + incrementBy;
  try {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(current));
  } catch (e) {
    console.error('Error recording stat', e);
  }
  return current;
}
