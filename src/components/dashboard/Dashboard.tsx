import React, { useState, useEffect } from 'react';
import { Plus, TrendingUp, Package, DollarSign, ShoppingCart, BarChart3 } from 'lucide-react';
import { Product, ProductFormData, Sale, SaleFormData } from '../../types';
import { productApi, salesApi } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { Header } from '../layout/Header';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { ProductForm } from '../products/ProductForm';
import { ProductList } from '../products/ProductList';
import { SaleForm } from '../sales/SaleForm';
import { SalesList } from '../sales/SalesList';

export function Dashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [salesLoading, setSalesLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'products' | 'sales'>('products');
  
  // Product modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productFormLoading, setProductFormLoading] = useState(false);
  
  // Sale modals
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [saleFormLoading, setSaleFormLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProducts();
      fetchSales();
    }
  }, [user]);

  const fetchProducts = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await productApi.getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSales = async () => {
    if (!user) return;
    
    try {
      setSalesLoading(true);
      const data = await salesApi.getSales();
      setSales(data);
    } catch (error) {
      console.error('Failed to fetch sales:', error);
    } finally {
      setSalesLoading(false);
    }
  };

  const handleAddProduct = async (data: ProductFormData) => {
    if (!user) return;
    
    try {
      setProductFormLoading(true);
      const newProduct = await productApi.createProduct(data);
      setProducts(prev => [newProduct, ...prev]);
      setIsProductModalOpen(false);
    } catch (error) {
      console.error('Failed to add product:', error);
    } finally {
      setProductFormLoading(false);
    }
  };

  const handleUpdateProduct = async (data: ProductFormData) => {
    if (!editingProduct || !user) return;
    
    try {
      setProductFormLoading(true);
      const updatedProduct = await productApi.updateProduct(editingProduct.id, data);
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? updatedProduct : p));
      setIsProductModalOpen(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Failed to update product:', error);
    } finally {
      setProductFormLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?') || !user) return;
    
    try {
      await productApi.deleteProduct(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const handleSellProduct = (product: Product) => {
    setIsSaleModalOpen(true);
  };

  const handleCreateSale = async (data: SaleFormData) => {
    if (!user) return;
    
    try {
      setSaleFormLoading(true);
      const newSale = await salesApi.createSale(data);
      setSales(prev => [newSale, ...prev]);
      
      // Update product quantity in local state
      setProducts(prev => prev.map(p => 
        p.id === data.productId 
          ? { ...p, quantity: p.quantity - data.quantitySold }
          : p
      ));
      
      setIsSaleModalOpen(false);
    } catch (error) {
      console.error('Failed to create sale:', error);
      alert((error as Error).message);
    } finally {
      setSaleFormLoading(false);
    }
  };

  const handleCloseProductModal = () => {
    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  const handleCloseSaleModal = () => {
    setIsSaleModalOpen(false);
  };

  const stats = {
    totalProducts: products.length,
    totalQuantity: products.reduce((sum, p) => sum + p.quantity, 0),
    totalInventoryValue: products.reduce((sum, p) => sum + (p.quantity * p.price), 0),
    totalSalesValue: sales.reduce((sum, s) => sum + s.totalAmount, 0),
    lowStockProducts: products.filter(p => p.quantity <= 5 && p.quantity > 0).length,
    outOfStockProducts: products.filter(p => p.quantity === 0).length,
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalProducts}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Sales</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(stats.totalSalesValue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <DollarSign className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Inventory Value</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(stats.totalInventoryValue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Low Stock Items</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.lowStockProducts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stock Alerts */}
        {(stats.lowStockProducts > 0 || stats.outOfStockProducts > 0) && (
          <Card className="mb-8 border-l-4 border-l-yellow-500">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                  <Package className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Stock Alerts</h3>
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    {stats.lowStockProducts > 0 && (
                      <p>⚠️ {stats.lowStockProducts} product(s) running low on stock</p>
                    )}
                    {stats.outOfStockProducts > 0 && (
                      <p>🚫 {stats.outOfStockProducts} product(s) out of stock</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'products'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('sales')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'sales'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            Sales History
          </button>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'products' ? (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Products</h2>
                  <p className="text-gray-600 dark:text-gray-400">Manage your store inventory</p>
                </div>
                <div className="flex space-x-3">
                  <Button onClick={() => setIsSaleModalOpen(true)} variant="secondary">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Sell Product
                  </Button>
                  <Button onClick={() => setIsProductModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ProductList
                products={products}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
                onSell={handleSellProduct}
                isLoading={loading}
              />
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Sales History</h2>
                  <p className="text-gray-600 dark:text-gray-400">Track your sales performance</p>
                </div>
                <Button onClick={() => setIsSaleModalOpen(true)}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  New Sale
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <SalesList sales={sales} isLoading={salesLoading} />
            </CardContent>
          </Card>
        )}
      </main>

      {/* Product Form Modal */}
      <Modal
        isOpen={isProductModalOpen}
        onClose={handleCloseProductModal}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
      >
        <ProductForm
          product={editingProduct || undefined}
          onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
          onCancel={handleCloseProductModal}
          isLoading={productFormLoading}
        />
      </Modal>

      {/* Sale Form Modal */}
      <Modal
        isOpen={isSaleModalOpen}
        onClose={handleCloseSaleModal}
        title="Sell Product"
      >
        <SaleForm
          products={products}
          onSubmit={handleCreateSale}
          onCancel={handleCloseSaleModal}
          isLoading={saleFormLoading}
        />
      </Modal>
    </div>
  );
}