import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobseekerApplications } from "../../redux/jobseekerApplicationsSlice";
import ApplicationDetailModal from "./ApplicationDetailModal";
import { Navbar } from "../navbar";
import Footer from "./Footer";
import { 
  FileText, 
  Building, 
  Calendar, 
  Clock, 
  ChevronRight, 
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  Filter,
  Search,
  BarChart4
} from 'lucide-react';

const JobseekerApplications = () => {
  const dispatch = useDispatch();
  const { applications, loading, error } = useSelector((state) => state.jobseekerApplications);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const jobseekerId = user?.jobseeker?.id;
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (jobseekerId) {
      dispatch(fetchJobseekerApplications(jobseekerId));
    }
  }, [dispatch, jobseekerId]);

  const handleOpenDetail = (application) => {
    setSelectedApplication(application);
  };

  const handleCloseDetail = () => {
    setSelectedApplication(null);
  };

  // Filter applications by status and search term
  const filteredApplications = applications?.filter(app => {
    const matchesStatus = filterStatus === 'all' || app.status?.toLowerCase() === filterStatus;
    const matchesSearch = app.job?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.job?.company_id?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Generate status badge styles
  const getStatusBadgeStyle = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'reviewed':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'shortlisted':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'rejected':
        return 'bg-red-50 text-red-700 border border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  // Generate status icon
  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'reviewed':
        return <FileText className="w-4 h-4" />;
      case 'shortlisted':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return <ClockIcon className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold">Your Job Applications</h1>
          <p className="mt-2 text-blue-100 max-w-2xl">
            Track the status of your applications and stay updated on your job search journey
          </p>
        </div>
      </div>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Dashboard Content */}
        <div className="-mt-16 relative z-10">
          {loading ? (
            <div className="bg-white rounded-xl shadow-lg p-10 flex flex-col items-center justify-center">
              <div className="w-16 h-16 border-4 border-t-blue-500 border-r-blue-500 border-b-blue-300 border-l-blue-300 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500 font-medium">Loading your applications...</p>
            </div>
          ) : error ? (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="h-10 w-10 text-red-500" />
              </div>
              <h2 className="text-xl font-medium text-gray-800 mb-2">Oops! Something went wrong</h2>
              <p className="text-red-500 mb-6">
                {typeof error === 'object' ? error.message || 'An error occurred' : error}
              </p>
              <button 
                onClick={() => dispatch(fetchJobseekerApplications(jobseekerId))} 
                className="bg-red-50 text-red-700 px-5 py-2.5 rounded-lg hover:bg-red-100 transition font-medium"
              >
                Try Again
              </button>
            </div>
          ) : applications?.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-10 text-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="h-12 w-12 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">No Applications Yet</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                You haven't applied to any jobs yet. Start exploring opportunities and kickstart your career journey!
              </p>
              <a href="/jobs" className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition font-medium inline-flex items-center">
                Browse Jobs
                <ChevronRight className="ml-2 h-4 w-4" />
              </a>
            </div>
          ) : (
            <>
              {/* Application Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Applications</p>
                      <p className="text-3xl font-bold text-gray-800 mt-2">{applications.length}</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <FileText className="h-6 w-6 text-blue-500" />
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
                
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Pending</p>
                      <p className="text-3xl font-bold text-amber-500 mt-2">
                        {applications.filter(app => app.status === 'pending').length}
                      </p>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-lg">
                      <Clock className="h-6 w-6 text-amber-500" />
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-amber-500 h-1.5 rounded-full" 
                        style={{ width: `${(applications.filter(app => app.status === 'pending').length / applications.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Shortlisted</p>
                      <p className="text-3xl font-bold text-emerald-500 mt-2">
                        {applications.filter(app => app.status === 'shortlisted').length}
                      </p>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-emerald-500" />
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-emerald-500 h-1.5 rounded-full" 
                        style={{ width: `${(applications.filter(app => app.status === 'shortlisted').length / applications.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Rejected</p>
                      <p className="text-3xl font-bold text-red-500 mt-2">
                        {applications.filter(app => app.status === 'rejected').length}
                      </p>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg">
                      <XCircle className="h-6 w-6 text-red-500" />
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-red-500 h-1.5 rounded-full" 
                        style={{ width: `${(applications.filter(app => app.status === 'rejected').length / applications.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Filters and Search */}
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                      <Filter className="mr-2 h-5 w-5 text-gray-500" />
                      Filter by Status
                    </h2>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setFilterStatus('all')}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          filterStatus === 'all' 
                            ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                            : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                        }`}
                      >
                        All
                      </button>
                      <button 
                        onClick={() => setFilterStatus('pending')}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          filterStatus === 'pending' 
                            ? 'bg-amber-100 text-amber-700 border border-amber-200' 
                            : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                        }`}
                      >
                        Pending
                      </button>
                      <button 
                        onClick={() => setFilterStatus('shortlisted')}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          filterStatus === 'shortlisted' 
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                            : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                        }`}
                      >
                        Shortlisted
                      </button>
                      <button 
                        onClick={() => setFilterStatus('rejected')}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          filterStatus === 'rejected' 
                            ? 'bg-red-100 text-red-700 border border-red-200' 
                            : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                        }`}
                      >
                        Rejected
                      </button>
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by job title or company..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Recent Applications */}
              <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                <BarChart4 className="mr-2 h-5 w-5 text-blue-500" />
                Recent Applications
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {filteredApplications?.slice(0, 6).map((app) => (
                  <div 
                    key={app._id} 
                    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-gray-100" 
                    onClick={() => handleOpenDetail(app)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-100 text-blue-600">
                        <Building className="h-5 w-5" />
                      </div>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeStyle(app.status)}`}>
                        {getStatusIcon(app.status)}
                        {app.status?.charAt(0).toUpperCase() + app.status?.slice(1) || 'Unknown'}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1">{app.job?.title}</h3>
                    <p className="text-gray-600 mb-3 line-clamp-1">{app.job?.company_id?.name || "N/A"}</p>
                    
                    <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-gray-500 mt-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1.5 text-gray-400" />
                        Applied: {new Date(app.applied_at).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 mr-1.5 text-gray-400" />
                        {app.job?.job_type || "Full Time"}
                      </div>
                    </div>
                    
                    <div className="mt-5 pt-4 border-t border-gray-100 flex justify-end">
                      <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center">
                        View Details
                        <ExternalLink className="ml-1 h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* All Applications Table */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-800">All Applications</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied Date</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredApplications?.map((app) => (
                        <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{app.job?.title}</div>
                            <div className="text-xs text-gray-500">{app.job?.job_type || "Full Time"}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                                {app.job?.company_id?.logo ? (
                                  <img src={app.job.company_id.logo} alt="" className="h-8 w-8 rounded-full" />
                                ) : (
                                  <Building className="h-4 w-4 text-gray-500" />
                                )}
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">{app.job?.company_id?.name || "N/A"}</div>
                                <div className="text-xs text-gray-500">{app.job?.location || "Remote"}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{new Date(app.applied_at).toLocaleDateString()}</div>
                            <div className="text-xs text-gray-500">{new Date(app.applied_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeStyle(app.status)}`}>
                              {getStatusIcon(app.status)}
                              {app.status?.charAt(0).toUpperCase() + app.status?.slice(1) || 'Unknown'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenDetail(app);
                              }}
                              className="bg-blue-50 text-blue-700 py-1.5 px-4 rounded-lg hover:bg-blue-100 transition font-medium"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredApplications?.length === 0 && (
                  <div className="text-center py-10">
                    <p className="text-gray-500">No applications match your filters</p>
                    <button 
                      onClick={() => {setFilterStatus('all'); setSearchTerm('');}} 
                      className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Modal chi tiết */}
        {selectedApplication && (
          <ApplicationDetailModal application={selectedApplication} onClose={handleCloseDetail} />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default JobseekerApplications;