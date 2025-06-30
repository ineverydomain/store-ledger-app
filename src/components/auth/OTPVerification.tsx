import React, { useState, useEffect } from 'react';
import { Shield, Mail, Phone, RotateCcw } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface OTPVerificationProps {
  identifier: string;
  verificationType: 'email' | 'phone';
  onBack: () => void;
}

export function OTPVerification({ identifier, verificationType, onBack }: OTPVerificationProps) {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  
  const { verifyOTP, resendOTP, loading } = useAuth();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }
    
    try {
      setError('');
      await verifyOTP(identifier, otp, verificationType);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleResendOTP = async () => {
    try {
      setError('');
      await resendOTP(identifier, verificationType);
      setCountdown(60); // 60 seconds countdown
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
    if (error) setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <div className="mx-auto w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center mb-4">
          <Shield className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Verify Your Account</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          We've sent a 6-digit code to your {verificationType}
        </p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          {verificationType === 'email' ? (
            <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          ) : (
            <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          )}
          <div>
            <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Code sent to:
            </p>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              {verificationType === 'email' 
                ? identifier.replace(/(.{2})(.*)(@.*)/, '$1***$3')
                : identifier.replace(/(\+?\d{2})(\d*)(\d{4})/, '$1***$3')
              }
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <Input
          label="Enter 6-digit OTP"
          type="text"
          value={otp}
          onChange={handleChange}
          placeholder="000000"
          className="text-center text-2xl font-mono tracking-widest"
          maxLength={6}
          autoComplete="one-time-code"
        />
      </div>

      <Button type="submit" isLoading={loading} className="w-full">
        Verify Account
      </Button>

      <div className="text-center space-y-3">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Didn't receive the code?
        </p>
        
        {countdown > 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Resend code in {countdown} seconds
          </p>
        ) : (
          <Button
            type="button"
            variant="ghost"
            onClick={handleResendOTP}
            disabled={loading}
            className="text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Resend OTP
          </Button>
        )}
        
        <button
          type="button"
          onClick={onBack}
          className="block w-full text-sm text-gray-600 hover:text-gray-500 dark:text-gray-400"
        >
          Back to registration
        </button>
      </div>

      <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
        <p className="text-sm text-yellow-700 dark:text-yellow-300 font-medium">Demo Mode:</p>
        <p className="text-sm text-yellow-600 dark:text-yellow-400">
          Check the browser console for the OTP code (in production, this would be sent via {verificationType})
        </p>
      </div>
    </form>
  );
}