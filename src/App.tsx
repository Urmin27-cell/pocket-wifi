import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ToastProvider } from './components/Toast';
import { LanguageProvider } from './i18n/LanguageContext';
import { ThemeProvider, useTheme } from './components/ThemeContext';
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

// Inner component with hooks for keyboard shortcut and URL query navigation
function AppContent({
  products,
  settings,
  fetchStoreData,
  detailProduct,
  setDetailProduct,
  orderProduct,
  setOrderProduct,
  orderQuantity,
  setOrderQuantity,
}: {
  products: Product[];
  settings: SiteSettings;
  fetchStoreData: () => Promise<void>;
  detailProduct: Product | null;
  setDetailProduct: (p: Product | null) => void;
  orderProduct: Product | null;
  setOrderProduct: (p: Product | null) => void;
  orderQuantity: number;
  setOrderQuantity: (q: number) => void;
}) {
  const navigate = useNavigate();
  const { theme } = useTheme();

  useEffect(() => {
    // Check URL query param (?redirect, ?admin, ?page=admin) or hash (#/admin, #admin)
    const params = new URLSearchParams(window.location.search);
    const redirectParam = params.get('redirect');
    if (redirectParam) {
      try {
        const decoded = decodeURIComponent(redirectParam);
        navigate(decoded, { replace: true });
      } catch {
        navigate('/admin', { replace: true });
      }
    } else if (
      params.has('admin') ||
      params.get('page') === 'admin' ||
      window.location.hash === '#admin' ||
      window.location.hash === '#/admin' ||
      window.location.hash.startsWith('#/admin') ||
      window.location.hash.startsWith('#admin')
    ) {
      navigate('/admin', { replace: true });
    }

    const handleHashChange = () => {
      const currentHash = window.location.hash;
      if (
        currentHash === '#admin' ||
        currentHash === '#/admin' ||
        currentHash.startsWith('#/admin') ||
        currentHash.startsWith('#admin')
      ) {
        navigate('/admin', { replace: true });
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + Shift + A or Cmd + Shift + A
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        navigate('/admin');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate]);

  const handleOpenDetail = (product: Product) => {
    setDetailProduct(product);
  };

  const handleCloseDetail = () => {
    setDetailProduct(null);
  };

  const handleOpenOrder = (product: Product, quantity: number = 1) => {
    setOrderProduct(product);
    setOrderQuantity(quantity);
    setDetailProduct(null);
  };

  const handleCloseOrder = () => {
    setOrderProduct(null);
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      theme === 'light'
        ? 'bg-white text-slate-900 selection:bg-red-500 selection:text-white'
        : 'bg-slate-950 text-slate-100 selection:bg-red-500 selection:text-slate-950'
    }`}>
      <Routes>
        {/* Dedicated Admin Routes (both exact and wildcard) */}
        <Route
          path="/admin"
          element={
            <AdminPage
              settings={settings}
              onRefreshGlobalSettings={fetchStoreData}
            />
          }
        />
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
  );
}

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
        getProducts(false),
      ]);

      if (fetchedSettings) {
        setSettings(fetchedSettings);
      }

      setProducts(fetchedProducts || []);
    } catch (err) {
      console.warn('Tsy nahomby ny fakana ny angona voalohany:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testConnection();
    fetchStoreData();

    const handleProductsUpdated = () => {
      fetchStoreData();
    };

    window.addEventListener('boxwifi_products_updated', handleProductsUpdated);
    return () => {
      window.removeEventListener('boxwifi_products_updated', handleProductsUpdated);
    };
  }, []);

  return (
    <ToastProvider>
      <LanguageProvider>
        <ThemeProvider>
          <BrowserRouter>
            <AppContent
              products={products}
              settings={settings}
              fetchStoreData={fetchStoreData}
              detailProduct={detailProduct}
              setDetailProduct={setDetailProduct}
              orderProduct={orderProduct}
              setOrderProduct={setOrderProduct}
              orderQuantity={orderQuantity}
              setOrderQuantity={setOrderQuantity}
            />
          </BrowserRouter>
        </ThemeProvider>
      </LanguageProvider>
    </ToastProvider>
  );
}
