/**
 * ApplyForm - Refactored Version
 * 
 * Component form apply job
 * Đã được refactor để:
 * - Tách UI components riêng biệt vào thư mục apply-form/
 * - Sử dụng custom hooks (useApplyForm, useFileUpload, useJobData)
 * - Tách API calls vào service file (applicationService)
 * - Tối ưu performance với React.memo và useCallback
 * - Clean code, loại bỏ console.log và inline functions
 * - Tuân thủ React best practices
 */

import React, { useState, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Building2,
  MapPin as MapPinIcon,
  DollarSign,
  Clock,
  Briefcase
} from 'lucide-react';
import Navbar from '../navbar/Navbar';

// ========================================
// Custom Hooks
// ========================================
import useApplyForm from '@/hooks/useApplyForm';
import useFileUpload from '@/hooks/useFileUpload';
import useJobData from '@/hooks/useJobData';
import { useInterviewPreview } from '@/hooks/useInterview';

// ========================================
// Components
// ========================================
import {
  FormMessages,
  CVUploadSection,
  // PersonalInfoSection, // Removed as per new backend DTO
  CoverLetterSection,
  SubmitSection
} from '@/components/apply-form';
import { InterviewInvitationModal } from '@/components/interviews';

// ========================================
// Services
// ========================================
import { submitApplication } from '@/services/applicationService';

/**
 * Main ApplyForm Component
 */
export default function ApplyForm() {
  const params = useParams();
  const navigate = useNavigate();
  
  // ========================================
  // State Management
  // ========================================
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [interviewData, setInterviewData] = useState(null);
  const [applicationId, setApplicationId] = useState(null);
  
  // ========================================
  // Custom Hooks
  // ========================================
  const jobData = useJobData();
  
  const {
    input,
    coverLetter,
    remainingChars,
    handleInputChange,
    handleCoverLetterChange
  } = useApplyForm();
  
  const {
    cvFile,
    cvName,
    cvSize,
    cvProgress,
    handleFileChange,
    handleRemoveFile,
    formatFileSize
  } = useFileUpload(setError);

  // ========================================
  // Form Submission Handler
  // ========================================
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validate CV file
    if (!cvFile) {
      setError('Please upload your CV/Resume');
      return;
    }

    // Prepare application data (only job_post_id and cover_letter as per backend DTO)
    const applicationData = {
      coverLetter: coverLetter
    };

    try {
      setLoading(true);
      const response = await submitApplication(params.id, applicationData, cvFile);

      setSuccess(true);

      // Check if interview is required
      if (response.interview && response.interview.has_interview) {
        setInterviewData(response.interview);
        setApplicationId(response.data?.application_id);
        setShowInterviewModal(true);
      } else {
        // Redirect to applications page after 2 seconds if no interview
        setTimeout(() => {
          navigate('/jobseeker-applications');
        }, 2000);
      }
    } catch (err) {
      setError(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [cvFile, coverLetter, params.id, navigate]);

  // ========================================
  // Render
  // ========================================
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </button>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Apply for Position
          </h1>
          <p className="text-gray-600">
            {jobData?.title || 'Job Position'} at {jobData?.company?.name || 'Company'}
          </p>
        </div>

        {/* Application Form */}
        <div className="bg-white rounded-lg border border-gray-200">
          <form onSubmit={handleSubmit} className="p-8">
            {/* Success/Error Messages */}
            <FormMessages success={success} error={error} />

            {/* CV Upload Section */}
            <CVUploadSection 
              cvFile={cvFile}
              cvName={cvName}
              cvSize={cvSize}
              cvProgress={cvProgress}
              onFileChange={handleFileChange}
              onRemove={handleRemoveFile}
              formatFileSize={formatFileSize}
            />

            {/* Cover Letter */}
            <CoverLetterSection 
              value={coverLetter}
              remainingChars={remainingChars}
              onChange={handleCoverLetterChange}
            />

            {/* Submit Section */}
            <SubmitSection loading={loading} />
          </form>
        </div>
      </div>

      {/* Interview Invitation Modal */}
      <InterviewInvitationModal
        open={showInterviewModal}
        onOpenChange={setShowInterviewModal}
        interviewData={interviewData}
        onStartNow={async () => {
          try {
            // Accept interview
            const interviewService = (await import('@/services/interview.service')).default;
            const candidateInterview = await interviewService.acceptInterview(
              interviewData.interview_id,
              applicationId
            );
            
            // Navigate to interview session
            navigate(`/interview/${candidateInterview.candidate_interview_id}`);
          } catch (error) {
            console.error('Error accepting interview:', error);
            setError('Không thể bắt đầu interview');
          }
        }}
        onDoLater={() => {
          setShowInterviewModal(false);
          // Redirect to applications page
          navigate('/jobseeker-applications');
        }}
      />
    </div>
  );
}
