import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import {
  fetchEmployerApplications,
  updateApplicationStatus,
} from "@/redux/applicationSlice";
import {
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Eye,
  FileText,
  Mail,
  Briefcase,
  Building2,
  ChevronLeft,
  MapPin,
  DollarSign,
  Download,
  ChevronDown,
  Star,
  UserCheck,
  AlertCircle,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import * as XLSX from "xlsx";

export default function DetailJobPostApplication() {
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

  // Export to Excel
  const exportToExcel = (jobInfo, jobApplications) => {
    if (!jobApplications || jobApplications.length === 0 || !jobInfo) return;
    
    const ws = XLSX.utils.aoa_to_sheet([]);
    XLSX.utils.sheet_add_aoa(ws, [['CareerVibe - Applicants Report']], { origin: 'A1' });
    ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 6 } }];
    
    const stats = {
      total: jobApplications.length,
      pending: jobApplications.filter((app) => app.status === "pending").length,
      reviewed: jobApplications.filter((app) => app.status === "reviewed").length,
      shortlisted: jobApplications.filter((app) => app.status === "shortlisted").length,
      rejected: jobApplications.filter((app) => app.status === "rejected").length,
    };
    
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
    
    XLSX.utils.sheet_add_aoa(ws, [
      ['Applicant Name', 'Email', 'Applied Date', 'Status', 'Skills', 'Cover Letter']
    ], { origin: 'A13' });
    
    const data = jobApplications.map(app => [
      app.job_seeker_id?.full_name || 'Unknown',
      app.job_seeker_id?.user_id?.email || 'No email',
      new Date(app.applied_at).toLocaleDateString(),
      app.status.charAt(0).toUpperCase() + app.status.slice(1),
      app.job_seeker_id?.skills?.join(', ') || 'N/A',
      app.cover_letter || 'No cover letter'
    ]);
    
    XLSX.utils.sheet_add_aoa(ws, data, { origin: 'A14' });
    ws['!cols'] = [
      { wch: 20 }, { wch: 30 }, { wch: 15 }, 
      { wch: 12 }, { wch: 40 }, { wch: 50 }
    ];
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Applicants');
    XLSX.writeFile(wb, `${jobInfo.title.replace(/[^a-zA-Z0-9]/g, '_')}_applicants.xlsx`);
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case "pending":
        return {
          bgColor: "bg-amber-50",
          textColor: "text-amber-700",
          borderColor: "border-amber-200",
          icon: <Clock className="w-3 h-3 mr-1" />,
        };
      case "reviewed":
        return {
          bgColor: "bg-blue-50",
          textColor: "text-blue-700",
          borderColor: "border-blue-200",
          icon: <Eye className="w-3 h-3 mr-1" />,
        };
      case "shortlisted":
        return {
          bgColor: "bg-emerald-50",
          textColor: "text-emerald-700",
          borderColor: "border-emerald-200",
          icon: <CheckCircle className="w-3 h-3 mr-1" />,
        };
      case "rejected":
        return {
          bgColor: "bg-red-50",
          textColor: "text-red-700",
          borderColor: "border-red-200",
          icon: <XCircle className="w-3 h-3 mr-1" />,
        };
      default:
        return {
          bgColor: "bg-gray-50",
          textColor: "text-gray-700",
          borderColor: "border-gray-200",
          icon: <Clock className="w-3 h-3 mr-1" />,
        };
    }
  };

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
            <p className="mt-4 text-gray-600 font-medium">Loading job applications...</p>
          </motion.div>
        </div>
      </div>
    );
  }

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
            <h2 className="text-xl font-bold text-gray-900 mb-2">Something Went Wrong</h2>
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

  const jobApplications = applications.filter(
    (app) => app.job_post_id?._id === id
  );
  
  const jobInfo = jobApplications[0]?.job_post_id;

  const stats = {
    total: jobApplications.length,
    pending: jobApplications.filter((app) => app.status === "pending").length,
    reviewed: jobApplications.filter((app) => app.status === "reviewed").length,
    shortlisted: jobApplications.filter((app) => app.status === "shortlisted").length,
    rejected: jobApplications.filter((app) => app.status === "rejected").length,
  };

  const filteredApplications = jobApplications.filter(app => 
    app.job_seeker_id?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.job_seeker_id?.user_id?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Job Listings
          </button>
          
          {jobInfo && (
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{jobInfo.title}</h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {jobInfo.location || "Remote"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {jobInfo.job_type?.replace("_", " ") || "Full-time"}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    ${jobInfo.salary?.toLocaleString() || "Competitive"}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    jobInfo.status === "active" 
                      ? "bg-emerald-100 text-emerald-700" 
                      : "bg-gray-100 text-gray-700"
                  }`}>
                    {jobInfo.status === "active" ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
        
        {/* Job Description */}
        {jobInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6"
          >
            <button 
              onClick={() => setShowDescription(!showDescription)}
              className="w-full flex justify-between items-center p-5 text-left hover:bg-gray-50 transition-colors"
            >
              <span className="text-base font-semibold text-gray-900">Job Description</span>
              <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${showDescription ? 'rotate-180' : ''}`} />
            </button>
            
            {showDescription && (
              <div className="p-5 pt-0 border-t border-gray-100">
                <p className="text-sm text-gray-600 mb-4">{jobInfo.description || "No description available"}</p>
                
                {jobInfo.skills?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold mb-2 text-gray-900">Required Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {jobInfo.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs flex items-center gap-1"
                        >
                          <Star className="w-3 h-3" />
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
        
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6"
        >
          {[
            { label: 'Total', value: stats.total, icon: Users, color: 'blue', trend: TrendingUp },
            { label: 'Pending', value: stats.pending, icon: Clock, color: 'amber', percent: (stats.pending / stats.total) * 100 },
            { label: 'Reviewed', value: stats.reviewed, icon: Eye, color: 'indigo', percent: (stats.reviewed / stats.total) * 100 },
            { label: 'Shortlisted', value: stats.shortlisted, icon: UserCheck, color: 'green', percent: (stats.shortlisted / stats.total) * 100 },
            { label: 'Rejected', value: stats.rejected, icon: XCircle, color: 'red', percent: (stats.rejected / stats.total) * 100 }
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-10 h-10 bg-gradient-to-br from-${stat.color}-100 to-${stat.color}-50 rounded-xl flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
                </div>
                {stat.trend ? (
                  <stat.trend className="w-4 h-4 text-green-500" />
                ) : (
                  stat.percent > 0 && (
                    <span className="text-xs text-gray-500">{stat.percent.toFixed(0)}%</span>
                  )
                )}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </motion.div>
        
        {/* Applicants Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Applicants ({filteredApplications.length})
            </h2>

            <div className="flex flex-wrap items-center gap-3">
              {jobApplications.length > 0 && (
                <>
                  <button
                    onClick={() => exportToExcel(jobInfo, jobApplications)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors text-sm font-medium"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </button>

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search applicants..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Applicant</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Applied Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">CV</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredApplications.map((app, index) => {
                    const statusInfo = getStatusInfo(app.status);
                    return (
                      <motion.tr
                        key={app._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.03 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center overflow-hidden">
                              {app.job_seeker_id?.avatar ? (
                                <img src={app.job_seeker_id.avatar} alt="avatar" className="w-full h-full object-cover" />
                              ) : (
                                <Users className="w-5 h-5 text-blue-600" />
                              )}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {app.job_seeker_id?.full_name || "Unknown Applicant"}
                              </div>
                              <div className="text-xs text-gray-500">
                                {app.job_seeker_id?.user_id?.email || "No email"}
                              </div>
                            </div>
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
                          <a
                            href={`${app.cv_url.replace(/\\/g, "/")}`}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors w-fit text-sm"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FileText className="w-4 h-4" /> View CV
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="relative">
                            <select
                              className={`appearance-none pl-7 pr-8 py-1.5 rounded-full text-xs font-medium border focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${statusInfo.bgColor} ${statusInfo.textColor} ${statusInfo.borderColor}`}
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
                              <option value="pending">Pending</option>
                              <option value="reviewed">Reviewed</option>
                              <option value="shortlisted">Shortlisted</option>
                              <option value="rejected">Rejected</option>
                            </select>
                            <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
                              {statusInfo.icon}
                            </div>
                            <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                              <ChevronDown className="w-3 h-3 text-current opacity-70" />
                            </div>
                            
                            {updateStatusLoading && app._id === updatingId && (
                              <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-full">
                                <div className="w-4 h-4 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            <button
                              onClick={() => navigate(`/admin/jobs/applicants/candidate-profile/${app?._id}`)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors text-sm"
                            >
                              <Eye className="w-4 h-4" />
                              Profile
                            </button>
                            <button
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm"
                            >
                              <Mail className="w-4 h-4" />
                              Contact
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {searchTerm ? "No matching applicants" : "No applicants yet"}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {searchTerm 
                  ? "No applicants match your search criteria" 
                  : "When job seekers apply to this position, they'll appear here."}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
