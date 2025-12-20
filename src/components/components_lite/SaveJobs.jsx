import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '@/api/client';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { 
  Bookmark, 
  Building2, 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Clock, 
  Search, 
  Trash2,
  X,
  ArrowUpDown,
  ChevronDown,
  Filter,
  ExternalLink
} from 'lucide-react';
import { Navbar } from '../navbar';
import Footer from '../components_lite/Footer';

const SaveJobs = () => {
  const { user } = useSelector((state) => state.auth);
  
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('dateDesc');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    jobType: 'all',
    salary: [0, 200000],
    location: '',
    date: 'all'
  });
  
  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        setLoading(true);
        // Fetch saved jobs
        const jobsRes = await apiClient.get('/api/jobseeker/saved/jobs');
        
        // Process saved jobs data
        if (jobsRes.data && jobsRes.data.data) {
          setSavedJobs(jobsRes.data.data || []);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching saved jobs:', error);
        toast.error(error.response?.data?.message || 'Failed to load saved jobs');
        setLoading(false);
      }
    };
    
    const token = localStorage.getItem("accessToken");
    if (token || user) {
      fetchSavedJobs();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Handle removing saved job
  const handleRemoveJob = async (savedJobId, jobPostId) => {
    try {
      await apiClient.delete(`/api/jobseeker/saved/jobs/${jobPostId}`);
      
      setSavedJobs(savedJobs.filter(job => job.saved_job_id !== savedJobId));
      toast.success('Job removed from saved list');
    } catch (error) {
      console.error('Error removing saved job:', error);
      toast.error(error.response?.data?.message || 'Failed to remove job');
    }
  };

  const parseSalary = (salaryRange) => {
    if (!salaryRange) return 0;
    const match = salaryRange.match(/([\d,]+)/);
    if (match) {
      return parseInt(match[1].replace(/,/g, ''));
    }
    return 0;
  };
  
  const isWithinDateRange = (dateString, range) => {
    if (!dateString) return false;
    
    const savedDate = new Date(dateString);
    const today = new Date();
    const daysDiff = Math.floor((today - savedDate) / (1000 * 60 * 60 * 24));
    
    switch (range) {
      case 'today':
        return daysDiff < 1;
      case 'week':
        return daysDiff <= 7;
      case 'month':
        return daysDiff <= 30;
      default:
        return true;
    }
  };
  
  const applyFilters = (items) => {
    return items
      .filter(savedJob => {
        // Check if savedJob has the required properties
        if (!savedJob || !savedJob.jobPost) return false;
        
        const job = savedJob.jobPost;
        const company = job.company;
        
        const titleMatch = job.title?.toLowerCase().includes(searchQuery.toLowerCase());
        const companyMatch = company?.name?.toLowerCase().includes(searchQuery.toLowerCase());
        
        const jobTypeMatch = filters.jobType === 'all' || 
          job.employment_type?.toLowerCase().replace('-', '_') === filters.jobType.toLowerCase();
        
        // Parse salary range if exists
        let salaryValue = 0;
        if (job.salary_range) {
          const salaryMatch = job.salary_range.match(/([\d,]+)/);
          if (salaryMatch) {
            salaryValue = parseInt(salaryMatch[1].replace(/,/g, '')) / 1000000; // Convert VND to millions
          }
        }
        const salaryMatch = salaryValue === 0 || 
          (salaryValue >= filters.salary[0] && salaryValue <= filters.salary[1]);
        
        const locationMatch = !filters.location || 
          job.location?.toLowerCase().includes(filters.location.toLowerCase());
        
        const dateMatch = filters.date === 'all' || 
          isWithinDateRange(savedJob.saved_at, filters.date);
        
        return (titleMatch || companyMatch) && jobTypeMatch && salaryMatch && locationMatch && dateMatch;
      })
      .sort((a, b) => {
        const jobA = a.jobPost;
        const jobB = b.jobPost;
        
        switch (sortBy) {
          case 'dateAsc':
            return new Date(a.saved_at) - new Date(b.saved_at);
          case 'dateDesc':
            return new Date(b.saved_at) - new Date(a.saved_at);
          case 'salaryAsc': {
            const salaryA = parseSalary(jobA.salary_range);
            const salaryB = parseSalary(jobB.salary_range);
            return salaryA - salaryB;
          }
          case 'salaryDesc': {
            const salaryA = parseSalary(jobA.salary_range);
            const salaryB = parseSalary(jobB.salary_range);
            return salaryB - salaryA;
          }
          case 'alphabetical':
            return jobA.title.localeCompare(jobB.title);
          default:
            return new Date(b.saved_at) - new Date(a.saved_at);
        }
      });
  };
  
  const filteredJobs = applyFilters(savedJobs);
  
  const resetFilters = () => {
    setFilters({
      jobType: 'all',
      salary: [0, 200000],
      location: '',
      date: 'all'
    });
    setSearchQuery('');
    setSortBy('dateDesc');
  };
  
  // Get count of applied filters for the badge
  const getAppliedFiltersCount = () => {
    let count = 0;
    if (searchQuery) count++;
    if (filters.jobType !== 'all') count++;
    if (filters.salary[0] > 0 || filters.salary[1] < 200000) count++;
    if (filters.location) count++;
    if (filters.date !== 'all') count++;
    return count;
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navbar */}
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <Navbar />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3 flex items-center">
            <div className="bg-indigo-100 p-2 rounded-lg mr-4">
              <Bookmark className="h-8 w-8 text-indigo-600" />
            </div>
            Saved Jobs
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Keep track of jobs you're interested in and revisit them anytime
          </p>
        </div>
        
        {/* Search and filter bar */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search job titles or companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full py-2.5 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="relative">
                <button
                  onClick={() => setShowSortMenu(!showSortMenu)}
                  className="flex items-center px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700"
                >
                  <ArrowUpDown className="h-4 w-4 mr-1.5" />
                  Sort
                  <ChevronDown className="h-3.5 w-3.5 ml-1" />
                </button>
                
                {showSortMenu && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl p-2 z-10 border border-gray-200">
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sort By</div>
                    <button 
                      onClick={() => {setSortBy('dateDesc'); setShowSortMenu(false);}}
                      className={`w-full text-left px-3 py-2 text-sm rounded-md ${sortBy === 'dateDesc' ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'}`}
                    >
                      Newest saved first
                    </button>
                    <button 
                      onClick={() => {setSortBy('dateAsc'); setShowSortMenu(false);}}
                      className={`w-full text-left px-3 py-2 text-sm rounded-md ${sortBy === 'dateAsc' ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'}`}
                    >
                      Oldest saved first
                    </button>
                    <button 
                      onClick={() => {setSortBy('salaryDesc'); setShowSortMenu(false);}}
                      className={`w-full text-left px-3 py-2 text-sm rounded-md ${sortBy === 'salaryDesc' ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'}`}
                    >
                      Salary: high to low
                    </button>
                    <button 
                      onClick={() => {setSortBy('salaryAsc'); setShowSortMenu(false);}}
                      className={`w-full text-left px-3 py-2 text-sm rounded-md ${sortBy === 'salaryAsc' ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'}`}
                    >
                      Salary: low to high
                    </button>
                    <button 
                      onClick={() => {setSortBy('alphabetical'); setShowSortMenu(false);}}
                      className={`w-full text-left px-3 py-2 text-sm rounded-md ${sortBy === 'alphabetical' ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'}`}
                    >
                      Alphabetical (A-Z)
                    </button>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700 relative"
              >
                <Filter className="h-4 w-4 mr-1.5" />
                Filters
                {getAppliedFiltersCount() > 0 && (
                  <span className="ml-1.5 h-5 w-5 bg-indigo-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {getAppliedFiltersCount()}
                  </span>
                )}
              </button>
            </div>
          </div>
          
          {/* Advanced filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <h3 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">Job Type</h3>
                      <select
                        value={filters.jobType}
                        onChange={(e) => setFilters({...filters, jobType: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="all">All types</option>
                        <option value="full_time">Full Time</option>
                        <option value="part_time">Part Time</option>
                        <option value="contract">Contract</option>
                        <option value="internship">Internship</option>
                        <option value="remote">Remote</option>
                      </select>
                    </div>
                    
                    <div>
                      <h3 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">Salary Range</h3>
                      <div className="px-2">
                        <input
                          type="range"
                          min="0"
                          max="200000"
                          step="10000"
                          value={filters.salary[1]}
                          onChange={(e) => setFilters({...filters, salary: [0, parseInt(e.target.value)]})}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>$0</span>
                          <span>${filters.salary[1].toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">Location</h3>
                      <input
                        type="text"
                        placeholder="Any location"
                        value={filters.location}
                        onChange={(e) => setFilters({...filters, location: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    
                    <div>
                      <h3 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">Date Saved</h3>
                      <select
                        value={filters.date}
                        onChange={(e) => setFilters({...filters, date: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="all">All time</option>
                        <option value="today">Today</option>
                        <option value="week">This week</option>
                        <option value="month">This month</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={resetFilters}
                      className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors flex items-center"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Reset All
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative w-20 h-20">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-100 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-gray-500 font-medium mt-4">Loading your saved jobs...</p>
          </div>
        ) : (
          <>
            {filteredJobs.length === 0 ? (
              <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl shadow-sm p-12 text-center border border-indigo-100">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white mb-6 shadow-lg">
                  <Bookmark className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No saved jobs found</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  {searchQuery || getAppliedFiltersCount() > 0 
                    ? "We couldn't find any saved jobs matching your current filters. Try adjusting your search criteria."
                    : "You haven't saved any jobs yet. Save jobs that interest you to view them here later."}
                </p>
                {(searchQuery || getAppliedFiltersCount() > 0) && (
                  <button
                    onClick={resetFilters}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl font-semibold"
                  >
                    Clear Filters
                  </button>
                )}
                {!searchQuery && getAppliedFiltersCount() === 0 && (
                  <a
                    href="/browse"
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl font-semibold inline-block"
                  >
                    Browse Jobs
                  </a>
                )}
              </div>
            ) : (
              <div>
                <div className="mb-5 flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    Showing <span className="font-bold text-indigo-600">{filteredJobs.length}</span> of <span className="font-semibold">{savedJobs.length}</span> saved jobs
                  </p>
                </div>
                
                {/* Modern Job Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  <AnimatePresence>
                    {filteredJobs.map((savedJob) => {
                      const job = savedJob.jobPost;
                      const company = job?.company;
                      
                      return (
                        <motion.div
                          key={savedJob.saved_job_id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                          className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-indigo-300 transition-all shadow-sm hover:shadow-xl relative"
                        >
                          {/* Job Card Header */}
                          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                          
                          <div className="p-5">
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex items-start space-x-3 flex-1 min-w-0">
                                <div className="h-12 w-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center overflow-hidden border border-gray-200 group-hover:scale-110 transition-transform flex-shrink-0">
                                  {company?.logo_url ? (
                                    <img src={company.logo_url} alt={company.name} className="h-full w-full object-cover" />
                                  ) : (
                                    <Building2 className="h-7 w-7 text-gray-400" />
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <h3 className="font-bold text-base text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2 mb-1">
                                    <a href={`/view-job-detail/${job.job_post_id}`}>{job.title}</a>
                                  </h3>
                                  <p className="text-sm text-gray-600 truncate">{company?.name}</p>
                                </div>
                              </div>
                              <button 
                                onClick={() => handleRemoveJob(savedJob.saved_job_id, job.job_post_id)}
                                className="text-gray-400 hover:text-red-500 transition-colors p-1.5 hover:bg-red-50 rounded-lg flex-shrink-0"
                                aria-label="Remove from saved"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center text-sm text-gray-500">
                                <div className="bg-gray-100 p-1 rounded-full mr-2">
                                  <MapPin className="h-3.5 w-3.5 text-gray-600" />
                                </div>
                                {job.location || "Location not specified"}
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <div className="bg-gray-100 p-1 rounded-full mr-2">
                                  <Briefcase className="h-3.5 w-3.5 text-gray-600" />
                                </div>
                                {job.employment_type ? job.employment_type.replace("-", " ") : "Full Time"}
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <div className="bg-gray-100 p-1 rounded-full mr-2">
                                  <DollarSign className="h-3.5 w-3.5 text-gray-600" />
                                </div>
                                {job.salary_range || "Salary not specified"}
                              </div>
                            </div>
                            
                            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                              <div className="flex items-center text-xs text-gray-500">
                                <Clock className="h-3 w-3 mr-1" />
                                {savedJob.saved_at ? format(new Date(savedJob.saved_at), 'MMM d, yyyy') : "Recently"}
                              </div>
                              <a
                                href={`/view-job-detail/${job.job_post_id}`}
                                className="inline-flex items-center text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors group-hover:gap-1.5 gap-1"
                              >
                                View
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default SaveJobs;
