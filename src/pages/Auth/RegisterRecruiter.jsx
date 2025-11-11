/**
 * RegisterRecruiter Page Component
 * Refactored for better maintainability and separation of concerns
 * 
 * Location: src/pages/Auth/RegisterRecruiter.jsx (moved from components/authentication)
 * 
 * Changes:
 * - Extracted business logic to custom hook (useRegisterRecruiter)
 * - Separated form steps into smaller components
 * - Moved API calls to service layer
 * - Added company service for autocomplete
 * - Optimized with React.memo and useCallback
 * - Reusable shared components
 */
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';

// Custom hooks
import { useRegisterRecruiter } from '@/hooks/useRegisterRecruiter';

// Components
import { Navbar } from '@/components/navbar';
import { FormProgress } from '@/components/shared';
import RecruiterStepOne from '@/components/authentication/RecruiterStepOne';
import RecruiterStepTwo from '@/components/authentication/RecruiterStepTwo';
import RecruiterStepThree from '@/components/authentication/RecruiterStepThree';

// Constants
import { ROUTES } from '@/constants';

/**
 * Step labels for progress indicator
 */
const STEP_LABELS = ['Personal Info', 'Company Info', 'Confirmation'];

/**
 * RegisterRecruiter Component
 * Main recruiter registration page with multi-step form
 */
const RegisterRecruiter = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  
  // Use custom recruiter registration hook
  const {
    formData,
    showPassword,
    showConfirmPassword,
    currentStep,
    isSubmitting,
    companySuggestions,
    showCompanyDropdown,
    selectedCompany,
    isSearching,
    handleInputChange,
    handleFileChange,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    handleCompanyNameChange,
    handleCompanySelect,
    resetCompanySelection,
    nextStep,
    prevStep,
    handleSubmit,
  } = useRegisterRecruiter();

  /**
   * Redirect if already logged in
   */
  useEffect(() => {
    if (user) {
      navigate(ROUTES.HOME);
    }
  }, [user, navigate]);

  return (
    <div>
      <Navbar />
      
      <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center py-10">
        <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
          <div className="lg:w-1/2 xl:w-5/12 p-6">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <img
                src="https://media.licdn.com/dms/image/v2/C561BAQGnoaNjsBLsQg/company-background_10000/company-background_10000/0/1590217283917/jobseeker_hub_cover?e=2147483647&v=beta&t=izGlJYuYMvsHNLdu5MgxzoZzZotna4k65zE2r2yTjD0"
                alt="CareerVibe Logo"
                className="w-32 h-auto"
              />
            </div>

            <div className="mt-8 flex flex-col items-center">
              {/* Page Title */}
              <motion.h1
                key={currentStep}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-2xl xl:text-3xl font-bold mb-6 text-gray-900"
              >
                {currentStep === 1 && 'Recruiter Information'}
                {currentStep === 2 && 'Company Information'}
                {currentStep === 3 && 'Review & Confirm'}
              </motion.h1>

              {/* Progress Indicator */}
              <div className="w-full mb-8">
                <FormProgress
                  currentStep={currentStep}
                  totalSteps={3}
                  stepLabels={STEP_LABELS}
                />
              </div>

              {/* Multi-step Form */}
              <div className="w-full flex-1">
                <form onSubmit={handleSubmit}>
                  {/* Step 1: Personal Information */}
                  {currentStep === 1 && (
                    <RecruiterStepOne
                      formData={formData}
                      showPassword={showPassword}
                      showConfirmPassword={showConfirmPassword}
                      handleInputChange={handleInputChange}
                      togglePasswordVisibility={togglePasswordVisibility}
                      toggleConfirmPasswordVisibility={toggleConfirmPasswordVisibility}
                      onNext={nextStep}
                      isSubmitting={isSubmitting}
                    />
                  )}

                  {/* Step 2: Company Information */}
                  {currentStep === 2 && (
                    <RecruiterStepTwo
                      formData={formData}
                      companySuggestions={companySuggestions}
                      showCompanyDropdown={showCompanyDropdown}
                      selectedCompany={selectedCompany}
                      isSearching={isSearching}
                      handleCompanyNameChange={handleCompanyNameChange}
                      handleCompanySelect={handleCompanySelect}
                      resetCompanySelection={resetCompanySelection}
                      handleInputChange={handleInputChange}
                      handleFileChange={handleFileChange}
                      onBack={prevStep}
                      onNext={nextStep}
                      isSubmitting={isSubmitting}
                    />
                  )}

                  {/* Step 3: Confirmation */}
                  {currentStep === 3 && (
                    <RecruiterStepThree
                      formData={formData}
                      selectedCompany={selectedCompany}
                      onBack={prevStep}
                      onSubmit={handleSubmit}
                      isSubmitting={isSubmitting}
                    />
                  )}
                </form>

                {/* Login Link */}
                <div className="flex justify-center mt-6">
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link
                      to={ROUTES.LOGIN}
                      className="font-medium text-blue-600 hover:text-blue-800 focus:outline-none focus:underline"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>

                {/* Terms & Privacy */}
                <p className="mt-6 text-xs text-gray-600 text-center">
                  By signing up, you agree to our{' '}
                  <a
                    href="#"
                    className="border-b border-gray-500 border-dotted hover:text-gray-900"
                  >
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a
                    href="#"
                    className="border-b border-gray-500 border-dotted hover:text-gray-900"
                  >
                    Privacy Policy
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterRecruiter;
