import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Eye,
  FileText,
  Mail,
  ChevronLeft,
  Download,
  Filter,
  UserCheck,
  AlertCircle,
  TrendingUp,
  Briefcase,
  MapPin,
  Phone,
  Calendar,
  Award,
  GraduationCap,
  Code,
  MessageSquare,
  BarChart3
} from 'lucide-react';
import * as XLSX from "xlsx";
import axios from "axios";
import { APPLICATION_STATUS } from '../../../../constants/application.constants';

export default function JobPostApplications() {
  const { jobPostId } = useParams();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedApp, setSelectedApp] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, [jobPostId]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `http://localhost:5000/api/employer/application/job-posts/${jobPostId}/applications`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setApplications(response.data.data || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (applicationId, newStatus) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.patch(
        `http://localhost:5000/api/employer/application/applications/${applicationId}/status`,
        { status: newStatus },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      
      // Update local state
      setApplications(prev => 
        prev.map(app => 
          app.application_id === applicationId 
            ? { ...app, status: newStatus }
            : app
        )
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update application status");
    }
  };

  // Statistics
  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === APPLICATION_STATUS.PENDING).length,
    reviewed: applications.filter(app => app.status === APPLICATION_STATUS.REVIEWED).length,
    accepted: applications.filter(app => app.status === APPLICATION_STATUS.ACCEPTED).length,
    rejected: applications.filter(app => app.status === APPLICATION_STATUS.REJECTED).length,
  };

  // Get percentage for a status
  const getPercentage = (status) => {
    if (stats.total === 0) return 0;
    return (stats[status] / stats.total) * 100;
  };

  // Filter applications
  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.jobSeeker?.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.jobSeeker?.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || app.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Export to Excel
  const exportToExcel = () => {
    if (applications.length === 0) return;
    
    const ws = XLSX.utils.aoa_to_sheet([]);
    XLSX.utils.sheet_add_aoa(ws, [['CareerVibe - Job Applications Report']], { origin: 'A1' });
    ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 6 } }];
    
    XLSX.utils.sheet_add_aoa(ws, [
      [],
      [`Total Applications: ${applications.length}`],
      [`Pending: ${stats.pending}`],
      [`Reviewed: ${stats.reviewed}`],
      [`Shortlisted: ${stats.shortlisted}`],
      [`Rejected: ${stats.rejected}`],
      [],
      ['Applicant Name', 'Email', 'Phone', 'Applied Date', 'Status', 'Cover Letter']
    ], { origin: 'A2' });
    
    const data = applications.map(app => [
      app.jobSeeker?.user?.full_name || 'Unknown',
      app.jobSeeker?.user?.email || 'No email',
      app.jobSeeker?.user?.phone || 'N/A',
      new Date(app.applied_at).toLocaleDateString(),
      app.status.charAt(0).toUpperCase() + app.status.slice(1),
      app.cover_letter || app.coverLetter || 'N/A'
    ]);
    
    XLSX.utils.sheet_add_aoa(ws, data, { origin: 'A10' });
    ws['!cols'] = [
      { wch: 25 }, { wch: 30 }, { wch: 15 }, 
      { wch: 15 }, { wch: 12 }, { wch: 60 }
    ];
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Applications');
    XLSX.writeFile(wb, `job_applications_${jobPostId}.xlsx`);
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case APPLICATION_STATUS.PENDING:
        return {
          color: "amber",
          icon: Clock,
          label: "Pending Review"
        };
      case APPLICATION_STATUS.REVIEWED:
        return {
          color: "blue",
          icon: Eye,
          label: "Reviewed"
        };
      case APPLICATION_STATUS.ACCEPTED:
        return {
          color: "green",
          icon: CheckCircle,
          label: "Accepted"
        };
      case APPLICATION_STATUS.REJECTED:
        return {
          color: "red",
          icon: XCircle,
          label: "Rejected"
        };
      default:
        return {
          color: "gray",
          icon: Clock,
          label: status
        };
    }
  };

  // Get status badge style
  const getStatusStyle = (status) => {
    switch (status) {
      case APPLICATION_STATUS.PENDING:
        return {
          bgColor: "bg-amber-50",
          textColor: "text-amber-700",
          borderColor: "border-amber-200",
          icon: <Clock className="mr-1 w-3 h-3" />,
        };
      case APPLICATION_STATUS.REVIEWED:
        return {
          bgColor: "bg-blue-50",
          textColor: "text-blue-700",
          borderColor: "border-blue-200",
          icon: <Eye className="mr-1 w-3 h-3" />,
        };
      case APPLICATION_STATUS.ACCEPTED:
        return {
          bgColor: "bg-emerald-50",
          textColor: "text-emerald-700",
          borderColor: "border-emerald-200",
          icon: <CheckCircle className="mr-1 w-3 h-3" />,
        };
      case APPLICATION_STATUS.REJECTED:
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
            <h2 className="text-xl font-bold text-gray-900 mb-2">Failed to Load Applications</h2>
            <p className="text-sm text-red-600 mb-6">{error}</p>
            <button
              onClick={fetchApplications}
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
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors group"
          >
            <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Jobs</span>
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Job Applications</h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage and review applications for this position
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

            {/* Accepted Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-50 rounded-xl flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-green-600" />
                </div>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-green-600 mb-1">{stats.accepted}</h3>
              <p className="text-sm text-gray-600">Accepted</p>
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
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6"
        >
          <div className="flex flex-col lg:flex-row justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 text-sm rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            
            <div className="flex flex-wrap gap-3 items-center">
              {/* Status Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="pl-10 pr-8 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white cursor-pointer text-sm font-medium"
                  >
                    <option value="all">All Status</option>
                    <option value={APPLICATION_STATUS.PENDING}>Pending</option>
                    <option value={APPLICATION_STATUS.REVIEWED}>Reviewed</option>
                    <option value={APPLICATION_STATUS.ACCEPTED}>Accepted</option>
                    <option value={APPLICATION_STATUS.REJECTED}>Rejected</option>
                  </select>
              </div>

              {/* Export Button */}
              {applications.length > 0 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={exportToExcel}
                  className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all text-sm font-semibold"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Excel</span>
                </motion.button>
              )}
            </div>
          </div>
          
          {/* Results Count */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              Showing <span className="font-bold text-gray-900">{filteredApplications.length}</span> of{' '}
              <span className="font-bold text-gray-900">{applications.length}</span> applications
            </p>
          </div>
        </motion.div>
        
        {/* Applications List */}
        {filteredApplications.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            {filteredApplications.map((app, index) => {
              const statusInfo = getStatusInfo(app.status);
              const StatusIcon = statusInfo.icon;
              
              return (
                <motion.div
                  key={app.application_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Applicant Info */}
                      <div className="flex-1">
                        <div className="flex items-start gap-4 mb-4">
                          {/* Avatar */}
                          <div className="relative">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
                              {app.jobSeeker?.avatar_url || app.jobSeeker?.user?.avatar_url ? (
                                <img 
                                  src={app.jobSeeker?.avatar_url}
                                  alt="avatar" 
                                  className="w-full h-full object-cover" 
                                />
                              ) : (
                                <Users className="w-8 h-8 text-blue-600" />
                              )}
                            </div>
                            <div className={`absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-${statusInfo.color}-500 to-${statusInfo.color}-600 rounded-full flex items-center justify-center border-2 border-white`}>
                              <StatusIcon className="w-3 h-3 text-white" />
                            </div>
                          </div>
                          
                          {/* Name and Contact */}
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              {app.jobSeeker?.user?.full_name || "Unknown Applicant"}
                            </h3>
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Mail className="w-4 h-4 text-gray-400" />
                                <span>{app.jobSeeker?.user?.email || "No email"}</span>
                              </div>
                              {app.jobSeeker?.user?.phone && (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Phone className="w-4 h-4 text-gray-400" />
                                  <span>{app.jobSeeker.user.phone}</span>
                                </div>
                              )}
                              {app.jobSeeker?.user?.address && (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <MapPin className="w-4 h-4 text-gray-400" />
                                  <span className="line-clamp-1">{app.jobSeeker.user.address}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Cover Letter (replaces About) */}
                        { (app.cover_letter || app.coverLetter) && (
                          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                            <div className="flex items-center gap-2 mb-2">
                              <MessageSquare className="w-4 h-4 text-blue-600" />
                              <span className="text-sm font-semibold text-gray-700">Cover Letter</span>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-3">{app.cover_letter || app.coverLetter}</p>
                          </div>
                        )}
                      </div>
                      
                      {/* Actions Sidebar */}
                      <div className="lg:w-64 space-y-4">
                        {/* Status */}
                        <div>
                          <label className="text-xs font-semibold text-gray-600 mb-2 block">
                            Application Status
                          </label>
                          <select
                            value={app.status}
                            onChange={(e) => updateStatus(app.application_id, e.target.value)}
                            className={`w-full px-4 py-2.5 rounded-xl border-2 font-medium text-sm focus:outline-none focus:ring-2 transition-all bg-${statusInfo.color}-50 text-${statusInfo.color}-700 border-${statusInfo.color}-200 focus:ring-${statusInfo.color}-500`}
                          >
                            <option value={APPLICATION_STATUS.PENDING}>Pending Review</option>
                            <option value={APPLICATION_STATUS.REVIEWED}>Reviewed</option>
                            <option value={APPLICATION_STATUS.ACCEPTED}>Accepted</option>
                            <option value={APPLICATION_STATUS.REJECTED}>Rejected</option>
                          </select>
                        </div>
                        
                        {/* Applied Date */}
                        <div className="bg-gray-50 rounded-xl p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="text-xs font-semibold text-gray-600">Applied Date</span>
                          </div>
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(app.applied_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {new Date(app.applied_at).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="space-y-2">
                          {(app.resume_url || app.jobSeeker?.resume_url) && (
                            <a
                              href={app.resume_url || app.jobSeeker.resume_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all text-sm font-semibold"
                            >
                              <FileText className="w-4 h-4" />
                              View Resume
                            </a>
                          )}
                          
                          <button
                            onClick={() => {
                              // Navigate to candidate profile page using user id
                              navigate(`/admin/jobs/applicants/candidate-profile/${app.jobSeeker.user_id || app.user.user_id}`);
                            }}
                            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:border-gray-300 hover:shadow-md transition-all text-sm font-semibold"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>
                          
                          <a
                            href={`mailto:${app.jobSeeker?.user?.email}`}
                            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all text-sm font-semibold"
                          >
                            <Mail className="w-4 h-4" />
                            Contact
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center"
          >
            <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                <Users className="w-12 h-12 text-gray-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {searchTerm || filterStatus !== "all" 
                    ? "No Applications Found" 
                    : "No Applications Yet"}
                </h3>
                <p className="text-gray-600">
                  {searchTerm || filterStatus !== "all" 
                    ? "No applications match your current filters. Try adjusting your search criteria."
                    : "When job seekers apply to this position, they'll appear here."}
                </p>
              </div>
              {(searchTerm || filterStatus !== "all") && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilterStatus("all");
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
