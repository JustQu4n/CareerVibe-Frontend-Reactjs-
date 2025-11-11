/**
 * CompanyInfoDisplay Component
 * Display company information (read-only or editable)
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Building2, MapPin, Globe } from 'lucide-react';

const CompanyInfoDisplay = React.memo(({
  companyData,
  isReadOnly,
  onEdit
}) => {
  if (isReadOnly) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-gray-700 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-indigo-600" />
            Existing Company
          </h3>
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium focus:outline-none focus:underline"
            >
              Change
            </button>
          )}
        </div>

        {/* Company Name */}
        <div className="mb-3">
          <p className="text-xs text-gray-500 mb-1">Company Name</p>
          <p className="font-medium text-gray-900">{companyData.name}</p>
        </div>

        {/* Domain */}
        {companyData.domain && (
          <div className="mb-3 flex items-start gap-2">
            <Globe className="h-4 w-4 text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">Domain</p>
              <p className="text-sm font-medium text-gray-900">{companyData.domain}</p>
            </div>
          </div>
        )}

        {/* Address */}
        {companyData.address && (
          <div className="mb-3 flex items-start gap-2">
            <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">Address</p>
              <p className="text-sm font-medium text-gray-900">{companyData.address}</p>
            </div>
          </div>
        )}

        {/* Logo */}
        {companyData.logo && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-2">Logo</p>
            <div className="w-16 h-16 bg-white rounded border border-gray-200 overflow-hidden">
              <img
                src={companyData.logo}
                alt="Company logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
});

CompanyInfoDisplay.displayName = 'CompanyInfoDisplay';

CompanyInfoDisplay.propTypes = {
  companyData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    domain: PropTypes.string,
    address: PropTypes.string,
    logo: PropTypes.string,
  }).isRequired,
  isReadOnly: PropTypes.bool,
  onEdit: PropTypes.func,
};

CompanyInfoDisplay.defaultProps = {
  isReadOnly: true,
  onEdit: null,
};

export default CompanyInfoDisplay;
