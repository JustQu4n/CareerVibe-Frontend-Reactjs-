import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobPostsByEmployer } from "@/redux/jobPostSlice";
import { 
  FaMapMarkerAlt, 
  FaMoneyBillWave, 
  FaClock, 
  FaTable, 
  FaList, 
  FaSearch, 
  FaPlus, 
  FaFilter,
  FaEye, 
  FaPencilAlt, 
  FaTrashAlt,
  FaCheck,
  FaTimes,
  FaBriefcase,
  FaUserTie,
  FaCalendarAlt,
  FaChartLine,
  FaRegClock,
  FaUsers
} from "react-icons/fa";
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Users, 
  Eye, 
  Edit3, 
  Trash2, 
  Clock,
  Calendar,
  TrendingUp,
  Filter,
  Grid,
  List as ListIcon,
  Search,
  Plus,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  Target,
  Zap,
  Sparkles
} from "lucide-react";
import { updateJobPostById, deleteJobPostById } from "@/redux/jobPostSlice";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const JobPostList = () => {
  const [viewMode, setViewMode] = useState('list');
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const { user } = useSelector((state) => state.auth);
  const employerId = user?.employer?.employer_id;
  const dispatch = useDispatch();
  const { jobs, loading, error, pagination } = useSelector((state) => state.jobPosts);
  const navigate = useNavigate();

  useEffect(() => {
    if (employerId) {
      dispatch(fetchJobPostsByEmployer({ page: currentPage, limit: itemsPerPage }));
    }
  }, [dispatch, employerId, currentPage, itemsPerPage]);

  const handleDelete = (job) => {
    if (window.confirm("Are you sure you want to delete this job post?")) {
      dispatch(deleteJobPostById({ jobId: job.job_post_id || job._id, user_id: user.id, company_id: user.company.id }))
        .unwrap()
        .then(() => {
          toast.success("Job deleted successfully");
        })
        .catch((err) => {
          toast.error(err || "Failed to delete job");
        });
    }
  };

  // Filter jobs by search and status
  const filteredJobs = jobs?.filter(
    (job) => {
      const matchesSearch = 
        (job.title?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (job.location?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (job.level?.toLowerCase() || "").includes(search.toLowerCase());
        
      const matchesStatus = 
        filterStatus === "all" || 
        job.status === filterStatus;
        
      return matchesSearch && matchesStatus;
    }
  );

  // Sort filtered jobs
  const sortedJobs = [...(filteredJobs || [])].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      case "oldest":
        return new Date(a.created_at || 0) - new Date(b.created_at || 0);
      case "title":
        return (a.title || "").localeCompare(b.title || "");
      case "salary-high":
        return (b.salary_range || b.salary || 0) - (a.salary_range || a.salary || 0);
      case "salary-low":
        return (a.salary_range || a.salary || 0) - (b.salary_range || b.salary || 0);
      default:
        return 0;
    }
  });

  // Job statistics
  const activeJobs = jobs?.filter(job => job.status === "active").length || 0;
  const inactiveJobs = jobs?.filter(job => job.status === "inactive").length || 0;
  const totalViews = jobs?.reduce((total, job) => total + (job.views || 0), 0) || 0;
  
  // Get days until expiration
  const getDaysUntilExpiration = (expiryDate) => {
    if (!expiryDate) return null;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Render job expiration status
  const renderExpirationStatus = (expiryDate) => {
    if (!expiryDate) return <span className="text-gray-500">No expiration</span>;
    
    const daysLeft = getDaysUntilExpiration(expiryDate);
    
    if (daysLeft < 0) {
      return <span className="text-red-600 font-medium">Expired</span>;
    } else if (daysLeft <= 7) {
      return <span className="text-amber-600 font-medium">{daysLeft} days left</span>;
    } else {
      return <span className="text-green-600 font-medium">{daysLeft} days left</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Job Management
              </h1>
              <p className="text-sm text-gray-600">
                Manage your job postings, track applications, and update job details.
              </p>
            </div>
          </div>
        </motion.div>
      
      {/* Stats Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-blue-600" />
            </div>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{jobs?.length || 0}</h3>
          <p className="text-sm text-gray-600">Total Jobs</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-50 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
              Active
            </div>
          </div>
          <h3 className="text-2xl font-bold text-green-600 mb-1">{activeJobs}</h3>
          <p className="text-sm text-gray-600">Active Jobs</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl flex items-center justify-center">
              <XCircle className="w-5 h-5 text-gray-600" />
            </div>
            <span className="text-xs text-gray-500">Paused</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-700 mb-1">{inactiveJobs}</h3>
          <p className="text-sm text-gray-600">Inactive Jobs</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-xl flex items-center justify-center">
              <Eye className="w-5 h-5 text-indigo-600" />
            </div>
            <BarChart3 className="w-4 h-4 text-indigo-500" />
          </div>
          <h3 className="text-2xl font-bold text-indigo-600 mb-1">{totalViews}</h3>
          <p className="text-sm text-gray-600">Total Views</p>
        </div>
      </motion.div>
      
      {/* Toolbar */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8"
      >
        <div className="flex flex-col lg:flex-row justify-between gap-4 mb-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs by title, location, level..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          
          <div className="flex flex-wrap gap-3 items-center">
            {/* Filter Toggle */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all ${
                showFilters 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filters</span>
              {(filterStatus !== 'all' || sortBy !== 'newest') && (
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
              )}
            </motion.button>
            
            {/* View Toggle */}
            <div className="flex items-center p-1 bg-gray-100 rounded-xl">
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all ${
                  viewMode === 'list' 
                    ? 'bg-white text-blue-600 shadow-sm font-medium' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">Grid</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all ${
                  viewMode === 'table' 
                    ? 'bg-white text-blue-600 shadow-sm font-medium' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <ListIcon className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">Table</span>
              </button>
            </div>
            
            {/* Add New Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/admin/jobs/create")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg transition-all text-sm font-semibold"
            >
              <Plus className="w-4 h-4" />
              <span>Post Job</span>
            </motion.button>
          </div>
        </div>
        
        {/* Expanded Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                {/* Status Filter */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Target className="w-4 h-4 text-blue-600" />
                    Status
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                
                {/* Sort Options */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Zap className="w-4 h-4 text-blue-600" />
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="title">Title (A-Z)</option>
                    <option value="salary-high">Salary (High to Low)</option>
                    <option value="salary-low">Salary (Low to High)</option>
                  </select>
                </div>

                {/* Results Count */}
                <div className="flex items-end">
                  <div className="w-full px-4 py-2.5 rounded-xl bg-blue-50 border-2 border-blue-100">
                    <p className="text-sm text-blue-600 font-medium">
                      {sortedJobs?.length || 0} job{sortedJobs?.length !== 1 ? 's' : ''} found
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* Loading State */}
      {loading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-20 text-center"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-blue-100 rounded-full"></div>
              <div className="w-20 h-20 border-4 border-t-blue-600 border-r-blue-600 rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
            <div>
              <p className="text-gray-900 font-semibold text-lg mb-1">Loading job posts...</p>
              <p className="text-gray-500 text-sm">Please wait a moment</p>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Error State */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-sm border border-red-100 p-12 text-center"
        >
          <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-50 rounded-full flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Failed to Load Jobs</h3>
              <p className="text-red-600 mb-6">{error}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => dispatch(fetchJobPostsByEmployer(employerId))}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
            >
              Try Again
            </motion.button>
          </div>
        </motion.div>
      )}
      
      {/* No Jobs State */}
      {!loading && !error && sortedJobs?.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center"
        >
          <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
              <Briefcase className="w-12 h-12 text-blue-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {search || filterStatus !== "all" 
                  ? "No Jobs Found" 
                  : "No Job Posts Yet"}
              </h3>
              <p className="text-gray-600 mb-6">
                {search || filterStatus !== "all" 
                  ? "No jobs match your current filters. Try adjusting your search criteria."
                  : "You haven't created any job posts yet. Click the button below to post your first job."}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/admin/jobs/create")}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
            >
              <Plus className="w-5 h-5" />
              Post New Job
            </motion.button>
          </div>
        </motion.div>
      )}
      
      {/* List View */}
      {!loading && !error && sortedJobs?.length > 0 && viewMode === 'list' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {sortedJobs.map((job, index) => (
            <motion.div
              key={job.job_post_id || job._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300"
            >
              {/* Job Header with Gradient */}
              <div className="relative p-5 pb-3 bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-2.5 py-0.5 text-xs rounded-full font-semibold shadow-sm ${
                      job.status === "active"
                        ? "bg-green-500 text-white"
                        : "bg-gray-400 text-white"
                    }`}
                  >
                    {job.status === "active" ? "Active" : "Inactive"}
                  </span>
                </div>
                
                <div className="pr-20">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {job.title}
                  </h3>
                  
                  <div className="flex flex-wrap gap-2">
                    {job.job_type && (
                      <span className="inline-flex items-center px-2.5 py-1 bg-white/80 backdrop-blur-sm text-blue-700 rounded-full text-xs font-medium border border-blue-200">
                        <Clock className="w-3 h-3 mr-1" />
                        {job.job_type?.replace("_", " ")}
                      </span>
                    )}
                    {job.level && (
                      <span className="inline-flex items-center px-2.5 py-1 bg-white/80 backdrop-blur-sm text-purple-700 rounded-full text-xs font-medium border border-purple-200">
                        <Target className="w-3 h-3 mr-1" />
                        {job.level}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Job Details */}
              <div className="p-5 pt-3 space-y-2.5">
                <div className="flex items-center text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                  <MapPin className="w-4 h-4 text-gray-400 mr-1.5 flex-shrink-0" /> 
                  <span className="truncate">{job.location || "Remote"}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                  <DollarSign className="w-4 h-4 text-green-500 mr-1.5 flex-shrink-0" /> 
                  <span className="font-semibold text-green-600">
                    {job.salary ? `$${job.salary.toLocaleString()}/year` : "Competitive"}
                  </span>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 text-indigo-500 mr-1" /> 
                    <span className="font-medium text-indigo-600">{job.applicants_count || 0}</span>
                    <span className="ml-1 text-xs">applicants</span>
                  </div>
                  
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="w-3 h-3 mr-1" /> 
                    {new Date(job.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Link
                    to={`/admin/jobs/applicants/${job.job_post_id || job._id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 rounded-xl hover:from-indigo-100 hover:to-blue-100 transition-all font-medium text-xs border border-indigo-200 hover:shadow-md"
                  >
                    <Users className="w-4 h-4" />
                    <span>Applications</span>
                  </Link>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(`/admin/jobs/edit/${job.job_post_id || job._id}`)}
                    className="flex items-center justify-center px-3 py-2 bg-amber-50 text-amber-700 rounded-xl hover:bg-amber-100 transition-all font-medium text-xs border border-amber-200"
                    title="Edit Job"
                  >
                    <Edit3 className="w-4 h-4" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(job)}
                    className="flex items-center justify-center px-3 py-2 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-all font-medium text-xs border border-red-200"
                    title="Delete Job"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
      
      {/* Table View */}
      {!loading && !error && sortedJobs?.length > 0 && viewMode === 'table' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-5 py-4 text-sm font-semibold text-gray-700">Title</th>
                  <th className="px-5 py-4 text-sm font-semibold text-gray-700">Location</th>
                  <th className="px-5 py-4 text-sm font-semibold text-gray-700">Type</th>
                  <th className="px-5 py-4 text-sm font-semibold text-gray-700">Salary</th>
                  <th className="px-5 py-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-5 py-4 text-sm font-semibold text-gray-700">Views</th>
                  <th className="px-5 py-4 text-sm font-semibold text-gray-700">Posted</th>
                  <th className="px-5 py-4 text-sm font-semibold text-gray-700">Expiration</th>
                  <th className="px-5 py-4 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sortedJobs.map((job) => (
                  <tr key={job.job_post_id || job._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-gray-800">{job.title}</div>
                      <div className="text-xs text-gray-500">{job.level}</div>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{job.location}</td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-medium bg-blue-50 text-blue-700 rounded-full px-2.5 py-1">
                        {job.job_type?.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-700 font-medium">
                      ${job.salary?.toLocaleString()}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          job.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {job.status === "active" ? (
                          <><FaCheck className="mr-1" /> Active</>
                        ) : (
                          <><FaTimes className="mr-1" /> Inactive</>
                        )}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-700">
                      {job.views || 0}
                    </td>
                    <td className="px-5 py-4 text-gray-600 text-sm">
                      {new Date(job.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 text-sm">
                      {renderExpirationStatus(job.expires_at)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex space-x-2">
                        <Link
                          to={`/admin/jobs/applicants/${job.job_post_id || job._id}`}
                          className="p-1.5 bg-indigo-50 text-indigo-700 rounded hover:bg-indigo-100 transition-colors"
                          title="View Applications"
                        >
                          <FaUsers />
                        </Link>
                        <button
                          onClick={() => navigate(`/admin/jobs/edit/${job.job_post_id || job._id}`)}
                          className="p-1.5 bg-amber-50 text-amber-700 rounded hover:bg-amber-100 transition-colors"
                          title="Edit Job"
                        >
                          <FaPencilAlt />
                        </button>
                        <button
                          onClick={() => handleDelete(job)}
                          className="p-1.5 bg-red-50 text-red-700 rounded hover:bg-red-100 transition-colors"
                          title="Delete Job"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Pagination */}
      {!loading && !error && sortedJobs?.length > 0 && pagination && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 flex items-center justify-between bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-4"
        >
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{((pagination.currentPage - 1) * pagination.limit) + 1}</span> to{' '}
            <span className="font-semibold text-gray-900">
              {Math.min(pagination.currentPage * pagination.limit, pagination.total)}
            </span> of{' '}
            <span className="font-semibold text-gray-900">{pagination.total}</span> jobs
          </div>
          
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
              }`}
            >
              Previous
            </motion.button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => {
                // Show first, last, current, and pages around current
                const showPage = page === 1 || 
                                page === pagination.totalPages || 
                                (page >= currentPage - 1 && page <= currentPage + 1);
                
                const showEllipsis = (page === currentPage - 2 && currentPage > 3) || 
                                    (page === currentPage + 2 && currentPage < pagination.totalPages - 2);
                
                if (showEllipsis) {
                  return <span key={page} className="px-2 text-gray-400">...</span>;
                }
                
                if (!showPage) return null;
                
                return (
                  <motion.button
                    key={page}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-xl font-medium transition-all ${
                      currentPage === page
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </motion.button>
                );
              })}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
              disabled={currentPage === pagination.totalPages}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                currentPage === pagination.totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
              }`}
            >
              Next
            </motion.button>
          </div>
        </motion.div>
      )}
      </div>
    </div>
  );
};

export default JobPostList;