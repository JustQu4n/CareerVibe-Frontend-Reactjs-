import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
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
  Star,
  ExternalLink
} from 'lucide-react';
import { Navbar } from '../navbar';
import Footer from '../components_lite/Footer';

const SavedItems = () => {
  const { user } = useSelector((state) => state.auth);
  
  const [activeTab, setActiveTab] = useState('jobs');
  const [savedJobs, setSavedJobs] = useState([]);
  const [savedCompanies, setSavedCompanies] = useState([]);
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
    const fetchSavedItems = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        
        const jobsRes = await axios.get('http://localhost:5000/api/jobseeker/saved/saved-jobs', { 
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        });
        
        const companiesRes = await axios.get('http://localhost:5000/api/jobseeker/saved/saved-companies', { 
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        });
        
        if (jobsRes.data.success) {
          setSavedJobs(jobsRes.data.data || []);
        }
        
        if (companiesRes.data.success) {
          setSavedCompanies(companiesRes.data.data || []);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching saved items:', error);
        toast.error(error.response?.data?.message || 'Failed to load saved items');
        setLoading(false);
      }
    };
    
    if (user?.token) {
      fetchSavedItems();
    }
  }, [user]);

  // Handle removing saved job
  const handleRemoveJob = async (jobId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/jobseeker/saved/saved-jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      
      setSavedJobs(savedJobs.filter(job => job._id !== jobId));
      toast.success('Job removed from saved list');
    } catch (error) {
      console.error('Error removing saved job:', error);
      toast.error(error.response?.data?.message || 'Failed to remove job');
    }
  };

  // Handle removing saved company
  const handleRemoveCompany = async (companyId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/jobseeker/saved/saved-companies/${companyId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      
      setSavedCompanies(savedCompanies.filter(company => company._id !== companyId));
      toast.success('Company removed from saved list');
    } catch (error) {
      console.error('Error removing saved company:', error);
      toast.error(error.response?.data?.message || 'Failed to remove company');
    }
  };
  
  const applyFilters = (items) => {
    if (activeTab === 'jobs') {
      return items
        .filter(job => {
          // Check if job has the required properties
          if (!job) return false;
          
          const titleMatch = job.title?.toLowerCase().includes(searchQuery.toLowerCase());
          const companyMatch = job.company_id?.name?.toLowerCase().includes(searchQuery.toLowerCase());
          
          const jobTypeMatch = filters.jobType === 'all' || 
            job.job_type?.toLowerCase() === filters.jobType.toLowerCase();
          
          const salaryMatch = !job.salary || 
            (job.salary >= filters.salary[0] && job.salary <= filters.salary[1]);
          
          const locationMatch = !filters.location || 
            job.location?.toLowerCase().includes(filters.location.toLowerCase());
          
          const dateMatch = filters.date === 'all' || 
            isWithinDateRange(job.created_at, filters.date);
          
          return (titleMatch || companyMatch) && jobTypeMatch && salaryMatch && locationMatch && dateMatch;
        })
        .sort((a, b) => {
          switch (sortBy) {
            case 'dateAsc':
              return new Date(a.created_at) - new Date(b.created_at);
            case 'dateDesc':
              return new Date(b.created_at) - new Date(a.created_at);
            case 'salaryAsc':
              return a.salary - b.salary;
            case 'salaryDesc':
              return b.salary - a.salary;
            case 'alphabetical':
              return a.title.localeCompare(b.title);
            default:
              return new Date(b.created_at) - new Date(a.created_at);
          }
        });
    } else {
      // Companies filtering
      return items
        .filter(company => {
          if (!company) return false;
          
          return company.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            company.industry?.toLowerCase().includes(searchQuery.toLowerCase());
        })
        .sort((a, b) => {
          switch (sortBy) {
            case 'dateAsc':
              return new Date(a.created_at) - new Date(b.created_at);
            case 'dateDesc':
              return new Date(b.created_at) - new Date(a.created_at);
            case 'alphabetical':
              return a.name.localeCompare(b.name);
            default:
              return new Date(b.created_at) - new Date(a.created_at);
          }
        });
    }
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
  
  const filteredJobs = applyFilters(savedJobs);
  const filteredCompanies = applyFilters(savedCompanies);
  
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
            Saved Items
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Keep track of jobs and companies you're interested in and revisit them anytime
          </p>
        </div>
        
        {/* Tabs */}
        <div className="mb-8 inline-flex p-1 bg-gray-100 rounded-xl">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-6 py-3 rounded-lg text-sm font-medium flex items-center transition-all ${
              activeTab === 'jobs' 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-gray-700 hover:text-indigo-500'
            }`}
          >
            <Briefcase className="mr-2 h-4 w-4" />
            Saved Jobs
            <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
              activeTab === 'jobs' 
                ? 'bg-indigo-100 text-indigo-700' 
                : 'bg-gray-200 text-gray-700'
            }`}>
              {savedJobs.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('companies')}
            className={`px-6 py-3 rounded-lg text-sm font-medium flex items-center transition-all ${
              activeTab === 'companies' 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-gray-700 hover:text-indigo-500'
            }`}
          >
            <Building2 className="mr-2 h-4 w-4" />
            Saved Companies
            <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
              activeTab === 'companies' 
                ? 'bg-indigo-100 text-indigo-700' 
                : 'bg-gray-200 text-gray-700'
            }`}>
              {savedCompanies.length}
            </span>
          </button>
        </div>
        
        {/* Search and filter bar */}
        <div className="bg-white rounded-xl shadow-sm p-5 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={`Search ${activeTab === 'jobs' ? 'job titles or companies' : 'companies or industries'}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full py-3 px-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="relative">
                <button
                  onClick={() => setShowSortMenu(!showSortMenu)}
                  className="flex items-center px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
                >
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  Sort
                  <ChevronDown className="h-4 w-4 ml-1" />
                </button>
                
                {showSortMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl p-2 z-10 border border-gray-100">
                    <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sort Options</div>
                    {activeTab === 'jobs' ? (
                      <>
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
                      </>
                    ) : (
                      <>
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
                          onClick={() => {setSortBy('alphabetical'); setShowSortMenu(false);}}
                          className={`w-full text-left px-3 py-2 text-sm rounded-md ${sortBy === 'alphabetical' ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'}`}
                        >
                          Alphabetical (A-Z)
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 relative"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {getAppliedFiltersCount() > 0 && (
                  <span className="absolute -top-2 -right-2 h-5 w-5 bg-indigo-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
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
                <div className="mt-6 pt-4 border-t border-gray-200">
                  {activeTab === 'jobs' && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Job Type</h3>
                        <select
                          value={filters.jobType}
                          onChange={(e) => setFilters({...filters, jobType: e.target.value})}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
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
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Salary Range</h3>
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
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Location</h3>
                        <input
                          type="text"
                          placeholder="Any location"
                          value={filters.location}
                          onChange={(e) => setFilters({...filters, location: e.target.value})}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                        />
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Date Saved</h3>
                        <select
                          value={filters.date}
                          onChange={(e) => setFilters({...filters, date: e.target.value})}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                        >
                          <option value="all">All time</option>
                          <option value="today">Today</option>
                          <option value="week">This week</option>
                          <option value="month">This month</option>
                        </select>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={resetFilters}
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 flex items-center"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Reset filters
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
            <p className="text-gray-500 font-medium mt-4">Loading your saved items...</p>
          </div>
        ) : (
          <>
            {activeTab === 'jobs' && (
              <>
                {filteredJobs.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-100 text-indigo-600 mb-6">
                      <Bookmark className="h-10 w-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">No saved jobs found</h3>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">
                      {searchQuery || getAppliedFiltersCount() > 0 
                        ? "We couldn't find any saved jobs matching your current filters. Try adjusting your search criteria."
                        : "You haven't saved any jobs yet. Save jobs that interest you to view them here later."}
                    </p>
                    {(searchQuery || getAppliedFiltersCount() > 0) && (
                      <button
                        onClick={resetFilters}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md font-medium"
                      >
                        Clear Filters
                      </button>
                    )}
                    {!searchQuery && getAppliedFiltersCount() === 0 && (
                      <a
                        href="/find-job"
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md font-medium inline-block"
                      >
                        Browse Jobs
                      </a>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="mb-6 flex justify-between items-center">
                      <p className="text-sm text-gray-600">
                        Showing <span className="font-medium text-indigo-600">{filteredJobs.length}</span> saved jobs
                      </p>
                    </div>
                    
                    {/* Modern Job Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <AnimatePresence>
                        {filteredJobs.map((job) => (
                          <motion.div
                            key={job._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-indigo-200 transition-all shadow-sm hover:shadow-md"
                          >
                            {/* Job Card Header */}
                            <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                            
                            <div className="p-6">
                              <div className="flex justify-between items-start">
                                <div className="flex items-start space-x-4">
                                  <div className="h-14 w-14 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                                    {job.company_id?.logo ? (
                                      <img src={job.company_id.logo} alt={job.company_id.name} className="h-full w-full object-cover" />
                                    ) : (
                                      <Building2 className="h-7 w-7 text-gray-400" />
                                    )}
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-lg text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                                      <a href={`/view-job-detail/${job._id}`}>{job.title}</a>
                                    </h3>
                                    <p className="text-gray-600">{job.company_id?.name}</p>
                                  </div>
                                </div>
                                <button 
                                  onClick={() => handleRemoveJob(job._id)}
                                  className="text-gray-400 hover:text-red-500 transition-colors ml-2 p-1 hover:bg-red-50 rounded-full"
                                  aria-label="Remove from saved"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              </div>
                              
                              <div className="mt-5 space-y-2">
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
                                  {job.job_type ? job.job_type.replace("_", " ") : "Full Time"}
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                  <div className="bg-gray-100 p-1 rounded-full mr-2">
                                    <DollarSign className="h-3.5 w-3.5 text-gray-600" />
                                  </div>
                                  {job.salary ? `$${job.salary.toLocaleString()}` : "Salary not specified"}
                                </div>
                              </div>
                              
                              <div className="mt-6 pt-5 border-t border-gray-100 flex justify-between items-center">
                                <div className="flex items-center text-xs text-gray-500">
                                  <Clock className="h-3.5 w-3.5 mr-1" />
                                  {job.created_at ? format(new Date(job.created_at), 'MMM d, yyyy') : "Recently"}
                                </div>
                                <a
                                  href={`/view-job-detail/${job._id}`}
                                  className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                                >
                                  View details
                                  <ExternalLink className="ml-1 h-3.5 w-3.5" />
                                </a>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                )}
              </>
            )}
            
            {activeTab === 'companies' && (
              <>
                {filteredCompanies.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-100 text-indigo-600 mb-6">
                      <Building2 className="h-10 w-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">No saved companies found</h3>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">
                      {searchQuery || getAppliedFiltersCount() > 0 
                        ? "We couldn't find any saved companies matching your current filters. Try adjusting your search criteria."
                        : "You haven't saved any companies yet. Save companies that interest you to view them here later."}
                    </p>
                    {(searchQuery || getAppliedFiltersCount() > 0) && (
                      <button
                        onClick={resetFilters}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md font-medium"
                      >
                        Clear Filters
                      </button>
                    )}
                    {!searchQuery && getAppliedFiltersCount() === 0 && (
                      <a
                        href="/companies"
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md font-medium inline-block"
                      >
                        Explore Companies
                      </a>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="mb-6 flex justify-between items-center">
                      <p className="text-sm text-gray-600">
                        Showing <span className="font-medium text-indigo-600">{filteredCompanies.length}</span> saved companies
                      </p>
                    </div>
                    
                    {/* Modern Company Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <AnimatePresence>
                        {filteredCompanies.map((company) => (
                          <motion.div
                            key={company._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-indigo-200 overflow-hidden"
                          >
                            <div className="h-28 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
                              <div className="absolute bottom-0 translate-y-1/2 left-6">
                                <div className="h-16 w-16 bg-white rounded-xl shadow-md flex items-center justify-center overflow-hidden p-2">
                                  {company.logo ? (
                                    <img src={company.logo} alt={company.name} className="h-full w-full object-contain" />
                                  ) : (
                                    <Building2 className="h-8 w-8 text-gray-400" />
                                  )}
                                </div>
                              </div>
                              <button 
                                onClick={() => handleRemoveCompany(company._id)}
                                className="absolute top-3 right-3 text-white hover:text-red-200 transition-colors p-1 hover:bg-red-500/20 rounded-full"
                                aria-label="Remove from saved"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                            
                            <div className="p-6 pt-12">
                              <h3 className="font-semibold text-lg text-gray-900 group-hover:text-indigo-600 transition-colors">
                                <a href={`/company-details/${company._id}`}>{company.name}</a>
                              </h3>
                              <p className="text-gray-600 text-sm mt-1">{company.industry || "Technology"}</p>
                              
                              <div className="mt-4 space-y-2">
                                <div className="flex items-center text-sm text-gray-500">
                                  <div className="bg-gray-100 p-1 rounded-full mr-2">
                                    <MapPin className="h-3.5 w-3.5 text-gray-600" />
                                  </div>
                                  {company.location || "Location not specified"}
                                </div>
                                
                                <div className="flex items-center text-sm text-gray-500">
                                  <div className="bg-gray-100 p-1 rounded-full mr-2">
                                    <Star className="h-3.5 w-3.5 text-gray-600" />
                                  </div>
                                  {(company.rating && 
                                    <div className="flex">
                                      {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`h-3.5 w-3.5 ${i < company.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                                      ))}
                                      <span className="ml-1">{company.reviewCount || 0} reviews</span>
                                    </div>
                                  ) || "No ratings yet"}
                                </div>
                              </div>
                              
                              <div className="mt-6 pt-5 border-t border-gray-100 flex justify-between items-center">
                                <div className="flex items-center text-xs text-gray-500">
                                  <Clock className="h-3.5 w-3.5 mr-1" />
                                  {company.created_at ? format(new Date(company.created_at), 'MMM d, yyyy') : "Recently"}
                                </div>
                                <a
                                  href={`/company-details/${company._id}`}
                                  className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                                >
                                  View profile
                                  <ExternalLink className="ml-1 h-3.5 w-3.5" />
                                </a>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default SavedItems;