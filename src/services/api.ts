import { User, Product, Sale, LoginData, RegisterData, ProductFormData, SaleFormData, OTPVerificationData } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'An error occurred');
  }
  return response.json();
};

export const authApi = {
  async register(username: string, identifier: string, password: string, verificationType: 'email' | 'phone'): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, identifier, password, verificationType }),
    });
    return handleResponse(response);
  },

  async verifyOTP(identifier: string, otp: string, verificationType: 'email' | 'phone'): Promise<{ user: User; token: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, otp, verificationType }),
    });
    return handleResponse(response);
  },

  async login(identifier: string, password: string): Promise<{ user: User; token: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });
    return handleResponse(response);
  },

  async resendOTP(identifier: string, verificationType: 'email' | 'phone'): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, verificationType }),
    });
    return handleResponse(response);
  },

  async getCurrentUser(): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

export const productApi = {
  async getProducts(): Promise<Product[]> {
    const response = await fetch(`${API_BASE_URL}/products`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  async createProduct(data: ProductFormData): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async updateProduct(id: string, data: ProductFormData): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async deleteProduct(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete product');
    }
  },
};

export const salesApi = {
  async getSales(): Promise<Sale[]> {
    const response = await fetch(`${API_BASE_URL}/sales`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  async createSale(data: SaleFormData): Promise<Sale> {
    const response = await fetch(`${API_BASE_URL}/sales`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
};