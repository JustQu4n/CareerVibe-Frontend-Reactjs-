import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { CheckCircle2 } from 'lucide-react';

// Custom hooks
import { useRegister } from '@/hooks/useRegister';

// Components
import Navbar from '@/components/components_lite/Navbar';
import { FormProgress } from '@/components/shared';
import RegisterStepOne from '@/components/authentication/RegisterStepOne';
import RegisterStepTwo from '@/components/authentication/RegisterStepTwo';

// Constants
import { ROUTES } from '@/constants';

/**
 * Popular skills list
 */
const POPULAR_SKILLS = [
  'React', 'NodeJS', 'Docker', 'SQL',
  'MongoDB', 'AWS', 'Python', 'JavaScript'
];

/**
 * Register Component
 * Main registration page with multi-step form
 */
const Register = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  
  // Use custom register hook
  const {
    formData,
    imagePreview,
    showPassword,
    showConfirmPassword,
    skillInput,
    skills,
    formStep,
    passwordStrength,
    isSubmitting,
    setSkillInput,
    handleInputChange,
    handleFileChange,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    handleSkillKeyDown,
    removeSkill,
    addPopularSkill,
    nextStep,
    prevStep,
    handleSubmit,
  } = useRegister();

  /**
   * Redirect if already logged in
   */
  useEffect(() => {
    if (user) {
      navigate(ROUTES.HOME);
    }
  }, [user, navigate]);

  /**
   * Handle skill input change
   */
  const handleSkillInputChange = (e) => {
    setSkillInput(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <Navbar />
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden"
        >
          <div className="flex flex-col md:flex-row">
            {/* Left Side - Form */}
            <div className="w-full md:w-3/5 p-6 sm:p-8">
              {/* Logo */}
              <div className="flex justify-center mb-4">
                <img
                  src="/src/assets/logo.png"
                  alt="CareerVibe"
                  className="h-10"
                />
              </div>
              
              {/* Header */}
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  Create Your Account
                </h1>
                <p className="text-gray-600 mt-1">
                  Join thousands of job seekers finding their dream careers
                </p>
              </div>
              
              {/* Progress Steps */}
              <FormProgress
                currentStep={formStep}
                totalSteps={2}
                stepLabels={['Personal Info', 'Account Setup']}
              />
              
              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {formStep === 1 && (
                  <RegisterStepOne
                    formData={formData}
                    handleInputChange={handleInputChange}
                    onNext={nextStep}
                    isSubmitting={isSubmitting}
                  />
                )}
                
                {formStep === 2 && (
                  <RegisterStepTwo
                    formData={formData}
                    passwordStrength={passwordStrength}
                    imagePreview={imagePreview}
                    skills={skills}
                    skillInput={skillInput}
                    showPassword={showPassword}
                    showConfirmPassword={showConfirmPassword}
                    handleInputChange={handleInputChange}
                    handleFileChange={handleFileChange}
                    togglePasswordVisibility={togglePasswordVisibility}
                    toggleConfirmPasswordVisibility={toggleConfirmPasswordVisibility}
                    onSkillInputChange={handleSkillInputChange}
                    handleSkillKeyDown={handleSkillKeyDown}
                    removeSkill={removeSkill}
                    addPopularSkill={addPopularSkill}
                    onBack={prevStep}
                    isSubmitting={isSubmitting}
                    popularSkills={POPULAR_SKILLS}
                  />
                )}
                
                {/* Login Link */}
                <div className="text-center mt-6">
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
              </form>
            </div>
            
            {/* Right Side - Info/Branding */}
            <div className="hidden md:block md:w-2/5 bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-8 relative overflow-hidden">
              {/* Background SVG */}
              <div className="absolute top-0 right-0 opacity-10">
                <svg width="400" height="400" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fill="#FFFFFF"
                    d="M38.9,-66.5C53.5,-59.8,70.4,-54.9,77.7,-43.5C85,-32.1,82.8,-14,79.3,2.1C75.7,18.1,70.8,32.2,62.6,44.4C54.3,56.6,42.7,66.8,29.1,73.4C15.6,80,0.2,82.9,-14.6,79.5C-29.4,76.1,-43.6,66.2,-56.7,54.3C-69.8,42.3,-81.9,28.2,-84.8,12.5C-87.7,-3.3,-81.4,-20.7,-72.2,-35.8C-63,-50.9,-50.9,-63.6,-37.3,-70.9C-23.7,-78.2,-8.5,-79.9,2.4,-83.9C13.3,-87.9,24.4,-94.2,35.9,-85.9C47.4,-77.6,59.3,-54.8,60.1,-41.9C60.9,-29,50.6,-25.9,38.9,-19.7Z"
                    transform="translate(100 100)"
                  />
                </svg>
              </div>
              
              <div className="relative z-10">
                {/* Header */}
                <h2 className="text-3xl font-bold mb-6">
                  Start Your Career Journey Today
                </h2>
                <p className="text-blue-100 mb-8">
                  Join thousands of professionals who have found their dream jobs through CareerVibe. Our AI-powered platform matches your skills with the perfect opportunities.
                </p>
                
                {/* Features List */}
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold">
                        Personalized Job Recommendations
                      </h3>
                      <p className="text-blue-100 text-sm">
                        Get job matches based on your skills, experience, and preferences
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold">
                        Easy Application Process
                      </h3>
                      <p className="text-blue-100 text-sm">
                        Apply to jobs with just one click using your CareerVibe profile
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold">
                        Career Development Tools
                      </h3>
                      <p className="text-blue-100 text-sm">
                        Access resources to help you grow professionally
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Testimonial */}
                <div className="mt-12 bg-white/10 rounded-xl p-6 backdrop-blur-sm border border-white/20">
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-gray-200 mr-4"></div>
                    <div>
                      <h4 className="font-semibold">Sarah Johnson</h4>
                      <p className="text-sm text-blue-100">UX Designer at Adobe</p>
                    </div>
                  </div>
                  <p className="italic text-blue-50">
                    "CareerVibe helped me find my dream job in just 2 weeks! The platform is intuitive and the job matches were spot on with my skills and career goals."
                  </p>
                </div>
              </div>
              
              {/* Decorative SVG */}
              <div className="absolute bottom-0 left-0 opacity-10">
                <svg width="300" height="300" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fill="#FFFFFF"
                    d="M39.5,-65.3C50.4,-57.9,58.4,-45.8,62.9,-32.9C67.4,-20,68.5,-6.2,68,8.1C67.6,22.4,65.7,37.2,58.4,49.8C51.1,62.4,38.5,72.8,23.8,77.7C9.1,82.6,-7.7,82,-23.1,77.4C-38.5,72.8,-52.6,64.2,-63.1,51.8C-73.6,39.4,-80.6,23.1,-80.6,7C-80.5,-9.1,-73.4,-25,-64.3,-38.7C-55.3,-52.4,-44.2,-63.8,-31.2,-70.2C-18.2,-76.6,-3.2,-77.9,9.8,-73.8C22.7,-69.8,45.5,-60.5,39.5,-53.5Z"
                    transform="translate(100 100)"
                  />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Footer Terms */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-600">
            By creating an account, you agree to our{' '}
            <a
              href="#"
              className="text-blue-600 hover:underline focus:outline-none focus:underline"
            >
              Terms of Service
            </a>{' '}
            and{' '}
            <a
              href="#"
              className="text-blue-600 hover:underline focus:outline-none focus:underline"
            >
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
