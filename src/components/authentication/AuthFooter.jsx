/**
 * AuthFooter Component
 * 
 * @description
 * Footer section for authentication pages with signup link and terms.
 * Displays different content based on auth page type.
 * 
 * Features:
 * - Signup/Login link
 * - Terms of Service and Privacy Policy links
 * - Responsive text sizing
 * 
 * @component
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

/**
 * AuthFooter Component
 */
export const AuthFooter = React.memo(({ 
  promptText = "Don't have a recruiter account?",
  linkText = "Sign up now",
  linkTo = "/register-recruiter"
}) => {
  return (
    <>
      {/* Signup/Login Link */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          {promptText}{" "}
          <Link to={linkTo} className="font-medium text-blue-600 hover:text-blue-800">
            {linkText} <ChevronRight className="inline h-4 w-4" />
          </Link>
        </p>
      </div>
      
      {/* Terms and Privacy */}
      <div className="mt-10 pt-6 border-t border-gray-200">
        <p className="text-xs text-center text-gray-500">
          By signing in, you agree to our{" "}
          <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>{" "}
          and{" "}
          <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
        </p>
      </div>
    </>
  );
});

AuthFooter.displayName = 'AuthFooter';

export default AuthFooter;
