/**
 * JobseekerApplications - Refactored Version
 * 
 * Component hiển thị danh sách applications của jobseeker
 * Đã được refactor để:
 * - Tách UI components riêng biệt vào thư mục applications/
 * - Sử dụng custom hooks (useApplicationFilters, useApplicationModal)
 * - Tách helper functions vào utils/applicationHelpers.js
 * - Tách API calls vào services/applicationService.js
 * - Tối ưu performance với React.memo và useCallback
 * - Clean code, loại bỏ inline functions và code duplicate
 */

import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobseekerApplications } from '@/redux/jobseekerApplicationsSlice';
import ApplicationDetailModal from '@/components/components_lite/ApplicationDetailModal';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/components_lite/Footer';

// Import UI Components
import {
  LoadingState,
  ErrorState,
  EmptyState,
  ApplicationStats,
  ApplicationFilters,
  ApplicationsTable,
} from '@/components/applications';

// Import Custom Hooks
import useApplicationFilters from '@/hooks/useApplicationFilters';
import useApplicationModal from '@/hooks/useApplicationModal';

/**
 * Main Component
 */
const JobseekerApplications = () => {
  const dispatch = useDispatch();
  const { applications, loading, error } = useSelector((state) => state.jobseekerApplications);
  const { user } = useSelector((state) => state.auth);
  // Use job_seeker_id instead of user_id
  const jobseekerId = user?.job_seeker_id;

  // Custom hooks - Logic đã được tách ra
  const {
    filterStatus,
    searchTerm,
    filteredApplications,
    handleFilterChange,
    handleSearchChange,
    handleClearFilters,
  } = useApplicationFilters(applications);

  const {
    selectedApplication,
    handleOpenModal,
    handleCloseModal,
  } = useApplicationModal();

  // Fetch applications khi component mount
  useEffect(() => {
    if (jobseekerId) {
      dispatch(fetchJobseekerApplications(jobseekerId));
    }
  }, [dispatch, jobseekerId]);

  // Handler: Retry fetch applications - sử dụng useCallback
  const handleRetry = useCallback(() => {
    if (jobseekerId) {
      dispatch(fetchJobseekerApplications(jobseekerId));
    }
  }, [dispatch, jobseekerId]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-900">My Applications</h1>
        </div>

        {/* Dashboard Content */}
        <div>
          {/* Loading State */}
          {loading ? (
            <LoadingState />
          ) : error ? (
            /* Error State */
            <ErrorState error={error} onRetry={handleRetry} />
          ) : applications?.length === 0 ? (
            /* Empty State */
            <EmptyState />
          ) : (
            <>
              {/* Application Stats */}
              <ApplicationStats applications={applications} />
              
              {/* Filters and Search */}
              <ApplicationFilters
                filterStatus={filterStatus}
                onFilterChange={handleFilterChange}
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
              />

              {/* All Applications Table */}
              <ApplicationsTable
                applications={filteredApplications}
                onViewDetails={handleOpenModal}
                onClearFilters={handleClearFilters}
              />
            </>
          )}
        </div>

        {/* Modal chi tiết */}
        {selectedApplication && (
          <ApplicationDetailModal 
            application={selectedApplication} 
            onClose={handleCloseModal} 
          />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default JobseekerApplications;