/**
 * CompanySearch Component
 * Autocomplete search for existing companies
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Building2, Loader2 } from 'lucide-react';

const CompanySearch = React.memo(({
  value,
  onChange,
  suggestions,
  showDropdown,
  onSelect,
  isSearching,
  disabled
}) => {
  return (
    <div className="relative">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Building2 className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          name="company_name"
          value={value}
          onChange={onChange}
          placeholder="Search or enter company name"
          disabled={disabled}
          autoComplete="off"
          className="w-full pl-10 pr-10 py-4 bg-gray-100 border border-gray-200 rounded-lg placeholder-gray-500 text-sm font-medium focus:outline-none focus:border-gray-400 focus:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {isSearching && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
          </div>
        )}
      </div>

      {/* Dropdown Suggestions */}
      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute z-10 mt-1 bg-white border border-gray-300 w-full max-h-48 overflow-y-auto rounded-lg shadow-lg">
          {suggestions.map((company) => (
            <li
              key={company._id}
              className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm flex items-center gap-3 transition-colors"
              onClick={() => onSelect(company)}
            >
              {/* Company Logo */}
              <div className="w-8 h-8 flex-shrink-0 bg-gray-100 rounded overflow-hidden border border-gray-200">
                {company.logo ? (
                  <img
                    src={company.logo}
                    alt={`${company.name} logo`}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&background=4F46E5&color=fff`;
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-700 font-semibold text-xs">
                    {company.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              
              {/* Company Name */}
              <span className="flex-1 font-medium text-gray-900">{company.name}</span>
            </li>
          ))}
        </ul>
      )}
      
      {/* No results message */}
      {showDropdown && suggestions.length === 0 && !isSearching && value.length >= 2 && (
        <div className="absolute z-10 mt-1 bg-white border border-gray-300 w-full rounded-lg shadow-lg p-4 text-sm text-gray-500 text-center">
          No companies found. Enter a new company name to create one.
        </div>
      )}
    </div>
  );
});

CompanySearch.displayName = 'CompanySearch';

CompanySearch.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  suggestions: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      logo: PropTypes.string,
    })
  ).isRequired,
  showDropdown: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  isSearching: PropTypes.bool,
  disabled: PropTypes.bool,
};

CompanySearch.defaultProps = {
  isSearching: false,
  disabled: false,
};

export default CompanySearch;
