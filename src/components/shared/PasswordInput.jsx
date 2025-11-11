/**
 * PasswordInput Component
 * Reusable password input field with show/hide toggle
 */
import React from 'react';
import PropTypes from 'prop-types';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

const PasswordInput = React.memo(({ 
  value, 
  onChange, 
  error,
  showPassword,
  onToggleVisibility,
  placeholder = '••••••••',
  label = 'Password',
  name = 'password',
  showForgotPassword = false,
  onForgotPasswordClick,
  disabled = false 
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        {showForgotPassword && onForgotPasswordClick && (
          <button
            type="button"
            onClick={onForgotPasswordClick}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium focus:outline-none focus:underline"
          >
            Forgot password?
          </button>
        )}
      </div>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg 
            className="h-5 w-5 text-gray-400" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor"
            aria-hidden="true"
          >
            <path 
              fillRule="evenodd" 
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" 
              clipRule="evenodd" 
            />
          </svg>
        </div>
        <input
          id={name}
          name={name}
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          required
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`pl-10 pr-10 w-full py-3 px-4 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
            error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          placeholder={placeholder}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${name}-error` : undefined}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none"
          onClick={onToggleVisibility}
          disabled={disabled}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <EyeOffIcon className="h-5 w-5 text-gray-500 hover:text-gray-700" />
          ) : (
            <EyeIcon className="h-5 w-5 text-gray-500 hover:text-gray-700" />
          )}
        </button>
      </div>
      {error && (
        <p id={`${name}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
});

PasswordInput.displayName = 'PasswordInput';

PasswordInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  showPassword: PropTypes.bool.isRequired,
  onToggleVisibility: PropTypes.func.isRequired,
  error: PropTypes.string,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  showForgotPassword: PropTypes.bool,
  onForgotPasswordClick: PropTypes.func,
  disabled: PropTypes.bool,
};

export default PasswordInput;
