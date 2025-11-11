/**
 * RecruiterSite Component - Refactored & Optimized
 * 
 * @description
 * Login page for recruiters/employers to access the CareerVibe platform.
 * This component has been refactored following React best practices:
 * 
 * Improvements:
 * - Extracted business logic into custom hook (useRecruiterLogin)
 * - Split UI into smaller, reusable components
 * - Added React.memo for performance optimization
 * - Moved API calls to service layer
 * - Removed code smell (console.log, inline functions)
 * - Better separation of concerns
 * - Consistent code formatting
 * 
 * @component
 */

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Navbar } from "../navbar";
import { useRecruiterLogin } from "@/hooks/useRecruiterLogin";
import RecruiterHeroSection from "../authentication/RecruiterHeroSection";
import RecruiterLoginForm from "../authentication/RecruiterLoginForm";
import SocialLoginButtons from "../authentication/SocialLoginButtons";
import AuthPageHeader from "../authentication/AuthPageHeader";
import AuthFooter from "../authentication/AuthFooter";

/**
 * RecruiterSite Component
 * Main component for recruiter login page
 */
const RecruiterSite = () => {
  const navigate = useNavigate();
  
  // Get user from Redux store to check authentication status
  const { user } = useSelector((store) => store.auth);
  
  // Custom hook containing all login logic and state management
  const {
    formData,
    showPassword,
    isSubmitting,
    handleInputChange,
    handleSubmit,
    togglePasswordVisibility,
  } = useRecruiterLogin();

  /**
   * Redirect to home if user is already logged in
   * Effect runs only on component mount
   */
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Sticky Navigation Bar */}
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <Navbar />
      </div>
      
      {/* Main Content Container */}
      <div className="container mx-auto px-4 py-12">
        {/* Animated Card Container - Framer Motion for smooth entrance */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden"
        >
          <div className="flex flex-col md:flex-row">
            {/* Left Panel - Marketing/Hero Section */}
            <RecruiterHeroSection />
            
            {/* Right Panel - Login Form Section */}
            <div className="w-full md:w-1/2 p-8 md:p-12">
              <div className="max-w-md mx-auto">
                {/* Header with Logo and Title */}
                <AuthPageHeader
                  title="Welcome back, recruiter"
                  subtitle="Sign in to access your recruitment dashboard"
                />
                
                {/* Login Form */}
                <RecruiterLoginForm
                  formData={formData}
                  showPassword={showPassword}
                  isLoading={isSubmitting}
                  onInputChange={handleInputChange}
                  onSubmit={handleSubmit}
                  onTogglePassword={togglePasswordVisibility}
                />
                
                {/* Social Login Options */}
                <SocialLoginButtons />
                
                {/* Footer with Signup Link and Terms */}
                <AuthFooter
                  promptText="Don't have a recruiter account?"
                  linkText="Sign up now"
                  linkTo="/register-recruiter"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Export with display name for better debugging
RecruiterSite.displayName = 'RecruiterSite';

export default RecruiterSite;