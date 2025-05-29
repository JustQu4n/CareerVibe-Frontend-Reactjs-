import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchEmployerApplications,
  updateApplicationStatus,
} from "../../../redux/applicationSlice";
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
  FaArrowLeft,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaClock,
  FaUsers,
  FaDownload,
  FaFileExcel,
  FaChevronDown,
  FaStar,
  FaUserGraduate,
} from "react-icons/fa";
import * as XLSX from "xlsx";

export default function JobPostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [updatingId, setUpdatingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDescription, setShowDescription] = useState(false);
  const { updateStatusLoading } = useSelector((state) => state.applications);
  const { applications, loading, error } = useSelector(
    (state) => state.applications
  );

  useEffect(() => {
    dispatch(fetchEmployerApplications());
  }, [dispatch]);

  // Export to Excel functionality
  const exportToExcel = (jobInfo, jobApplications) => {
    if (!jobApplications || jobApplications.length === 0 || !jobInfo) return;
    
    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet([]);
    
    // Add title with merge
    XLSX.utils.sheet_add_aoa(ws, [['CareerVibe - Applicants Report']], { origin: 'A1' });
    ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 6 } }]; // Merge A1:G1
    
    // Calculate stats
    const stats = {
      total: jobApplications.length,
      pending: jobApplications.filter((app) => app.status === "pending").length,
      reviewed: jobApplications.filter((app) => app.status === "reviewed").length,
      shortlisted: jobApplications.filter((app) => app.status === "shortlisted").length,
      rejected: jobApplications.filter((app) => app.status === "rejected").length,
    };
    
    // Add job info
    XLSX.utils.sheet_add_aoa(ws, [
      [],
      [`Job Title: ${jobInfo.title}`],
      [`Location: ${jobInfo.location || 'N/A'}`],
      [`Job Type: ${jobInfo.job_type || 'N/A'}`],
      [`Salary: $${jobInfo.salary?.toLocaleString() || 'N/A'}`],
      [`Total Applicants: ${jobApplications.length}`],
      [],
      ['Application Statistics:'],
      ['Pending', 'Reviewed', 'Shortlisted', 'Rejected'],
      [stats.pending, stats.reviewed, stats.shortlisted, stats.rejected],
      [],
    ], { origin: 'A2' });
    
    // Add table headers with style
    XLSX.utils.sheet_add_aoa(ws, [
      ['Applicant Name', 'Email', 'Applied Date', 'Status', 'Skills', 'Cover Letter']
    ], { origin: 'A13' });
    
    // Add applicant data
    const data = jobApplications.map(app => [
      app.job_seeker_id?.full_name || 'Unknown',
      app.job_seeker_id?.user_id?.email || 'No email',
      new Date(app.applied_at).toLocaleDateString(),
      app.status.charAt(0).toUpperCase() + app.status.slice(1),
      app.job_seeker_id?.skills?.join(', ') || 'N/A',
      app.cover_letter || 'No cover letter'
    ]);
    
    XLSX.utils.sheet_add_aoa(ws, data, { origin: 'A14' });
    
    // Set column widths
    ws['!cols'] = [
      { wch: 20 }, // Name
      { wch: 30 }, // Email
      { wch: 15 }, // Date
      { wch: 12 }, // Status
      { wch: 40 }, // Skills
      { wch: 50 }  // Cover letter
    ];
    
    // Create workbook and add the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Applicants');
    
    // Generate Excel file and trigger download
    XLSX.writeFile(wb, `${jobInfo.title.replace(/[^a-zA-Z0-9]/g, '_')}_applicants.xlsx`);
  };

  // Get status badge color and icon
  const getStatusInfo = (status) => {
    switch (status) {
      case "pending":
        return {
          bgColor: "bg-amber-50",
          textColor: "text-amber-700",
          borderColor: "border-amber-200",
          icon: <FaRegClock className="mr-2" />,
          hoverBg: "hover:bg-amber-100",
          selectBg: "bg-amber-100"
        };
      case "reviewed":
        return {
          bgColor: "bg-blue-50",
          textColor: "text-blue-700",
          borderColor: "border-blue-200",
          icon: <FaEye className="mr-2" />,
          hoverBg: "hover:bg-blue-100",
          selectBg: "bg-blue-100"
        };
      case "shortlisted":
        return {
          bgColor: "bg-emerald-50",
          textColor: "text-emerald-700",
          borderColor: "border-emerald-200",
          icon: <FaCheck className="mr-2" />,
          hoverBg: "hover:bg-emerald-100",
          selectBg: "bg-emerald-100"
        };
      case "rejected":
        return {
          bgColor: "bg-red-50",
          textColor: "text-red-700",
          borderColor: "border-red-200",
          icon: <FaTimes className="mr-2" />,
          hoverBg: "hover:bg-red-100",
          selectBg: "bg-red-100"
        };
      case "active":
        return {
          bgColor: "bg-emerald-50",
          textColor: "text-emerald-700",
          borderColor: "border-emerald-200",
          icon: <FaCheck className="mr-2" />,
          hoverBg: "hover:bg-emerald-100",
          selectBg: "bg-emerald-100"
        };
      case "inactive":
        return {
          bgColor: "bg-gray-50",
          textColor: "text-gray-700",
          borderColor: "border-gray-200",
          icon: <FaTimes className="mr-2" />,
          hoverBg: "hover:bg-gray-100",
          selectBg: "bg-gray-100"
        };
      default:
        return {
          bgColor: "bg-gray-50",
          textColor: "text-gray-700",
          borderColor: "border-gray-200",
          icon: <FaRegClock className="mr-2" />,
          hoverBg: "hover:bg-gray-100",
          selectBg: "bg-gray-100"
        };
    }
  };

  // Render loading state with animation
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <div className="w-20 h-20 border-4 border-t-blue-600 border-r-blue-500 border-b-blue-300 border-l-blue-200 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 font-medium">Loading job applications...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Render error state with visual feedback
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-lg">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaTimes className="text-red-500 text-3xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Something Went Wrong</h2>
            <p className="text-red-600 mb-6">{error}</p>
            <button
              onClick={() => dispatch(fetchEmployerApplications())}
              className="bg-red-50 hover:bg-red-100 text-red-700 font-medium px-6 py-3 rounded-lg transition-colors duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Filter applications for current job
  const jobApplications = applications.filter(
    (app) => app.job_post_id?._id === id
  );
  
  // Get job information
  const jobInfo = jobApplications[0]?.job_post_id;

  // Calculate statistics
  const stats = {
    total: jobApplications.length,
    pending: jobApplications.filter((app) => app.status === "pending").length,
    reviewed: jobApplications.filter((app) => app.status === "reviewed").length,
    shortlisted: jobApplications.filter((app) => app.status === "shortlisted").length,
    rejected: jobApplications.filter((app) => app.status === "rejected").length,
  };

  // Filter applications by search term
  const filteredApplications = jobApplications.filter(app => 
    app.job_seeker_id?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.job_seeker_id?.user_id?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <Navbar />
      </div>
      
      <div className="flex-grow">
        {/* Hero Section with Job Title */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-10">
          <div className="container mx-auto px-4">
            <button
              onClick={() => window.history.back()}
              className="flex items-center text-white/80 hover:text-white mb-6 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Back to Job Listings
            </button>
            
            {jobInfo ? (
              <>
                <div className="flex items-center mb-2">
                  <div className="bg-white/10 p-3 rounded-lg mr-4">
                    <FaBriefcase className="text-white text-xl" />
                  </div>
                  <h1 className="text-3xl font-bold">{jobInfo.title}</h1>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-blue-100 ml-12">
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="mr-2" /> 
                    {jobInfo.location || "Remote"}
                  </div>
                  <div className="flex items-center">
                    <FaClock className="mr-2" /> 
                    {jobInfo.job_type?.replace("_", " ") || "Full-time"}
                  </div>
                  <div className="flex items-center">
                    <FaMoneyBillWave className="mr-2" /> 
                    ${jobInfo.salary?.toLocaleString() || "Competitive"}
                  </div>
                  <div className="flex items-center">
                    <FaBuilding className="mr-2" /> 
                    {jobInfo.level || "Any level"}
                  </div>
                  <div className="ml-auto">
                    <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                      jobInfo.status === "active" 
                        ? "bg-emerald-100 text-emerald-800" 
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {jobInfo.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <h1 className="text-3xl font-bold">Job Details</h1>
            )}
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8">
          {/* Job Info Section */}
          {jobInfo && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 -mt-8 relative z-10">
              {/* Job Description Toggle */}
              <div className="p-6 border-b border-gray-100">
                <button 
                  onClick={() => setShowDescription(!showDescription)}
                  className="w-full flex justify-between items-center text-left"
                >
                  <span className="text-lg font-semibold text-gray-800">Job Description</span>
                  <FaChevronDown className={`text-gray-500 transition-transform duration-300 ${showDescription ? 'transform rotate-180' : ''}`} />
                </button>
                
                {showDescription && (
                  <div className="mt-4 text-gray-600 prose max-w-none">
                    <p>{jobInfo.description || "No description available"}</p>
                    
                    {jobInfo.skills?.length > 0 && (
                      <div className="mt-4">
                        <h3 className="font-semibold mb-2 text-gray-800">Required Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {jobInfo.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center"
                            >
                              <FaStar className="mr-1.5 h-3 w-3" />
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Application Statistics */}
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <FaUsers className="mr-2 text-blue-600" />
            Application Statistics
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {/* Total Applications */}
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 transition-all hover:shadow-md">
              <div className="flex items-center">
                <div className="bg-indigo-100 p-3 rounded-lg">
                  <FaUsers className="text-indigo-600 text-xl" />
                </div>
                <div className="ml-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {stats.total}
                  </h2>
                  <p className="text-gray-500 text-sm">Total</p>
                </div>
              </div>
              <div className="mt-4 w-full bg-gray-200 rounded-full h-1">
                <div className="bg-indigo-600 h-1 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>

            {/* Pending Applications */}
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 transition-all hover:shadow-md">
              <div className="flex items-center">
                <div className="bg-amber-100 p-3 rounded-lg">
                  <FaRegClock className="text-amber-600 text-xl" />
                </div>
                <div className="ml-4">
                  <h2 className="text-2xl font-bold text-amber-600">
                    {stats.pending}
                  </h2>
                  <p className="text-gray-500 text-sm">Pending</p>
                </div>
              </div>
              <div className="mt-4 w-full bg-gray-200 rounded-full h-1">
                <div className="bg-amber-500 h-1 rounded-full" style={{ width: `${stats.total ? (stats.pending / stats.total) * 100 : 0}%` }}></div>
              </div>
            </div>

            {/* Reviewed Applications */}
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 transition-all hover:shadow-md">
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
              <div className="mt-4 w-full bg-gray-200 rounded-full h-1">
                <div className="bg-blue-500 h-1 rounded-full" style={{ width: `${stats.total ? (stats.reviewed / stats.total) * 100 : 0}%` }}></div>
              </div>
            </div>

            {/* Shortlisted Applications */}
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 transition-all hover:shadow-md">
              <div className="flex items-center">
                <div className="bg-emerald-100 p-3 rounded-lg">
                  <FaCheck className="text-emerald-600 text-xl" />
                </div>
                <div className="ml-4">
                  <h2 className="text-2xl font-bold text-emerald-600">
                    {stats.shortlisted}
                  </h2>
                  <p className="text-gray-500 text-sm">Shortlisted</p>
                </div>
              </div>
              <div className="mt-4 w-full bg-gray-200 rounded-full h-1">
                <div className="bg-emerald-500 h-1 rounded-full" style={{ width: `${stats.total ? (stats.shortlisted / stats.total) * 100 : 0}%` }}></div>
              </div>
            </div>

            {/* Rejected Applications */}
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 transition-all hover:shadow-md">
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
              <div className="mt-4 w-full bg-gray-200 rounded-full h-1">
                <div className="bg-red-500 h-1 rounded-full" style={{ width: `${stats.total ? (stats.rejected / stats.total) * 100 : 0}%` }}></div>
              </div>
            </div>
          </div>
          
          {/* Applicant Table Section */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <FaUserTie className="mr-2 text-blue-600" />
                Applicants ({filteredApplications.length})
              </h2>

              <div className="flex flex-wrap items-center gap-3">
                {jobApplications.length > 0 && (
                  <>
                    <button
                      onClick={() => exportToExcel(jobInfo, jobApplications)}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                      title="Download as Excel"
                    >
                      <FaFileExcel className="mr-2" />
                      Export
                    </button>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaSearch className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Search applicants..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {filteredApplications.length > 0 ? (
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
                    {filteredApplications.map((app) => {
                      const statusInfo = getStatusInfo(app.status);
                      return (
                        <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 overflow-hidden">
                                {app.job_seeker_id?.avatar ? (
                                  <img
                                    src={app.job_seeker_id.avatar}
                                    alt="avatar"
                                    className="h-full w-full object-cover"
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
                            <div className="text-sm text-gray-900">
                              {new Date(app.applied_at).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(app.applied_at).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <a
                              href={`${app.cv_url.replace(/\\/g, "/")}`}
                              className="flex items-center px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors w-fit"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FaFileAlt className="mr-2" /> View CV
                            </a>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="relative">
                              <select
                                className={`appearance-none pl-8 pr-8 py-2 rounded-full text-sm font-medium border focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${statusInfo.bgColor} ${statusInfo.textColor} ${statusInfo.borderColor} focus:ring-${statusInfo.textColor.replace('text-', '')}`}
                                value={app.status}
                                onChange={(e) => {
                                  setUpdatingId(app._id);
                                  dispatch(
                                    updateApplicationStatus({
                                      applicationId: app._id,
                                      status: e.target.value,
                                    })
                                  );
                                }}
                              >
                                <option value="pending" className="bg-amber-100 text-amber-800">
                                  Pending
                                </option>
                                <option value="reviewed" className="bg-blue-100 text-blue-800">
                                  Reviewed
                                </option>
                                <option value="shortlisted" className="bg-emerald-100 text-emerald-800">
                                  Shortlisted
                                </option>
                                <option value="rejected" className="bg-red-100 text-red-800">
                                  Rejected
                                </option>
                              </select>
                              <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
                                {statusInfo.icon}
                              </div>
                              <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                                <FaChevronDown className="h-3 w-3 text-current opacity-70" />
                              </div>
                              
                              {/* Loading indicator */}
                              {updateStatusLoading && app._id === updatingId && (
                                <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-full">
                                  <div className="h-4 w-4 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => navigate(`/admin/jobs/applicants/candidate-profile/${app?._id}`)}
                                className="flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors"
                                title="View Profile"
                              >
                                <FaUserGraduate className="mr-2 h-4 w-4" />
                                Profile
                              </button>
                              <button
                                className="flex items-center px-3 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                                title="Contact Applicant"
                              >
                                <FaEnvelope className="mr-2 h-4 w-4" />
                                Contact
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center">
                {searchTerm ? (
                  <>
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaSearch className="text-blue-500 text-xl" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                      No matching applicants
                    </h3>
                    <p className="text-gray-500 mb-4">
                      No applicants match your search criteria
                    </p>
                    <button
                      onClick={() => setSearchTerm("")}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Clear search
                    </button>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaUserTie className="text-gray-400 text-xl" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                      No applicants yet
                    </h3>
                    <p className="text-gray-500">
                      When job seekers apply to this position, they'll appear here.
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}