export interface User {
  id: string;
  username: string;
  email?: string;
  phone?: string;
  isVerified: boolean;
}

export interface Product {
  id: string;
  name: string;
  quantity: number;
  price: number;
  unit: string;
  createdAt: string;
  userId: string;
}

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  quantitySold: number;
  unit: string;
  pricePerUnit: number;
  totalAmount: number;
  saleDate: string;
  userId: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface ProductFormData {
  name: string;
  quantity: number;
  price: number;
  unit: string;
}

export interface SaleFormData {
  productId: string;
  quantitySold: number;
}

export interface LoginData {
  identifier: string; // email or phone
  password: string;
}

export interface RegisterData {
  username: string;
  identifier: string; // email or phone
  password: string;
  verificationType: 'email' | 'phone';
}

export interface OTPVerificationData {
  identifier: string;
  otp: string;
  verificationType: 'email' | 'phone';
}

export const SI_UNITS = [
  { value: 'kg', label: 'Kilogram (kg)' },
  { value: 'g', label: 'Gram (g)' },
  { value: 'l', label: 'Liter (l)' },
  { value: 'ml', label: 'Milliliter (ml)' },
  { value: 'm', label: 'Meter (m)' },
  { value: 'cm', label: 'Centimeter (cm)' },
  { value: 'mm', label: 'Millimeter (mm)' },
  { value: 'pcs', label: 'Pieces (pcs)' },
  { value: 'box', label: 'Box' },
  { value: 'pack', label: 'Pack' },
  { value: 'dozen', label: 'Dozen' },
  { value: 'pair', label: 'Pair' },
] as const;