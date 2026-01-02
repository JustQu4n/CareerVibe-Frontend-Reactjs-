/**
 * ApplyModal Component
 * Modal popup for job application
 */

import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// Custom Hooks
import useApplyForm from '@/hooks/useApplyForm';
import useFileUpload from '@/hooks/useFileUpload';

// Components
import {
  FormMessages,
  CVUploadSection,
  CoverLetterSection,
  SubmitSection
} from '@/components/apply-form';
import { InterviewInvitationModal } from '@/components/interviews';

// Services
import { submitApplication } from '@/services/applicationService';

export default function ApplyModal({ open, onClose, jobId, jobTitle, companyName }) {
  const navigate = useNavigate();
  
  // State Management
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [interviewData, setInterviewData] = useState(null);
  const [applicationId, setApplicationId] = useState(null);
  
  // Custom Hooks
  const {
    coverLetter,
    remainingChars,
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

  // Form Submission Handler
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validate CV file
    if (!cvFile) {
      setError('Please upload your CV/Resume');
      return;
    }

    // Prepare application data
    const applicationData = {
      coverLetter: coverLetter
    };

    try {
      setLoading(true);
      const response = await submitApplication(jobId, applicationData, cvFile);

      setSuccess(true);

      // Check if interview is required
      if (response.interview && response.interview.has_interview) {
        setInterviewData(response.interview);
        setApplicationId(response.data?.application_id);
        setShowInterviewModal(true);
      } else {
        // Close modal and redirect after 2 seconds
        setTimeout(() => {
          onClose();
          navigate('/jobseeker-applications');
        }, 2000);
      }
    } catch (err) {
      setError(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [cvFile, coverLetter, jobId, navigate, onClose]);

  // Close handler
  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
            >
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full my-8">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Apply for Position</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {jobTitle} at {companyName}
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    disabled={loading}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Interview Invitation Modal */}
      <InterviewInvitationModal
        open={showInterviewModal}
        onOpenChange={setShowInterviewModal}
        interviewData={interviewData}
        onStartNow={async () => {
          try {
            const interviewService = (await import('@/services/interview.service')).default;
            const candidateInterview = await interviewService.acceptInterview(
              interviewData.interview_id,
              applicationId
            );
            navigate(`/interview/${candidateInterview.candidate_interview_id}`);
          } catch (error) {
            console.error('Error accepting interview:', error);
            setError('Không thể bắt đầu interview');
          }
        }}
        onDoLater={() => {
          setShowInterviewModal(false);
          onClose();
          navigate('/jobseeker-applications');
        }}
      />
    </>
  );
}
