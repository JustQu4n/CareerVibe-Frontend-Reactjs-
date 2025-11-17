// src/components/ApplicationDetailModal.jsx
import React from 'react';
import { 
  X, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Calendar, 
  FileText, 
  Download,
  CheckCircle,
  Clock,
  XCircle,
  Building2,
  Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ApplicationDetailModal = ({ application, onClose }) => {
  if (!application) return null;
  
  // New API structure: application.jobPost instead of application.job
  const { jobPost, cover_letter, resume_url, applied_at, status } = application;

  // Status configuration with modern design
  const statusConfig = {
    pending: {
      icon: <Clock className="w-4 h-4" />,
      bgColor: 'bg-gradient-to-r from-amber-50 to-orange-50',
      textColor: 'text-amber-700',
      borderColor: 'border-amber-200',
      label: 'Pending Review'
    },
    reviewed: {
      icon: <FileText className="w-4 h-4" />,
      bgColor: 'bg-gradient-to-r from-blue-50 to-indigo-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200',
      label: 'Under Review'
    },
    shortlisted: {
      icon: <CheckCircle className="w-4 h-4" />,
      bgColor: 'bg-gradient-to-r from-emerald-50 to-green-50',
      textColor: 'text-emerald-700',
      borderColor: 'border-emerald-200',
      label: 'Shortlisted'
    },
    rejected: {
      icon: <XCircle className="w-4 h-4" />,
      bgColor: 'bg-gradient-to-r from-red-50 to-rose-50',
      textColor: 'text-red-700',
      borderColor: 'border-red-200',
      label: 'Not Selected'
    }
  };

  const currentStatus = statusConfig[status?.toLowerCase()] || statusConfig.pending;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header Section */}
          <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-8 text-white">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-all duration-200 group"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
            </button>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl">
                <Building2 className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-2">{jobPost?.title || 'Job Title'}</h2>
                <p className="text-blue-100 text-lg">{jobPost?.company?.name || 'Company Name'}</p>
                <div className="mt-4 flex items-center gap-2">
                  <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border-2 ${currentStatus.bgColor} ${currentStatus.textColor} ${currentStatus.borderColor}`}>
                    {currentStatus.icon}
                    {currentStatus.label}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
            {/* Job Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <InfoCard 
                icon={<MapPin className="w-5 h-5 text-blue-600" />}
                label="Location"
                value={jobPost?.location || 'Not specified'}
              />
              <InfoCard 
                icon={<Briefcase className="w-5 h-5 text-purple-600" />}
                label="Employment Type"
                value={jobPost?.employment_type || 'Not specified'}
              />
              <InfoCard 
                icon={<DollarSign className="w-5 h-5 text-green-600" />}
                label="Salary"
                value={jobPost?.salary_range || 'Negotiable'}
              />
              <InfoCard 
                icon={<Calendar className="w-5 h-5 text-orange-600" />}
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
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-1 h-5 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
                  Job Requirements
                </h3>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {jobPost.requirements}
                  </p>
                </div>
              </div>
            )}

            {/* Cover Letter Section */}
            {cover_letter && (
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-1 h-5 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full"></div>
                  Cover Letter
                </h3>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {cover_letter}
                  </p>
                </div>
              </div>
            )}

            {/* Actions Section */}
            <div className="flex flex-col sm:flex-row gap-4">
              {resume_url && (
                <a
                  href={resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 group relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    View Resume
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>
              )}
              <button
                onClick={onClose}
                className="flex-1 bg-gray-100 text-gray-700 py-4 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Mail className="w-5 h-5" />
                Contact Recruiter
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
  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 border border-gray-200 hover:shadow-lg transition-all duration-300 group">
    <div className="flex items-start gap-3">
      <div className="p-2 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-500 font-medium mb-1">{label}</p>
        <p className="text-gray-900 font-semibold">{value}</p>
      </div>
    </div>
  </div>
);

export default ApplicationDetailModal;
