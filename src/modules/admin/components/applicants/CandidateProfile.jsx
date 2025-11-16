import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchApplicationDetails } from "@/redux/applicationSlice";
import { motion } from 'framer-motion';
import { 
  Mail, 
  UserPlus, 
  Download, 
  Calendar, 
  MapPin, 
  Phone, 
  Globe, 
  Briefcase, 
  GraduationCap,
  FileText,
  User,
  Flag,
  Users,
  Github,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  ChevronLeft,
  Eye,
  Star,
  AlertCircle
} from 'lucide-react';

const CandidateProfile = () => {
  const { applicationId } = useParams();
  const dispatch = useDispatch();
  const [activeSection, setActiveSection] = useState('profile');
  const { 
    applicationDetail, 
    detailLoading, 
    detailError 
  } = useSelector((state) => state.applications);

  useEffect(() => {
    if (applicationId) {
      dispatch(fetchApplicationDetails(applicationId));
    }
  }, [applicationId, dispatch]);

  // Loading state
  if (detailLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="flex items-center justify-center min-h-[70vh]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-16 h-16 border-4 border-t-blue-600 border-r-blue-600 border-b-blue-200 border-l-blue-200 rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading candidate profile...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  // Error state
  if (detailError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="flex items-center justify-center min-h-[70vh]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-red-100 p-8 text-center max-w-lg"
          >
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Something Went Wrong</h2>
            <p className="text-sm text-red-600 mb-6">{detailError}</p>
            <button 
              onClick={() => dispatch(fetchApplicationDetails(applicationId))}
              className="px-6 py-2.5 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-colors font-medium"
            >
              Try Again
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // No data
  if (!applicationDetail) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="text-center bg-white rounded-2xl shadow-sm p-8 max-w-md">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-blue-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Profile Data</h2>
            <p className="text-sm text-gray-600">No candidate information is currently available</p>
          </div>
        </div>
      </div>
    );
  }

  const { job_seeker_id, job_post_id, cover_letter, cv_url, status } = applicationDetail;
  const skills = job_seeker_id?.skills || [];
  
  const getStatusBadge = () => {
    switch(status?.toLowerCase()) {
      case 'pending':
        return "bg-amber-50 text-amber-700 border-amber-200";
      case 'reviewed':
        return "bg-blue-50 text-blue-700 border-blue-200";
      case 'shortlisted':
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case 'rejected':
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <button 
            onClick={() => window.history.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Applications
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Candidate Profile</h1>
              <p className="text-sm text-gray-600">
                Application for <span className="font-medium">{job_post_id?.title || "Unknown Position"}</span>
              </p>
            </div>
          </div>
        </motion.div>
        
        {/* Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6"
        >
          <div className="p-6 pb-4 bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md">
                  <img 
                    src={job_seeker_id?.avatar || "https://via.placeholder.com/150"} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className={`absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge()}`}>
                  {status?.charAt(0).toUpperCase() + status?.slice(1) || "Unknown"}
                </div>
              </div>
              
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">
                  {job_seeker_id?.full_name || "Candidate Name"}
                </h2>
                <p className="text-sm text-gray-600 mb-2">
                  {job_seeker_id?.title || "Candidate Title"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {job_seeker_id?.experience && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                      <Briefcase className="mr-1 w-3 h-3" />
                      {job_seeker_id?.experience} Years
                    </span>
                  )}
                  {job_seeker_id?.education && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
                      <GraduationCap className="mr-1 w-3 h-3" />
                      {job_seeker_id?.education}
                    </span>
                  )}
                  {job_seeker_id?.location && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                      <MapPin className="mr-1 w-3 h-3" />
                      {job_seeker_id?.location}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                <a 
                  href={`mailto:${job_seeker_id?.user_id?.email}`}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors text-sm font-medium"
                >
                  <Mail className="w-4 h-4" /> 
                  Contact
                </a>
                <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition-colors text-sm font-medium">
                  <UserPlus className="w-4 h-4" /> 
                  Shortlist
                </button>
              </div>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="px-6 pt-2 border-b border-gray-100">
            <nav className="flex overflow-x-auto hide-scrollbar gap-4">
              {['profile', 'coverletter', 'resume', 'skills'].map((section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeSection === section
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {section === 'profile' && 'Profile Overview'}
                  {section === 'coverletter' && 'Cover Letter'}
                  {section === 'resume' && 'Resume'}
                  {section === 'skills' && 'Skills & Experience'}
                </button>
              ))}
            </nav>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {activeSection === 'profile' && (
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Biography
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {job_seeker_id?.bio || "No biography provided by the candidate."}
                </p>
              </div>
            )}
            
            {activeSection === 'coverletter' && (
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Cover Letter
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                  {cover_letter || "No cover letter provided by the candidate."}
                </p>
              </div>
            )}
            
            {activeSection === 'resume' && (
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Resume Preview
                </h3>
                
                <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-xl border border-gray-200 mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <FileText className="w-8 h-8 text-blue-600" />
                  </div>
                  <h4 className="text-base font-medium text-gray-900 mb-2">Resume Document</h4>
                  <p className="text-sm text-gray-500 text-center mb-4">
                    View or download the candidate's complete resume
                  </p>
                  <div className="flex gap-3">
                    <a
                      href={`${cv_url?.replace(/\\/g, "/")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors text-sm font-medium flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View Resume
                    </a>
                    <a
                      href={`${cv_url?.replace(/\\/g, "/")}`}
                      download
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-xl transition-colors text-sm font-medium flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </a>
                  </div>
                </div>
              </div>
            )}
            
            {activeSection === 'skills' && (
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-blue-600" />
                  Skills & Expertise
                </h3>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {skills.length > 0 ? skills.map((skill, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100"
                    >
                      <Star className="mr-1.5 w-3.5 h-3.5" />
                      {skill}
                    </span>
                  )) : (
                    <p className="text-sm text-gray-500">No skills listed by the candidate.</p>
                  )}
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  Work Experience
                </h3>
                
                {job_seeker_id?.experience_details?.length > 0 ? (
                  <div className="space-y-6">
                    {job_seeker_id.experience_details.map((exp, index) => (
                      <div key={index} className="relative pl-6 border-l-2 border-gray-200 pb-6">
                        <div className="absolute -left-2.5 top-0 w-5 h-5 rounded-full bg-blue-100 border-2 border-blue-500"></div>
                        <h4 className="text-base font-medium text-gray-900">{exp.position}</h4>
                        <p className="text-sm text-blue-600">{exp.company}</p>
                        <p className="text-xs text-gray-500">{exp.start_date} - {exp.end_date || 'Present'}</p>
                        <p className="mt-2 text-sm text-gray-600">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No work experience details available.</p>
                )}
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Personal Info */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                Personal Information
              </h3>
              
              <div className="space-y-4">
                {[
                  { icon: Calendar, label: 'Date of Birth', value: job_seeker_id?.date_of_birth ? new Date(job_seeker_id?.date_of_birth).toLocaleDateString() : 'Not specified' },
                  { icon: Flag, label: 'Nationality', value: job_seeker_id?.nationality || 'Not specified' },
                  { icon: MapPin, label: 'Location', value: job_seeker_id?.location || 'Not specified' },
                  { icon: Users, label: 'Marital Status', value: job_seeker_id?.marital_status || 'Not specified' },
                  { icon: Phone, label: 'Phone', value: job_seeker_id?.phone || 'Not provided' },
                  { icon: Mail, label: 'Email', value: job_seeker_id?.user_id?.email || 'Not provided' }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="bg-blue-50 p-2 rounded-lg">
                      <item.icon className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{item.label}</p>
                      <p className="text-sm font-medium text-gray-900">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Resume Card */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
                <h3 className="text-base font-semibold text-white">Resume/CV</h3>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl mb-4">
                  <FileText className="text-blue-600 w-10 h-10" />
                  <div className="mx-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">Candidate Resume</p>
                    <p className="text-xs text-gray-500">PDF Document</p>
                  </div>
                  <a
                    href={`${cv_url?.replace(/\\/g, "/")}`}
                    download
                    className="p-2 bg-blue-100 rounded-full text-blue-700 hover:bg-blue-200 transition-colors"
                  >
                    <Download className="w-5 h-5" />
                  </a>
                </div>
                
                <a
                  href={`${cv_url?.replace(/\\/g, "/")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors text-sm font-medium"
                >
                  <Eye className="w-4 h-4" />
                  View Full Resume
                </a>
              </div>
            </div>
            
            {/* Social Media */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Social Profiles</h3>
              
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Linkedin, name: 'LinkedIn', url: job_seeker_id?.linkedin, color: 'bg-blue-50 text-blue-700 hover:bg-blue-100' },
                  { icon: Github, name: 'GitHub', url: job_seeker_id?.github, color: 'bg-gray-800 text-white hover:bg-gray-900' },
                  { icon: Twitter, name: 'Twitter', url: job_seeker_id?.twitter, color: 'bg-blue-400 text-white hover:bg-blue-500' },
                  { icon: Facebook, name: 'Facebook', url: job_seeker_id?.facebook, color: 'bg-blue-600 text-white hover:bg-blue-700' },
                  { icon: Instagram, name: 'Instagram', url: job_seeker_id?.instagram, color: 'bg-gradient-to-br from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700' },
                  { icon: Globe, name: 'Website', url: job_seeker_id?.website, color: 'bg-green-50 text-green-700 hover:bg-green-100' }
                ].map((social, index) => (
                  social.url ? (
                    <a 
                      key={index}
                      href={social.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`flex flex-col items-center justify-center p-3 rounded-lg transition-colors ${social.color}`}
                    >
                      <social.icon className="w-6 h-6 mb-1" />
                      <span className="text-xs">{social.name}</span>
                    </a>
                  ) : (
                    <div key={index} className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg text-gray-400">
                      <social.icon className="w-6 h-6 mb-1" />
                      <span className="text-xs">{social.name}</span>
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
