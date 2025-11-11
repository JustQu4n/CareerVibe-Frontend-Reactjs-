/**
 * RecruiterLoginForm Component
 * 
 * @description
 * Login form specifically for recruiters/employers.
 * Handles email/password authentication with password visibility toggle.
 * 
 * Features:
 * - Controlled form inputs
 * - Password visibility toggle
 * - Loading state during submission
 * - Input validation
 * - Icons for better UX
 * 
 * @component
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { AtSign, LockKeyhole, Eye, EyeOff } from 'lucide-react';

/**
 * Input Field Component
 * Reusable input field with icon
 */
const InputField = React.memo(({ 
  id, 
  name, 
  type, 
  label, 
  value, 
  onChange, 
  placeholder, 
  icon: Icon,
  autoComplete,
  required = true 
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        value={value}
        onChange={onChange}
        className="pl-10 w-full py-3 px-4 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        placeholder={placeholder}
      />
    </div>
  </div>
));

InputField.displayName = 'InputField';

/**
 * Password Input Component
 * Input field with visibility toggle
 */
const PasswordInput = React.memo(({ 
  id, 
  name, 
  value, 
  onChange, 
  showPassword, 
  onToggleVisibility,
  autoComplete = "current-password",
  placeholder = "••••••••"
}) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <LockKeyhole className="h-5 w-5 text-gray-400" />
    </div>
    <input
      id={id}
      name={name}
      type={showPassword ? "text" : "password"}
      autoComplete={autoComplete}
      required
      value={value}
      onChange={onChange}
      className="pl-10 w-full py-3 px-4 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      placeholder={placeholder}
    />
    <button
      type="button"
      className="absolute inset-y-0 right-0 pr-3 flex items-center"
      onClick={onToggleVisibility}
    >
      {showPassword ? (
        <EyeOff className="h-5 w-5 text-gray-500" />
      ) : (
        <Eye className="h-5 w-5 text-gray-500" />
      )}
    </button>
  </div>
));

PasswordInput.displayName = 'PasswordInput';

/**
 * Submit Button Component
 * Button with loading state
 */
const SubmitButton = React.memo(({ isLoading, children = "Sign In" }) => (
  <button
    type="submit"
    disabled={isLoading}
    className="w-full flex justify-center items-center py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {isLoading ? (
      <>
        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Signing In...
      </>
    ) : (
      children
    )}
  </button>
));

SubmitButton.displayName = 'SubmitButton';

/**
 * RecruiterLoginForm Component
 * Main form component
 */
export const RecruiterLoginForm = React.memo(({ 
  formData, 
  showPassword, 
  isLoading,
  onInputChange, 
  onSubmit, 
  onTogglePassword 
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Email Input */}
      <InputField
        id="email"
        name="email"
        type="email"
        label="Email Address"
        value={formData.email}
        onChange={onInputChange}
        placeholder="you@company.com"
        icon={AtSign}
        autoComplete="email"
      />
      
      {/* Password Input */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <Link to="/forgot-password" className="text-xs text-blue-600 hover:text-blue-800 font-medium">
            Forgot password?
          </Link>
        </div>
        <PasswordInput
          id="password"
          name="password"
          value={formData.password}
          onChange={onInputChange}
          showPassword={showPassword}
          onToggleVisibility={onTogglePassword}
        />
      </div>
      
      {/* Submit Button */}
      <SubmitButton isLoading={isLoading} />
    </form>
  );
});

RecruiterLoginForm.displayName = 'RecruiterLoginForm';

export default RecruiterLoginForm;
