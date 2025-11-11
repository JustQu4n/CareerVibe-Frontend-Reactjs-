/**
 * RecruiterStepThree Component
 * Third step of recruiter registration: Confirmation
 */
import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowLeft } from 'lucide-react';
import { LoadingButton } from '@/components/shared';

const RecruiterStepThree = React.memo(({
  formData,
  selectedCompany,
  onBack,
  onSubmit,
  isSubmitting
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-md text-center"
    >
      {/* Success Icon */}
      <div className="flex justify-center mb-6">
        <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle2 className="h-16 w-16 text-green-600" />
        </div>
      </div>

      <h2 className="text-xl font-bold mb-6 text-gray-900">
        Confirm Your Information
      </h2>

      {/* Personal Information */}
      <div className="bg-gray-50 p-4 rounded-lg text-left mb-6 border border-gray-200">
        <h3 className="font-semibold text-gray-700 border-b pb-2 mb-3">
          Personal Information
        </h3>
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <span className="text-sm text-gray-600">Full Name:</span>
            <span className="col-span-2 text-sm font-medium text-gray-900">
              {formData.fullname}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-sm text-gray-600">Email:</span>
            <span className="col-span-2 text-sm font-medium text-gray-900 break-all">
              {formData.email}
            </span>
          </div>
        </div>
      </div>

      {/* Company Information */}
      <div className="bg-gray-50 p-4 rounded-lg text-left mb-6 border border-gray-200">
        <h3 className="font-semibold text-gray-700 border-b pb-2 mb-3">
          Company Information
        </h3>
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <span className="text-sm text-gray-600">Name:</span>
            <span className="col-span-2 text-sm font-medium text-gray-900">
              {formData.company_name}
            </span>
          </div>
          
          {selectedCompany && (
            <div className="col-span-3 text-xs text-indigo-600 bg-indigo-50 p-2 rounded">
              ✓ Using existing company
            </div>
          )}
          
          <div className="grid grid-cols-3 gap-2">
            <span className="text-sm text-gray-600">Domain:</span>
            <span className="col-span-2 text-sm font-medium text-gray-900">
              {formData.company_domain || 'N/A'}
            </span>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <span className="text-sm text-gray-600">Address:</span>
            <span className="col-span-2 text-sm font-medium text-gray-900">
              {formData.company_address || 'N/A'}
            </span>
          </div>
          
          {(formData.file || formData.company_logo) && (
            <div className="grid grid-cols-3 gap-2 pt-2">
              <span className="text-sm text-gray-600">Logo:</span>
              <div className="col-span-2">
                <div className="w-16 h-16 bg-white rounded border border-gray-200 overflow-hidden">
                  <img
                    src={formData.file ? URL.createObjectURL(formData.file) : formData.company_logo}
                    alt="Company logo"
                    className="w-full h-full object-contain"
                    onLoad={(e) => {
                      if (formData.file) {
                        URL.revokeObjectURL(e.target.src);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-4 mt-8">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 tracking-wide font-semibold bg-gray-500 text-gray-100 w-1/2 py-4 rounded-lg hover:bg-gray-600 transition-all duration-300 ease-in-out focus:shadow-outline focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </button>
        
        <LoadingButton
          type="submit"
          onClick={onSubmit}
          isLoading={isSubmitting}
          loadingText="Creating Account..."
          variant="primary"
          className="w-1/2 py-4"
        >
          <span className="flex items-center justify-center gap-2">
            Confirm
            <CheckCircle2 className="h-5 w-5" />
          </span>
        </LoadingButton>
      </div>
    </motion.div>
  );
});

RecruiterStepThree.displayName = 'RecruiterStepThree';

RecruiterStepThree.propTypes = {
  formData: PropTypes.shape({
    fullname: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    company_name: PropTypes.string.isRequired,
    company_domain: PropTypes.string,
    company_address: PropTypes.string,
    company_logo: PropTypes.string,
    file: PropTypes.object,
  }).isRequired,
  selectedCompany: PropTypes.object,
  onBack: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
};

export default RecruiterStepThree;
