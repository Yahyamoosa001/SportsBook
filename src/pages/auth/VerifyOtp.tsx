
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Shield } from 'lucide-react';

const VerifyOtp: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const { verifyOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;

    setLoading(true);
    try {
      await verifyOtp(otp);
      navigate('/');
    } catch (error) {
      // Error is handled in the auth context
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    // TODO: Implement resend OTP functionality
    console.log('Resend OTP');
  };

  if (!email) {
    navigate('/register');
    return null;
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-muted items-center justify-center">
        <div className="text-center">
          <div className="text-6xl font-bold text-muted-foreground mb-4">IMAGE</div>
          <p className="text-muted-foreground">Secure your account</p>
        </div>
      </div>

      {/* Right side - OTP Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-wider mb-2">QUICKCOURT</h1>
            <div className="flex items-center justify-center gap-2 mb-6">
              <Shield className="w-5 h-5 text-orange-500" />
              <h2 className="text-lg font-medium">VERIFY YOUR EMAIL</h2>
            </div>
          </div>

          {/* Description */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              We've sent a code to your email:{' '}
              <span className="text-foreground font-medium">{email}</span>
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
              <p className="text-sm text-blue-700">
                <strong>Development Mode:</strong> Use <code className="bg-blue-100 px-1 rounded">123456</code> as the OTP code
              </p>
            </div>
          </div>

          {/* OTP Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
                className="gap-2"
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="w-12 h-12 text-lg rounded-lg border border-border" />
                  <InputOTPSlot index={1} className="w-12 h-12 text-lg rounded-lg border border-border" />
                  <InputOTPSlot index={2} className="w-12 h-12 text-lg rounded-lg border border-border" />
                  <InputOTPSlot index={3} className="w-12 h-12 text-lg rounded-lg border border-border" />
                  <InputOTPSlot index={4} className="w-12 h-12 text-lg rounded-lg border border-border" />
                  <InputOTPSlot index={5} className="w-12 h-12 text-lg rounded-lg border border-border" />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={loading || otp.length !== 6}
            >
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </Button>
          </form>

          {/* Footer Links */}
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Didn't receive the code?{' '}
              <button 
                onClick={handleResend}
                className="text-primary hover:underline"
              >
                Resend OTP
              </button>
            </p>
            <p className="text-sm text-muted-foreground">
              Wrong email?{' '}
              <button 
                onClick={() => navigate('/register')}
                className="text-primary hover:underline"
              >
                Edit Email
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
