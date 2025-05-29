import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployerApplications } from "../../redux/applicationSlice";
import Navbar from "../components_lite/Navbar";
import { useNavigate } from "react-router-dom";
import {
  FaUserTie,
  FaRegClock,
  FaCheck,
  FaTimes,
  FaRegCalendarAlt,
  FaSearch,
  FaFilter,
  FaEye,
  FaFileAlt,
  FaEnvelope,
  FaChevronRight,
  FaSort,
  FaBriefcase,
  FaMapMarkerAlt,
  FaUserClock,
} from "react-icons/fa";

const Applicants = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { applications, loading, error } = useSelector(
    (state) => state.applications
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showJobPostings, setShowJobPostings] = useState(true);

  useEffect(() => {
    dispatch(fetchEmployerApplications());
  }, [dispatch]);

  // Calculate statistics
  const stats = {
    total: applications.length,
    pending: applications.filter((app) => app.status === "pending").length,
    reviewed: applications.filter((app) => app.status === "reviewed").length,
    shortlisted: applications.filter((app) => app.status === "shortlisted")
      .length,
    rejected: applications.filter((app) => app.status === "rejected").length,
  };

  // Get percentage for progress bars
  const getPercentage = (status) => {
    if (stats.total === 0) return 0;
    return (stats[status] / stats.total) * 100;
  };

  // Filter and sort applications
  const filteredApplications = applications
    .filter((app) => {
      // Filter by status
      if (statusFilter !== "all" && app.status !== statusFilter) return false;

      // Filter by search query (applicant name or job title)
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const nameMatch = app.job_seeker_id?.full_name
          ?.toLowerCase()
          .includes(searchLower);
        const jobMatch = app.job_post_id?.title
          ?.toLowerCase()
          .includes(searchLower);
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
          icon: <FaRegClock className="mr-1.5 h-3 w-3" />,
        };
      case "reviewed":
        return {
          bgColor: "bg-blue-50",
          textColor: "text-blue-700",
          borderColor: "border-blue-200",
          icon: <FaEye className="mr-1.5 h-3 w-3" />,
        };
      case "shortlisted":
        return {
          bgColor: "bg-emerald-50",
          textColor: "text-emerald-700",
          borderColor: "border-emerald-200",
          icon: <FaCheck className="mr-1.5 h-3 w-3" />,
        };
      case "rejected":
        return {
          bgColor: "bg-red-50",
          textColor: "text-red-700",
          borderColor: "border-red-200",
          icon: <FaTimes className="mr-1.5 h-3 w-3" />,
        };
      default:
        return {
          bgColor: "bg-gray-50",
          textColor: "text-gray-700",
          borderColor: "border-gray-200",
          icon: <FaRegClock className="mr-1.5 h-3 w-3" />,
        };
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="text-center">
            <div className="w-20 h-20 border-4 border-t-blue-600 border-r-blue-600 border-b-blue-300 border-l-blue-300 rounded-full animate-spin mx-auto"></div>
            <p className="mt-6 text-gray-600 font-medium">Loading applications...</p>
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="bg-white border border-red-100 rounded-xl shadow-lg p-8 text-center max-w-lg">
            <div className="bg-red-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaTimes className="text-red-500 text-4xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Something Went Wrong
            </h2>
            <p className="text-red-600 mb-6">{error}</p>
            <button
              onClick={() => dispatch(fetchEmployerApplications())}
              className="bg-red-50 hover:bg-red-100 text-red-700 font-medium px-6 py-3 rounded-lg transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero section with gradient background */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold">Applicant Management</h1>
          <p className="text-blue-100 mt-2 max-w-3xl">
            Track and manage all job applications across your company's open positions
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        {/* Dashboard cards - elevated above the gradient */}
        <div className="relative -mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
            {/* Total Applicants Card */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 transition-all hover:shadow-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Applicants</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{stats.total}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <FaUserTie className="text-blue-600 text-xl" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  {applications.length > 0 
                    ? `Last application on ${new Date(applications[0].applied_at).toLocaleDateString()}`
                    : 'No applications yet'}
                </p>
              </div>
            </div>
            
            {/* Pending Card */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 transition-all hover:shadow-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Pending</p>
                  <p className="text-3xl font-bold text-amber-500 mt-2">{stats.pending}</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg">
                  <FaRegClock className="text-amber-600 text-xl" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-amber-500 h-1.5 rounded-full" 
                    style={{ width: `${getPercentage('pending')}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            {/* Reviewed Card */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 transition-all hover:shadow-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Reviewed</p>
                  <p className="text-3xl font-bold text-blue-500 mt-2">{stats.reviewed}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <FaEye className="text-blue-600 text-xl" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-blue-500 h-1.5 rounded-full" 
                    style={{ width: `${getPercentage('reviewed')}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            {/* Shortlisted Card */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 transition-all hover:shadow-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Shortlisted</p>
                  <p className="text-3xl font-bold text-emerald-500 mt-2">{stats.shortlisted}</p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-lg">
                  <FaCheck className="text-emerald-600 text-xl" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-emerald-500 h-1.5 rounded-full" 
                    style={{ width: `${getPercentage('shortlisted')}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            {/* Rejected Card */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 transition-all hover:shadow-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Rejected</p>
                  <p className="text-3xl font-bold text-red-500 mt-2">{stats.rejected}</p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <FaTimes className="text-red-600 text-xl" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-red-500 h-1.5 rounded-full" 
                    style={{ width: `${getPercentage('rejected')}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Options */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search applicants or job titles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="flex items-center">
                <FaFilter className="text-gray-500 mr-2" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="flex items-center">
                <FaSort className="text-gray-500 mr-2" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Job Postings Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <FaBriefcase className="mr-2 text-blue-600" />
              Active Job Postings
            </h2>
            <button 
              onClick={() => setShowJobPostings(!showJobPostings)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
            >
              {showJobPostings ? 'Hide' : 'Show'} Job Postings
              <FaChevronRight className={`ml-1 transition-transform duration-200 ${showJobPostings ? 'transform rotate-90' : ''}`} />
            </button>
          </div>
          
          {showJobPostings && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Group applications by job post ID to avoid duplicates */}
              {Object.values(
                applications.reduce((acc, application) => {
                  // Skip if no job post data
                  if (!application.job_post_id?._id) return acc;

                  const jobId = application.job_post_id._id;

                  // If this job post isn't in our accumulator yet, add it
                  if (!acc[jobId]) {
                    acc[jobId] = {
                      jobPost: application.job_post_id,
                      applicantCount: 0,
                    };
                  }

                  // Increment applicant count for this job
                  acc[jobId].applicantCount++;

                  return acc;
                }, {})
              ).map(({ jobPost, applicantCount }) => (
                <div
                  key={jobPost._id}
                  className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden cursor-pointer transform hover:-translate-y-1" 
                  onClick={() => navigate(`/admin/jobs/applicants/${jobPost._id}`)}
                >
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-gray-200">
                    <h3 className="font-bold text-gray-800 text-lg line-clamp-1">{jobPost.title}</h3>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center text-gray-600 mb-3">
                      <FaMapMarkerAlt className="text-gray-400 mr-2" />
                      <span>{jobPost.location || "Remote"}</span>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center text-blue-600">
                        <FaUserClock className="mr-2" />
                        <span className="font-medium">
                          {applicantCount} {applicantCount === 1 ? "applicant" : "applicants"}
                        </span>
                      </div>
                      <button className="text-gray-500 hover:text-blue-700 text-sm font-medium flex items-center">
                        View Details
                        <FaChevronRight className="ml-1 h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Applicants Section */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <FaUserTie className="mr-2 text-blue-600" />
            Recent Applications
          </h2>
        </div>
        
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            {filteredApplications.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaUserTie className="text-blue-500 text-3xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  No applications found
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  {applications.length > 0
                    ? "Try adjusting your search or filter settings."
                    : "When job seekers apply to your job posts, they'll appear here."}
                </p>
                {applications.length > 0 && statusFilter !== 'all' && (
                  <button 
                    onClick={() => setStatusFilter('all')} 
                    className="mt-4 text-blue-600 hover:text-blue-800 font-medium flex items-center mx-auto"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Applicant
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Job Position
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Applied Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredApplications.map((app) => {
                    const statusStyle = getStatusStyle(app.status);
                    return (
                      <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold overflow-hidden">
                              {app.job_seeker_id?.avatar ? (
                                <img
                                  src={app.job_seeker_id.avatar}
                                  alt="avatar"
                                  className="h-10 w-10 object-cover"
                                />
                              ) : (
                                <FaUserTie className="h-5 w-5" />
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {app.job_seeker_id?.full_name ||
                                  "Unknown Applicant"}
                              </div>
                              <div className="text-sm text-gray-500">
                                {app.job_seeker_id?.user_id?.email || "No email provided"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {app.job_post_id?.title || "Unknown Position"}
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            <FaMapMarkerAlt className="mr-1 h-3 w-3 text-gray-400" />
                            {app.job_post_id?.location || "No location"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(app.applied_at).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                          <div className="text-xs text-gray-500">
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
                            {app.status.charAt(0).toUpperCase() +
                              app.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-3">
                            <button
                              className="bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors p-2 rounded-lg"
                              title="View Application"
                            >
                              <FaEye className="h-4 w-4" />
                            </button>
                            <a
                              href={app.cv_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors p-2 rounded-lg"
                              title="View CV"
                            >
                              <FaFileAlt className="h-4 w-4" />
                            </a>
                            <button
                              className="bg-green-50 text-green-700 hover:bg-green-100 transition-colors p-2 rounded-lg"
                              title="Contact Applicant"
                            >
                              <FaEnvelope className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Applicants;