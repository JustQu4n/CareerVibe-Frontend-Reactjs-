import React from 'react';
import { Building } from 'lucide-react';

/**
 * ApplicationsTable Component
 * Bảng hiển thị tất cả applications
 * 
 * @param {Object} props
 * @param {Array} props.applications - Danh sách applications
 * @param {Function} props.onViewDetails - View details handler
 * @param {Function} props.onClearFilters - Clear filters handler
 */
const ApplicationsTable = ({ applications = [], onViewDetails, onClearFilters }) => {
  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Applications</h2>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-500 text-sm">No applications match your filters</p>
          <button 
            onClick={onClearFilters} 
            className="mt-3 text-gray-900 hover:text-gray-700 font-medium text-sm"
          >
            Clear filters
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">All Applications</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                Job Title
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                Company
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                Applied Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                Status
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {applications.map((app, idx) => {
              const rowKey = app?.application_id || app?._id || app?.id || app?.applicationId || idx;
              return (
                <ApplicationRow
                  key={rowKey}
                  application={app}
                  onViewDetails={onViewDetails}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/**
 * ApplicationRow - Individual table row
 */
const ApplicationRow = React.memo(({ application, onViewDetails }) => {
  // New API structure: application.jobPost instead of application.job
  const { jobPost, status, applied_at } = application;

  const handleViewDetails = (e) => {
    e.stopPropagation();
    onViewDetails(application);
  };

  // Status badge colors
  const getStatusStyle = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case 'pending':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'reviewed':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'shortlisted':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'rejected':
        return 'bg-red-50 text-red-700 border border-red-200';
      case 'accepted':
        return 'bg-green-50 text-green-700 border border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
      {/* Job Title */}
      <td className="px-4 py-3">
        <div className="text-sm font-medium text-gray-900">{jobPost?.title || 'N/A'}</div>
        <div className="text-xs text-gray-500">{jobPost?.employment_type || 'Full Time'}</div>
      </td>

      {/* Company */}
      <td className="px-4 py-3">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
            {jobPost?.company?.logo_url ? (
              <img src={jobPost.company.logo_url} alt="" className="h-8 w-8 rounded-full object-cover" />
            ) : (
              <Building className="h-4 w-4 text-gray-500" />
            )}
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">
              {jobPost?.company?.name || 'N/A'}
            </div>
            <div className="text-xs text-gray-500">{jobPost?.location || 'Remote'}</div>
          </div>
        </div>
      </td>

      {/* Applied Date */}
      <td className="px-4 py-3">
        <div className="text-sm text-gray-900">
          {new Date(applied_at).toLocaleDateString()}
        </div>
        <div className="text-xs text-gray-500">
          {new Date(applied_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </div>
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${getStatusStyle(status)}`}>
          {status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown'}
        </span>
      </td>

      {/* Action */}
      <td className="px-4 py-3 text-center text-sm">
        <button
          onClick={handleViewDetails}
          className="bg-gray-900 text-white py-1.5 px-4 rounded hover:bg-gray-800 transition text-xs font-medium"
        >
          View Details
        </button>
      </td>
    </tr>
  );
});

ApplicationRow.displayName = 'ApplicationRow';

export default React.memo(ApplicationsTable);
