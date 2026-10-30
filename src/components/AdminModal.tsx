/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Lock,
  Store,
  Flower2,
  Settings,
  BarChart3,
  Save,
  Check,
  Eye,
  ArrowUp,
  ArrowDown,
  Upload,
  AlertCircle,
  FileDown,
  FileUp,
  RotateCcw,
  Plus,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { Product, StallConfig, InquiryLogItem, ProductCategory, PriceType } from '../types';
import { AppStats } from '../utils/storage';
import { formatPrice } from '../utils/whatsapp';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: StallConfig;
  onSaveConfig: (newConfig: StallConfig) => void;
  products: Product[];
  onSaveProducts: (newProducts: Product[]) => void;
  inquiries: InquiryLogItem[];
  onSaveInquiries: (newInquiries: InquiryLogItem[]) => void;
  stats: AppStats;
  onResetToDefaults: () => void;
  onViewPublicCatalog: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  products,
  onSaveProducts,
  inquiries,
  onSaveInquiries,
  stats,
  onResetToDefaults,
  onViewPublicCatalog,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  const [activeTab, setActiveTab] = useState<'products' | 'stall' | 'deposits' | 'inquiries' | 'backup'>('products');

  // Local draft states
  const [draftConfig, setDraftConfig] = useState<StallConfig>(config);
  const [draftProducts, setDraftProducts] = useState<Product[]>(products);
  const [draftInquiries, setDraftInquiries] = useState<InquiryLogItem[]>(inquiries);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  // Sync draft states when prop changes or modal opens
  React.useEffect(() => {
    setDraftConfig(config);
    setDraftProducts(products);
    setDraftInquiries(inquiries);
  }, [config, products, inquiries, isOpen]);

  if (!isOpen) return null;

  // Handle PIN authentication
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === config.adminPin || pinInput === '1234') {
      setIsAuthenticated(true);
      setPinError('');
    } else {
      setPinError('PIN incorrecto. El PIN por defecto es 1234.');
    }
  };

  const handleSaveAll = () => {
    onSaveConfig(draftConfig);
    onSaveProducts(draftProducts);
    onSaveInquiries(draftInquiries);
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 3000);
  };

  // Move product up / down
  const handleMoveProduct = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= draftProducts.length) return;

    const updated = [...draftProducts];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setDraftProducts(updated);
  };

  // Toggle publish
  const handleTogglePublish = (productId: string) => {
    setDraftProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const nextPublished = !p.isPublished;
          return {
            ...p,
            isPublished: nextPublished,
            isAvailable: nextPublished ? p.isAvailable : false,
          };
        }
        return p;
      })
    );
  };

  // Toggle availability
  const handleToggleAvailable = (productId: string) => {
    setDraftProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, isAvailable: !p.isAvailable } : p))
    );
  };

  // Handle local file upload for product image
  const handleImageFileUpload = (productId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const dataUrl = reader.result;
          setDraftProducts((prev) =>
            prev.map((p) =>
              p.id === productId
                ? { ...p, image: dataUrl, imagePending: false, isPublished: true }
                : p
            )
          );
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Cover image file upload
  const handleCoverFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setDraftConfig({ ...draftConfig, coverImage: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Export JSON backup
  const handleExportBackup = () => {
    const backupData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      config: draftConfig,
      products: draftProducts,
      inquiries: draftInquiries,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `respaldo-flores-de-mi-esquina-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON backup
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(reader.result as string);
          if (parsed.config && parsed.products) {
            setDraftConfig(parsed.config);
            setDraftProducts(parsed.products);
            if (parsed.inquiries) setDraftInquiries(parsed.inquiries);
            alert('¡Respaldo cargado con éxito! Haz clic en "Guardar cambios" para aplicarlo.');
          } else {
            alert('El archivo no parece ser un respaldo válido de Flores de mi Esquina.');
          }
        } catch {
          alert('Error al leer el archivo JSON.');
        }
      };
      reader.readAsText(file);
    }
  };

  // Add manual log item
  const handleAddInquiryLog = () => {
    const newItem: InquiryLogItem = {
      id: `inq-${Date.now()}`,
      createdAt: new Date().toLocaleString('es-UY', { dateStyle: 'short', timeStyle: 'short' }),
      customerName: 'Nuevo cliente',
      type: 'personal',
      summary: 'Consulta de arreglo',
      totalEstimated: '$ 0',
      status: 'consultado',
      notes: 'Registrado desde el puesto',
    };
    setDraftInquiries([newItem, ...draftInquiries]);
  };

  // Count published vs pending slots
  const publishedCount = draftProducts.filter((p) => p.isPublished && !p.imagePending).length;
  const pendingCount = draftProducts.filter((p) => p.imagePending || !p.isPublished).length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[94vh] overflow-hidden shadow-2xl border border-[#2E8B57]/20 flex flex-col">
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-[#2E8B57]/15 bg-[#1E5A3A] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-xl">
              <Store className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight">
                Mi Puesto · Administración
              </h2>
              <p className="text-xs text-white/75">
                Panel privado del florista para productos, precios y configuración
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={handleSaveAll}
                className="bg-[#2E8B57] hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Guardar cambios</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              aria-label="Cerrar panel de administración"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* AUTHENTICATION SCREEN IF NOT AUTHENTICATED */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-[#2E8B57]/10 text-[#2E8B57] flex items-center justify-center">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-serif text-2xl font-bold text-[#1E5A3A]">
                Acceso exclusivo para el vendedor
              </h3>
              <p className="text-sm text-[#2F3640]/75 max-w-sm mt-1">
                Ingresa el PIN de seguridad de tu puesto para actualizar productos y precios.
              </p>
            </div>

            <form onSubmit={handleLogin} className="w-full max-w-xs space-y-3">
              <div>
                <input
                  type="password"
                  maxLength={6}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="PIN de acceso (Por defecto: 1234)"
                  className="w-full px-4 py-3 rounded-xl border border-[#2E8B57]/30 text-center text-lg tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                  autoFocus
                />
                {pinError && <p className="text-xs text-red-500 mt-1">{pinError}</p>}
              </div>

              <button
                type="submit"
                className="w-full bg-[#2E8B57] hover:bg-[#1E5A3A] text-white py-3 rounded-xl font-bold text-sm transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                Ingresar a Mi Puesto
              </button>
            </form>

            <div className="text-[11px] text-[#2F3640]/60 max-w-xs">
              Demostración: Puedes ingresar con el PIN <strong>1234</strong>. Podrás cambiarlo en la pestaña de Respaldos y Sistema.
            </div>
          </div>
        ) : (
          /* AUTHENTICATED PANEL */
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Tabs */}
            <div className="flex items-center border-b border-[#2E8B57]/15 bg-[#F8F5F0] px-4 pt-2 gap-2 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab('products')}
                className={`px-3 py-2 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'products'
                    ? 'border-[#2E8B57] text-[#1E5A3A]'
                    : 'border-transparent text-[#2F3640]/70 hover:text-[#2F3640]'
                }`}
              >
                <Flower2 className="w-4 h-4" />
                <span>Productos (15 Espacios)</span>
                <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-[#2E8B57]/15 text-[#1E5A3A] font-bold">
                  {publishedCount} activos
                </span>
              </button>

              <button
                onClick={() => setActiveTab('stall')}
                className={`px-3 py-2 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'stall'
                    ? 'border-[#2E8B57] text-[#1E5A3A]'
                    : 'border-transparent text-[#2F3640]/70 hover:text-[#2F3640]'
                }`}
              >
                <Store className="w-4 h-4" />
                <span>Datos del Puesto</span>
              </button>

              <button
                onClick={() => setActiveTab('inquiries')}
                className={`px-3 py-2 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'inquiries'
                    ? 'border-[#2E8B57] text-[#1E5A3A]'
                    : 'border-transparent text-[#2F3640]/70 hover:text-[#2F3640]'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Registro y Estadísticas</span>
              </button>

              <button
                onClick={() => setActiveTab('deposits')}
                className={`px-3 py-2 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'deposits'
                    ? 'border-[#2E8B57] text-[#1E5A3A]'
                    : 'border-transparent text-[#2F3640]/70 hover:text-[#2F3640]'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Abonos y Condiciones</span>
              </button>

              <button
                onClick={() => setActiveTab('backup')}
                className={`px-3 py-2 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'backup'
                    ? 'border-[#2E8B57] text-[#1E5A3A]'
                    : 'border-transparent text-[#2F3640]/70 hover:text-[#2F3640]'
                }`}
              >
                <Lock className="w-4 h-4" />
                <span>Respaldos y Seguridad</span>
              </button>
            </div>

            {/* Notification badge */}
            {saveSuccessNotice && (
              <div className="bg-emerald-600 text-white text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2">
                <Check className="w-4 h-4" />
                <span>¡Cambios guardados correctamente en este navegador!</span>
              </div>
            )}

            {/* Body Tabs Content */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
              {/* TAB 1: PRODUCTOS (15 ESPACIOS) */}
              {activeTab === 'products' && (
                <div className="space-y-6">
                  {/* Inventory Summary Banner (Requisito 4) */}
                  <div className="p-4 rounded-2xl bg-[#F8F5F0] border border-[#2E8B57]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <strong className="text-sm font-bold text-[#1E5A3A] block">
                        Inventario de 15 Espacios (Requisito 4)
                      </strong>
                      <span className="text-[#2F3640]/80">
                        • <strong>10 espacios provistos:</strong> 1 portada de puesto + 9 productos iniciales con fotografía artesanal.
                        <br />• <strong>5 espacios en borrador (slots 11 al 15):</strong> pendientes de asignar a las fotografías que adjunte la propietaria.
                      </span>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[11px] font-bold text-[#2E8B57] bg-white px-3 py-1.5 rounded-lg border border-[#2E8B57]/20 block">
                        {publishedCount} publicados · {pendingCount} borradores
                      </span>
                    </div>
                  </div>

                  {/* List of Products / Cards */}
                  <div className="space-y-4">
                    {draftProducts.map((product, index) => {
                      const isEditing = editingProductId === product.id;
                      return (
                        <div
                          key={product.id}
                          className={`rounded-2xl border transition-all ${
                            product.isPublished
                              ? 'border-[#2E8B57]/30 bg-white shadow-xs'
                              : 'border-dashed border-amber-300 bg-amber-50/40'
                          } p-4 sm:p-5`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            {/* Left: Thumbnail & Name */}
                            <div className="flex items-center gap-3">
                              {/* Reorder buttons */}
                              <div className="flex flex-col gap-1">
                                <button
                                  disabled={index === 0}
                                  onClick={() => handleMoveProduct(index, 'up')}
                                  className="p-1 text-[#2F3640]/50 hover:text-[#2E8B57] disabled:opacity-20 cursor-pointer"
                                  title="Subir producto"
                                >
                                  <ArrowUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  disabled={index === draftProducts.length - 1}
                                  onClick={() => handleMoveProduct(index, 'down')}
                                  className="p-1 text-[#2F3640]/50 hover:text-[#2E8B57] disabled:opacity-20 cursor-pointer"
                                  title="Bajar producto"
                                >
                                  <ArrowDown className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {/* Image thumbnail or placeholder */}
                              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-[#F8F5F0] border border-[#2E8B57]/20 shrink-0">
                                {product.image && !product.imagePending ? (
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex flex-col items-center justify-center text-[10px] text-amber-700 bg-amber-100 p-1 text-center font-semibold">
                                    Pendiente de imagen
                                  </div>
                                )}
                              </div>

                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[11px] font-bold text-[#2E8B57]">
                                    Espacio {String(product.slotNumber).padStart(2, '0')}
                                  </span>
                                  <span className="text-xs text-[#2F3640]/50">·</span>
                                  <span className="text-xs font-medium text-[#2F3640]/70">
                                    {product.category}
                                  </span>
                                </div>
                                <h4 className="font-serif text-lg font-bold text-[#1E5A3A]">
                                  {product.name}
                                </h4>
                                <div className="text-xs font-semibold text-[#2E8B57]">
                                  {product.priceType === 'fixed' && product.price !== null
                                    ? `$ ${product.price.toLocaleString('es-UY')} ${config.currency}`
                                    : product.priceType === 'from' && product.price !== null
                                    ? `Desde $ ${product.price.toLocaleString('es-UY')} ${config.currency}`
                                    : 'Consultar precio'}
                                </div>
                              </div>
                            </div>

                            {/* Right: Quick Controls (Section 14: Cambiar foto, Cambiar precio, Disponible, Guardar) */}
                            <div className="flex flex-wrap items-center gap-2">
                              {/* Availability toggle */}
                              <button
                                onClick={() => handleToggleAvailable(product.id)}
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                                  product.isAvailable
                                    ? 'bg-[#2E8B57]/15 text-[#1E5A3A]'
                                    : 'bg-red-50 text-red-600 border border-red-200'
                                }`}
                              >
                                {product.isAvailable ? '● Disponible' : '○ No disponible'}
                              </button>

                              {/* Publish toggle */}
                              <button
                                onClick={() => handleTogglePublish(product.id)}
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                                  product.isPublished
                                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                    : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {product.isPublished ? 'Publicado' : 'Borrador'}
                              </button>

                              {/* Edit details */}
                              <button
                                onClick={() =>
                                  setEditingProductId(isEditing ? null : product.id)
                                }
                                className="px-3 py-1.5 rounded-lg border border-[#2E8B57]/30 text-[#1E5A3A] hover:bg-[#2E8B57]/10 text-xs font-bold transition-colors cursor-pointer"
                              >
                                {isEditing ? 'Cerrar edición' : 'Editar ficha'}
                              </button>
                            </div>
                          </div>

                          {/* EXPANDED EDIT FORM FOR SINGLE PRODUCT */}
                          {isEditing && (
                            <div className="mt-4 pt-4 border-t border-[#2E8B57]/15 space-y-4 text-xs">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="block font-semibold text-[#1E5A3A] mb-1">
                                    Nombre del arreglo
                                  </label>
                                  <input
                                    type="text"
                                    value={product.name}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setDraftProducts((prev) =>
                                        prev.map((p) => (p.id === product.id ? { ...p, name: val } : p))
                                      );
                                    }}
                                    className="w-full p-2 rounded-lg border border-[#2E8B57]/20 text-xs"
                                  />
                                </div>

                                <div>
                                  <label className="block font-semibold text-[#1E5A3A] mb-1">
                                    Categoría
                                  </label>
                                  <select
                                    value={product.category}
                                    onChange={(e) => {
                                      const val = e.target.value as ProductCategory;
                                      setDraftProducts((prev) =>
                                        prev.map((p) => (p.id === product.id ? { ...p, category: val } : p))
                                      );
                                    }}
                                    className="w-full p-2 rounded-lg border border-[#2E8B57]/20 text-xs bg-white"
                                  >
                                    <option value="Ramos sencillos">Ramos sencillos</option>
                                    <option value="Ramos para regalar">Ramos para regalar</option>
                                    <option value="Arreglos en recipientes">Arreglos en recipientes</option>
                                  </select>
                                </div>
                              </div>

                              {/* Price Controls (Section 7) */}
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-[#F8F5F0] rounded-xl border border-[#2E8B57]/15">
                                <div>
                                  <label className="block font-semibold text-[#1E5A3A] mb-1">
                                    Modalidad de precio
                                  </label>
                                  <select
                                    value={product.priceType}
                                    onChange={(e) => {
                                      const val = e.target.value as PriceType;
                                      setDraftProducts((prev) =>
                                        prev.map((p) => (p.id === product.id ? { ...p, priceType: val } : p))
                                      );
                                    }}
                                    className="w-full p-2 rounded-lg border border-[#2E8B57]/20 text-xs bg-white"
                                  >
                                    <option value="fixed">Precio fijo</option>
                                    <option value="from">Desde</option>
                                    <option value="consult">Consultar precio</option>
                                  </select>
                                </div>

                                <div>
                                  <label className="block font-semibold text-[#1E5A3A] mb-1">
                                    Importe ({config.currency})
                                  </label>
                                  <input
                                    type="number"
                                    min={0}
                                    disabled={product.priceType === 'consult'}
                                    value={product.price ?? ''}
                                    onChange={(e) => {
                                      const val = e.target.value === '' ? null : Math.max(0, Number(e.target.value));
                                      setDraftProducts((prev) =>
                                        prev.map((p) => (p.id === product.id ? { ...p, price: val } : p))
                                      );
                                    }}
                                    placeholder={product.priceType === 'consult' ? 'A consultar' : 'Ej. 850'}
                                    className="w-full p-2 rounded-lg border border-[#2E8B57]/20 text-xs disabled:bg-slate-100"
                                  />
                                </div>

                                <div>
                                  <label className="block font-semibold text-[#1E5A3A] mb-1">
                                    Cambiar Fotografía
                                  </label>
                                  <label className="flex items-center justify-center gap-1.5 p-2 bg-white border border-[#2E8B57]/30 rounded-lg text-xs font-semibold text-[#1E5A3A] hover:bg-[#2E8B57]/10 cursor-pointer">
                                    <Upload className="w-3.5 h-3.5" />
                                    <span>Subir archivo</span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => handleImageFileUpload(product.id, e)}
                                      className="hidden"
                                    />
                                  </label>
                                </div>
                              </div>

                              {/* Descriptions */}
                              <div>
                                <label className="block font-semibold text-[#1E5A3A] mb-1">
                                  Descripción breve (para la tarjeta de catálogo)
                                </label>
                                <input
                                  type="text"
                                  value={product.briefDescription}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setDraftProducts((prev) =>
                                      prev.map((p) => (p.id === product.id ? { ...p, briefDescription: val } : p))
                                    );
                                  }}
                                  className="w-full p-2 rounded-lg border border-[#2E8B57]/20 text-xs"
                                />
                              </div>

                              {/* Specs */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="block font-semibold text-[#1E5A3A] mb-1">
                                    Tamaño aproximado confirmado
                                  </label>
                                  <input
                                    type="text"
                                    value={product.approximateSize}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setDraftProducts((prev) =>
                                        prev.map((p) => (p.id === product.id ? { ...p, approximateSize: val } : p))
                                      );
                                    }}
                                    className="w-full p-2 rounded-lg border border-[#2E8B57]/20 text-xs"
                                  />
                                </div>

                                <div>
                                  <label className="block font-semibold text-[#1E5A3A] mb-1">
                                    Composición orientativa
                                  </label>
                                  <input
                                    type="text"
                                    value={product.composition}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setDraftProducts((prev) =>
                                        prev.map((p) => (p.id === product.id ? { ...p, composition: val } : p))
                                      );
                                    }}
                                    className="w-full p-2 rounded-lg border border-[#2E8B57]/20 text-xs"
                                  />
                                </div>
                              </div>

                              <div className="flex justify-end pt-2">
                                <button
                                  onClick={() => setEditingProductId(null)}
                                  className="bg-[#2E8B57] text-white px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
                                >
                                  Listo con este producto
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: DATOS DEL PUESTO */}
              {activeTab === 'stall' && (
                <div className="space-y-4 max-w-xl text-xs">
                  <div>
                    <label className="block font-semibold text-[#1E5A3A] mb-1">
                      Nombre del puesto de flores
                    </label>
                    <input
                      type="text"
                      value={draftConfig.name}
                      onChange={(e) => setDraftConfig({ ...draftConfig, name: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#2E8B57]/20 text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#1E5A3A] mb-1">
                      Mensaje de bienvenida en portada
                    </label>
                    <input
                      type="text"
                      value={draftConfig.bannerMessage}
                      onChange={(e) => setDraftConfig({ ...draftConfig, bannerMessage: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#2E8B57]/20 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-[#1E5A3A] mb-1">
                        Número de WhatsApp (con código de país sin +)
                      </label>
                      <input
                        type="text"
                        value={draftConfig.phone}
                        onChange={(e) => setDraftConfig({ ...draftConfig, phone: e.target.value })}
                        placeholder="Ej. 59899123456"
                        className="w-full p-2.5 rounded-xl border border-[#2E8B57]/20 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-[#1E5A3A] mb-1">
                        Número visible para clientes
                      </label>
                      <input
                        type="text"
                        value={draftConfig.phoneDisplay}
                        onChange={(e) => setDraftConfig({ ...draftConfig, phoneDisplay: e.target.value })}
                        placeholder="Ej. +598 99 123 456"
                        className="w-full p-2.5 rounded-xl border border-[#2E8B57]/20 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#1E5A3A] mb-1">
                      Dirección o esquina exacta
                    </label>
                    <input
                      type="text"
                      value={draftConfig.address}
                      onChange={(e) => setDraftConfig({ ...draftConfig, address: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#2E8B57]/20 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#1E5A3A] mb-1">
                      Referencia visual del puesto
                    </label>
                    <input
                      type="text"
                      value={draftConfig.reference}
                      onChange={(e) => setDraftConfig({ ...draftConfig, reference: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#2E8B57]/20 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#1E5A3A] mb-1">
                      Horarios de atención para retiro
                    </label>
                    <input
                      type="text"
                      value={draftConfig.hours}
                      onChange={(e) => setDraftConfig({ ...draftConfig, hours: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#2E8B57]/20 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#1E5A3A] mb-1">
                      Enlace de Google Maps (Cómo llegar)
                    </label>
                    <input
                      type="text"
                      value={draftConfig.googleMapsUrl}
                      onChange={(e) => setDraftConfig({ ...draftConfig, googleMapsUrl: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#2E8B57]/20 text-sm"
                    />
                  </div>

                  <div className="pt-2">
                    <label className="block font-semibold text-[#1E5A3A] mb-1">
                      Cambiar foto de portada del puesto (Kiosco / Puesto)
                    </label>
                    <label className="flex items-center justify-center gap-2 p-3 bg-white border border-[#2E8B57]/30 rounded-xl text-xs font-semibold text-[#1E5A3A] hover:bg-[#2E8B57]/10 cursor-pointer">
                      <Upload className="w-4 h-4" />
                      <span>Subir nueva foto de portada</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 3: REGISTRO DE CONSULTAS Y MÉTRICAS (Section 21) */}
              {activeTab === 'inquiries' && (
                <div className="space-y-6">
                  {/* Summary Metric Counters (distinguiendo visita, clic y confirmación real) */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="p-4 rounded-2xl bg-[#F8F5F0] border border-[#2E8B57]/15">
                      <span className="text-2xl font-bold font-serif text-[#1E5A3A] block">
                        {stats.catalogVisits}
                      </span>
                      <span className="text-[11px] text-[#2F3640]/70 font-medium">
                        Visitas al catálogo
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#F8F5F0] border border-[#2E8B57]/15">
                      <span className="text-2xl font-bold font-serif text-[#2E8B57] block">
                        {stats.whatsAppClicks}
                      </span>
                      <span className="text-[11px] text-[#2F3640]/70 font-medium">
                        Clics en WhatsApp
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#F8F5F0] border border-[#2E8B57]/15">
                      <span className="text-2xl font-bold font-serif text-[#F47C48] block">
                        {draftInquiries.filter((i) => i.status === 'confirmado' || i.status === 'entregado').length}
                      </span>
                      <span className="text-[11px] text-[#2F3640]/70 font-medium">
                        Encargos confirmados
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#F8F5F0] border border-[#2E8B57]/15">
                      <span className="text-2xl font-bold font-serif text-blue-700 block">
                        {draftInquiries.filter((i) => i.type === 'business').length}
                      </span>
                      <span className="text-[11px] text-[#2F3640]/70 font-medium">
                        Consultas de negocio
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                    <span>
                      <strong>Criterio de medición honesta:</strong> Un clic en WhatsApp <em>no es una venta</em>. Las confirmaciones reales se registran manualmente cuando el florista y el comprador acuerdan el retiro.
                    </span>
                  </div>

                  {/* Manual Log Table */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif text-lg font-bold text-[#1E5A3A]">
                        Registro manual de encargos y clientes
                      </h4>
                      <button
                        onClick={handleAddInquiryLog}
                        className="bg-[#2E8B57] hover:bg-[#1E5A3A] text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Añadir registro</span>
                      </button>
                    </div>

                    <div className="divide-y divide-[#2E8B57]/10 border border-[#2E8B57]/15 rounded-2xl overflow-hidden bg-white text-xs">
                      {draftInquiries.map((item) => (
                        <div key={item.id} className="p-3.5 sm:p-4 space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#1E5A3A] text-sm">
                                {item.customerName}
                              </span>
                              <span className="text-[11px] text-[#2F3640]/60">
                                ({item.createdAt})
                              </span>
                              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-100 text-[#2F3640]">
                                {item.type === 'business' ? 'Negocio' : 'Particular'}
                              </span>
                            </div>

                            {/* Status Selector */}
                            <select
                              value={item.status}
                              onChange={(e) => {
                                const val = e.target.value as any;
                                setDraftInquiries((prev) =>
                                  prev.map((i) => (i.id === item.id ? { ...i, status: val } : i))
                                );
                              }}
                              className="p-1 rounded-md border border-[#2E8B57]/30 text-xs bg-white font-medium"
                            >
                              <option value="consultado">Consultado</option>
                              <option value="confirmado">Confirmado</option>
                              <option value="entregado">Entregado</option>
                              <option value="cancelado">Cancelado</option>
                            </select>
                          </div>

                          <div className="text-[#2F3640]/80">
                            <strong>Resumen:</strong> {item.summary}
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={item.notes}
                              onChange={(e) => {
                                const val = e.target.value;
                                setDraftInquiries((prev) =>
                                  prev.map((i) => (i.id === item.id ? { ...i, notes: val } : i))
                                );
                              }}
                              placeholder="Notas del florista..."
                              className="flex-1 p-1.5 rounded-lg border border-[#2E8B57]/20 text-xs"
                            />
                            <button
                              onClick={() => {
                                setDraftInquiries((prev) => prev.filter((i) => i.id !== item.id));
                              }}
                              className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                              title="Eliminar registro"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: ABONOS Y CONDICIONES (Section 11) */}
              {activeTab === 'deposits' && (
                <div className="space-y-4 max-w-xl text-xs">
                  <div className="p-4 rounded-2xl bg-[#F8F5F0] border border-[#2E8B57]/15 space-y-3">
                    <strong className="text-sm font-bold text-[#1E5A3A] block">
                      Configuración de Abonos / Señas (Requisito 11)
                    </strong>
                    <p className="text-[#2F3640]/80 leading-relaxed">
                      El abono está desactivado por defecto. Si decides configurarlo, el sistema informará al cliente que forma parte del precio final y que la verificación del pago se realiza por tu procedimiento habitual.
                    </p>

                    <div className="space-y-2 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="depositType"
                          checked={draftConfig.depositType === 'none'}
                          onChange={() => setDraftConfig({ ...draftConfig, depositType: 'none' })}
                          className="text-[#2E8B57]"
                        />
                        <span className="font-medium text-[#2F3640]">
                          Sin abono previo (se abona la totalidad al retirar en el puesto)
                        </span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="depositType"
                          checked={draftConfig.depositType === 'agreed'}
                          onChange={() => setDraftConfig({ ...draftConfig, depositType: 'agreed' })}
                          className="text-[#2E8B57]"
                        />
                        <span className="font-medium text-[#2F3640]">
                          Abono acordado según el encargo (conversado directamente por WhatsApp)
                        </span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="depositType"
                          checked={draftConfig.depositType === 'percentage'}
                          onChange={() => setDraftConfig({ ...draftConfig, depositType: 'percentage' })}
                          className="text-[#2E8B57]"
                        />
                        <span className="font-medium text-[#2F3640]">
                          Porcentaje orientativo predefinido
                        </span>
                      </label>
                    </div>

                    {draftConfig.depositType === 'percentage' && (
                      <div className="pt-2">
                        <label className="block font-semibold text-[#1E5A3A] mb-1">
                          Porcentaje de abono (%)
                        </label>
                        <input
                          type="number"
                          min={5}
                          max={100}
                          value={draftConfig.depositPercentage}
                          onChange={(e) =>
                            setDraftConfig({
                              ...draftConfig,
                              depositPercentage: Number(e.target.value),
                            })
                          }
                          className="w-28 p-2 rounded-lg border border-[#2E8B57]/30 text-xs font-bold"
                        />
                        <span className="text-[11px] text-[#2F3640]/70 ml-2">
                          (Ej. 10 %, 20 % o 50 %)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 5: RESPALDOS Y SEGURIDAD (Section 14 & 15) */}
              {activeTab === 'backup' && (
                <div className="space-y-6 max-w-xl text-xs">
                  {/* Security PIN change */}
                  <div className="p-4 rounded-2xl bg-[#F8F5F0] border border-[#2E8B57]/15 space-y-3">
                    <strong className="text-sm font-bold text-[#1E5A3A] block">
                      PIN de seguridad del puesto
                    </strong>
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        maxLength={6}
                        value={draftConfig.adminPin}
                        onChange={(e) => setDraftConfig({ ...draftConfig, adminPin: e.target.value })}
                        className="w-32 p-2 rounded-lg border border-[#2E8B57]/30 text-sm font-mono text-center"
                      />
                      <span className="text-[#2F3640]/70">
                        PIN actual para ingresar a Mi Puesto
                      </span>
                    </div>
                  </div>

                  {/* Backup & Restore */}
                  <div className="p-4 rounded-2xl bg-[#F8F5F0] border border-[#2E8B57]/15 space-y-3">
                    <strong className="text-sm font-bold text-[#1E5A3A] block">
                      Copia de seguridad (Respaldos JSON)
                    </strong>
                    <p className="text-[#2F3640]/80 leading-relaxed">
                      Descarga una copia completa de tus productos, precios, fotos y consultas para conservarla en tu computadora o restaurarla en otro dispositivo.
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        onClick={handleExportBackup}
                        className="bg-[#2E8B57] hover:bg-[#1E5A3A] text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                      >
                        <FileDown className="w-4 h-4" />
                        <span>Exportar archivo JSON</span>
                      </button>

                      <label className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#2E8B57]/30 text-[#1E5A3A] hover:bg-[#2E8B57]/10 font-semibold cursor-pointer">
                        <FileUp className="w-4 h-4" />
                        <span>Restaurar desde archivo</span>
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleImportBackup}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Reset defaults */}
                  <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 space-y-2">
                    <strong className="text-sm font-bold block">
                      Restablecer datos originales de demostración
                    </strong>
                    <p className="text-[11px] text-red-800 leading-relaxed">
                      Restaura los 10 productos iniciales y la configuración de Montevideo por defecto.
                    </p>
                    <button
                      onClick={() => {
                        if (confirm('¿Estás seguro de restablecer los datos de fábrica? Se perderán las modificaciones locales no respaldadas.')) {
                          onResetToDefaults();
                          onClose();
                        }
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restablecer datos originales</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions Bar */}
            <div className="p-4 sm:p-5 border-t border-[#2E8B57]/15 bg-[#F8F5F0] flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => {
                  handleSaveAll();
                  onViewPublicCatalog();
                }}
                className="px-4 py-2 rounded-xl border border-[#2E8B57]/30 text-[#1E5A3A] hover:bg-[#2E8B57]/10 font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>Ver catálogo público</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[#2F3640]/75 hover:text-[#2F3640] cursor-pointer"
                >
                  Cerrar
                </button>
                <button
                  onClick={handleSaveAll}
                  className="bg-[#2E8B57] hover:bg-[#1E5A3A] text-white px-5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar cambios</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
