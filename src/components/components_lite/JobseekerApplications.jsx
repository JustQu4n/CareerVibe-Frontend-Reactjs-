import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobseekerApplications } from '../../redux/jobseekerApplicationsSlice';
import ApplicationDetailModal from './ApplicationDetailModal';
import Navbar from './Navbar';
import Footer from './Footer';

const JobseekerApplications = () => {
  const dispatch = useDispatch();
  const { applications, loading, error } = useSelector((state) => state.jobseekerApplications);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const jobseekerId = user?.jobseeker?.id;
  console.log('Jobseeker ID:', jobseekerId);
  console.log('Applications:', applications);

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

  // Generate status badge styles
  const getStatusBadgeStyle = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'reviewed':
        return 'bg-blue-100 text-blue-700';
      case 'shortlisted':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Your Job Applications</h1>
          <p className="text-gray-600 mt-1">Track the status of your applications</p>
        </header>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
           <p className="text-red-500 font-medium">
            {typeof error === 'object' ? error.message || 'An error occurred' : error}
          </p>
            <button 
              onClick={() => dispatch(fetchJobseekerApplications(jobseekerId))} 
              className="mt-4 bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition"
            >
              Try Again
            </button>
          </div>
        ) : applications?.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-10 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-medium text-gray-800 mb-2">No Applications Yet</h2>
            <p className="text-gray-600 mb-6">You haven't applied to any jobs yet. Start exploring opportunities!</p>
            <a href="/jobs" className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition">
              Browse Jobs
            </a>
          </div>
        ) : (
          <>
            {/* Application Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-4">
                <p className="text-sm text-gray-500">Total Applications</p>
                <p className="text-2xl font-bold text-gray-800">{applications.length}</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4">
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {applications.filter(app => app.status === 'pending').length}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4">
                <p className="text-sm text-gray-500">Shortlisted</p>
                <p className="text-2xl font-bold text-green-600">
                  {applications.filter(app => app.status === 'shortlisted').length}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4">
                <p className="text-sm text-gray-500">Rejected</p>
                <p className="text-2xl font-bold text-red-600">
                  {applications.filter(app => app.status === 'rejected').length}
                </p>
              </div>
            </div>
            {/* Card List */}
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Applications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {applications.slice(0, 6).map((app) => (
                <div key={app._id} className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition cursor-pointer" onClick={() => handleOpenDetail(app)}>
                  <h2 className="text-xl font-semibold mb-2">{app.job?.title}</h2>
                  <p className="text-gray-600 mb-1">{app.job?.location}</p>
                  <p className="text-sm text-gray-500">Applied: {new Date(app.applied_at).toLocaleDateString()}</p>
                  <span className={`inline-block mt-3 px-3 py-1 rounded-full text-sm ${getStatusBadgeStyle(app.status)}`}>
                    {app.status?.charAt(0).toUpperCase() + app.status?.slice(1) || 'Unknown'}
                  </span>
                </div>
              ))}
            </div>

            {/* Table View */}
            <h2 className="text-xl font-semibold mb-4 text-gray-800">All Applications</h2>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-700 text-sm">
                      <th className="py-3 px-6 text-left font-medium">Job Title</th>
                      <th className="py-3 px-6 text-left font-medium">Company</th>
                      <th className="py-3 px-6 text-left font-medium">Applied Date</th>
                      <th className="py-3 px-6 text-left font-medium">Status</th>
                      <th className="py-3 px-6 text-center font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 text-sm">
                    {applications.map((app) => (
                      <tr key={app._id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                        <td className="py-3 px-6 text-left font-medium">{app.job?.title}</td>
                        <td className="py-3 px-6 text-left">{app.job?.company_id?.name || "N/A"}</td>
                        <td className="py-3 px-6 text-left">{new Date(app.applied_at).toLocaleDateString()}</td>
                        <td className="py-3 px-6 text-left">
                          <span className={`px-3 py-1 rounded-full text-xs ${getStatusBadgeStyle(app.status)}`}>
                            {app.status?.charAt(0).toUpperCase() + app.status?.slice(1) || 'Unknown'}
                          </span>
                        </td>
                        <td className="py-3 px-6 text-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDetail(app);
                            }}
                            className="bg-blue-500 text-white py-1 px-3 rounded-lg hover:bg-blue-600 transition text-xs"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

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