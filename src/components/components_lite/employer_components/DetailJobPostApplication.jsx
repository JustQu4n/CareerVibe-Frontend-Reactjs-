import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployerApplications } from "../../../redux/applicationSlice";
import Navbar from "../../components_lite/Navbar";
import Footer from "../../components_lite/Footer";
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
  FaBriefcase,
  FaBuilding,
  FaArrowLeft ,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaClock,
  FaUsers,
} from "react-icons/fa";

export default function JobPostDetail() {
  const { id } = useParams(); // job_post_id
  const dispatch = useDispatch();
  const { applications, loading, error } = useSelector(
    (state) => state.applications
  );

  useEffect(() => {
    dispatch(fetchEmployerApplications());
  }, [dispatch]);

  // Render content based on loading/error state
  const renderContent = () => {
    if (loading)
      return (
        <div className="p-6 flex justify-center items-center h-64">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      );

    if (error)
      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-center">
          <div className="text-red-500 text-4xl mb-4">
            <FaTimes className="mx-auto" />
          </div>
          <h2 className="text-xl font-bold text-red-700 mb-2">
            Error Loading Data
          </h2>
          <p className="text-red-600">{error}</p>
        </div>
      );

    const jobApplications = applications.filter(
      (app) => app.job_post_id?._id === id
    );
    const jobInfo = jobApplications[0]?.job_post_id;

    // Calculate stats
    const stats = {
      total: jobApplications.length,
      pending: jobApplications.filter((app) => app.status === "pending").length,
      reviewed: jobApplications.filter((app) => app.status === "reviewed").length,
      shortlisted: jobApplications.filter((app) => app.status === "shortlisted")
        .length,
      rejected: jobApplications.filter((app) => app.status === "rejected").length,
    };

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
        case "active":
          return "bg-green-100 text-green-800";
        case "inactive":
          return "bg-gray-100 text-gray-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };

    return (
      <div className="p-6">
        {jobInfo ? (
          <>
            {/* Back Button */}
            <div className="mb-6">
              <button
                onClick={() => window.history.back()}
                className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                <FaArrowLeft className="mr-2" />
               Back to Job Listings
              </button>
            </div>
            {/* Job Information */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    <FaBriefcase className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                      {jobInfo.title}
                    </h1>
                    <div className="flex items-center mt-1 text-gray-600">
                      <FaMapMarkerAlt className="mr-1" /> {jobInfo.location}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                      jobInfo.status
                    )}`}
                  >
                    {jobInfo.status}
                  </span>
                </div>
              </div>
              <div className="py-5">
                {jobInfo.description || "No description available"}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                <div className="flex items-center">
                  <FaBuilding className="text-gray-500 mr-2" />
                  <span>
                    <strong>Level:</strong> {jobInfo.level || "Not specified"}
                  </span>
                </div>
                <div className="flex items-center">
                  <FaMoneyBillWave className="text-gray-500 mr-2" />
                  <span>
                    <strong>Salary:</strong> $
                    {jobInfo.salary?.toLocaleString() || "Not specified"}
                  </span>
                </div>
                <div className="flex items-center">
                  <FaClock className="text-gray-500 mr-2" />
                  <span>
                    <strong>Type:</strong>{" "}
                    {jobInfo.job_type?.replace("_", " ") || "Not specified"}
                  </span>
                </div>
              </div>

              {jobInfo.description && (
                <div className="mt-4 text-gray-700">
                  <h3 className="font-semibold mb-2">Job Description</h3>
                  <p>{jobInfo.description}</p>
                </div>
              )}

              {jobInfo.skills?.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {jobInfo.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Applicant Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                <div className="flex items-center">
                  <div className="bg-indigo-100 p-3 rounded-lg">
                    <FaUsers className="text-indigo-600 text-xl" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-2xl font-bold text-gray-800">
                      {stats.total}
                    </h2>
                    <p className="text-gray-500 text-sm">Total Applicants</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                <div className="flex items-center">
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <FaRegClock className="text-yellow-600 text-xl" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-2xl font-bold text-yellow-600">
                      {stats.pending}
                    </h2>
                    <p className="text-gray-500 text-sm">Pending</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <FaEye className="text-blue-600 text-xl" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-2xl font-bold text-blue-600">
                      {stats.reviewed}
                    </h2>
                    <p className="text-gray-500 text-sm">Reviewed</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <FaCheck className="text-green-600 text-xl" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-2xl font-bold text-green-600">
                      {stats.shortlisted}
                    </h2>
                    <p className="text-gray-500 text-sm">Shortlisted</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                <div className="flex items-center">
                  <div className="bg-red-100 p-3 rounded-lg">
                    <FaTimes className="text-red-600 text-xl" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-2xl font-bold text-red-600">
                      {stats.rejected}
                    </h2>
                    <p className="text-gray-500 text-sm">Rejected</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Applicant Table */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">List of Applicants</h2>

                {jobApplications.length > 0 && (
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaSearch className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search applicants..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}
              </div>

              {jobApplications.length > 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="overflow-x-auto">
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
                            Applied Date
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            CV
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
                        {jobApplications.map((app) => (
                          <tr key={app._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <img
                                  src={
                                    app.job_seeker_id?.avatar ||
                                    "/default-avatar.png"
                                  }
                                  alt="avatar"
                                  className="h-10 w-10 rounded-full object-cover"
                                />
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {app.job_seeker_id?.full_name ||
                                      "Unknown Applicant"}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {app.job_seeker_id?.email ||
                                      "No email provided"}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(app.applied_at).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <a
                                href={`/${app.cv_url.replace(/\\/g, "/")}`}
                                className="text-blue-500 hover:underline flex items-center"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <FaFileAlt className="mr-1" /> View CV
                              </a>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <select
                                className={`px-2 py-1 text-xs rounded-full border-0 font-semibold ${getStatusColor(
                                  app.status
                                )}`}
                                defaultValue={app.status}
                              >
                                <option
                                  value="pending"
                                  className="bg-yellow-100 text-yellow-800"
                                >
                                  Pending
                                </option>
                                <option
                                  value="reviewed"
                                  className="bg-blue-100 text-blue-800"
                                >
                                  Reviewed
                                </option>
                                <option
                                  value="shortlisted"
                                  className="bg-green-100 text-green-800"
                                >
                                  Shortlisted
                                </option>
                                <option
                                  value="rejected"
                                  className="bg-red-100 text-red-800"
                                >
                                  Rejected
                                </option>
                              </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-3">
                                <button
                                  className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                                  title="View Profile"
                                >
                                  <FaEye />
                                </button>
                                <button
                                  className="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-50"
                                  title="Send Message"
                                >
                                  <FaEnvelope />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center bg-gray-50 rounded-xl">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaUserTie className="text-gray-400 text-xl" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-1">
                    No applicants yet
                  </h3>
                  <p className="text-gray-500">
                    When job seekers apply to this position, they'll appear here.
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaBriefcase className="text-gray-400 text-xl" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-1">
              Job Not Found
            </h3>
            <p className="text-gray-500">
              The job post you're looking for doesn't exist or has no applicants.
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
     <div className="sticky top-0 z-50 bg-slate-100 shadow-md shadow-black/5 dark:bg-neutral-600 dark:shadow-black/10">
        <Navbar />
      </div>
      <div className="flex-grow container mx-auto">
        {renderContent()}
      </div>
      <Footer />
    </div>
  );
}