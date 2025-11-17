/**
 * BrowseSearchBar Component
 * Main search interface with keyword, location, and job type filters
 * Optimized with React.memo to prevent unnecessary re-renders
 */

import React, { memo } from "react";
import { Search, MapPin, Briefcase, ChevronDown } from "lucide-react";
import { JOB_TYPES } from "@/constants/browse.constants";

const BrowseSearchBar = ({
  search,
  location,
  filter,
  onSearchChange,
  onLocationChange,
  onFilterChange,
  onSearch,
}) => {
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Search Input - Job title/keywords */}
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
              aria-label="Search jobs"
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
              aria-label="Location"
            />
          </div>

          {/* Job Type Select */}
          <div className="md:col-span-3 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Briefcase className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white transition-all"
              value={filter}
              onChange={(e) => onFilterChange(e.target.value)}
              aria-label="Job type"
            >
              {JOB_TYPES.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
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
              aria-label="Search jobs"
            >
              <Search className="h-5 w-5 mr-2" />
              Search Jobs
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

// Memoize to prevent re-renders when parent re-renders
export default memo(BrowseSearchBar);
