import React, { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';
import { AdminPinLogin } from './AdminPinLogin';
import { AdminDashboard } from './AdminDashboard';
import { AdminProducts } from './AdminProducts';
import { AdminOrders } from './AdminOrders';
import { AdminSettings } from './AdminSettings';
import { AdminProductForm } from './AdminProductForm';
import { subscribeToAuth } from '../services/authService';
import { isPinSessionValid } from '../services/pinService';
import { getProducts } from '../services/productService';
import { getOrders } from '../services/orderService';
import { AdminUser, Product, Order, SiteSettings } from '../types';

interface AdminPageProps {
  settings: SiteSettings;
  onRefreshGlobalSettings: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ settings, onRefreshGlobalSettings }) => {
  const [isPinAuthenticated, setIsPinAuthenticated] = useState<boolean>(() => isPinSessionValid());
  const [currentUser, setCurrentUser] = useState<AdminUser>({
    uid: 'admin_pin_user',
    email: 'boutiquemevasoa@gmail.com',
    displayName: 'Administrateur BOX WIFI',
    isAdmin: true,
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'settings'>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentEditingProduct, setCurrentEditingProduct] = useState<Product | null | undefined>(undefined);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Sync auth state if signed into Firebase as well
  useEffect(() => {
    const unsubscribe = subscribeToAuth((user, isAdmin) => {
      if (user) {
        setCurrentUser({
          uid: user.uid,
          email: user.email || 'boutiquemevasoa@gmail.com',
          displayName: user.displayName || 'Administrateur BOX WIFI',
          isAdmin: true,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const loadData = async () => {
    try {
      const [prods, ords] = await Promise.all([
        getProducts(true), // Include inactive in admin view
        getOrders(),
      ]);
      setProducts(prods || []);
      setOrders(ords || []);
    } catch (err) {
      console.warn('Hadisoana teo am-pakana ny angona admin:', err);
    }
  };

  useEffect(() => {
    if (isPinAuthenticated) {
      loadData();
    }
  }, [isPinAuthenticated]);

  const handleOpenProductForm = (product?: Product) => {
    setCurrentEditingProduct(product || null);
    setIsFormOpen(true);
  };

  const handleCloseProductForm = () => {
    setIsFormOpen(false);
    setCurrentEditingProduct(undefined);
  };

  const handleRefreshAll = () => {
    loadData();
    onRefreshGlobalSettings();
  };

  // If PIN is not verified, require Secret PIN code
  if (!isPinAuthenticated) {
    return (
      <AdminPinLogin
        onSuccess={() => {
          setIsPinAuthenticated(true);
          loadData();
        }}
      />
    );
  }

  return (
    <AdminLayout
      user={currentUser}
      settings={settings}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      {activeTab === 'dashboard' && (
        <AdminDashboard
          products={products}
          orders={orders}
          settings={settings}
          onNavigate={(tab) => setActiveTab(tab)}
          onOpenProductForm={handleOpenProductForm}
          onRefreshData={handleRefreshAll}
        />
      )}

      {activeTab === 'products' && (
        <AdminProducts
          products={products}
          onOpenProductForm={handleOpenProductForm}
          onRefreshData={handleRefreshAll}
        />
      )}

      {activeTab === 'orders' && (
        <AdminOrders orders={orders} onRefreshData={handleRefreshAll} />
      )}

      {activeTab === 'settings' && (
        <AdminSettings settings={settings} onRefreshData={handleRefreshAll} />
      )}

      {/* Product Form Modal */}
      {isFormOpen && (
        <AdminProductForm
          product={currentEditingProduct}
          onClose={handleCloseProductForm}
          onSuccess={handleRefreshAll}
        />
      )}
    </AdminLayout>
  );
};
