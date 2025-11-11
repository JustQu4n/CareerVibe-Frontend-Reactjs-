/**
 * RecruiterStepTwo Component
 * Second step of recruiter registration: Company information
 */
import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import CompanySearch from '@/components/shared/CompanySearch';
import CompanyInfoDisplay from '@/components/shared/CompanyInfoDisplay';
import { TextInput, ImageUpload, LoadingButton } from '@/components/shared';
import { Globe, MapPin } from 'lucide-react';

const RecruiterStepTwo = React.memo(({
  formData,
  companySuggestions,
  showCompanyDropdown,
  selectedCompany,
  isSearching,
  handleCompanyNameChange,
  handleCompanySelect,
  resetCompanySelection,
  handleInputChange,
  handleFileChange,
  onBack,
  onNext,
  isSubmitting
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-md"
    >
      <div className="space-y-5">
        {/* Company Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Name
          </label>
          <CompanySearch
            value={formData.company_name}
            onChange={handleCompanyNameChange}
            suggestions={companySuggestions}
            showDropdown={showCompanyDropdown}
            onSelect={handleCompanySelect}
            isSearching={isSearching}
            disabled={isSubmitting}
          />
        </div>

        {/* Selected Company Display or New Company Form */}
        {selectedCompany ? (
          <CompanyInfoDisplay
            companyData={{
              name: formData.company_name,
              domain: formData.company_domain,
              address: formData.company_address,
              logo: formData.company_logo,
            }}
            isReadOnly={true}
            onEdit={resetCompanySelection}
          />
        ) : (
          <>
            {/* Company Domain */}
            <TextInput
              id="company_domain"
              name="company_domain"
              label="Company Domain"
              icon={Globe}
              value={formData.company_domain}
              onChange={handleInputChange}
              placeholder="e.g., example.com"
              disabled={isSubmitting}
              required
            />

            {/* Company Address */}
            <TextInput
              id="company_address"
              name="company_address"
              label="Company Address"
              icon={MapPin}
              value={formData.company_address}
              onChange={handleInputChange}
              placeholder="Enter company address"
              disabled={isSubmitting}
              required
            />

            {/* Company Logo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Logo
              </label>
              <ImageUpload
                imagePreview={formData.file ? URL.createObjectURL(formData.file) : null}
                onFileChange={handleFileChange}
                disabled={isSubmitting}
                label="Upload Logo"
              />
              {formData.file && (
                <p className="text-xs text-gray-500 mt-1">
                  {formData.file.name}
                </p>
              )}
            </div>
          </>
        )}
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
          type="button"
          onClick={onNext}
          isLoading={isSubmitting}
          variant="primary"
          className="w-1/2 py-4"
        >
          <span className="flex items-center justify-center gap-2">
            Next
            <ArrowRight className="h-5 w-5" />
          </span>
        </LoadingButton>
      </div>
    </motion.div>
  );
});

RecruiterStepTwo.displayName = 'RecruiterStepTwo';

RecruiterStepTwo.propTypes = {
  formData: PropTypes.shape({
    company_name: PropTypes.string.isRequired,
    company_domain: PropTypes.string.isRequired,
    company_address: PropTypes.string.isRequired,
    company_logo: PropTypes.string,
    file: PropTypes.object,
  }).isRequired,
  companySuggestions: PropTypes.array.isRequired,
  showCompanyDropdown: PropTypes.bool.isRequired,
  selectedCompany: PropTypes.object,
  isSearching: PropTypes.bool,
  handleCompanyNameChange: PropTypes.func.isRequired,
  handleCompanySelect: PropTypes.func.isRequired,
  resetCompanySelection: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleFileChange: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
};

export default RecruiterStepTwo;
