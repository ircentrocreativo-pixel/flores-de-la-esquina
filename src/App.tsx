/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CatalogSection } from './components/CatalogSection';
import { BusinessFloresSection } from './components/BusinessFloresSection';
import { FindStallSection } from './components/FindStallSection';
import { ConditionsSection } from './components/ConditionsSection';
import { OrderPreparationModal } from './components/OrderPreparationModal';
import { ShareAndQRModal } from './components/ShareAndQRModal';
import { AdminModal } from './components/AdminModal';
import { Footer } from './components/Footer';

import { Product, StallConfig, CartItem, InquiryLogItem, BusinessConsultationForm, PersonalConsultationForm } from './types';
import { INITIAL_STALL_CONFIG, INITIAL_PRODUCTS, INITIAL_INQUIRIES } from './data/initialData';
import {
  loadStoredConfig,
  saveStoredConfig,
  loadStoredProducts,
  saveStoredProducts,
  loadStoredInquiries,
  saveStoredInquiries,
  loadStats,
  recordStatEvent,
  AppStats,
} from './utils/storage';

export default function App() {
  const [config, setConfig] = useState<StallConfig>(loadStoredConfig);
  const [products, setProducts] = useState<Product[]>(loadStoredProducts);
  const [inquiries, setInquiries] = useState<InquiryLogItem[]>(loadStoredInquiries);
  const [stats, setStats] = useState<AppStats>(loadStats);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeSection, setActiveSection] = useState<string>('inicio');

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Record visit on initial load and handle hash deep linking
  useEffect(() => {
    recordStatEvent('catalogVisits', 1);
    setStats(loadStats());

    // Listen for hash changes (e.g. #producto-prod-04, #catalogo, #negocios)
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#producto-')) {
        const pId = hash.replace('#producto-', '');
        setSelectedProductId(pId);
        setActiveSection('catalogo');
        const elem = document.getElementById('catalogo');
        if (elem) elem.scrollIntoView({ behavior: 'smooth' });
      } else if (hash.startsWith('#')) {
        const sec = hash.replace('#', '');
        setActiveSection(sec);
        const elem = document.getElementById(sec);
        if (elem) elem.scrollIntoView({ behavior: 'smooth' });
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Cart operations
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Navigate to section
  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'inicio') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const elem = document.getElementById(sectionId);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Record WhatsApp click event
  const handleRecordWhatsAppClick = () => {
    const updated = recordStatEvent('whatsAppClicks', 1);
    setStats(updated);
  };

  // Save config from Admin
  const handleSaveConfig = (newConfig: StallConfig) => {
    setConfig(newConfig);
    saveStoredConfig(newConfig);
  };

  // Save products from Admin
  const handleSaveProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    saveStoredProducts(newProducts);
  };

  // Save inquiries from Admin
  const handleSaveInquiries = (newInquiries: InquiryLogItem[]) => {
    setInquiries(newInquiries);
    saveStoredInquiries(newInquiries);
  };

  // Record personal consultation into manual log
  const handleRecordPersonalInquiry = (form: PersonalConsultationForm, items: CartItem[]) => {
    const newLogItem: InquiryLogItem = {
      id: `inq-per-${Date.now()}`,
      createdAt: new Date().toLocaleString('es-UY', { dateStyle: 'short', timeStyle: 'short' }),
      customerName: form.customerPhone ? `${form.customerName} (${form.customerPhone})` : form.customerName,
      type: 'personal',
      summary: `${items.map((i) => `${i.quantity}x ${i.product.name}`).join(', ')} · Retiro: ${form.pickupDate || 'A coordinar'} (${form.pickupTimeSlot})`,
      totalEstimated: 'A convenir con puesto',
      status: 'consultado',
      notes: `WhatsApp: ${form.customerPhone || 'No indicado'}. ${form.dedication ? `Dedicatoria: "${form.dedication}". ` : ''}${form.comments || ''}`,
    };
    const updatedInquiries = [newLogItem, ...inquiries];
    setInquiries(updatedInquiries);
    saveStoredInquiries(updatedInquiries);
  };

  // Record business inquiry into manual log
  const handleRecordBusinessInquiry = (form: BusinessConsultationForm) => {
    const updatedStats = recordStatEvent('businessInquiries', 1);
    setStats(updatedStats);

    const newLogItem: InquiryLogItem = {
      id: `inq-biz-${Date.now()}`,
      createdAt: new Date().toLocaleString('es-UY', { dateStyle: 'short', timeStyle: 'short' }),
      customerName: `${form.businessName} (${form.contactName}${form.contactPhone ? ` · WA: ${form.contactPhone}` : ''})`,
      type: 'business',
      summary: `Espacio: ${form.spaceType} · ${form.neighborhood} · ${form.frequency === 'periodic_interest' ? 'Periódico' : 'Puntual'}`,
      totalEstimated: form.indicativeBudget || 'A presupuestar',
      status: 'consultado',
      notes: `Rubro: ${form.businessType}. ${form.contactPhone ? `Contacto WA: ${form.contactPhone}. ` : ''}${form.comments}`,
    };
    const updatedInquiries = [newLogItem, ...inquiries];
    setInquiries(updatedInquiries);
    saveStoredInquiries(updatedInquiries);
  };

  // Reset to factory defaults
  const handleResetToDefaults = () => {
    setConfig(INITIAL_STALL_CONFIG);
    saveStoredConfig(INITIAL_STALL_CONFIG);
    setProducts(INITIAL_PRODUCTS);
    saveStoredProducts(INITIAL_PRODUCTS);
    setInquiries(INITIAL_INQUIRIES);
    saveStoredInquiries(INITIAL_INQUIRIES);
    setCart([]);
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5F0] text-[#2F3640] selection:bg-[#2E8B57]/20 selection:text-[#1E5A3A]">
      {/* Header */}
      <Header
        config={config}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenShare={() => setIsShareOpen(true)}
        onNavigate={handleNavigate}
        activeSection={activeSection}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Banner & 3 Grand Options (Section 2 & 5) */}
        <Hero
          config={config}
          onNavigate={handleNavigate}
          onRecordWhatsAppClick={handleRecordWhatsAppClick}
        />

        {/* Catalog Section (Section 6 & 7) */}
        <CatalogSection
          products={products}
          config={config}
          onAddToCart={handleAddToCart}
          onRecordWhatsAppClick={handleRecordWhatsAppClick}
          selectedProductId={selectedProductId}
          onClearSelectedProduct={() => setSelectedProductId(null)}
        />

        {/* Business & Office Flowers (Section 10) */}
        <BusinessFloresSection
          config={config}
          onRecordWhatsAppClick={handleRecordWhatsAppClick}
          onRecordBusinessInquiry={handleRecordBusinessInquiry}
        />

        {/* Find the Stall Location & Hours (Section 13) */}
        <FindStallSection
          config={config}
          onRecordWhatsAppClick={handleRecordWhatsAppClick}
        />

        {/* Conditions of Service & Privacy (Section 12) */}
        <ConditionsSection config={config} />
      </main>

      {/* Footer */}
      <Footer
        config={config}
        onNavigate={handleNavigate}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenShare={() => setIsShareOpen(true)}
      />

      {/* Floating Action Button for Quick Cart on Mobile */}
      {totalCartCount > 0 && !isCartOpen && (
        <aside
          aria-label="Acceso rápido a tu consulta"
          className="fixed bottom-5 right-5 z-40 sm:hidden animate-in fade-in slide-in-from-bottom-4"
        >
          <button
            onClick={() => setIsCartOpen(true)}
            className="btn-cta text-sm !min-h-[46px] !px-5 shadow-2xl"
          >
            <span>Ver mi consulta</span>
            <span className="bg-[#1f2230] text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
              {totalCartCount}
            </span>
            <span className="btn-cta__flecha" aria-hidden="true">→</span>
          </button>
        </aside>
      )}

      {/* Order Preparation Modal (Section 8 & 9) */}
      <OrderPreparationModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        config={config}
        onRecordWhatsAppClick={handleRecordWhatsAppClick}
        onRecordPersonalInquiry={handleRecordPersonalInquiry}
      />

      {/* Share, QR, NFC & Instagram Modal (Section 17, 18, 19, 20) */}
      <ShareAndQRModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        config={config}
      />

      {/* Admin Panel ("Mi Puesto" - Section 14, 15, 21) */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        config={config}
        onSaveConfig={handleSaveConfig}
        products={products}
        onSaveProducts={handleSaveProducts}
        inquiries={inquiries}
        onSaveInquiries={handleSaveInquiries}
        stats={stats}
        onResetToDefaults={handleResetToDefaults}
        onViewPublicCatalog={() => {
          setIsAdminOpen(false);
          handleNavigate('catalogo');
        }}
      />
    </div>
  );
}
