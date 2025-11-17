import React from 'react';
import { Building } from 'lucide-react';
import { getStatusBadgeStyle } from '@/utils/applicationHelpers';
import StatusIcon from './StatusIcon';

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
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">All Applications</h2>
        </div>
        <div className="text-center py-10">
          <p className="text-gray-500">No applications match your filters</p>
          <button 
            onClick={onClearFilters} 
            className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear filters
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-800">All Applications</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Job Title
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Applied Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {applications.map((app) => (
              <ApplicationRow 
                key={app.application_id} 
                application={app} 
                onViewDetails={onViewDetails}
              />
            ))}
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

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      {/* Job Title */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{jobPost?.title || 'N/A'}</div>
        <div className="text-xs text-gray-500">{jobPost?.employment_type || 'Full Time'}</div>
      </td>

      {/* Company */}
      <td className="px-6 py-4 whitespace-nowrap">
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
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {new Date(applied_at).toLocaleDateString()}
        </div>
        <div className="text-xs text-gray-500">
          {new Date(applied_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </div>
      </td>

      {/* Status */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeStyle(status)}`}>
          <StatusIcon status={status} className="w-4 h-4" />
          {status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown'}
        </span>
      </td>

      {/* Action */}
      <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
        <button
          onClick={handleViewDetails}
          className="bg-blue-50 text-blue-700 py-1.5 px-4 rounded-lg hover:bg-blue-100 transition font-medium"
        >
          View Details
        </button>
      </td>
    </tr>
  );
});

ApplicationRow.displayName = 'ApplicationRow';

export default React.memo(ApplicationsTable);
