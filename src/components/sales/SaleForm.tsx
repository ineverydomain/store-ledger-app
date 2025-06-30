import React, { useState, useEffect } from 'react';
import { Product, SaleFormData } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

interface SaleFormProps {
  products: Product[];
  onSubmit: (data: SaleFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function SaleForm({ products, onSubmit, onCancel, isLoading = false }: SaleFormProps) {
  const [formData, setFormData] = useState<SaleFormData>({
    productId: '',
    quantitySold: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const availableProducts = products.filter(p => p.quantity > 0);
  const productOptions = availableProducts.map(product => ({
    value: product.id,
    label: `${product.name} (${product.quantity} ${product.unit} available)`,
  }));

  useEffect(() => {
    if (formData.productId) {
      const product = products.find(p => p.id === formData.productId);
      setSelectedProduct(product || null);
    } else {
      setSelectedProduct(null);
    }
  }, [formData.productId, products]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.productId) {
      newErrors.productId = 'Please select a product';
    }
    
    if (formData.quantitySold <= 0) {
      newErrors.quantitySold = 'Quantity must be greater than 0';
    }

    if (selectedProduct && formData.quantitySold > selectedProduct.quantity) {
      newErrors.quantitySold = `Low quantity! Only ${selectedProduct.quantity} ${selectedProduct.unit} available`;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await onSubmit(formData);
    } catch (err) {
      // Error handling can be added here
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const parsedValue = type === 'number' ? parseFloat(value) || 0 : value;
    
    setFormData(prev => ({ ...prev, [name]: parsedValue }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const calculateTotal = () => {
    if (selectedProduct && formData.quantitySold > 0) {
      return selectedProduct.price * formData.quantitySold;
    }
    return 0;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  if (availableProducts.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 dark:text-gray-400 mb-4">
          No products available for sale. All products are out of stock.
        </div>
        <Button onClick={onCancel}>Close</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Select
          label="Select Product"
          name="productId"
          value={formData.productId}
          onChange={handleChange}
          error={errors.productId}
          options={productOptions}
          placeholder="Choose a product to sell"
        />

        {selectedProduct && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <p><strong>Product:</strong> {selectedProduct.name}</p>
              <p><strong>Available:</strong> {selectedProduct.quantity} {selectedProduct.unit}</p>
              <p><strong>Price per unit:</strong> {formatPrice(selectedProduct.price)}</p>
            </div>
          </div>
        )}

        <Input
          label={`Quantity to Sell${selectedProduct ? ` (${selectedProduct.unit})` : ''}`}
          type="number"
          name="quantitySold"
          value={formData.quantitySold}
          onChange={handleChange}
          error={errors.quantitySold}
          placeholder="Enter quantity to sell"
          min="0"
          max={selectedProduct?.quantity || undefined}
          step="0.01"
        />

        {selectedProduct && formData.quantitySold > 0 && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
            <div className="text-sm text-emerald-700 dark:text-emerald-300">
              <p><strong>Total Sale Amount:</strong> {formatPrice(calculateTotal())}</p>
              <p><strong>Remaining Stock:</strong> {selectedProduct.quantity - formData.quantitySold} {selectedProduct.unit}</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          Complete Sale
        </Button>
      </div>
    </form>
  );
}