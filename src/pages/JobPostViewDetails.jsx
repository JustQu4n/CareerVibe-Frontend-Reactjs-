import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import apiClient from '@/api/client';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/components_lite/Footer';
import JDSummaryModal from '@/components/components_lite/JDSummaryModal';
import { ApplyModal } from '@/components/apply-form';

// Import UI Components đã được tách riêng
import {
  LoadingState,
  ErrorState,
  EmptyState,
  JobHeroSection,
  JobBreadcrumb,
  JobTabs,
  SkillsList,
  ShareJobSection,
  JobActionButtons,
  JobOverview,
  CompanyInfo,
  RelatedJobs,
  FloatingJDSummaryButton,
} from '@/components/job-details';

// Import Custom Hooks để quản lý logic
import useJobDetails from '@/hooks/useJobDetails';
import useJobBookmark from '@/hooks/useJobBookmark';
import useJobDateInfo from '@/hooks/useJobDateInfo';

/**
 * Main Component
 */
export default function JobPostViewDetails() {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const jobId = params.id;

  // Redux selectors
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);

  // Local state for related jobs (fetched directly from jobseeker related endpoint)
  const [relatedJobs, setRelatedJobs] = React.useState([]);
  const [loadingRelated, setLoadingRelated] = React.useState(false);
  const [relatedError, setRelatedError] = React.useState(null);
  // Local state
  const [activeTab, setActiveTab] = useState('description');
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);

  // Custom hooks - Logic đã được tách ra để dễ maintain và test
  const { loading, error } = useJobDetails(jobId);
  const { bookmarked, toggleBookmark } = useJobBookmark(jobId, user);
  const { daysRemaining } = useJobDateInfo(singleJob?.expires_at);

  // Ensure page scrolls to top when viewing a job detail (fix focus under footer)
  useEffect(() => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    } catch (err) {
      // fallback for environments where window might be undefined
      if (typeof window !== 'undefined') window.scrollTo(0, 0);
    }
  }, [jobId]);

  // Fetch related jobs when component mounts
  useEffect(() => {
    let mounted = true;
    const fetchRelated = async () => {
      if (!jobId) return;
      setLoadingRelated(true);
      setRelatedError(null);
      try {
        const res = await apiClient.get(`/api/jobseeker/job-posts/${jobId}/related`, {
          params: { limit: 5 }
        });
        const data = res.data?.data || res.data || [];
        if (mounted) setRelatedJobs(Array.isArray(data) ? data : []);
      } catch (err) {
        if (mounted) setRelatedError(err.response?.data?.message || err.message || 'Failed to load related jobs');
      } finally {
        if (mounted) setLoadingRelated(false);
      }
    };

    fetchRelated();

    return () => { mounted = false; };
  }, [jobId]);

  // Handler: Open apply modal
  const handleApplyClick = useCallback(() => {
    setShowApplyModal(true);
  }, []);

  // Handler: Open JD Summary Modal
  const handleOpenSummary = useCallback(() => {
    setShowSummaryModal(true);
  }, []);

  // Handler: Close JD Summary Modal
  const handleCloseSummary = useCallback(() => {
    setShowSummaryModal(false);
  }, []);

  // Render states - Đã tách thành components riêng
  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!singleJob) return <EmptyState />;

  // Destructure job data
  const { title, description, requirements, skills = [] } = singleJob;

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      {/* Navbar - Sticky navigation */}
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <Navbar />
      </div>

      {/* Floating JD Summary Button */}
      <FloatingJDSummaryButton onClick={handleOpenSummary} />

      {/* JD Summary Modal */}
      {showSummaryModal && (
        <JDSummaryModal jdText={description} onClose={handleCloseSummary} />
      )}
      
      {/* Hero Section - Hiển thị thông tin chính của job */}
      <JobHeroSection job={singleJob} />

      {/* Breadcrumb Navigation */}
      <JobBreadcrumb />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column - Bên trái */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Tabs - Description, Responsibilities, Requirements, Benefits */}
            <JobTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              description={description}
              requirements={requirements}
            />

            {/* Skills List - Danh sách kỹ năng */}
            <SkillsList skills={skills} />

            {/* Share Section - Chia sẻ job */}
            <ShareJobSection jobTitle={title} jobId={jobId} />
          </div>

          {/* Sidebar Column - Bên phải */}
          <div className="space-y-6">
            {/* Action Buttons - Apply và Save */}
            <JobActionButtons
              onApply={handleApplyClick}
              onToggleBookmark={toggleBookmark}
              isBookmarked={bookmarked}
              daysRemaining={daysRemaining}
            />

            {/* Job Overview - Thông tin tổng quan */}
            <JobOverview job={singleJob} />

            {/* Company Information - Thông tin công ty */}
            <CompanyInfo company={singleJob.company} />
          </div>
        </div>
      </div>

      {/* Related Jobs Section - Jobs tương tự */}
      <RelatedJobs jobs={relatedJobs} loading={loadingRelated} />

      {/* Footer */}
      <Footer />

      {/* Apply Modal */}
      <ApplyModal
        open={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        jobId={jobId}
        jobTitle={singleJob?.title || ''}
        companyName={singleJob?.company?.name || ''}
      />
    </div>
  );
}
