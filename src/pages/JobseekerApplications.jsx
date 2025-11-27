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
import { BarChart4 } from 'lucide-react';

// Import UI Components
import {
  ApplicationsHero,
  LoadingState,
  ErrorState,
  EmptyState,
  ApplicationStats,
  ApplicationFilters,
  ApplicationCard,
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Navbar */}
      <Navbar />
      
      {/* Hero Section - Component đã được tách riêng */}
      <ApplicationsHero />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Dashboard Content */}
        <div className="-mt-16 relative z-10">
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
              {/* Application Stats - Component đã được tách riêng */}
              <ApplicationStats applications={applications} />
              
              {/* Filters and Search - Component đã được tách riêng */}
              <ApplicationFilters
                filterStatus={filterStatus}
                onFilterChange={handleFilterChange}
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
              />

              {/* Recent Applications - Hiển thị 6 applications gần nhất */}
              <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                <BarChart4 className="mr-2 h-5 w-5 text-blue-500" />
                Recent Applications
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {filteredApplications?.slice(0, 6).map((app, idx) => {
                  const appKey = app?._id || app?.id || app?.application_id || app?.applicationId || app?.uuid || idx;
                  return (
                    <ApplicationCard
                      key={appKey}
                      application={app}
                      onClick={() => handleOpenModal(app)}
                    />
                  );
                })}
              </div>

              {/* All Applications Table - Component đã được tách riêng */}
              <ApplicationsTable
                applications={filteredApplications}
                onViewDetails={handleOpenModal}
                onClearFilters={handleClearFilters}
              />
            </>
          )}
        </div>

        {/* Modal chi tiết - Hiển thị khi có application được chọn */}
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