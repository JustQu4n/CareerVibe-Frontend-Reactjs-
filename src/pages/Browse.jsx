/**
 * Browse Page - WerkLinker Style
 * Job search page with sidebar filters and grid layout
 */

import React, { useState } from "react";
import useBrowse from "@/hooks/useBrowse";
import { Navbar } from "@/components/navbar";
import { Search, MapPin, ChevronDown, Grid3x3, List, Bookmark, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Browse = () => {
  const navigate = useNavigate();
  const {
    keyword,
    location,
    jobType,
    experience,
    salaryRange,
    sortBy,
    setKeyword,
    setLocation,
    setJobType,
    setExperience,
    setSalaryRange,
    setSortBy,
    jobs,
    loading,
    error,
    total,
    page,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    goToPage,
    nextPage,
    prevPage,
    resetFilters,
    handleSearch,
  } = useBrowse();

  const [viewMode, setViewMode] = useState("grid");
  const [openToRemote, setOpenToRemote] = useState(false);
  const [minSalary, setMinSalary] = useState(1000);
  const [maxSalary, setMaxSalary] = useState(25000);
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);
  const [selectedExperience, setSelectedExperience] = useState([]);
  const [selectedCity, setSelectedCity] = useState("All City");

  // Handle job type toggle
  const toggleJobType = (type) => {
    const mappedType = type === 'Full-Time' ? 'full_time' : 
                      type === 'Part-Time' ? 'part_time' : 
                      type === 'Contract' ? 'contract' : 
                      type === 'Internship' ? 'internship' : type.toLowerCase();
    
    if (selectedJobTypes.includes(type)) {
      setSelectedJobTypes(selectedJobTypes.filter(t => t !== type));
      if (jobType === mappedType) {
        setJobType('');
      }
    } else {
      setSelectedJobTypes([type]);
      setJobType(mappedType);
    }
  };

  // Handle experience toggle
  const toggleExperience = (exp) => {
    const mappedExp = exp === 'Less than a year' ? '0-1' :
                     exp === '1-3 years' ? '1-3' :
                     exp === '3-5 years' ? '3-5' :
                     exp === '5-10 years' ? '5-10' :
                     exp === 'More than 10' ? '10+' : exp;
    
    if (selectedExperience.includes(exp)) {
      setSelectedExperience(selectedExperience.filter(e => e !== exp));
      if (experience === mappedExp) {
        setExperience('');
      }
    } else {
      setSelectedExperience([exp]);
      setExperience(mappedExp);
    }
  };

  // Handle clear all filters
  const handleClearAll = () => {
    setSelectedJobTypes([]);
    setSelectedExperience([]);
    setOpenToRemote(false);
    setMinSalary(1000);
    setMaxSalary(25000);
    setKeyword("");
    setLocation("");
    resetFilters();
  };

  // Format time ago
  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hour${Math.floor(diff / 3600) > 1 ? 's' : ''} ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  console.log("Jobs:", jobs);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex">
        {/* Left Sidebar - Filters */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen p-6 sticky top-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Filter</h2>
            <button 
              onClick={handleClearAll}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear All
            </button>
          </div>

          {/* Job Type Filter */}
          <div className="mb-6">
            <button className="flex justify-between items-center w-full mb-3">
              <h3 className="text-sm font-semibold text-gray-900">Job Type</h3>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
            <div className="space-y-2">
              {["Contract", "Full-Time", "Part-Time", "Internship"].map((type) => (
                <label key={type} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedJobTypes.includes(type)}
                    onChange={() => toggleJobType(type)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Open to Remote Toggle */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-semibold text-gray-900">Open to remote</span>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={openToRemote}
                  onChange={(e) => setOpenToRemote(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </div>
            </label>
          </div>

          {/* Salary Range Filter */}
          <div className="mb-6">
            <button className="flex justify-between items-center w-full mb-3">
              <h3 className="text-sm font-semibold text-gray-900">Range Salary</h3>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
            <div className="space-y-2 mb-4">
              {[
                { label: "Less than $1000", value: "0-1000" },
                { label: "$1000 - $15,000", value: "1000-15000" },
                { label: "More than $15,000", value: "15000+" }
              ].map((range) => (
                <label key={range.value} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="salary"
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{range.label}</span>
                </label>
              ))}
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="salary"
                  defaultChecked
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Custom</span>
              </label>
            </div>

            {/* Salary Slider */}
            <div className="px-1">
              <div className="relative pt-1">
                <input
                  type="range"
                  min="1000"
                  max="25000"
                  value={minSalary}
                  onChange={(e) => setMinSalary(Number(e.target.value))}
                  className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                />
                <input
                  type="range"
                  min="1000"
                  max="25000"
                  value={maxSalary}
                  onChange={(e) => setMaxSalary(Number(e.target.value))}
                  className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer -mt-2"
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-xs text-gray-600">${minSalary.toLocaleString()}</span>
                <span className="text-xs text-gray-600">${maxSalary.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Experience Filter */}
          <div className="mb-6">
            <button className="flex justify-between items-center w-full mb-3">
              <h3 className="text-sm font-semibold text-gray-900">Experience</h3>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
            <div className="space-y-2">
              {[
                "Less than a year",
                "1-3 years",
                "3-5 years",
                "5-10 years",
                "More than 10"
              ].map((exp) => (
                <label key={exp} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedExperience.includes(exp)}
                    onChange={() => toggleExperience(exp)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{exp}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex gap-3">
              {/* Keyword Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="UI/UX Designer"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Location Dropdown */}
              <div className="w-48 relative">
                <select 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                >
                  <option>Vietnam</option>
                  <option>Da Nang</option>
                  <option>Ho Chi Minh</option>
                  <option>Ha Noi</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* City Dropdown */}
              <div className="w-40 relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select 
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                >
                  <option>All City</option>
                  <option>Da Nang</option>
                  <option>Ho Chi Minh</option>
                  <option>Ha Noi</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Search Button */}
              <button 
                onClick={() => handleSearch(keyword, location)}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
              >
                Search
              </button>
            </div>
          </div>

          {/* Results Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold">{total || 150}</span> Jobs{" "}
                {keyword && (
                  <>
                    <span className="font-semibold">{keyword}</span> in{" "}
                  </>
                )}
                <span className="font-semibold">{location || "Vietnam"}</span>
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Sort By */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Short by</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="relevancy">Relevancy</option>
                  <option value="newest">Newest</option>
                  <option value="salary_high">Highest Salary</option>
                  <option value="salary_low">Lowest Salary</option>
                </select>
              </div>

              {/* View Toggle */}
              <div className="flex gap-1 border border-gray-300 rounded-md p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded ${
                    viewMode === "grid" ? "bg-gray-200" : "hover:bg-gray-100"
                  }`}
                >
                  <Grid3x3 className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded ${
                    viewMode === "list" ? "bg-gray-200" : "hover:bg-gray-100"
                  }`}
                >
                  <List className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Job Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {jobs?.map((job) => (
                <div
                  key={job.job_post_id || job._id}
                  className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/view-job-detail/${job.job_post_id || job._id}`)}
                >
                  {/* Header: Logo, Company Name and Badge */}
                  <div className="flex items-start justify-between mb-3">
                    {/* Company Logo and Name */}
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 border rounded-lg flex items-center justify-center flex-shrink-0">
                        {job.company?.logo_url ? (
                          <img 
                            src={job.company.logo_url} 
                            alt={job.company.name}
                            className="w-10 h-10 object-contain rounded"
                          />
                        ) : (
                          <span className="text-blue-600 font-bold text-xl">
                            {job.company?.name?.charAt(0) || job.title?.charAt(0) || "J"}
                          </span>
                        )}
                      </div>
                      <h3 className="text-base text-black line-clamp-1">
                        {job.company?.name || "Company Name"}
                      </h3>
                    </div>

                    {/* Status Badge */}
                    <span className={`px-3 py-1 text-white text-xs font-medium rounded capitalize flex-shrink-0 ${
                      job.status === 'active' ? 'bg-green-500' : 
                      job.status === 'closed' ? 'bg-red-500' : 
                      'bg-gray-500'
                    }`}>
                      {job.status || "Active"}
                    </span>
                  </div>

                  {/* Job Title */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                    {job.title}
                  </h3>

                  {/* Job Info Row */}
                  <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-3">
                    <span className="flex items-center">
                      <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {getTimeAgo(job.createdAt)}
                    </span>
                    <span>•</span>
                    <span>{job.jobType || "Full Time"}</span>
                    <span>•</span>
                    <span>{job.experience || "< 12 month"}</span>
                    <span>•</span>
                    <span>{job.applications?.length || 0} Applied</span>
                    <span>•</span>
                    <span className="font-medium text-gray-900">
                      ${job.salary?.toLocaleString() || "1000-64000"}
                    </span>
                  </div>

                  {/* Job Description */}
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {job.description ? job.description.replace(/<[^>]*>/g, '') : "Looking for an experienced UI designer for an ongoing project. It is hoped that you will be able to collaborate with a marketing team for the project that we are currently developing as..."}
                  </p>

                  {/* Location */}
                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-1.5 text-gray-400" />
                    <span>{job.location || "Bandung, Indonesia"}</span>
                  </div>

                  {/* Skills Tags */}
                  <div className="flex flex-wrap gap-2">
                    {job.jobPostSkills && job.jobPostSkills.length > 0 ? (
                      job.jobPostSkills.slice(0, 4).map((skillObj, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {skillObj.skill?.name || "Skill"}
                        </span>
                      ))
                    ) : (
                      <>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          User Interface Design
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          Figma
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          Designer
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          UX Writing
                        </span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && jobs?.length > 0 && totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <nav className="flex items-center gap-2" aria-label="Pagination">
                {/* Previous Button */}
                <button
                  onClick={prevPage}
                  disabled={!hasPreviousPage}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                >
                  Previous
                </button>
                
                {/* Page Numbers */}
                <div className="flex gap-1">
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
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                          page === pageNum
                            ? 'text-white bg-blue-600 hover:bg-blue-700'
                            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  {/* Show ellipsis and last page if needed */}
                  {totalPages > 5 && page < totalPages - 2 && (
                    <>
                      <span className="px-2 py-2 text-gray-500">...</span>
                      <button
                        onClick={() => goToPage(totalPages)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                </div>
                
                {/* Next Button */}
                <button
                  onClick={nextPage}
                  disabled={!hasNextPage}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                >
                  Next
                </button>
              </nav>
            </div>
          )}

          {/* Page Info */}
          {!loading && jobs?.length > 0 && (
            <div className="mt-4 text-center text-sm text-gray-600">
              Showing page {page} of {totalPages} ({total} total jobs)
            </div>
          )}

          {/* No Results */}
          {!loading && jobs?.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No jobs found matching your criteria</p>
              <button
                onClick={handleClearAll}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Browse;
