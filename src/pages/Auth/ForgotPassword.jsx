import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import EmailInput from '@/components/shared/EmailInput';
import LoadingButton from '@/components/shared/LoadingButton';
import { forgotPassword } from '@/services/authService';
import { ROUTES } from '@/constants';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(email);
      toast.success('Password reset email sent. Check your inbox.');
      navigate(ROUTES.LOGIN);
    } catch (err) {
      console.error('Forgot password error:', err.response?.data || err.message || err);
      toast.error(err.response?.data?.message || 'Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center">
      <div className="max-w-md w-full mx-auto p-6 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Forgot your password?</h2>
        <p className="text-sm text-gray-600 mb-6">Enter the email associated with your account and we'll send a link to reset your password.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <EmailInput
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
          />

          <LoadingButton type="submit" isLoading={loading} loadingText="Sending..." fullWidth>
            Send Reset Email
          </LoadingButton>
        </form>

        <div className="mt-4 text-sm text-center">
          <button onClick={() => navigate(ROUTES.LOGIN)} className="text-blue-600 hover:text-blue-800 font-medium">
            Back to Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
