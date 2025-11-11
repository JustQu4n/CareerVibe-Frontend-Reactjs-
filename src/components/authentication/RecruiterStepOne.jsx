/**
 * RecruiterStepOne Component
 * First step of recruiter registration: Personal information
 */
import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { TextInput, PasswordInput, LoadingButton } from '@/components/shared';
import { User, Mail } from 'lucide-react';

const RecruiterStepOne = React.memo(({
  formData,
  showPassword,
  showConfirmPassword,
  handleInputChange,
  togglePasswordVisibility,
  toggleConfirmPasswordVisibility,
  onNext,
  isSubmitting
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-md"
    >
      <div className="space-y-5">
        {/* Full Name */}
        <TextInput
          id="fullname"
          name="fullname"
          label="Full Name"
          icon={User}
          value={formData.fullname}
          onChange={handleInputChange}
          placeholder="Enter your full name"
          disabled={isSubmitting}
          required
        />

        {/* Email */}
        <TextInput
          id="email"
          name="email"
          type="email"
          label="Email"
          icon={Mail}
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Enter your email"
          disabled={isSubmitting}
          required
        />

        {/* Password */}
        <PasswordInput
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          showPassword={showPassword}
          onToggleVisibility={togglePasswordVisibility}
          label="Password"
          placeholder="Enter password"
          disabled={isSubmitting}
        />

        {/* Confirm Password */}
        <PasswordInput
          name="repassword"
          value={formData.repassword}
          onChange={handleInputChange}
          showPassword={showConfirmPassword}
          onToggleVisibility={toggleConfirmPasswordVisibility}
          label="Confirm Password"
          placeholder="Re-enter password"
          disabled={isSubmitting}
        />
        
        {formData.password && formData.repassword && formData.password !== formData.repassword && (
          <p className="text-xs text-red-600 mt-1">Passwords do not match</p>
        )}
      </div>

      {/* Next Button */}
      <div className="mt-8">
        <LoadingButton
          type="button"
          onClick={onNext}
          isLoading={isSubmitting}
          variant="primary"
          fullWidth
          className="py-4"
        >
          Next Step
        </LoadingButton>
      </div>
    </motion.div>
  );
});

RecruiterStepOne.displayName = 'RecruiterStepOne';

RecruiterStepOne.propTypes = {
  formData: PropTypes.shape({
    fullname: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    repassword: PropTypes.string.isRequired,
  }).isRequired,
  showPassword: PropTypes.bool.isRequired,
  showConfirmPassword: PropTypes.bool.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  togglePasswordVisibility: PropTypes.func.isRequired,
  toggleConfirmPasswordVisibility: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
};

export default RecruiterStepOne;
