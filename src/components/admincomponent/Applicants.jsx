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

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "reviewed":
        return "bg-blue-100 text-blue-800";
      case "shortlisted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading applications...</p>
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
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-500 text-4xl mb-4">
              <FaTimes className="mx-auto" />
            </div>
            <h2 className="text-xl font-bold text-red-700 mb-2">
              Error Loading Applications
            </h2>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Applicant Management
          </h1>
          <p className="text-gray-600 mt-1">
            Track and manage all job applications
          </p>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <FaUserTie className="text-blue-600 text-xl" />
              </div>
              <div className="ml-4">
                <h2 className="text-3xl font-bold text-gray-800">
                  {stats.total}
                </h2>
                <p className="text-gray-500 text-sm">Total Applicants</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <FaRegClock className="text-yellow-600 text-xl" />
              </div>
              <div className="ml-4">
                <h2 className="text-3xl font-bold text-gray-800">
                  {stats.pending}
                </h2>
                <p className="text-gray-500 text-sm">Pending Review</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <FaEye className="text-blue-600 text-xl" />
              </div>
              <div className="ml-4">
                <h2 className="text-3xl font-bold text-gray-800">
                  {stats.reviewed}
                </h2>
                <p className="text-gray-500 text-sm">Reviewed</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <FaCheck className="text-green-600 text-xl" />
              </div>
              <div className="ml-4">
                <h2 className="text-3xl font-bold text-gray-800">
                  {stats.shortlisted}
                </h2>
                <p className="text-gray-500 text-sm">Shortlisted</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center">
              <div className="bg-red-100 p-3 rounded-lg">
                <FaTimes className="text-red-600 text-xl" />
              </div>
              <div className="ml-4">
                <h2 className="text-3xl font-bold text-gray-800">
                  {stats.rejected}
                </h2>
                <p className="text-gray-500 text-sm">Rejected</p>
              </div>
            </div>
          </div>
        </div>


        {/* List Jobpost */}
        {/* List Jobpost */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Active Job Postings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                className="border rounded-xl shadow-md p-4 hover:bg-gray-50 cursor-pointer transition"
                onClick={() =>
                  navigate(`/admin/jobs/applicants/${jobPost._id}`)
                }
              >
                <h2 className="text-xl">{jobPost.title}</h2>
                <p className="text-gray-600">{jobPost.location}</p>
                <p className="mt-2 text-sm text-gray-500">
                  {applicantCount}{" "}
                  {applicantCount === 1 ? "applicant" : "applicants"}
                </p>
              </div>
            ))}
          </div>
        </div>
                {/* Filter Options */}
        <div className="bg-white rounded-xl shadow-sm p-5 mb-8 border border-gray-100">
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
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="flex items-center">
                <FaFilter className="text-gray-500 mr-2" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="flex items-center">
                <FaRegCalendarAlt className="text-gray-500 mr-2" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        {/* Applicants Table */}
        <div className="mb-4 flex items-center justify-between">
          <h2>Recent Applications</h2>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            {filteredApplications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-gray-400 text-6xl mb-4">
                  <FaUserTie className="mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-1">
                  No applications found
                </h3>
                <p className="text-gray-500">
                  {applications.length > 0
                    ? "Try adjusting your search or filter settings."
                    : "When job seekers apply to your job posts, they'll appear here."}
                </p>
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
                  {filteredApplications.map((app) => (
                    <tr key={app._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                              <img
                                  src={
                                    app.job_seeker_id?.avatar ||
                                    "/default-avatar.png"
                                  }
                                  alt="avatar"
                                  className="h-10 w-10 rounded-full object-cover"
                                />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-large text-gray-900">
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
                        <div className="text-sm text-gray-900">
                          {app.job_post_id?.title || "Unknown Position"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {app.job_post_id?.location || "No location"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(app.applied_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            app.status
                          )}`}
                        >
                          {app.status.charAt(0).toUpperCase() +
                            app.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            className="text-blue-600 hover:text-blue-900"
                            title="View Application"
                          >
                            <FaEye />
                          </button>
                          <a
                            href={app.cv_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-gray-900"
                            title="View CV"
                          >
                            <FaFileAlt />
                          </a>
                          <button
                            className="text-green-600 hover:text-green-900"
                            title="Contact Applicant"
                          >
                            <FaEnvelope />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
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
