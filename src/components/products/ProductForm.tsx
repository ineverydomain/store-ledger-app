import React, { useState, useEffect } from 'react';
import { Product, ProductFormData, SI_UNITS } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: ProductFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ProductForm({ product, onSubmit, onCancel, isLoading = false }: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    quantity: 0,
    price: 0,
    unit: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        quantity: product.quantity,
        price: product.price,
        unit: product.unit,
      });
    }
  }, [product]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (formData.quantity < 0) {
      newErrors.quantity = 'Quantity must be 0 or greater';
    }
    
    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (!formData.unit) {
      newErrors.unit = 'Unit is required';
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Input
          label="Product Name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="Enter product name"
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Quantity"
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            error={errors.quantity}
            placeholder="Enter quantity"
            min="0"
          />

          <Select
            label="Unit"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            error={errors.unit}
            options={SI_UNITS}
            placeholder="Select unit"
          />
        </div>

        <Input
          label="Price per Unit ($)"
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          error={errors.price}
          placeholder="Enter price per unit"
          min="0"
          step="0.01"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {product ? 'Update Product' : 'Add Product'}
        </Button>
      </div>
    </form>
  );
}