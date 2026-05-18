'use client';

import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { requestOTP, verifyOTP } from '@/lib/auth-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export function AuthPage() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Request OTP on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsLoading(true);
        setError(null);
        await requestOTP();
        toast.success('OTP sent to your registered contact');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to request OTP';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp || otp.length < 4) {
      setError('Please enter a valid OTP');
      return;
    }

    try {
      setIsVerifying(true);
      setError(null);
      await verifyOTP(otp);
      toast.success('Authenticated successfully!');
      // Redirect to the app
      navigate({ to: '/create' });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to verify OTP';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Enter OTP</h1>
            <p className="mt-2 text-sm text-gray-600">
              Please enter the OTP to proceed
            </p>
          </div>

          <form onSubmit={handleVerify} className="mt-8 space-y-6">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                OTP Code
              </label>
              <Input
                id="otp"
                type="text"
                inputMode="numeric"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={handleOtpChange}
                disabled={isLoading || isVerifying}
                className="mt-2"
                maxLength={6}
                autoComplete="off"
              />
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading || isVerifying || otp.length < 4}
              className="w-full"
            >
              {isVerifying ? 'Verifying...' : 'Verify OTP'}
            </Button>
          </form>

          {isLoading && (
            <div className="mt-6 text-center text-sm text-gray-600">
              <p>Requesting OTP...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
