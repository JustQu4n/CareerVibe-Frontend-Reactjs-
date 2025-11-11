/**
 * SocialLoginButtons Component
 * Social authentication buttons (Google, Facebook)
 */
import React from 'react';
import PropTypes from 'prop-types';

const SocialLoginButtons = React.memo(({ 
  onGoogleLogin, 
  onFacebookLogin,
  disabled = false 
}) => {
  return (
    <div className="mt-8">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onGoogleLogin}
          disabled={disabled}
          className="w-full flex justify-center items-center py-2.5 px-4 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          aria-label="Sign in with Google"
        >
          <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
            <path
              d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
              fill="#4285F4"
            />
          </svg>
          Google
        </button>
        
        <button
          type="button"
          onClick={onFacebookLogin}
          disabled={disabled}
          className="w-full flex justify-center items-center py-2.5 px-4 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          aria-label="Sign in with Facebook"
        >
          <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="#1877F2">
            <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 011-1h3v-4h-3a5 5 0 00-5 5v2.01h-2l-.396 3.98h2.396v8.01z" />
          </svg>
          Facebook
        </button>
      </div>
    </div>
  );
});

SocialLoginButtons.displayName = 'SocialLoginButtons';

SocialLoginButtons.propTypes = {
  onGoogleLogin: PropTypes.func,
  onFacebookLogin: PropTypes.func,
  disabled: PropTypes.bool,
};

SocialLoginButtons.defaultProps = {
  onGoogleLogin: () => console.log('Google login not implemented'),
  onFacebookLogin: () => console.log('Facebook login not implemented'),
};

export default SocialLoginButtons;
