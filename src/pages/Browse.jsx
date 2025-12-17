/**
 * Browse Page
 * Main page for browsing and searching job listings with server-side filtering
 * 
 * Architecture:
 * - Uses custom hook (useBrowse) for server-side filtering and pagination
 * - Composed of modular, reusable components from components/browse
 * - Optimized with React.memo and useCallback to minimize re-renders
 * - Responsive design with Tailwind CSS
 */

import React from "react";
import useBrowse from "@/hooks/useBrowse";
import { Navbar } from "@/components/navbar";
import {
  BrowseHeader,
  BrowseSearchBar,
  BrowseFilters,
  BrowseToolbar,
  JobList,
} from "@/components/browse";

const Browse = () => {
  // Use custom hook for server-side filtering and pagination
  const {
    // Filter states
    keyword,
    location,
    jobType,
    level,
    experience,
    salaryRange,
    skills,
    sortBy,
    sortOrder,
    
    // Filter setters
    setKeyword,
    setLocation,
    setJobType,
    setLevel,
    setExperience,
    setSalaryRange,
    setSkills,
    setSortBy,
    setSortOrder,
    
    // Data
    jobs,
    loading,
    error,
    
    // Meta
    total,
    page,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    
    // UI states
    showFilters,
    viewMode,
    
    // Actions
    handleSearch,
    resetFilters,
    toggleFilters,
    changeViewMode,
    goToPage,
    nextPage,
    prevPage,
    appliedFiltersCount,
  } = useBrowse();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Navbar */}
      <div className="sticky top-0 z-50 bg-white shadow-md">
        <Navbar />
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <BrowseHeader />

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 font-medium">Error loading jobs: {error}</p>
          </div>
        )}

        {/* Search Bar */}
        <BrowseSearchBar
          search={keyword}
          location={location}
          filter={jobType}
          onSearchChange={setKeyword}
          onLocationChange={setLocation}
          onFilterChange={setJobType}
          onSearch={() => handleSearch(keyword, location)}
        />

        {/* Advanced Filters */}
        <BrowseFilters
          showFilters={showFilters}
          onToggle={toggleFilters}
          appliedFiltersCount={appliedFiltersCount}
          onReset={resetFilters}
          level={level}
          onLevelChange={setLevel}
          experience={experience}
          onExperienceChange={setExperience}
          salaryRange={salaryRange}
          onSalaryRangeChange={setSalaryRange}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
        />

        {/* Filter Chips and View Toggle */}
        <BrowseToolbar
          filter={jobType}
          onFilterChange={setJobType}
          jobCount={total}
          mode={viewMode}
          onModeChange={changeViewMode}
        />

        {/* Job List/Grid */}
        <JobList
          jobs={jobs}
          loading={loading}
          mode={viewMode}
          onResetFilters={resetFilters}
        />

        {/* Pagination */}
        {totalPages > 0 && (
          <div className="mt-10 flex justify-center">
            <nav className="flex items-center space-x-2" aria-label="Pagination">
              <button
                onClick={prevPage}
                disabled={!hasPreviousPage}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-500 bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {/* Page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      page === pageNum
                        ? 'text-white bg-blue-600 hover:bg-blue-700'
                        : 'text-gray-700 bg-white border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              {totalPages > 5 && page < totalPages - 2 && (
                <>
                  <span className="px-3 py-2 text-gray-500">...</span>
                  <button
                    onClick={() => goToPage(totalPages)}
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50"
                  >
                    {totalPages}
                  </button>
                </>
              )}
              
              <button
                onClick={nextPage}
                disabled={!hasNextPage}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse;
