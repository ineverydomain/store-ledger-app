import React, { useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { OTPVerification } from './OTPVerification';
import { useAuth } from '../../contexts/AuthContext';

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { pendingVerification } = useAuth();

  const handleBackToRegister = () => {
    // This would clear the pending verification state
    window.location.reload(); // Simple way to reset state
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          {pendingVerification ? (
            <OTPVerification
              identifier={pendingVerification.identifier}
              verificationType={pendingVerification.verificationType}
              onBack={handleBackToRegister}
            />
          ) : isLogin ? (
            <LoginForm onToggleMode={() => setIsLogin(false)} />
          ) : (
            <RegisterForm onToggleMode={() => setIsLogin(true)} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}