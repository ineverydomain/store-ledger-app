import React, { useState } from 'react';
import { UserPlus, Mail, Phone } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface RegisterFormProps {
  onToggleMode: () => void;
}

export function RegisterForm({ onToggleMode }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    username: '',
    identifier: '',
    password: '',
    confirmPassword: '',
    verificationType: 'email' as 'email' | 'phone',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { register, loading, error } = useAuth();

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return 'Password must contain at least one special character';
    }
    return null;
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\+?[\d\s-()]{10,}$/;
    return phoneRegex.test(phone);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!formData.identifier) {
      newErrors.identifier = `${formData.verificationType === 'email' ? 'Email' : 'Phone'} is required`;
    } else if (formData.verificationType === 'email' && !validateEmail(formData.identifier)) {
      newErrors.identifier = 'Please enter a valid email address';
    } else if (formData.verificationType === 'phone' && !validatePhone(formData.identifier)) {
      newErrors.identifier = 'Please enter a valid phone number';
    }
    
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      newErrors.password = passwordError;
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await register(formData.username, formData.identifier, formData.password, formData.verificationType);
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

  const handleVerificationTypeChange = (type: 'email' | 'phone') => {
    setFormData(prev => ({ 
      ...prev, 
      verificationType: type,
      identifier: '' // Clear identifier when switching types
    }));
    if (errors.identifier) {
      setErrors(prev => ({ ...prev, identifier: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <div className="mx-auto w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center mb-4">
          <UserPlus className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create account</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Join us today</p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <Input
          label="Username"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          error={errors.username}
          placeholder="Choose a username"
          autoComplete="username"
        />

        {/* Verification Type Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Verification Method
          </label>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => handleVerificationTypeChange('email')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                formData.verificationType === 'email'
                  ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/20 dark:border-blue-400 dark:text-blue-300'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <Mail className="h-4 w-4" />
              <span>Email</span>
            </button>
            <button
              type="button"
              onClick={() => handleVerificationTypeChange('phone')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                formData.verificationType === 'phone'
                  ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/20 dark:border-blue-400 dark:text-blue-300'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <Phone className="h-4 w-4" />
              <span>Phone</span>
            </button>
          </div>
        </div>

        <Input
          label={formData.verificationType === 'email' ? 'Email Address' : 'Phone Number'}
          type={formData.verificationType === 'email' ? 'email' : 'tel'}
          name="identifier"
          value={formData.identifier}
          onChange={handleChange}
          error={errors.identifier}
          placeholder={formData.verificationType === 'email' ? 'Enter your email' : 'Enter your phone number'}
          autoComplete={formData.verificationType === 'email' ? 'email' : 'tel'}
        />

        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="Create a password"
          autoComplete="new-password"
        />

        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          placeholder="Confirm your password"
          autoComplete="new-password"
        />
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <p className="text-sm text-blue-700 dark:text-blue-300 font-medium mb-2">Password Requirements:</p>
        <ul className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
          <li>• At least 8 characters long</li>
          <li>• At least one uppercase letter (A-Z)</li>
          <li>• At least one lowercase letter (a-z)</li>
          <li>• At least one special character (!@#$%^&*)</li>
        </ul>
      </div>

      <Button type="submit" isLoading={loading} className="w-full">
        Create Account
      </Button>

      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onToggleMode}
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            Sign in
          </button>
        </p>
      </div>
    </form>
  );
}