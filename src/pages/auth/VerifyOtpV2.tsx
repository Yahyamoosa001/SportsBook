import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContextV2';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ArrowLeft, Mail, Shield, Clock, CheckCircle } from 'lucide-react';

const VerifyOtpV2: React.FC = () => {
  const navigate = useNavigate();
  const { verifyOtp, isLoading } = useAuth();
  
  const [otp, setOtp] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleOtpChange = (value: string) => {
    setOtp(value);
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length < 1) {
      setError('Please enter the OTP');
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    try {
      await verifyOtp(otp, rememberMe);
      // Redirect is handled in the verifyOtp function
    } catch (error: any) {
      console.error('OTP verification error:', error);
      setError(error.response?.data?.message || 'OTP verification failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = () => {
    // In a real application, this would call an API to resend the OTP
    setError('');
    // For now, just show a message
    alert('OTP resend functionality would be implemented here. For development, use 123456');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Checking authentication...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
      <div className="w-full max-w-md">
        {/* Back to Login */}
        <Button
          variant="ghost"
          onClick={() => navigate('/login-v2')}
          className="mb-6 p-0 h-auto font-normal"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Login
        </Button>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
            <CardDescription>
              We've sent a verification code to your email address. 
              Enter the 6-digit code below to complete your registration.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {/* Development Notice */}
            <Alert className="mb-6 border-blue-200 bg-blue-50">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-700">
                <strong>Development Mode:</strong> Use <code className="bg-blue-100 px-1 rounded font-mono">123456</code> as the OTP code, or any 6-digit number.
              </AlertDescription>
            </Alert>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* OTP Input */}
              <div className="space-y-2">
                <Label className="text-center block">Enter Verification Code</Label>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={handleOtpChange}
                    disabled={isSubmitting}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                {error && (
                  <p className="text-sm text-red-500 text-center">{error}</p>
                )}
              </div>

              {/* Remember Me Option */}
              <div className="flex items-center justify-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  disabled={isSubmitting}
                />
                <Label htmlFor="rememberMe" className="text-sm font-normal cursor-pointer">
                  Keep me signed in for 7 days
                </Label>
              </div>

              {/* Remember Me Info */}
              {rememberMe && (
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    Your session will be saved securely. You won't need to login again on this device for 7 days.
                  </AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting || !otp}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify Email'
                )}
              </Button>

              {/* Resend OTP */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Didn't receive the code?
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleResendOtp}
                  disabled={isSubmitting}
                >
                  Resend Code
                </Button>
              </div>
            </form>

            {/* Security Info */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold mb-1">Email Verification</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li className="flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      Verification codes expire in 10 minutes
                    </li>
                    <li className="flex items-center gap-2">
                      <Mail className="w-3 h-3" />
                      Check your spam folder if you don't see the email
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help */}
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Need help?{' '}
            <Link 
              to="/contact" 
              className="text-primary hover:underline"
            >
              Contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpV2;
