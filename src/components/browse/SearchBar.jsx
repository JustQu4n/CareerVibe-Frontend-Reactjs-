/**
 * SearchBar Component
 * Main search form with job title, location, and type filters
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Search, MapPin, Briefcase, ChevronDown } from 'lucide-react';
import { JOB_TYPES } from '@/constants/browse.constants';

const SearchBar = ({
  search,
  location,
  jobType,
  onSearchChange,
  onLocationChange,
  onJobTypeChange,
  onSearchSubmit,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearchSubmit?.();
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Search Input */}
        <div className="md:col-span-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Job title, keywords, or company"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Location Input */}
        <div className="md:col-span-3 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Location or Remote"
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Job Type Select */}
        <div className="md:col-span-3 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Briefcase className="h-5 w-5 text-gray-400" />
          </div>
          <select
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white transition-all"
            value={jobType}
            onChange={(e) => onJobTypeChange(e.target.value)}
          >
            {JOB_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </div>
        </div>

        {/* Search Button */}
        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full h-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm flex items-center justify-center"
          >
            <Search className="h-5 w-5 mr-2" />
            Search
          </button>
        </div>
      </div>
    </form>
  );
};

SearchBar.propTypes = {
  search: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  jobType: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onLocationChange: PropTypes.func.isRequired,
  onJobTypeChange: PropTypes.func.isRequired,
  onSearchSubmit: PropTypes.func,
};

export default React.memo(SearchBar);
