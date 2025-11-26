/**
 * AuthPageHeader Component
 * 
 * @description
 * Header section for authentication pages displaying logo and welcome message.
 * Reusable across different auth pages (login, register, etc.)
 * 
 * Features:
 * - Logo display
 * - Dynamic title and subtitle
 * - Centered layout
 * 
 * @component
 */

import React from 'react';
import logo from '@/assets/logo.png';

/**
 * AuthPageHeader Component
 */
export const AuthPageHeader = React.memo(({ 
  title = "Welcome back", 
  subtitle = "Sign in to your account",
  logoSrc = logo,
  logoAlt = "CareerVibe"
}) => {
  return (
    <div className="text-center mb-8">
      <img 
        src={logoSrc} 
        alt={logoAlt} 
        className="h-10 mx-auto mb-4"
      />
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      <p className="text-gray-600 mt-1">{subtitle}</p>
    </div>
  );
});

AuthPageHeader.displayName = 'AuthPageHeader';

export default AuthPageHeader;
