/**
 * BrowseFilters Component
 * Advanced filter panel with salary, experience, date, and company type filters
 * Uses AnimatePresence for smooth show/hide animations
 */

import React, { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  SlidersHorizontal,
  DollarSign,
  Briefcase,
  Calendar,
  Building2,
} from "lucide-react";
import {
  EXPERIENCE_OPTIONS,
  DATE_OPTIONS,
  COMPANY_TYPES,
  SALARY_RANGE,
} from "@/constants/browse.constants";

const BrowseFilters = ({
  showFilters,
  onToggle,
  appliedFiltersCount,
  onReset,
  salary,
  onSalaryChange,
  experience,
  onExperienceChange,
  datePosted,
  onDatePostedChange,
  sortBy,
  onSortByChange,
}) => {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-between">
      {/* Left side - Filter controls */}
      <div className="flex items-center space-x-2 mt-2">
        {/* Toggle Advanced Filters Button */}
        <button
          onClick={onToggle}
          className="flex items-center space-x-1 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
          aria-label="Toggle advanced filters"
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>Advanced Filters</span>
          {appliedFiltersCount > 0 && (
            <span className="ml-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-600 rounded-full">
              {appliedFiltersCount}
            </span>
          )}
        </button>

        {/* Clear Filters Button - only show when filters are applied */}
        {appliedFiltersCount > 0 && (
          <button
            onClick={onReset}
            className="flex items-center space-x-1 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
            aria-label="Clear all filters"
          >
            <X className="h-4 w-4" />
            <span>Clear Filters</span>
          </button>
        )}
      </div>

      {/* Right side - Sort dropdown */}
      <div className="flex items-center space-x-2 mt-2">
        <span className="text-sm text-gray-500">Sort by:</span>
        <select
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
          className="text-sm border border-gray-200 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          aria-label="Sort jobs"
        >
          <option value="relevance">Relevance</option>
          <option value="newest">Newest</option>
          <option value="salary_high">Salary: High to Low</option>
          <option value="salary_low">Salary: Low to High</option>
        </select>
      </div>

      {/* Advanced Filters Panel - Animated */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden w-full"
          >
            <div className="mt-6 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Salary Range Slider */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <DollarSign className="h-4 w-4 mr-1 text-gray-500" />
                  Salary Range
                </h3>
                <div className="px-2">
                  <input
                    type="range"
                    min={SALARY_RANGE.MIN}
                    max={SALARY_RANGE.MAX}
                    step={SALARY_RANGE.STEP}
                    value={salary[1]}
                    onChange={(e) =>
                      onSalaryChange([salary[0], parseInt(e.target.value)])
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    aria-label="Maximum salary"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>${SALARY_RANGE.MIN}</span>
                    <span>${salary[1].toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Experience Level Select */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Briefcase className="h-4 w-4 mr-1 text-gray-500" />
                  Experience Level
                </h3>
                <select
                  value={experience}
                  onChange={(e) => onExperienceChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  aria-label="Experience level"
                >
                  {EXPERIENCE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Posted Select */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                  Date Posted
                </h3>
                <select
                  value={datePosted}
                  onChange={(e) => onDatePostedChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  aria-label="Date posted"
                >
                  {DATE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* Company Type Checkboxes */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Building2 className="h-4 w-4 mr-1 text-gray-500" />
                  Company Type
                </h3>
                <div className="space-y-1">
                  {COMPANY_TYPES.map((type) => (
                    <label
                      key={type}
                      className="flex items-center text-sm text-gray-700 cursor-pointer hover:text-gray-900"
                    >
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 mr-2"
                        aria-label={type}
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Memoize to prevent unnecessary re-renders
export default memo(BrowseFilters);
