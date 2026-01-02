// src/components/ApplicationDetailModal.jsx
import React from 'react';
import { 
  X, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Calendar, 
  FileText,
  Building2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ApplicationDetailModal = ({ application, onClose }) => {
  if (!application) return null;
  
  // New API structure: application.jobPost instead of application.job
  const { jobPost, cover_letter, resume_url, applied_at, status } = application;

  // Status configuration with simple design
  const statusConfig = {
    pending: {
      label: 'Pending Review'
    },
    reviewed: {
      label: 'Under Review'
    },
    shortlisted: {
      label: 'Shortlisted'
    },
    rejected: {
      label: 'Not Selected'
    }
  };

  const currentStatus = statusConfig[status?.toLowerCase()] || statusConfig.pending;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header Section */}
          <div className="relative bg-gray-900 p-6 text-white border-b border-gray-800">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-800 rounded transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-800 rounded">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-1">{jobPost?.title || 'Job Title'}</h2>
                <p className="text-gray-300 text-sm">{jobPost?.company?.name || 'Company Name'}</p>
                <div className="mt-3">
                  <span className="inline-flex items-center px-3 py-1 rounded text-xs font-medium bg-gray-800 text-white border border-gray-700">
                    {currentStatus.label}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {/* Job Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              <InfoCard 
                icon={<MapPin className="w-4 h-4 text-gray-600" />}
                label="Location"
                value={jobPost?.location || 'Not specified'}
              />
              <InfoCard 
                icon={<Briefcase className="w-4 h-4 text-gray-600" />}
                label="Employment Type"
                value={jobPost?.employment_type || 'Not specified'}
              />
              <InfoCard 
                icon={<DollarSign className="w-4 h-4 text-gray-600" />}
                label="Salary"
                value={jobPost?.salary_range || 'Negotiable'}
              />
              <InfoCard 
                icon={<Calendar className="w-4 h-4 text-gray-600" />}
                label="Applied On"
                value={new Date(applied_at).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              />
            </div>

            {/* Requirements Section */}
            {jobPost?.requirements && (
              <div className="mb-6">
                <h3 className="text-base font-semibold text-gray-900 mb-2">
                  Job Requirements
                </h3>
                <div className="bg-gray-50 rounded p-4 border border-gray-200">
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                    {jobPost.requirements}
                  </p>
                </div>
              </div>
            )}

            {/* Cover Letter Section */}
            {cover_letter && (
              <div className="mb-6">
                <h3 className="text-base font-semibold text-gray-900 mb-2">
                  Cover Letter
                </h3>
                <div className="bg-gray-50 rounded p-4 border border-gray-200">
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                    {cover_letter}
                  </p>
                </div>
              </div>
            )}

            {/* Actions Section */}
            <div className="flex flex-col sm:flex-row gap-3">
              {resume_url && (
                <a
                  href={resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-gray-900 text-white py-2.5 px-4 rounded font-medium hover:bg-gray-800 transition flex items-center justify-center gap-2 text-sm"
                >
                  <FileText className="w-4 h-4" />
                  View Resume
                </a>
              )}
              <button
                onClick={onClose}
                className="flex-1 bg-gray-100 text-gray-700 py-2.5 px-4 rounded font-medium hover:bg-gray-200 transition flex items-center justify-center gap-2 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// InfoCard Component for displaying job details
const InfoCard = ({ icon, label, value }) => (
  <div className="bg-gray-50 rounded p-3 border border-gray-200">
    <div className="flex items-start gap-2">
      <div className="p-1.5 bg-white rounded border border-gray-200">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-xs text-gray-600 mb-0.5">{label}</p>
        <p className="text-sm text-gray-900 font-medium">{value}</p>
      </div>
    </div>
  </div>
);

export default ApplicationDetailModal;
