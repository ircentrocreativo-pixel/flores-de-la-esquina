/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Eye, Plus, Check, MessageCircle, Share2, Info, X, Sparkles } from 'lucide-react';
import { Product, ProductCategory, StallConfig } from '../types';
import { getProductPriceLabel, createWhatsAppUrl, buildSingleProductInquiryMessage, copyToClipboard } from '../utils/whatsapp';

interface CatalogSectionProps {
  products: Product[];
  config: StallConfig;
  onAddToCart: (product: Product, quantity?: number) => void;
  onRecordWhatsAppClick: () => void;
  selectedProductId?: string | null;
  onClearSelectedProduct?: () => void;
}

export const CatalogSection: React.FC<CatalogSectionProps> = ({
  products,
  config,
  onAddToCart,
  onRecordWhatsAppClick,
  selectedProductId,
  onClearSelectedProduct,
}) => {
  // Only published products with an assigned image appear in the public catalog
  const publishedProducts = useMemo(() => {
    return products.filter((p) => p.isPublished && !p.imagePending && p.image);
  }, [products]);

  // Compute available categories from published products only
  const availableCategories = useMemo(() => {
    const cats = new Set<ProductCategory>();
    publishedProducts.forEach((p) => cats.add(p.category));
    return Array.from(cats);
  }, [publishedProducts]);

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [detailModalProduct, setDetailModalProduct] = useState<Product | null>(null);
  const [detailQuantity, setDetailQuantity] = useState<number>(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // If a selected product ID is passed via deep link or URL hash
  React.useEffect(() => {
    if (selectedProductId) {
      const match = publishedProducts.find((p) => p.id === selectedProductId);
      if (match) {
        setDetailModalProduct(match);
        setDetailQuantity(1);
      }
    }
  }, [selectedProductId, publishedProducts]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return publishedProducts;
    return publishedProducts.filter((p) => p.category === activeCategory);
  }, [publishedProducts, activeCategory]);

  const handleOpenDetail = (p: Product) => {
    setDetailModalProduct(p);
    setDetailQuantity(1);
  };

  const handleCloseDetail = () => {
    setDetailModalProduct(null);
    if (onClearSelectedProduct) onClearSelectedProduct();
  };

  const handleAddAndClose = (p: Product) => {
    onAddToCart(p, detailQuantity);
    showToast(`✓ Agregado: ${detailQuantity}x ${p.name}`);
    handleCloseDetail();
  };

  const handleSingleProductWhatsApp = (p: Product) => {
    onRecordWhatsAppClick();
    const text = buildSingleProductInquiryMessage(config, p);
    const url = createWhatsAppUrl(config.phone, text);
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleShareProduct = async (p: Product) => {
    const shareUrl = `${window.location.origin}${window.location.pathname}#producto-${p.id}`;
    const shareText = `Mira este hermoso arreglo floral de ${config.name}: ${p.name} (${getProductPriceLabel(p, config.currency)}). Consulta por WhatsApp: ${shareUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${p.name} - ${config.name}`,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch {
        // Fallback to copy
      }
    }

    const copied = await copyToClipboard(shareUrl);
    if (copied) {
      showToast('✓ Enlace del producto copiado al portapapeles');
    }
  };

  return (
    <section id="catalogo" className="py-12 sm:py-16 bg-[#F8F5F0]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#2E8B57] font-semibold uppercase tracking-wider mb-1">
              <span>Opción A</span>
              <span aria-hidden="true">·</span>
              <span>Catálogo Abierto</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E5A3A]">
              Flores para regalar y disfrutar
            </h2>
            <p className="text-sm text-[#2F3640]/80 mt-1 max-w-xl">
              Explora nuestros ramos y arreglos en recipientes. Agrega los que te gusten para armar tu encargo y consultar por WhatsApp.
            </p>
          </div>

          <div className="text-xs text-[#2F3640]/70 sm:text-right bg-white/70 p-3 rounded-xl border border-[#2E8B57]/15">
            <span className="font-semibold text-[#1E5A3A] block">Retiro en el puesto</span>
            <span>Confirmación directa por WhatsApp</span>
          </div>
        </div>

        {/* Category Filters (Segmented interactive buttons) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar" role="tablist">
          <button
            role="tab"
            aria-selected={activeCategory === 'all'}
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-xl transition-all cursor-pointer whitespace-nowrap focus-visible:ring-2 focus-visible:ring-[#2E8B57] ${
              activeCategory === 'all'
                ? 'bg-[#2E8B57] text-white shadow-sm font-semibold'
                : 'bg-white text-[#2F3640] border border-[#2E8B57]/20 hover:bg-[#2E8B57]/5'
            }`}
          >
            Todos ({publishedProducts.length})
          </button>

          {availableCategories.map((cat) => {
            const count = publishedProducts.filter((p) => p.category === cat).length;
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                role="tab"
                aria-selected={isSelected}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-xl transition-all cursor-pointer whitespace-nowrap focus-visible:ring-2 focus-visible:ring-[#2E8B57] ${
                  isSelected
                    ? 'bg-[#2E8B57] text-white shadow-sm font-semibold'
                    : 'bg-white text-[#2F3640] border border-[#2E8B57]/20 hover:bg-[#2E8B57]/5'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-[#2E8B57]/30 p-8">
            <p className="text-base text-[#2F3640]">No hay productos publicados en esta categoría en este momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {filteredProducts.map((product) => {
              const priceLabel = getProductPriceLabel(product, config.currency);
              return (
                <div
                  key={product.id}
                  id={`producto-${product.id}`}
                  className="bg-white rounded-2xl border border-[#2E8B57]/15 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
                >
                  {/* Image area: complete view without heavy crops */}
                  <div className="relative aspect-[4/5] bg-[#F8F5F0] overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-300"
                      loading="lazy"
                    />

                    {/* Quiet availability notice */}
                    <div className="absolute top-3 left-3">
                      {product.isAvailable ? (
                        <span className="text-[11px] font-semibold bg-white/95 text-[#1E5A3A] px-2.5 py-1 rounded-md shadow-sm border border-[#2E8B57]/20 backdrop-blur-xs">
                          ● Disponible para consulta
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold bg-white/95 text-[#F47C48] px-2.5 py-1 rounded-md shadow-sm border border-[#F47C48]/20 backdrop-blur-xs">
                          ○ Consultar disponibilidad
                        </span>
                      )}
                    </div>

                    {/* Quick view button overlay on image */}
                    <button
                      onClick={() => handleOpenDetail(product)}
                      className="absolute bottom-3 right-3 bg-white/95 hover:bg-white text-[#2F3640] text-xs font-medium px-3 py-1.5 rounded-lg shadow-sm border border-[#2E8B57]/20 flex items-center gap-1.5 transition-all opacity-95 group-hover:opacity-100 cursor-pointer"
                      title="Ver ficha completa"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Ver detalle</span>
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex flex-col flex-1 justify-between">
                    <div>
                      {/* Quiet Category Metadata without pill enclosure */}
                      <div className="flex items-center gap-1 text-xs text-[#2E8B57] font-semibold mb-1.5">
                        <span>{product.category}</span>
                      </div>

                      <h3 className="font-serif text-xl font-bold text-[#1E5A3A] leading-snug mb-2 group-hover:text-[#2E8B57] transition-colors">
                        {product.name}
                      </h3>

                      <p className="text-xs sm:text-sm text-[#2F3640]/75 line-clamp-2 leading-relaxed mb-4">
                        {product.briefDescription}
                      </p>
                    </div>

                    {/* Price and Add button area */}
                    <div className="pt-3 border-t border-[#2E8B57]/10 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[11px] text-[#2F3640]/60 block">Precio:</span>
                        <div className="font-serif text-lg font-bold text-[#1E5A3A]">
                          {priceLabel}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            onAddToCart(product, 1);
                            showToast(`✓ Agregado: ${product.name}`);
                          }}
                          className="btn-cta-sm"
                          title="Añadir a mi consulta"
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Añadir</span>
                          <span className="btn-cta__flecha" aria-hidden="true">→</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Catalog disclaimer */}
        <div className="mt-10 p-4 rounded-2xl bg-white border border-[#2E8B57]/15 text-xs text-[#2F3640]/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#2E8B57] shrink-0" />
            <span>
              <strong>Nota sobre disponibilidad y flores de estación:</strong> La consulta no reserva automáticamente las flores. El florista confirmará disponibilidad, variedades frescas del día y precio final acordado por WhatsApp antes del armado.
            </span>
          </div>
        </div>
      </div>

      {/* DETAILED MODAL (Ficha ampliada) */}
      {detailModalProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#2E8B57]/20 flex flex-col">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-[#2E8B57]/15 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2 text-xs text-[#2E8B57] font-semibold">
                <span>{detailModalProduct.category}</span>
                <span aria-hidden="true">·</span>
                <span>Ficha detallada</span>
              </div>
              <button
                onClick={handleCloseDetail}
                className="p-1.5 text-[#2F3640]/70 hover:text-[#2F3640] hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-7 space-y-6">
              {/* Product full image: complete view without cropping */}
              <div className="rounded-2xl overflow-hidden bg-[#F8F5F0] border border-[#2E8B57]/15 flex items-center justify-center p-2 sm:p-4 max-h-[460px]">
                <img
                  src={detailModalProduct.image}
                  alt={detailModalProduct.name}
                  className="w-full h-full max-h-[440px] object-contain rounded-xl"
                />
              </div>

              <div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E5A3A] mb-2">
                  {detailModalProduct.name}
                </h3>
                <p className="text-sm text-[#2F3640]/85 leading-relaxed">
                  {detailModalProduct.fullDescription || detailModalProduct.briefDescription}
                </p>
              </div>

              {/* Price Banner */}
              <div className="p-4 rounded-xl bg-[#F8F5F0] border border-[#2E8B57]/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs text-[#2F3640]/70 block font-medium">Precio del vendedor:</span>
                  <div className="font-serif text-2xl font-bold text-[#1E5A3A]">
                    {getProductPriceLabel(detailModalProduct, config.currency)}
                  </div>
                  {detailModalProduct.priceType === 'from' && (
                    <span className="text-xs text-[#F47C48] font-medium block mt-0.5">
                      * El importe final dependerá de la composición acordada con el florista.
                    </span>
                  )}
                  {detailModalProduct.priceType === 'consult' && (
                    <span className="text-xs text-[#2F3640]/70 block mt-0.5">
                      * Precio a consultar por WhatsApp según flores de temporada.
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#2F3640]/80">Cantidad:</span>
                  <div className="flex items-center border border-[#2E8B57]/30 rounded-lg bg-white">
                    <button
                      onClick={() => setDetailQuantity((q) => Math.max(1, q - 1))}
                      className="px-2.5 py-1 text-sm font-bold text-[#2F3640] hover:bg-[#2E8B57]/10 cursor-pointer"
                      aria-label="Disminuir cantidad"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-sm font-semibold text-[#1E5A3A]">
                      {detailQuantity}
                    </span>
                    <button
                      onClick={() => setDetailQuantity((q) => q + 1)}
                      className="px-2.5 py-1 text-sm font-bold text-[#2F3640] hover:bg-[#2E8B57]/10 cursor-pointer"
                      aria-label="Aumentar cantidad"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Detailed Specs (Confirmed by seller) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="p-3.5 rounded-xl border border-[#2E8B57]/15 bg-white">
                  <strong className="text-[#1E5A3A] block mb-1 font-semibold">📏 Tamaño aproximado:</strong>
                  <span className="text-[#2F3640]/80">{detailModalProduct.approximateSize || 'A confirmar con el florista'}</span>
                </div>

                <div className="p-3.5 rounded-xl border border-[#2E8B57]/15 bg-white">
                  <strong className="text-[#1E5A3A] block mb-1 font-semibold">🌿 Composición orientativa:</strong>
                  <span className="text-[#2F3640]/80">{detailModalProduct.composition || 'Flores frescas de estación'}</span>
                </div>

                <div className="p-3.5 rounded-xl border border-[#2E8B57]/15 bg-white">
                  <strong className="text-[#1E5A3A] block mb-1 font-semibold">📦 Envoltorio o recipiente:</strong>
                  <span className="text-[#2F3640]/80">{detailModalProduct.packagingOrContainer || 'Envoltura de floristería artesanal'}</span>
                </div>

                <div className="p-3.5 rounded-xl border border-[#2E8B57]/15 bg-white">
                  <strong className="text-[#1E5A3A] block mb-1 font-semibold">🏷️ Qué incluye:</strong>
                  <span className="text-[#2F3640]/80">{detailModalProduct.priceIncludes || 'Arreglo floral armado y tarjeta dedicatoria'}</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 sm:p-5 border-t border-[#2E8B57]/15 bg-[#F8F5F0] flex flex-wrap items-center justify-between gap-3 sticky bottom-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleShareProduct(detailModalProduct)}
                  className="p-2.5 rounded-xl border border-[#2E8B57]/30 text-[#1E5A3A] hover:bg-[#2E8B57]/10 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                  title="Compartir este producto"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Compartir</span>
                </button>

                <button
                  onClick={() => handleSingleProductWhatsApp(detailModalProduct)}
                  className="bg-[#25D366] hover:bg-[#1EBE5D] text-white px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Consultar solo este</span>
                </button>
              </div>

              <button
                onClick={() => handleAddAndClose(detailModalProduct)}
                className="btn-cta text-sm !min-h-[46px] !px-6"
              >
                <span>Añadir {detailQuantity > 1 ? `(${detailQuantity})` : ''} a mi consulta</span>
                <span className="btn-cta__flecha text-lg" aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating temporary toast notice */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1E5A3A] text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow-lg animate-in fade-in slide-in-from-bottom-2">
          {toastMessage}
        </div>
      )}
    </section>
  );
};
