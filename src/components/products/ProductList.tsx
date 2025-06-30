import React from 'react';
import { Edit2, Trash2, DollarSign, Package, ShoppingCart } from 'lucide-react';
import { Product } from '../../types';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onSell: (product: Product) => void;
  isLoading?: boolean;
}

export function ProductList({ products, onEdit, onDelete, onSell, isLoading = false }: ProductListProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-1/2 mb-4"></div>
              <div className="flex justify-between items-center">
                <div className="h-3 bg-gray-300 rounded w-1/3"></div>
                <div className="flex space-x-2">
                  <div className="h-8 w-16 bg-gray-300 rounded"></div>
                  <div className="h-8 w-16 bg-gray-300 rounded"></div>
                  <div className="h-8 w-16 bg-gray-300 rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No products yet</h3>
          <p className="text-gray-500 dark:text-gray-400">Add your first product to get started.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <Card key={product.id} className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {product.name}
                </h3>
                <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Package className="h-4 w-4" />
                    <span>{product.quantity} {product.unit}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="h-4 w-4" />
                    <span>{formatPrice(product.price)}/{product.unit}</span>
                  </div>
                  <span>Added: {formatDate(product.createdAt)}</span>
                </div>
                
                {/* Low stock warning */}
                {product.quantity <= 5 && product.quantity > 0 && (
                  <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                    Low Stock Warning
                  </div>
                )}
                
                {product.quantity === 0 && (
                  <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                    Out of Stock
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2 ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSell(product)}
                  disabled={product.quantity === 0}
                  className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-900/20"
                >
                  <ShoppingCart className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(product)}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(product.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 dark:text-gray-400">Total Value:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {formatPrice(product.quantity * product.price)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}