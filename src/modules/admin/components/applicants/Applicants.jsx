import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployerApplications } from "@/redux/applicationSlice";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Eye,
  FileText,
  Mail,
  ChevronRight,
  Briefcase,
  MapPin,
  TrendingUp,
  Calendar,
  BarChart3,
  UserCheck,
  AlertCircle,
  Download
} from 'lucide-react';

const Applicants = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { applications, loading, error } = useSelector(
    (state) => state.applications
  );
  // Ensure applications is always an array to avoid runtime errors
  const apps = Array.isArray(applications) ? applications : [];
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showJobPostings, setShowJobPostings] = useState(true);
  useEffect(() => {
    dispatch(fetchEmployerApplications());
  }, [dispatch]);

  // Calculate statistics
  const stats = {
    total: apps.length,
    pending: apps.filter((app) => app?.status === "pending").length,
    reviewed: apps.filter((app) => app?.status === "reviewed").length,
    shortlisted: apps.filter((app) => app?.status === "shortlisted").length,
    rejected: apps.filter((app) => app?.status === "rejected").length,
  };

  // Get percentage for progress bars
  const getPercentage = (status) => {
    if (stats.total === 0) return 0;
    return (stats[status] / stats.total) * 100;
  };

  // Filter and sort applications
  const filteredApplications = apps
    .filter((app) => {
      // Filter by status
      if (statusFilter !== "all" && app.status !== statusFilter) return false;

      // Filter by search query (applicant name or job title)
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const seekerName =
          app?.job_seeker_id?.full_name || app?.jobSeeker?.user?.full_name || app?.jobSeeker?.full_name;
        const nameMatch = seekerName?.toLowerCase?.().includes(searchLower);

        const jobTitle = app?.job_post_id?.title || app?.jobPost?.title;
        const jobMatch = jobTitle?.toLowerCase?.().includes(searchLower);

        if (!nameMatch && !jobMatch) return false;
      }

      return true;
    })
    .sort((a, b) => {
      // Sort applications
      if (sortBy === "newest") {
        return new Date(b.applied_at) - new Date(a.applied_at);
      } else if (sortBy === "oldest") {
        return new Date(a.applied_at) - new Date(b.applied_at);
      }
      return 0;
    });

  // Get status badge style
  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return {
          bgColor: "bg-amber-50",
          textColor: "text-amber-700",
          borderColor: "border-amber-200",
          icon: <Clock className="mr-1 w-3 h-3" />,
        };
      case "reviewed":
        return {
          bgColor: "bg-blue-50",
          textColor: "text-blue-700",
          borderColor: "border-blue-200",
          icon: <Eye className="mr-1 w-3 h-3" />,
        };
      case "shortlisted":
        return {
          bgColor: "bg-emerald-50",
          textColor: "text-emerald-700",
          borderColor: "border-emerald-200",
          icon: <CheckCircle className="mr-1 w-3 h-3" />,
        };
      case "rejected":
        return {
          bgColor: "bg-red-50",
          textColor: "text-red-700",
          borderColor: "border-red-200",
          icon: <XCircle className="mr-1 w-3 h-3" />,
        };
      default:
        return {
          bgColor: "bg-gray-50",
          textColor: "text-gray-700",
          borderColor: "border-gray-200",
          icon: <Clock className="mr-1 w-3 h-3" />,
        };
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="flex items-center justify-center min-h-[70vh]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-16 h-16 border-4 border-t-blue-600 border-r-blue-600 border-b-blue-200 border-l-blue-200 rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading applications...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="flex items-center justify-center min-h-[70vh]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-red-100 p-8 text-center max-w-lg"
          >
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Something Went Wrong
            </h2>
            <p className="text-sm text-red-600 mb-6">{error}</p>
            <button
              onClick={() => dispatch(fetchEmployerApplications())}
              className="px-6 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 font-medium rounded-xl transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-4 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Applicant Management
              </h1>
              <p className="text-sm text-gray-600">
                Track and manage all job applications across your company's open positions
              </p>
            </div>
          </div>
        </motion.div>
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6"
        >
            {/* Total Applicants Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <TrendingUp className="w-4 h-4 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.total}</h3>
              <p className="text-sm text-gray-600">Total Applicants</p>
            </div>
            
            {/* Pending Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                  {getPercentage('pending').toFixed(0)}%
                </div>
              </div>
              <h3 className="text-2xl font-bold text-amber-600 mb-1">{stats.pending}</h3>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
            
            {/* Reviewed Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center">
                  <Eye className="w-5 h-5 text-blue-600" />
                </div>
                <BarChart3 className="w-4 h-4 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold text-blue-600 mb-1">{stats.reviewed}</h3>
              <p className="text-sm text-gray-600">Reviewed</p>
            </div>
            
            {/* Shortlisted Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-50 rounded-xl flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-green-600" />
                </div>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-green-600 mb-1">{stats.shortlisted}</h3>
              <p className="text-sm text-gray-600">Shortlisted</p>
            </div>
            
            {/* Rejected Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-red-50 rounded-xl flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <span className="text-xs text-gray-500">{getPercentage('rejected').toFixed(0)}%</span>
              </div>
              <h3 className="text-2xl font-bold text-red-600 mb-1">{stats.rejected}</h3>
              <p className="text-sm text-gray-600">Rejected</p>
            </div>
        </motion.div>

        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search applicants or job titles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="rejected">Rejected</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
          
          {filteredApplications.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                Showing <span className="font-semibold text-gray-900">{filteredApplications.length}</span> of <span className="font-semibold text-gray-900">{apps.length}</span> applications
              </p>
            </div>
          )}
        </motion.div>

        {/* Job Postings Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-600" />
              Active Job Postings
            </h2>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowJobPostings(!showJobPostings)}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
            >
              {showJobPostings ? 'Hide' : 'Show'}
              <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${showJobPostings ? 'rotate-90' : ''}`} />
            </motion.button>
          </div>
          
          <AnimatePresence>
            {showJobPostings && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
              {/* Group applications by job post ID to avoid duplicates */}
                {Object.values(
                  apps.reduce((acc, application) => {
                    // Support multiple API shapes: application.job_post_id may be an object or a string id, or application.jobPost may exist
                    let jobObj = null;
                    if (application?.job_post_id && typeof application.job_post_id === 'object') {
                      jobObj = application.job_post_id;
                    } else if (application?.jobPost) {
                      jobObj = application.jobPost;
                    } else if (application?.job_post_id) {
                      jobObj = { _id: application.job_post_id, title: application.job_post_title || 'Unknown Position' };
                    }

                    if (!jobObj) return acc;

                    const jobId = jobObj._id || jobObj.job_post_id;
                    if (!acc[jobId]) {
                      acc[jobId] = {
                        jobPost: jobObj,
                        applicantCount: 0,
                      };
                    }
                    acc[jobId].applicantCount++;
                    return acc;
                  }, {})
                ).map(({ jobPost, applicantCount }, index) => {
                  const jobId = jobPost._id || jobPost.job_post_id;
                  // find a representative application for this job to get application_id
                  const firstApp = apps.find((application) => {
                    const appJobObj = application?.job_post_id && typeof application.job_post_id === 'object'
                      ? (application.job_post_id._id || application.job_post_id.job_post_id)
                      : (application.job_post_id || application.jobPost?._id || application.jobPost?.job_post_id);
                    return appJobObj === jobId;
                  });
                  const applicationId = firstApp?.application_id || firstApp?._id || jobId;

                  return (
                  <motion.div
                    key={applicationId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -4 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all cursor-pointer group"
                    onClick={() => navigate(`/admin/jobs/applicants/${applicationId}`)}
                  >
                    <div className="p-4 pb-3 bg-gradient-to-br from-blue-50 to-indigo-50">
                      <h3 className="font-bold text-gray-900 text-base line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {jobPost.title || jobPost.name || 'Untitled Position'}
                      </h3>
                    </div>
                    <div className="p-4 pt-3">
                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <MapPin className="w-4 h-4 text-gray-400 mr-1.5" />
                        <span>{jobPost.location || "Remote"}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-blue-600">
                          <Users className="w-4 h-4 mr-1.5" />
                          <span className="font-medium">
                            {applicantCount} {applicantCount === 1 ? "applicant" : "applicants"}
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                    </div>
                  </motion.div>
                  )})}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Applications Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">Recent Applications</h2>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {filteredApplications.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-12 text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  No applications found
                </h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto mb-4">
                  {apps.length > 0
                    ? "Try adjusting your search or filter settings."
                    : "When job seekers apply to your job posts, they'll appear here."}
                </p>
                {apps.length > 0 && statusFilter !== 'all' && (
                  <button 
                    onClick={() => setStatusFilter('all')} 
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Clear filters
                  </button>
                )}
              </motion.div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Applicant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Job Position
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Applied Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredApplications.map((app, index) => {
                      const statusStyle = getStatusStyle(app.status);
                      return (
                        <motion.tr
                          key={app._id || app.application_id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.03 }}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center overflow-hidden">
                                {app.job_seeker_id?.avatar || app.jobSeeker?.avatar_url ? (
                                  <img
                                    src={app.job_seeker_id?.avatar || app.jobSeeker?.avatar_url}
                                    alt="avatar"
                                    className="w-10 h-10 object-cover"
                                  />
                                ) : (
                                  <Users className="w-5 h-5 text-blue-600" />
                                )}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {app.job_seeker_id?.full_name || app.jobSeeker?.user?.full_name || app.jobSeeker?.full_name || "Unknown Applicant"}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {app.job_seeker_id?.user_id?.email || app.jobSeeker?.user?.email || "No email"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {app.job_post_id?.title || app.jobPost?.title || "Unknown Position"}
                            </div>
                            <div className="flex items-center text-xs text-gray-500 mt-0.5">
                              <MapPin className="w-3 h-3 mr-1 text-gray-400" />
                              {app.job_post_id?.location || app.jobPost?.location || "No location"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-900">
                              <Calendar className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                              {new Date(app.applied_at).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </div>
                            <div className="text-xs text-gray-500 ml-5">
                              {new Date(app.applied_at).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle.bgColor} ${statusStyle.textColor} border ${statusStyle.borderColor}`}
                            >
                              {statusStyle.icon}
                              {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex gap-2">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"
                                title="View Application"
                              >
                                <Eye className="w-4 h-4" />
                              </motion.button>
                              <motion.a
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                href={app.cv_url || app.resume_url || app.jobSeeker?.resume_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-gray-50 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                title="View CV"
                              >
                                <Download className="w-4 h-4" />
                              </motion.a>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg transition-colors"
                                title="Contact"
                              >
                                <Mail className="w-4 h-4" />
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Applicants;