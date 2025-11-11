/**
 * SocialLoginButtons Component
 * 
 * @description
 * Social authentication buttons for third-party login providers.
 * Currently displays Google and GitHub login options.
 * 
 * Features:
 * - Consistent styling
 * - Hover effects
 * - Provider icons
 * - Grid layout
 * 
 * Note: Social login functionality needs to be implemented on backend
 * 
 * @component
 */

import React from 'react';

/**
 * Google Icon SVG Component
 */
const GoogleIcon = React.memo(() => (
  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
    <path
      d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
      fill="#4285F4"
    />
  </svg>
));

GoogleIcon.displayName = 'GoogleIcon';

/**
 * GitHub Icon SVG Component
 */
const GitHubIcon = React.memo(() => (
  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
    <path
      fillRule="evenodd"
      d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"
      fill="currentColor"
    />
  </svg>
));

GitHubIcon.displayName = 'GitHubIcon';

/**
 * Social Login Button Component
 */
const SocialButton = React.memo(({ icon: Icon, provider, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full flex justify-center items-center py-2.5 px-4 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
  >
    <Icon />
    {provider}
  </button>
));

SocialButton.displayName = 'SocialButton';

/**
 * SocialLoginButtons Component
 * Main component with divider and buttons
 */
export const SocialLoginButtons = React.memo(() => {
  // TODO: Implement social login handlers
  const handleGoogleLogin = () => {
    console.log('Google login clicked');
    // Implement Google OAuth flow
  };

  const handleGitHubLogin = () => {
    console.log('GitHub login clicked');
    // Implement GitHub OAuth flow
  };

  return (
    <div className="mt-8">
      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>
      
      {/* Social Login Buttons */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <SocialButton 
          icon={GoogleIcon} 
          provider="Google" 
          onClick={handleGoogleLogin}
        />
        
        <SocialButton 
          icon={GitHubIcon} 
          provider="GitHub" 
          onClick={handleGitHubLogin}
        />
      </div>
    </div>
  );
});

SocialLoginButtons.displayName = 'SocialLoginButtons';

export default SocialLoginButtons;
