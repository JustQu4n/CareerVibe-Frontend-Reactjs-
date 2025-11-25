import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import PasswordInput from '@/components/shared/PasswordInput';
import LoadingButton from '@/components/shared/LoadingButton';
import { resetPassword } from '@/services/authService';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const tokenFromQuery = searchParams.get('token') || '';
  const [token, setToken] = useState(tokenFromQuery);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // If token present in query, keep it
    if (tokenFromQuery) setToken(tokenFromQuery);
  }, [tokenFromQuery]);

  const validate = () => {
    if (!token || token.trim() === '') {
      toast.error('Missing token. Please use the link sent to your email.');
      return false;
    }

    if (!newPassword || newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return false;
    }

    if (!passwordRegex.test(newPassword)) {
      toast.error('Password must include uppercase, lowercase, number and special character');
      return false;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await resetPassword({ token, newPassword });
      toast.success('Password reset successful. Please sign in with your new password.');
      navigate('/login');
    } catch (err) {
      console.error('Reset password error:', err.response?.data || err.message || err);
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center">
      <div className="max-w-md w-full mx-auto p-6 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset your password</h2>
        <p className="text-sm text-gray-600 mb-6">Enter your new password below. The token is taken from the link you received.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Token is taken from the query string and not shown to the user for security */}
          {!token && (
            <div className="p-3 bg-yellow-50 border border-yellow-100 text-yellow-800 rounded">
              <strong className="block">Missing reset token</strong>
              <span className="text-sm">Please use the password reset link sent to your email.</span>
            </div>
          )}

          <PasswordInput
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            showPassword={showNew}
            onToggleVisibility={() => setShowNew((s) => !s)}
            error={null}
            label="New Password"
            name="newPassword"
          />

          <PasswordInput
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            showPassword={showConfirm}
            onToggleVisibility={() => setShowConfirm((s) => !s)}
            error={null}
            label="Confirm Password"
            name="confirmPassword"
          />

          <LoadingButton type="submit" isLoading={loading} loadingText="Resetting..." fullWidth>
            Reset Password
          </LoadingButton>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
