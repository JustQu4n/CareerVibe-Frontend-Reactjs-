/**
 * Browse Page
 * Main page for browsing and searching job listings
 * 
 * Architecture:
 * - Uses custom hook (useBrowseFilters) for state management
 * - Composed of modular, reusable components from components/browse
 * - Optimized with React.memo and useCallback to minimize re-renders
 * - Responsive design with Tailwind CSS
 */

import React, { useCallback } from "react";
import { useSelector } from "react-redux";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import { Navbar } from "@/components/navbar";
import {
  BrowseHeader,
  BrowseSearchBar,
  BrowseFilters,
  BrowseToolbar,
  JobList,
} from "@/components/browse";

const Browse = () => {
  // Fetch all jobs from API
  const { loading, error } = useGetAllJobs();

  // Get jobs from Redux
  const { allJobs } = useSelector((store) => store.job);

  // Debug: Log jobs data
  React.useEffect(() => {
    console.log("Browse - allJobs:", allJobs);
    console.log("Browse - loading:", loading);
    console.log("Browse - error:", error);
  }, [allJobs, loading, error]);

  // Local state management
  const [search, setSearch] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [filter, setFilter] = React.useState("All");
  const [salary, setSalary] = React.useState([0, 200000]);
  const [experience, setExperience] = React.useState("Any");
  const [datePosted, setDatePosted] = React.useState("Any");
  const [sortBy, setSortBy] = React.useState("relevance");
  const [showFilters, setShowFilters] = React.useState(false);
  const [mode, setMode] = React.useState("list");

  // Memoized handlers to prevent unnecessary re-renders
  const handleSearchChange = useCallback((value) => setSearch(value), []);
  const handleLocationChange = useCallback((value) => setLocation(value), []);
  const handleFilterChange = useCallback((value) => setFilter(value), []);
  const handleSalaryChange = useCallback((value) => setSalary(value), []);
  const handleExperienceChange = useCallback((value) => setExperience(value), []);
  const handleDatePostedChange = useCallback((value) => setDatePosted(value), []);
  const handleSortByChange = useCallback((value) => setSortBy(value), []);
  const handleModeChange = useCallback((value) => setMode(value), []);
  const toggleFilters = useCallback(() => setShowFilters((prev) => !prev), []);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setSearch("");
    setLocation("");
    setFilter("All");
    setSalary([0, 200000]);
    setExperience("Any");
    setDatePosted("Any");
    setSortBy("relevance");
  }, []);

  // Helper: Check if date is within range
  const isWithinDateRange = useCallback((dateString, range) => {
    if (range === "Any") return true;

    const jobDate = new Date(dateString);
    const today = new Date();
    const daysDiff = Math.floor((today - jobDate) / (1000 * 60 * 60 * 24));

    switch (range) {
      case "Today":
        return daysDiff < 1;
      case "Last 3 days":
        return daysDiff <= 3;
      case "Last week":
        return daysDiff <= 7;
      case "Last month":
        return daysDiff <= 30;
      default:
        return true;
    }
  }, []);

  // Apply all filters to jobs
  const filteredJobs = React.useMemo(() => {
    // Safety check: ensure allJobs is an array
    if (!Array.isArray(allJobs) || allJobs.length === 0) {
      return [];
    }

    return allJobs
      .filter((job) => {
        // Title/keyword search - allow empty search to match all
        const matchesSearch = !search || job.title
          ?.toLowerCase()
          .includes(search.toLowerCase());

        // Job type filter - map employment_type from API to filter
        // API: "full-time", "part-time", "contract", "internship", "remote"
        // Filter: "Full Time", "Part Time", "Contract", "Internship", "Remote"
        const normalizeType = (type) => {
          if (!type) return '';
          return type.toLowerCase().replace('-', ' ');
        };
        
        const matchesType = filter === "All" || 
          normalizeType(job.employment_type) === normalizeType(filter) ||
          normalizeType(job.type) === normalizeType(filter);

        // Location filter
        const matchesLocation =
          !location ||
          job.location?.toLowerCase().includes(location.toLowerCase());

        // Salary range filter - API returns salary_range as string, skip if not numeric
        // This is a simplified check - can be enhanced later
        const matchesSalary = true; // TODO: Parse salary_range string for filtering

        // Experience level filter - API might not have this field
        const matchesExperience =
          experience === "Any" || job.experience === experience;

        // Date posted filter - use created_at from API
        const matchesDate =
          datePosted === "Any" ||
          isWithinDateRange(job.created_at, datePosted);

        return (
          matchesSearch &&
          matchesType &&
          matchesLocation &&
          matchesSalary &&
          matchesExperience &&
          matchesDate
        );
      })
      .sort((a, b) => {
        // Apply sorting - note: salary is string in new API
        if (sortBy === "newest")
          return new Date(b.created_at) - new Date(a.created_at);
        // Salary sorting disabled for now since salary_range is string
        // if (sortBy === "salary_high") return b.salary - a.salary;
        // if (sortBy === "salary_low") return a.salary - b.salary;
        return 0; // Default: relevance
      });
  }, [
    allJobs,
    search,
    location,
    filter,
    salary,
    experience,
    datePosted,
    sortBy,
    isWithinDateRange,
  ]);

  // Count applied filters for badge
  const appliedFiltersCount = React.useMemo(() => {
    let count = 0;
    if (filter !== "All") count++;
    if (location !== "") count++;
    if (salary[0] > 0 || salary[1] < 200000) count++;
    if (experience !== "Any") count++;
    if (datePosted !== "Any") count++;
    return count;
  }, [filter, location, salary, experience, datePosted]);

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
          search={search}
          location={location}
          filter={filter}
          onSearchChange={handleSearchChange}
          onLocationChange={handleLocationChange}
          onFilterChange={handleFilterChange}
        />

        {/* Advanced Filters */}
        <BrowseFilters
          showFilters={showFilters}
          onToggle={toggleFilters}
          appliedFiltersCount={appliedFiltersCount}
          onReset={resetFilters}
          salary={salary}
          onSalaryChange={handleSalaryChange}
          experience={experience}
          onExperienceChange={handleExperienceChange}
          datePosted={datePosted}
          onDatePostedChange={handleDatePostedChange}
          sortBy={sortBy}
          onSortByChange={handleSortByChange}
        />

        {/* Filter Chips and View Toggle */}
        <BrowseToolbar
          filter={filter}
          onFilterChange={handleFilterChange}
          jobCount={filteredJobs.length}
          mode={mode}
          onModeChange={handleModeChange}
        />

        {/* Job List/Grid */}
        <JobList
          jobs={filteredJobs}
          loading={loading}
          mode={mode}
          onResetFilters={resetFilters}
        />

        {/* Pagination - Static for now, can be enhanced later */}
        {filteredJobs.length > 0 && (
          <div className="mt-10 flex justify-center">
            <nav className="flex items-center space-x-2" aria-label="Pagination">
              <button
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-500 bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
                disabled
              >
                Previous
              </button>
              <button className="px-3 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                1
              </button>
              <button className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50">
                2
              </button>
              <button className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50">
                3
              </button>
              <span className="px-3 py-2 text-gray-500">...</span>
              <button className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50">
                8
              </button>
              <button className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50">
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
