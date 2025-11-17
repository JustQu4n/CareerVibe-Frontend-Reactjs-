/**
 * BrowseToolbar Component
 * Filter chips, job count, and view mode toggle (list/grid)
 * Provides quick access to job type filters and view preferences
 */

import React, { memo } from "react";
import { List, Grid3x3 } from "lucide-react";
import { JOB_TYPES } from "@/constants/browse.constants";

const BrowseToolbar = ({ filter, onFilterChange, jobCount, mode, onModeChange }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      {/* Filter Chips - Quick job type selection */}
      <div className="flex flex-wrap items-center gap-2">
        {JOB_TYPES.map((tag) => (
          <button
            key={tag}
            onClick={() => onFilterChange(tag)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === tag
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
            aria-label={`Filter by ${tag}`}
            aria-pressed={filter === tag}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Right side - Job count and view toggle */}
      <div className="flex items-center space-x-3">
        {/* Job Count Display */}
        <span className="text-sm text-gray-500">
          {jobCount} {jobCount === 1 ? "job" : "jobs"} found
        </span>

        {/* View Mode Toggle - List/Grid */}
        <div className="bg-white border border-gray-200 rounded-lg flex overflow-hidden">
          <button
            onClick={() => onModeChange("list")}
            className={`p-2 transition-colors ${
              mode === "list"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-500 hover:bg-gray-50"
            }`}
            aria-label="List view"
            aria-pressed={mode === "list"}
          >
            <List size={18} />
          </button>
          <button
            onClick={() => onModeChange("grid")}
            className={`p-2 transition-colors ${
              mode === "grid"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-500 hover:bg-gray-50"
            }`}
            aria-label="Grid view"
            aria-pressed={mode === "grid"}
          >
            <Grid3x3 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Memoize to prevent re-renders
export default memo(BrowseToolbar);
