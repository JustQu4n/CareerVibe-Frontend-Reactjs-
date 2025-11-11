import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import JobCard from "./JobCard";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  MapPin, 
  Briefcase, 
  List, 
  Grid3x3, 
  ChevronDown, 
  X, 
  Filter, 
  Clock, 
  Calendar, 
  Building2,
  DollarSign,
  SlidersHorizontal
} from "lucide-react";
import { Navbar } from "../navbar";

const Browse = () => {
  useGetAllJobs();
  const { allJobs, loading } = useSelector((store) => store.job);
  const dispatch = useDispatch();
  
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [mode, setMode] = useState("list");
  const [filter, setFilter] = useState("All");
  const [salary, setSalary] = useState([0, 200000]);
  const [experience, setExperience] = useState("Any");
  const [datePosted, setDatePosted] = useState("Any");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");
  
  const tags = ["All", "Full Time", "Part Time", "Remote", "Contract", "Internship"];
  const experienceOptions = ["Any", "Entry Level", "1-3 years", "3-5 years", "5+ years"];
  const dateOptions = ["Any", "Today", "Last 3 days", "Last week", "Last month"];
  
  // Apply all filters to jobs
  const filteredJobs = allJobs
    .filter(job => 
      job.title?.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "All" || job.type === filter) &&
      (location === "" || job.location?.toLowerCase().includes(location.toLowerCase())) &&
      (job.salary >= salary[0] && job.salary <= salary[1]) &&
      (experience === "Any" || job.experience === experience) &&
      (datePosted === "Any" || isWithinDateRange(job.created_at, datePosted))
    )
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.created_at) - new Date(a.created_at);
      if (sortBy === "salary_high") return b.salary - a.salary;
      if (sortBy === "salary_low") return a.salary - b.salary;
      return 0; // Default: relevance
    });
  
  // Helper function to check if a date is within the selected date range
  const isWithinDateRange = (dateString, range) => {
    if (range === "Any") return true;
    
    const jobDate = new Date(dateString);
    const today = new Date();
    const daysDiff = Math.floor((today - jobDate) / (1000 * 60 * 60 * 24));
    
    switch (range) {
      case "Today": return daysDiff < 1;
      case "Last 3 days": return daysDiff <= 3;
      case "Last week": return daysDiff <= 7;
      case "Last month": return daysDiff <= 30;
      default: return true;
    }
  };
  
  const resetFilters = () => {
    setSearch("");
    setLocation("");
    setFilter("All");
    setSalary([0, 200000]);
    setExperience("Any");
    setDatePosted("Any");
    setSortBy("relevance");
  };
  
  // Count applied filters for the badge
  const countAppliedFilters = () => {
    let count = 0;
    if (filter !== "All") count++;
    if (location !== "") count++;
    if (salary[0] > 0 || salary[1] < 200000) count++;
    if (experience !== "Any") count++;
    if (datePosted !== "Any") count++;
    return count;
  };
  
  const appliedFiltersCount = countAppliedFilters();
  
  useEffect(() => {
    return () => {
      dispatch(setSearchedQuery(""));
    };
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-50 bg-white shadow-md">
        <Navbar />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Dream Job</h1>
          <p className="text-gray-600">Explore thousands of job opportunities with all the information you need.</p>
        </div>
        
        {/* Search bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-4 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Job title, keywords, or company"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
            
            <div className="md:col-span-3 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Location or Remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
            
            <div className="md:col-span-3 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Briefcase className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white transition-all"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                {tags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </div>
            </div>
            
            <div className="md:col-span-2">
              <button 
                className="w-full h-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm flex items-center justify-center"
                onClick={() => {
                  // You can add additional search handling logic here
                }}
              >
                <Search className="h-5 w-5 mr-2" />
                Search Jobs
              </button>
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap items-center justify-between">
            <div className="flex items-center space-x-2 mt-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-1 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Advanced Filters</span>
                {appliedFiltersCount > 0 && (
                  <span className="ml-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-600 rounded-full">
                    {appliedFiltersCount}
                  </span>
                )}
              </button>
              
              {appliedFiltersCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="flex items-center space-x-1 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                  <span>Clear Filters</span>
                </button>
              )}
            </div>
            
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-sm text-gray-500">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border border-gray-200 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="relevance">Relevance</option>
                <option value="newest">Newest</option>
                <option value="salary_high">Salary: High to Low</option>
                <option value="salary_low">Salary: Low to High</option>
              </select>
            </div>
          </div>
          
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-6 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <DollarSign className="h-4 w-4 mr-1 text-gray-500" />
                      Salary Range
                    </h3>
                    <div className="px-2">
                      <input
                        type="range"
                        min="0"
                        max="200000"
                        step="10000"
                        value={salary[1]}
                        onChange={(e) => setSalary([salary[0], parseInt(e.target.value)])}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>$0</span>
                        <span>${salary[1].toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Briefcase className="h-4 w-4 mr-1 text-gray-500" />
                      Experience Level
                    </h3>
                    <select
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {experienceOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                      Date Posted
                    </h3>
                    <select
                      value={datePosted}
                      onChange={(e) => setDatePosted(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {dateOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Building2 className="h-4 w-4 mr-1 text-gray-500" />
                      Company Type
                    </h3>
                    <div className="space-y-1">
                      {["Startup", "Enterprise", "Agency", "Non-profit"].map(type => (
                        <label key={type} className="flex items-center text-sm text-gray-700">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 mr-2"
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
        
        {/* Filter chips and view toggle */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-2">
            {tags.map(tag => (
              <button
                key={tag}
                onClick={() => setFilter(tag)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === tag 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
  
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-500">
              {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
            </span>
            <div className="bg-white border border-gray-200 rounded-lg flex overflow-hidden">
              <button
                onClick={() => setMode('list')}
                className={`p-2 ${mode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
                aria-label="List view"
              >
                <List size={18} />
              </button>
              <button
                onClick={() => setMode('grid')}
                className={`p-2 ${mode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
                aria-label="Grid view"
              >
                <Grid3x3 size={18} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Job List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-500 font-medium">Loading jobs...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
              <Filter className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              We couldn't find any jobs matching your current filters. Try adjusting your search criteria or check back later.
            </p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div
            className={
              mode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-6"
            }
          >
            <AnimatePresence>
              {filteredJobs.map((job) => (
                <motion.div
                  key={job.id || job._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <JobCard job={job} mode={mode} />
                </motion.div>
              ))} 
            </AnimatePresence>
          </div>
        )}
        
        {/* Pagination */}
        {filteredJobs.length > 0 && (
          <div className="mt-10 flex justify-center">
            <nav className="flex items-center space-x-2" aria-label="Pagination">
              <button className="px-3 py-2 rounded-md text-sm font-medium text-gray-500 bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50">
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