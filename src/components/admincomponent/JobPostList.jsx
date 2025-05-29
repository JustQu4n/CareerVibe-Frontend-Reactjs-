import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobPostsByEmployer } from "../../redux/jobPostSlice";
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
import EditJobModal from "./EditJobModal";
import {
  updateJobPostById,
  deleteJobPostById,
} from "../../redux/jobPostSlice";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const JobPostList = () => {
  const [viewMode, setViewMode] = useState('list');
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const employerId = user?.employer?.id;
  const dispatch = useDispatch();
  const { jobs, loading, error } = useSelector((state) => state.jobPosts);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const navigate = useNavigate();

  const handleEditClick = (job) => {
    setSelectedJob(job);
    setEditModalOpen(true);
  };

  const handleUpdateJob = (updatedJob) => {
    dispatch(updateJobPostById({ jobId: updatedJob._id, updatedData: updatedJob }))
      .unwrap()
      .then(() => {
        toast.success("Job updated successfully");
        setEditModalOpen(false);
      })
      .catch((err) => toast.error(err || "Failed to update job"));
  };

  useEffect(() => {
    if (employerId) {
      dispatch(fetchJobPostsByEmployer(employerId));
    }
  }, [dispatch, employerId]);

  const handleDelete = (job) => {
    if (window.confirm("Are you sure you want to delete this job post?")) {
      dispatch(deleteJobPostById({ jobId: job._id, user_id: user.id, company_id: user.company.id }))
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
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.location.toLowerCase().includes(search.toLowerCase()) ||
        job.level.toLowerCase().includes(search.toLowerCase());
        
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
        return new Date(b.created_at) - new Date(a.created_at);
      case "oldest":
        return new Date(a.created_at) - new Date(b.created_at);
      case "title":
        return a.title.localeCompare(b.title);
      case "salary-high":
        return (b.salary || 0) - (a.salary || 0);
      case "salary-low":
        return (a.salary || 0) - (b.salary || 0);
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
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Dashboard Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          Job Management
        </h1>
        <p className="text-gray-600">
          Manage your job postings, track applications, and update job details.
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Jobs</p>
              <h3 className="text-2xl font-bold text-gray-900">{jobs?.length || 0}</h3>
            </div>
            <div className="bg-blue-100 rounded-lg p-3">
              <FaBriefcase className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Active Jobs</p>
              <h3 className="text-2xl font-bold text-green-600">{activeJobs}</h3>
            </div>
            <div className="bg-green-100 rounded-lg p-3">
              <FaCheck className="text-green-600 text-xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Inactive Jobs</p>
              <h3 className="text-2xl font-bold text-gray-500">{inactiveJobs}</h3>
            </div>
            <div className="bg-gray-100 rounded-lg p-3">
              <FaTimes className="text-gray-600 text-xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Views</p>
              <h3 className="text-2xl font-bold text-indigo-600">{totalViews}</h3>
            </div>
            <div className="bg-indigo-100 rounded-lg p-3">
              <FaEye className="text-indigo-600 text-xl" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Toolbar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-8">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          {/* Search */}
          <div className="relative w-full md:w-80">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs by title, location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex flex-wrap gap-3 items-center">
            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 transition-colors"
            >
              <FaFilter className={showFilters ? "text-blue-600" : "text-gray-500"} />
              Filters
            </button>
            
            {/* View Toggle */}
            <div className="flex p-1 bg-gray-100 rounded-lg">
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center justify-center p-2 rounded-md ${
                  viewMode === 'list' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-900'
                } transition-colors`}
                title="List View"
              >
                <FaList />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center justify-center p-2 rounded-md ${
                  viewMode === 'table' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-900'
                } transition-colors`}
                title="Table View"
              >
                <FaTable />
              </button>
            </div>
            
            {/* Add New Button */}
            <button
              onClick={() => navigate("/admin/jobs/create")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm ml-auto"
            >
              <FaPlus />
              <span>Post New Job</span>
            </button>
          </div>
        </div>
        
        {/* Expanded Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            
            {/* Sort Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Title (A-Z)</option>
                <option value="salary-high">Salary (High to Low)</option>
                <option value="salary-low">Salary (Low to High)</option>
              </select>
            </div>
          </div>
        )}
      </div>
      
      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 text-center">
          <div className="w-16 h-16 border-4 border-t-blue-600 border-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Loading job posts...</p>
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="bg-white rounded-xl shadow-sm border border-red-100 p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaTimes className="text-red-500 text-2xl" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Failed to Load Jobs</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => dispatch(fetchJobPostsByEmployer(employerId))}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      )}
      
      {/* No Jobs State */}
      {!loading && !error && sortedJobs?.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 text-center">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaBriefcase className="text-blue-500 text-2xl" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">No Job Posts Found</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            {search || filterStatus !== "all" 
              ? "No jobs match your current filters. Try adjusting your search criteria."
              : "You haven't created any job posts yet. Click the button below to post your first job."}
          </p>
          <button
            onClick={() => navigate("/admin/jobs/create")}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium inline-flex items-center gap-2"
          >
            <FaPlus /> Post New Job
          </button>
        </div>
      )}
      
      {/* List View */}
      {!loading && !error && sortedJobs?.length > 0 && viewMode === 'list' && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedJobs.map((job) => (
            <motion.div
              key={job._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
            >
              {/* Job Header */}
              <div className="p-5 border-b border-gray-100">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-gray-800 line-clamp-1">{job.title}</h3>
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium ${
                      job.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {job.status === "active" ? "Active" : "Inactive"}
                  </span>
                </div>
                
                <p className="text-gray-600 line-clamp-2 text-sm mb-3">{job.description}</p>
                
                <div className="flex flex-wrap gap-2 text-xs font-medium">
                  {job.job_type && (
                    <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">
                      {job.job_type?.replace("_", " ")}
                    </span>
                  )}
                  {job.level && (
                    <span className="bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full">
                      {job.level}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Job Details */}
              <div className="p-5">
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <FaMapMarkerAlt className="text-gray-400 mr-2" /> 
                    <span>{job.location || "Remote"}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FaMoneyBillWave className="text-gray-400 mr-2" /> 
                    <span>{job.salary ? `$${job.salary.toLocaleString()}` : "Competitive"}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FaUsers className="text-gray-400 mr-2" /> 
                    <span>{job.applicants_count || 0} applicants</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FaRegClock className="text-gray-400 mr-2" /> 
                    <span>Posted {new Date(job.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Link
                    to={`/admin/jobs/applicants/${job._id}`}
                    className="flex-1 flex items-center justify-center px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors font-medium text-sm"
                  >
                    <FaUsers className="mr-1.5" /> Applications
                  </Link>
                  <button
                    onClick={() => handleEditClick(job)}
                    className="flex items-center justify-center px-3 py-2 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors font-medium text-sm"
                  >
                    <FaPencilAlt className="mr-1.5" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(job)}
                    className="flex items-center justify-center px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
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
                  <tr key={job._id} className="hover:bg-gray-50 transition-colors">
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
                          to={`/admin/jobs/applicants/${job._id}`}
                          className="p-1.5 bg-indigo-50 text-indigo-700 rounded hover:bg-indigo-100 transition-colors"
                          title="View Applications"
                        >
                          <FaUsers />
                        </Link>
                        <button
                          onClick={() => handleEditClick(job)}
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
      
      {/* Edit Modal */}
      <EditJobModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        job={selectedJob}
        onSubmit={handleUpdateJob}
      />
    </div>
  );
};

export default JobPostList;