import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  Users,
  Calendar,
  ChevronLeft,
  Search,
  Filter,
  BarChart2,
  Clock,
  MapPin,
  ArrowUpDown,
  Check,
  AlertCircle,
  Grid,
  List,
  TrendingUp,
  Zap,
  Award,
  Sliders,
  Eye
} from 'lucide-react';
import { format } from 'date-fns';
import JobCandidateMatcher from './JobCandidateMatcher';
import { fetchJobPostsByEmployer } from "../../redux/jobPostSlice";
import { Navbar } from '../navbar';
import Footer from '../components_lite/Footer';

const JobMatchingDashboard = () => {
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMatcher, setShowMatcher] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [statusFilter, setStatusFilter] = useState('all');
  const [hoverCard, setHoverCard] = useState(null);
  
  const { user } = useSelector((state) => state.auth);
  const employerId = user?.employer?.id;
  const dispatch = useDispatch();
  const { jobs, loading, error } = useSelector((state) => state.jobPosts);

  useEffect(() => {
    if (employerId) {
      dispatch(fetchJobPostsByEmployer(employerId));
    }
  }, [dispatch, employerId]);

  useEffect(() => {
    // Filter jobs based on search query and status filter
    const filtered = jobs.filter(job => {
      const matchesSearch = job.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           job.company_name?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' ? true :
                           statusFilter === 'active' ? job.status === 'active' :
                           statusFilter === 'expired' ? job.status === 'expired' :
                           statusFilter === 'draft' ? job.status === 'draft' : true;
      
      return matchesSearch && matchesStatus;
    });

    // Sort jobs
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at || Date.now()) - new Date(a.created_at || Date.now());
        case 'oldest':
          return new Date(a.created_at || Date.now()) - new Date(b.created_at || Date.now());
        case 'applications':
          return (b.applications_count || 0) - (a.applications_count || 0);
        case 'title':
          return (a.title || '').localeCompare(b.title || '');
        default:
          return new Date(b.created_at || Date.now()) - new Date(a.created_at || Date.now());
      }
    });

    setFilteredJobs(sorted);
  }, [jobs, searchQuery, sortBy, statusFilter]);

  const handleJobSelect = (job) => {
    setSelectedJob(job);
    setShowMatcher(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-800';
      case 'expired':
        return 'bg-rose-100 text-rose-800';
      case 'draft':
        return 'bg-slate-100 text-slate-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getTimeAgo = (date) => {
    try {
      return format(new Date(date), 'MMM d, yyyy');
    } catch (error) {
      return 'Unknown date';
    }
  };

  const emojiForStatus = (status) => {
    switch (status) {
      case 'active': return '🟢';
      case 'expired': return '🔴';
      case 'draft': return '⚪';
      default: return '🔵';
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
     <div className="sticky top-0 z-50 bg-slate-100 shadow-md shadow-black/5 dark:bg-neutral-600 dark:shadow-black/10">
        <Navbar />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {showMatcher && selectedJob ? (
            <motion.div
              key="matcher"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="flex items-center mb-6">
                <button
                  onClick={() => setShowMatcher(false)}
                  className="group flex items-center text-gray-600 hover:text-indigo-600 transition-all mr-4 font-medium"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-sm group-hover:bg-indigo-50 transition-all mr-2">
                    <ChevronLeft className="h-5 w-5 text-gray-500 group-hover:text-indigo-600" />
                  </div>
                  Back to Jobs
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Candidate Matcher</h1>
              </div>
              
              <JobCandidateMatcher jobId={selectedJob._id} jobTitle={selectedJob.title} />
            </motion.div>
          ) : (
            <motion.div
              key="jobsList"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                    Job Matching Dashboard
                  </h1>
                  <p className="text-gray-600">Manage your job posts and find the perfect candidates</p>
                </div>
                
                <div className="mt-4 md:mt-0 flex items-center">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-1 flex">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-md transition-all ${viewMode === 'grid' 
                        ? 'bg-indigo-50 text-indigo-700' 
                        : 'text-gray-500 hover:text-indigo-600 hover:bg-gray-50'}`}
                    >
                      <Grid className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-md transition-all ${viewMode === 'list' 
                        ? 'bg-indigo-50 text-indigo-700' 
                        : 'text-gray-500 hover:text-indigo-600 hover:bg-gray-50'}`}
                    >
                      <List className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <motion.div 
                  className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-all"
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center">
                    <div className="p-3 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl">
                      <Briefcase className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm text-gray-500">Total Jobs</div>
                      <div className="text-xl font-semibold text-gray-900">{jobs.length}</div>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-all"
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center">
                    <div className="p-3 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl">
                      <Check className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm text-gray-500">Active Jobs</div>
                      <div className="text-xl font-semibold text-gray-900">
                        {jobs.filter(job => job.status === 'active').length}
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-all"
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center">
                    <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm text-gray-500">Total Applicants</div>
                      <div className="text-xl font-semibold text-gray-900">
                        {jobs.reduce((sum, job) => sum + (job.applications_count || 0), 0)}
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-all"
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center">
                    <div className="p-3 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl">
                      <Award className="h-6 w-6 text-amber-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm text-gray-500">Avg. Match Score</div>
                      <div className="text-xl font-semibold text-gray-900">73%</div>
                    </div>
                  </div>
                </motion.div>
              </div>
              
              {/* Filters */}
              <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search jobs by title or company..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-full py-3 px-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                  </div>
                  
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex items-center">
                      <Sliders className="absolute left-3 h-4 w-4 text-gray-500" />
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="pl-9 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                      >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="expired">Expired</option>
                        <option value="draft">Draft</option>
                      </select>
                    </div>
                    
                    <div className="relative flex items-center">
                      <ArrowUpDown className="absolute left-3 h-4 w-4 text-gray-500" />
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="pl-9 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                      >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="applications">Most Applications</option>
                        <option value="title">Job Title (A-Z)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              
              {loading ? (
                <div className="flex flex-col justify-center items-center py-16">
                  <div className="relative">
                    <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-indigo-500 animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-10 w-10 rounded-full bg-white"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Briefcase className="h-5 w-5 text-indigo-600" />
                    </div>
                  </div>
                  <p className="mt-4 text-gray-600 font-medium">Loading your jobs...</p>
                </div>
              ) : filteredJobs.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-10 text-center border border-gray-100">
                  <div className="inline-flex flex-col items-center mb-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center mb-4">
                      <AlertCircle className="h-10 w-10 text-indigo-500" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No jobs found</h3>
                    <p className="text-gray-500 max-w-md">
                      {searchQuery || statusFilter !== 'all' 
                        ? "We couldn't find any jobs matching your filters. Try adjusting your search criteria."
                        : "You haven't posted any jobs yet. Create your first job posting to get started."}
                    </p>
                  </div>
                  
                  {searchQuery || statusFilter !== 'all' ? (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setStatusFilter('all');
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-lg shadow-sm hover:shadow-md transition-all font-medium"
                    >
                      Clear Filters
                    </button>
                  ) : (
                    <button
                      className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-lg shadow-sm hover:shadow-md transition-all font-medium"
                    >
                      Create a Job Post
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div className="text-sm text-gray-500 mb-3 ml-1">
                    Showing <span className="font-medium text-indigo-600">{filteredJobs.length}</span> {filteredJobs.length === 1 ? 'job' : 'jobs'}
                  </div>
                  
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredJobs.map(job => (
                        <motion.div
                          key={job._id}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          onMouseEnter={() => setHoverCard(job._id)}
                          onMouseLeave={() => setHoverCard(null)}
                          className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all relative group"
                        >
                          <div className="h-2 bg-gradient-to-r from-indigo-500 to-violet-500"></div>
                          <div className="p-5">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex items-start space-x-3">
                                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center">
                                  <Briefcase className="h-5 w-5 text-indigo-600" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-lg text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                                    {job.title}
                                  </h3>
                                  <p className="text-sm text-gray-500">{job.company_name || 'Your Company'}</p>
                                </div>
                              </div>
                              <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(job.status)}`}>
                                {job.status}
                              </span>
                            </div>
                            
                            <div className="space-y-2 mb-4">
                              <div className="flex items-center text-sm text-gray-600">
                                <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center mr-2">
                                  <MapPin className="h-3.5 w-3.5 text-gray-500" />
                                </div>
                                {job.location || 'Remote'}
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center mr-2">
                                  <Calendar className="h-3.5 w-3.5 text-gray-500" />
                                </div>
                                Posted: {getTimeAgo(job.created_at)}
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center mr-2">
                                  <Users className="h-3.5 w-3.5 text-gray-500" />
                                </div>
                                {job.applications_count || 0} Applications
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mb-4">
                              {job.skills && job.skills.slice(0, 3).map((skill, index) => (
                                <span 
                                  key={index} 
                                  className="bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded-full border border-indigo-100"
                                >
                                  {skill}
                                </span>
                              ))}
                              {job.skills && job.skills.length > 3 && (
                                <span className="bg-gray-50 text-gray-600 text-xs px-2 py-1 rounded-full">
                                  +{job.skills.length - 3} more
                                </span>
                              )}
                            </div>
                            
                            <div className="pt-3 border-t border-gray-100">
                              <button
                                onClick={() => handleJobSelect(job)}
                                className="w-full py-2.5 text-white font-medium rounded-lg border border-transparent bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 transition-all flex items-center justify-center shadow-sm hover:shadow"
                              >
                                <Zap className="h-4 w-4 mr-1.5" />
                                Match Candidates
                              </button>
                            </div>

                            {/* Hover effects */}
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: hoverCard === job._id ? 1 : 0 }}
                              className="absolute top-3 right-3 flex space-x-1"
                            >
                              <div className="h-6 w-6 bg-white rounded-full shadow-sm flex items-center justify-center cursor-pointer hover:bg-indigo-50">
                                <Eye className="h-3.5 w-3.5 text-indigo-600" />
                              </div>
                            </motion.div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Job
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Location
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Posted Date
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Applications
                              </th>
                              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {filteredJobs.map((job) => (
                              <tr 
                                key={job._id}
                                className="hover:bg-gray-50 transition-colors group"
                              >
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center">
                                      <Briefcase className="h-5 w-5 text-indigo-600" />
                                    </div>
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">{job.title}</div>
                                      <div className="text-xs text-gray-500">{job.company_name || 'Your Company'}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(job.status)}`}>
                                    {job.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {job.location || 'Remote'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {getTimeAgo(job.created_at)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg">
                                    {job.applications_count || 0}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <button
                                    onClick={() => handleJobSelect(job)}
                                    className="py-1.5 px-3 text-white rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 transition-all shadow-sm hover:shadow flex items-center"
                                  >
                                    <Zap className="h-3.5 w-3.5 mr-1" />
                                    Match
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </div>
  );
};

export default JobMatchingDashboard;