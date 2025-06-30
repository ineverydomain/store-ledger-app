import React from 'react';
import { DollarSign, Calendar, Package, TrendingUp } from 'lucide-react';
import { Sale } from '../../types';
import { Card, CardContent } from '../ui/Card';

interface SalesListProps {
  sales: Sale[];
  isLoading?: boolean;
}

export function SalesList({ sales, isLoading = false }: SalesListProps) {
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
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (sales.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No sales yet</h3>
          <p className="text-gray-500 dark:text-gray-400">Start selling products to see your sales history.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {sales.map((sale) => (
        <Card key={sale.id} className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {sale.productName}
                </h3>
                <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Package className="h-4 w-4" />
                    <span>{sale.quantitySold} {sale.unit} sold</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="h-4 w-4" />
                    <span>{formatPrice(sale.pricePerUnit)}/{sale.unit}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(sale.saleDate)}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {formatPrice(sale.totalAmount)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Total Sale
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}