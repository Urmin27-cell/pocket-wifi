import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/Toast';
import { LanguageProvider } from './i18n/LanguageContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AnnouncementBar } from './components/AnnouncementBar';
import { ProductDetailModal } from './components/ProductDetailModal';
import { OrderModal } from './components/OrderModal';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './admin/AdminPage';
import { Product, SiteSettings } from './types';
import { getProducts } from './services/productService';
import { getSiteSettings, DEFAULT_SITE_SETTINGS } from './services/siteSettingsService';
import { testConnection } from './firebase/config';
import { INITIAL_PRODUCTS } from './services/seedData';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [loading, setLoading] = useState<boolean>(true);

  // Modals state
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [orderProduct, setOrderProduct] = useState<Product | null>(null);
  const [orderQuantity, setOrderQuantity] = useState<number>(1);

  const fetchStoreData = async () => {
    try {
      const [fetchedSettings, fetchedProducts] = await Promise.all([
        getSiteSettings(),
        getProducts(false), // only active products for public storefront
      ]);

      if (fetchedSettings) {
        setSettings(fetchedSettings);
      }

      // If database is brand new and has no products yet, display default realistic seed items
      if (fetchedProducts && fetchedProducts.length > 0) {
        setProducts(fetchedProducts);
      } else {
        const fallbackItems: Product[] = INITIAL_PRODUCTS.map((p, idx) => ({
          ...p,
          id: 'demo_' + (idx + 1),
        }));
        setProducts(fallbackItems);
      }
    } catch (err) {
      console.warn('Tsy nahomby ny fakana ny angona voalohany:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testConnection();
    fetchStoreData();
  }, []);

  const handleOpenDetail = (product: Product) => {
    setDetailProduct(product);
  };

  const handleCloseDetail = () => {
    setDetailProduct(null);
  };

  const handleOpenOrder = (product: Product, quantity: number = 1) => {
    setOrderProduct(product);
    setOrderQuantity(quantity);
    // Close detail modal if open
    setDetailProduct(null);
  };

  const handleCloseOrder = () => {
    setOrderProduct(null);
  };

  return (
    <ToastProvider>
      <LanguageProvider>
        <BrowserRouter>
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
          <Routes>
            {/* Admin Dedicated Route (standalone layout) */}
            <Route
              path="/admin/*"
              element={
                <AdminPage
                  settings={settings}
                  onRefreshGlobalSettings={fetchStoreData}
                />
              }
            />

            {/* Public Storefront Routes */}
            <Route
              path="*"
              element={
                <>
                  <AnnouncementBar settings={settings} />
                  <Navbar settings={settings} />

                  <main className="flex-1">
                    <Routes>
                      <Route
                        path="/"
                        element={
                          <HomePage
                            products={products}
                            settings={settings}
                            onSelectProduct={handleOpenDetail}
                            onOrderProduct={(p) => handleOpenOrder(p, 1)}
                          />
                        }
                      />
                      <Route
                        path="/vokatra"
                        element={
                          <CatalogPage
                            products={products}
                            onSelectProduct={handleOpenDetail}
                            onOrderProduct={(p) => handleOpenOrder(p, 1)}
                          />
                        }
                      />
                      <Route
                        path="/momba-anay"
                        element={<AboutPage settings={settings} />}
                      />
                      <Route
                        path="/fifandraisana"
                        element={<ContactPage settings={settings} />}
                      />
                    </Routes>
                  </main>

                  <Footer settings={settings} />

                  {/* Modals */}
                  <ProductDetailModal
                    product={detailProduct}
                    onClose={handleCloseDetail}
                    onOrder={(p, q) => handleOpenOrder(p, q)}
                  />

                  <OrderModal
                    product={orderProduct}
                    initialQuantity={orderQuantity}
                    settings={settings}
                    isOpen={!!orderProduct}
                    onClose={handleCloseOrder}
                  />
                </>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
      </LanguageProvider>
    </ToastProvider>
  );
}
