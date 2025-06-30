import React, { useState } from 'react';
import { LogIn } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface LoginFormProps {
  onToggleMode: () => void;
}

export function LoginForm({ onToggleMode }: LoginFormProps) {
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { login, loading, error } = useAuth();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.identifier) {
      newErrors.identifier = 'Email or phone number is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await login(formData.identifier, formData.password);
    } catch (err) {
      // Error is handled by context
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <div className="mx-auto w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
          <LogIn className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Sign in to your account</p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <Input
          label="Email or Phone"
          type="text"
          name="identifier"
          value={formData.identifier}
          onChange={handleChange}
          error={errors.identifier}
          placeholder="Enter your email or phone number"
          autoComplete="username"
        />

        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="Enter your password"
          autoComplete="current-password"
        />
      </div>

      <Button type="submit" isLoading={loading} className="w-full">
        Sign In
      </Button>

      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onToggleMode}
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            Sign up
          </button>
        </p>
      </div>
    </form>
  );
}