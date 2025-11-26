import React, { useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import logo from '@/assets/logo.png';
// Custom hooks
import { useLogin } from '@/hooks/useLogin';

// Shared components
import { Navbar } from '@/components/navbar';
import EmailInput from '@/components/shared/EmailInput';
import PasswordInput from '@/components/shared/PasswordInput';
import LoadingButton from '@/components/shared/LoadingButton';
import SocialLoginButtons from '@/components/shared/SocialLoginButtons';
import LoginFeaturesList from '@/components/shared/LoginFeaturesList';

// Constants
import { ROUTES } from '@/constants';

const Login = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  
  // Use custom login hook for all login logic
  const {
    formData,
    errors,
    showPassword,
    isSubmitting,
    handleInputChange,
    handleSubmit,
    togglePasswordVisibility,
  } = useLogin();

  /**
   * Redirect if already logged in
   * Effect runs only once on mount
   */
  useEffect(() => {
    if (user) {
      navigate(ROUTES.HOME);
    }
  }, [user, navigate]);

  /**
   * Handle forgot password navigation
   */
  const handleForgotPassword = useCallback(() => {
    navigate(ROUTES.FORGOT_PASSWORD);
  }, [navigate]);

  /**
   * Social login handlers (placeholder implementations)
   * TODO: Implement actual social auth
   */
  const handleGoogleLogin = useCallback(() => {
    // TODO: Implement Google OAuth
    console.log('Google login clicked');
  }, []);

  const handleFacebookLogin = useCallback(() => {
    // TODO: Implement Facebook OAuth
    console.log('Facebook login clicked');
  }, []);

  /**
   * Login features to display
   */
  const loginFeatures = [
    {
      title: 'Access to exclusive jobs',
      description: 'Find opportunities not listed anywhere else',
    },
    {
      title: 'AI-powered job matching',
      description: 'Get recommendations tailored to your profile',
    },
    {
      title: 'Track applications',
      description: 'Manage your job search process in one place',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto overflow-hidden rounded-2xl shadow-xl bg-white"
        >
          <div className="flex flex-col md:flex-row">
            {/* Left Side - Login Form */}
            <div className="w-full md:w-1/2 p-6 sm:p-10">
              {/* Logo */}
              <div className="flex justify-center mb-6">
                <img 
                  src={logo}
                  alt="CareerVibe Logo" 
                  className="h-10"
                />
              </div>
              
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
                <p className="text-gray-600 mt-1">Sign in to your jobseeker account</p>
              </div>
              
              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Input */}
                <EmailInput
                  value={formData.email}
                  onChange={handleInputChange}
                  error={errors.email}
                  disabled={isSubmitting}
                />
                
                {/* Password Input */}
                <PasswordInput
                  value={formData.password}
                  onChange={handleInputChange}
                  error={errors.password}
                  showPassword={showPassword}
                  onToggleVisibility={togglePasswordVisibility}
                  showForgotPassword={true}
                  onForgotPasswordClick={handleForgotPassword}
                  disabled={isSubmitting}
                />
                
                {/* Submit Button */}
                <LoadingButton
                  type="submit"
                  isLoading={isSubmitting}
                  loadingText="Signing In..."
                  fullWidth={true}
                >
                  Sign In
                </LoadingButton>
              </form>
              
              {/* Social Login */}
              <SocialLoginButtons
                onGoogleLogin={handleGoogleLogin}
                onFacebookLogin={handleFacebookLogin}
                disabled={isSubmitting}
              />
              
              {/* Register Link */}
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link 
                    to={ROUTES.REGISTER} 
                    className="font-medium text-blue-600 hover:text-blue-800 focus:outline-none focus:underline"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
            
            {/* Right Side - Features Showcase */}
            <div className="hidden md:block md:w-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-pattern opacity-10"></div>
              
              <div className="relative h-full flex flex-col justify-center p-12">
                {/* Header */}
                <div className="text-white mb-8">
                  <h2 className="text-3xl font-bold mb-3">Find Your Dream Job</h2>
                  <p className="text-blue-100">
                    Connect with thousands of employers and opportunities tailored to your skills and experience.
                  </p>
                </div>
                
                {/* Features List */}
                <LoginFeaturesList features={loginFeatures} />
                
                {/* Decorative Circles */}
                <div className="absolute bottom-0 right-0">
                  <svg 
                    width="250" 
                    height="250" 
                    viewBox="0 0 200 200" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="opacity-30"
                    aria-hidden="true"
                  >
                    <circle cx="100" cy="100" r="100" fill="white" />
                  </svg>
                </div>
                
                <div className="absolute -bottom-20 -left-20">
                  <svg 
                    width="200" 
                    height="200" 
                    viewBox="0 0 200 200" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="opacity-20"
                    aria-hidden="true"
                  >
                    <circle cx="100" cy="100" r="100" fill="white" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Footer Terms */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-600">
            By signing in, you agree to our{' '}
            <a href="#" className="text-blue-600 hover:underline focus:outline-none focus:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-blue-600 hover:underline focus:outline-none focus:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
