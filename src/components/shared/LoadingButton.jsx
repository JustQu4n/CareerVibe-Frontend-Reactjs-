/**
 * LoadingButton Component
 * Reusable button with loading state
 */
import React from 'react';
import PropTypes from 'prop-types';

const LoadingSpinner = () => (
  <svg 
    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24"
  >
    <circle 
      className="opacity-25" 
      cx="12" 
      cy="12" 
      r="10" 
      stroke="currentColor" 
      strokeWidth="4"
    ></circle>
    <path 
      className="opacity-75" 
      fill="currentColor" 
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

const LoadingButton = React.memo(({ 
  isLoading, 
  loadingText = 'Loading...', 
  children, 
  type = 'button',
  disabled = false,
  onClick,
  className = '',
  fullWidth = false,
  variant = 'primary'
}) => {
  const baseClasses = 'flex justify-center items-center py-3 px-4 font-medium rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = (isLoading || disabled) ? 'opacity-50 cursor-not-allowed' : '';
  
  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${widthClass} ${disabledClass} ${className}`;
  
  return (
    <button
      type={type}
      disabled={isLoading || disabled}
      onClick={onClick}
      className={buttonClasses}
    >
      {isLoading ? (
        <>
          <LoadingSpinner />
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
});

LoadingButton.displayName = 'LoadingButton';

LoadingButton.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  loadingText: PropTypes.string,
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
  fullWidth: PropTypes.bool,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger']),
};

export default LoadingButton;
