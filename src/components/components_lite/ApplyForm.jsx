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

// ========================================
// Components
// ========================================
import {
  FormMessages,
  CVUploadSection,
  PersonalInfoSection,
  CoverLetterSection,
  SubmitSection
} from '@/components/apply-form';

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
    removeCvFile
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
    
    // Prepare application data
    const applicationData = {
      fullname: input.fullname,
      phone: input.phone,
      location: input.location,
      coverLetter: coverLetter
    };
    
    try {
      setLoading(true);
      await submitApplication(params.id, applicationData, cvFile);
      
      setSuccess(true);
      
      // Redirect to applications page after 2 seconds
      setTimeout(() => {
        navigate('/jobseeker-applications');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [cvFile, input, coverLetter, params.id, navigate]);

  // ========================================
  // Render
  // ========================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Apply for Position
          </h1>
          <p className="text-gray-600">
            Complete the form below to submit your application
          </p>
        </motion.div>

        {/* Job Info Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 border border-gray-100"
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <h2 className="text-2xl font-bold text-white">
              {jobData?.title || 'Job Position'}
            </h2>
            <p className="text-blue-100 flex items-center mt-1">
              <Building2 className="h-4 w-4 mr-1" />
              {jobData?.company?.name || 'Company Name'}
            </p>
          </div>
          <div className="px-6 py-4 flex flex-wrap gap-4">
            {jobData?.location && (
              <div className="flex items-center text-gray-600">
                <MapPinIcon className="h-4 w-4 mr-1.5 text-blue-600" />
                {jobData.location}
              </div>
            )}
            {jobData?.salary && (
              <div className="flex items-center text-gray-600">
                <DollarSign className="h-4 w-4 mr-1.5 text-green-600" />
                {jobData.salary}
              </div>
            )}
            {jobData?.jobType && (
              <div className="flex items-center text-gray-600">
                <Clock className="h-4 w-4 mr-1.5 text-amber-600" />
                {jobData.jobType}
              </div>
            )}
            {jobData?.experienceLevel !== undefined && (
              <div className="flex items-center text-gray-600">
                <Briefcase className="h-4 w-4 mr-1.5 text-purple-600" />
                {jobData.experienceLevel} years exp
              </div>
            )}
          </div>
        </motion.div>

        {/* Application Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
        >
          <form onSubmit={handleSubmit} className="px-8 py-8">
            {/* Success/Error Messages */}
            <FormMessages success={success} error={error} />

            {/* CV Upload Section */}
            <CVUploadSection 
              cvFile={cvFile}
              cvName={cvName}
              cvSize={cvSize}
              cvProgress={cvProgress}
              onFileChange={handleFileChange}
              onRemove={removeCvFile}
            />

            {/* Personal Information */}
            <PersonalInfoSection 
              input={input}
              onChange={handleInputChange}
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
        </motion.div>

        {/* Additional Information */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-100">
          <h4 className="text-lg font-semibold text-gray-800 mb-2">
            What happens next?
          </h4>
          <ol className="space-y-3 mt-3">
            <li className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-200 flex items-center justify-center mr-3 mt-0.5 text-sm font-bold text-blue-800">
                1
              </div>
              <div className="text-gray-700">
                <strong>Application Review</strong>
                <p className="text-sm text-gray-600">
                  Our team will review your application and CV
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-200 flex items-center justify-center mr-3 mt-0.5 text-sm font-bold text-blue-800">
                2
              </div>
              <div className="text-gray-700">
                <strong>Initial Screening</strong>
                <p className="text-sm text-gray-600">
                  Qualified candidates will be contacted for a screening call
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-200 flex items-center justify-center mr-3 mt-0.5 text-sm font-bold text-blue-800">
                3
              </div>
              <div className="text-gray-700">
                <strong>Interview Process</strong>
                <p className="text-sm text-gray-600">
                  Selected candidates will proceed to the interview stage
                </p>
              </div>
            </li>
          </ol>
          <p className="text-sm text-gray-600 mt-4">
            The hiring process typically takes 2-3 weeks. You can check your application status
            in your <Link to="/jobseeker-applications" className="text-blue-600 hover:text-blue-800 font-medium">Applications Dashboard</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
