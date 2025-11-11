/**
 * RegisterStepOne Component
 * First step of registration: Personal information
 */
import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { User, AtSign, Phone, MapPin } from 'lucide-react';
import { TextInput } from '@/components/shared';

const RegisterStepOne = React.memo(({
  formData,
  handleInputChange,
  onNext,
  isSubmitting
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-4">
        <TextInput
          id="fullname"
          name="fullname"
          type="text"
          label="Full Name"
          value={formData.fullname}
          onChange={handleInputChange}
          placeholder="John Doe"
          icon={User}
          required
          disabled={isSubmitting}
        />
        
        <TextInput
          id="email"
          name="email"
          type="email"
          label="Email Address"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="you@example.com"
          icon={AtSign}
          required
          disabled={isSubmitting}
          autoComplete="email"
        />
        
        <TextInput
          id="phone"
          name="phone"
          type="text"
          label="Phone Number"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="+1 (555) 123-4567"
          icon={Phone}
          required
          disabled={isSubmitting}
          autoComplete="tel"
        />
        
        <TextInput
          id="address"
          name="address"
          type="text"
          label="Address"
          value={formData.address}
          onChange={handleInputChange}
          placeholder="123 Main St, City, Country"
          icon={MapPin}
          required
          disabled={isSubmitting}
          autoComplete="street-address"
        />
      </div>
      
      <div className="mt-8">
        <button
          type="button"
          onClick={onNext}
          disabled={isSubmitting}
          className="w-full flex justify-center items-center py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Continue to Account Setup
        </button>
      </div>
    </motion.div>
  );
});

RegisterStepOne.displayName = 'RegisterStepOne';

RegisterStepOne.propTypes = {
  formData: PropTypes.shape({
    fullname: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
  }).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
};

export default RegisterStepOne;
