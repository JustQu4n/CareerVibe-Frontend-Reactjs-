/**
 * RegisterStepTwo Component
 * Second step of registration: Account setup with password
 */
import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import {
  PasswordInput,
  PasswordStrengthIndicator,
  ImageUpload,
  LoadingButton
} from '@/components/shared';

const RegisterStepTwo = React.memo(({
  formData,
  passwordStrength,
  imagePreview,
  showPassword,
  showConfirmPassword,
  handleInputChange,
  handleFileChange,
  togglePasswordVisibility,
  toggleConfirmPasswordVisibility,
  onBack,
  isSubmitting
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-4">
        {/* Password */}
        <div>
          <PasswordInput
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            showPassword={showPassword}
            onToggleVisibility={togglePasswordVisibility}
            label="Password"
            placeholder="••••••••"
            disabled={isSubmitting}
          />
          <PasswordStrengthIndicator
            password={formData.password}
            strength={passwordStrength}
          />
        </div>
        
        {/* Confirm Password */}
        <div>
          <PasswordInput
            name="repassword"
            value={formData.repassword}
            onChange={handleInputChange}
            showPassword={showConfirmPassword}
            onToggleVisibility={toggleConfirmPasswordVisibility}
            label="Confirm Password"
            placeholder="••••••••"
            disabled={isSubmitting}
          />
          {formData.password && formData.repassword && formData.password !== formData.repassword && (
            <p className="mt-1 text-xs text-red-600">Passwords do not match</p>
          )}
        </div>
        
        {/* Profile Picture */}
        <ImageUpload
          imagePreview={imagePreview}
          onFileChange={handleFileChange}
          disabled={isSubmitting}
        />
      </div>
      
      <div className="mt-8 flex space-x-4">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="w-1/2 py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Back
        </button>
        <LoadingButton
          type="submit"
          isLoading={isSubmitting}
          loadingText="Creating Account..."
          variant="primary"
          fullWidth={false}
          className="w-1/2"
        >
          Create Account
        </LoadingButton>
      </div>
    </motion.div>
  );
});

RegisterStepTwo.displayName = 'RegisterStepTwo';

RegisterStepTwo.propTypes = {
  formData: PropTypes.shape({
    password: PropTypes.string.isRequired,
    repassword: PropTypes.string.isRequired,
  }).isRequired,
  passwordStrength: PropTypes.number.isRequired,
  imagePreview: PropTypes.string,
  showPassword: PropTypes.bool.isRequired,
  showConfirmPassword: PropTypes.bool.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleFileChange: PropTypes.func.isRequired,
  togglePasswordVisibility: PropTypes.func.isRequired,
  toggleConfirmPasswordVisibility: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
};

export default RegisterStepTwo;
