import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchApplicationDetails } from "../../../redux/applicationSlice";
import { Navbar } from "../../navbar";
import Footer from "../Footer";
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
  Heart,
  User,
  Flag,
  Users,
  Github,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  ChevronLeft,
  Eye,
  Star
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

  // Loading state with improved animation
  if (detailLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 border-4 border-t-blue-600 border-r-blue-600 border-b-blue-300 border-l-blue-300 rounded-full animate-spin mb-4 mx-auto"></div>
            <p className="text-gray-600 font-medium">Loading candidate profile...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state with improved design
  if (detailError) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center p-8 bg-white rounded-xl shadow-lg border border-red-100 max-w-md">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="h-10 w-10 text-red-500" />
            </div>
            <h2 className="text-xl font-medium text-gray-800 mb-2">Something Went Wrong</h2>
            <p className="text-red-600 mb-6">{detailError}</p>
            <button 
              onClick={() => dispatch(fetchApplicationDetails(applicationId))}
              className="px-6 py-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // If no data yet
  if (!applicationDetail) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="h-10 w-10 text-blue-500" />
            </div>
            <h2 className="text-xl font-medium text-gray-800 mb-2">No Profile Data</h2>
            <p className="text-gray-600 mb-6">No candidate information is currently available</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Extract candidate information
  const { job_seeker_id, job_post_id, cover_letter, cv_url, status } = applicationDetail;
  
  // Generate skills array if available
  const skills = job_seeker_id?.skills || [];
  
  // Generate status badge style
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <Navbar />
      </div>
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-8">
        <div className="container mx-auto px-4">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ChevronLeft className="mr-2" />
            Back to Applications
          </button>
          
          <h1 className="text-3xl font-bold mb-2">Candidate Profile</h1>
          <p className="text-blue-100">
            Reviewing application for <span className="font-medium">{job_post_id?.title || "Unknown Position"}</span>
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-6">
        {/* Profile Header - Elevated Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 -mt-12 relative z-10 border border-gray-100">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-100">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md">
                  <img 
                    src={job_seeker_id?.avatar || "https://via.placeholder.com/150"} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className={`absolute -bottom-1 -right-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge()}`}>
                  {status?.charAt(0).toUpperCase() + status?.slice(1) || "Unknown"}
                </div>
              </div>
              
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-800">
                  {job_seeker_id?.full_name || "Candidate Name"}
                </h2>
                <p className="text-gray-600 mb-2">
                  {job_seeker_id?.title || "Candidate Title"}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {job_seeker_id?.experience && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                      <Briefcase className="mr-1 w-3 h-3" />
                      {job_seeker_id?.experience} Years
                    </span>
                  )}
                  {job_seeker_id?.education && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
                      <GraduationCap className="mr-1 w-3 h-3" />
                      {job_seeker_id?.education}
                    </span>
                  )}
                  {job_seeker_id?.location && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                      <MapPin className="mr-1 w-3 h-3" />
                      {job_seeker_id?.location}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2 flex-col sm:flex-row">
                <a 
                  href={`mailto:${job_seeker_id?.user_id?.email}`}
                  className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg transition-colors shadow-sm font-medium"
                >
                  <Mail className="w-4 h-4" /> 
                  Contact
                </a>
                <button className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-lg transition-colors shadow-sm font-medium">
                  <UserPlus className="w-4 h-4" /> 
                  Shortlist
                </button>
              </div>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="px-6 pt-2 border-b border-gray-100">
            <nav className="flex overflow-x-auto hide-scrollbar gap-4">
              <button 
                onClick={() => setActiveSection('profile')} 
                className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeSection === 'profile' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Profile Overview
              </button>
              <button 
                onClick={() => setActiveSection('coverletter')} 
                className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeSection === 'coverletter' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Cover Letter
              </button>
              <button 
                onClick={() => setActiveSection('resume')} 
                className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeSection === 'resume' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Resume
              </button>
              <button 
                onClick={() => setActiveSection('skills')} 
                className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeSection === 'skills' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Skills & Experience
              </button>
            </nav>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-8">
            {activeSection === 'profile' && (
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <User className="mr-2 text-blue-500 h-5 w-5" />
                  Biography
                </h3>
                <div className="prose prose-blue max-w-none">
                  <p className="text-gray-600 leading-relaxed">
                    {job_seeker_id?.bio || "No biography provided by the candidate."}
                  </p>
                </div>
              </div>
            )}
            
            {activeSection === 'coverletter' && (
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FileText className="mr-2 text-blue-500 h-5 w-5" />
                  Cover Letter
                </h3>
                <div className="prose prose-blue max-w-none">
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {cover_letter || "No cover letter provided by the candidate."}
                  </p>
                </div>
              </div>
            )}
            
            {activeSection === 'resume' && (
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FileText className="mr-2 text-blue-500 h-5 w-5" />
                  Resume Preview
                </h3>
                
                <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border border-gray-200 mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-800 mb-2">Resume Document</h4>
                  <p className="text-gray-500 text-center mb-4">
                    View or download the candidate's complete resume
                  </p>
                  <div className="flex gap-3">
                    <a
                      href={`${cv_url?.replace(/\\/g, "/")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition-colors font-medium flex items-center"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Resume
                    </a>
                    <a
                      href={`${cv_url?.replace(/\\/g, "/")}`}
                      download
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-5 py-2.5 rounded-lg transition-colors font-medium flex items-center"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </a>
                  </div>
                </div>
              </div>
            )}
            
            {activeSection === 'skills' && (
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Star className="mr-2 text-blue-500 h-5 w-5" />
                  Skills & Expertise
                </h3>
                
                <div className="flex flex-wrap gap-2 mb-8">
                  {skills.length > 0 ? skills.map((skill, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100"
                    >
                      <Star className="mr-1.5 h-3.5 w-3.5" />
                      {skill}
                    </span>
                  )) : (
                    <p className="text-gray-500">No skills listed by the candidate.</p>
                  )}
                </div>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Briefcase className="mr-2 text-blue-500 h-5 w-5" />
                  Work Experience
                </h3>
                
                {job_seeker_id?.experience_details?.length > 0 ? (
                  <div className="space-y-6">
                    {job_seeker_id.experience_details.map((exp, index) => (
                      <div key={index} className="relative pl-6 border-l-2 border-gray-200 pb-6">
                        <div className="absolute -left-2.5 top-0 w-5 h-5 rounded-full bg-blue-100 border-2 border-blue-500"></div>
                        <h4 className="text-lg font-medium text-gray-800">{exp.position}</h4>
                        <p className="text-blue-600">{exp.company}</p>
                        <p className="text-sm text-gray-500">{exp.start_date} - {exp.end_date || 'Present'}</p>
                        <p className="mt-2 text-gray-600">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No work experience details available.</p>
                )}
              </div>
            )}
          </div>
          
          {/* Sidebar - Right Side */}
          <div className="space-y-8">
            {/* Candidate Info Card */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
                Personal Information
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-blue-50 p-2 rounded-lg mr-3">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date of Birth</p>
                    <p className="font-medium text-gray-800">
                      {job_seeker_id?.date_of_birth ? new Date(job_seeker_id?.date_of_birth).toLocaleDateString() : 'Not specified'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-50 p-2 rounded-lg mr-3">
                    <Flag className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Nationality</p>
                    <p className="font-medium text-gray-800">
                      {job_seeker_id?.nationality || 'Not specified'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-50 p-2 rounded-lg mr-3">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium text-gray-800">
                      {job_seeker_id?.location || 'Not specified'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-50 p-2 rounded-lg mr-3">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Marital Status</p>
                    <p className="font-medium text-gray-800">
                      {job_seeker_id?.marital_status || 'Not specified'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-50 p-2 rounded-lg mr-3">
                    <Phone className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-800">
                      {job_seeker_id?.phone || 'Not provided'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-50 p-2 rounded-lg mr-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-800">
                      {job_seeker_id?.user_id?.email || 'Not provided'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Resume Download Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
                <h3 className="text-lg font-semibold text-white">Resume/CV</h3>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg mb-4">
                  <FileText className="text-blue-600 h-10 w-10" />
                  <div className="mx-3 flex-1 truncate">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      Candidate Resume
                    </p>
                    <p className="text-xs text-gray-500">PDF Document</p>
                  </div>
                  <a
                    href={`${cv_url?.replace(/\\/g, "/")}`}
                    download
                    className="flex items-center justify-center p-2 bg-blue-100 rounded-full text-blue-700 hover:bg-blue-200 transition-colors"
                  >
                    <Download className="h-5 w-5" />
                  </a>
                </div>
                
                <a
                  href={`${cv_url?.replace(/\\/g, "/")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg transition-colors shadow-sm font-medium"
                >
                  <Eye className="h-4 w-4" />
                  View Full Resume
                </a>
              </div>
            </div>
            
            {/* Social Media Links */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Social Profiles
              </h3>
              
              <div className="grid grid-cols-3 gap-3">
                {job_seeker_id?.linkedin ? (
                  <a 
                    href={job_seeker_id.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-3 bg-blue-50 rounded-lg text-blue-700 hover:bg-blue-100 transition-colors"
                  >
                    <Linkedin className="h-6 w-6 mb-1" />
                    <span className="text-xs">LinkedIn</span>
                  </a>
                ) : (
                  <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg text-gray-400">
                    <Linkedin className="h-6 w-6 mb-1" />
                    <span className="text-xs">LinkedIn</span>
                  </div>
                )}
                
                {job_seeker_id?.github ? (
                  <a 
                    href={job_seeker_id.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-3 bg-gray-800 rounded-lg text-white hover:bg-gray-900 transition-colors"
                  >
                    <Github className="h-6 w-6 mb-1" />
                    <span className="text-xs">GitHub</span>
                  </a>
                ) : (
                  <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg text-gray-400">
                    <Github className="h-6 w-6 mb-1" />
                    <span className="text-xs">GitHub</span>
                  </div>
                )}
                
                {job_seeker_id?.twitter ? (
                  <a 
                    href={job_seeker_id.twitter} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-3 bg-blue-400 rounded-lg text-white hover:bg-blue-500 transition-colors"
                  >
                    <Twitter className="h-6 w-6 mb-1" />
                    <span className="text-xs">Twitter</span>
                  </a>
                ) : (
                  <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg text-gray-400">
                    <Twitter className="h-6 w-6 mb-1" />
                    <span className="text-xs">Twitter</span>
                  </div>
                )}
                
                {job_seeker_id?.facebook ? (
                  <a 
                    href={job_seeker_id.facebook} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-3 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition-colors"
                  >
                    <Facebook className="h-6 w-6 mb-1" />
                    <span className="text-xs">Facebook</span>
                  </a>
                ) : (
                  <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg text-gray-400">
                    <Facebook className="h-6 w-6 mb-1" />
                    <span className="text-xs">Facebook</span>
                  </div>
                )}
                
                {job_seeker_id?.instagram ? (
                  <a 
                    href={job_seeker_id.instagram} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-3 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg text-white hover:from-pink-600 hover:to-purple-700 transition-colors"
                  >
                    <Instagram className="h-6 w-6 mb-1" />
                    <span className="text-xs">Instagram</span>
                  </a>
                ) : (
                  <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg text-gray-400">
                    <Instagram className="h-6 w-6 mb-1" />
                    <span className="text-xs">Instagram</span>
                  </div>
                )}
                
                {job_seeker_id?.website ? (
                  <a 
                    href={job_seeker_id.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-3 bg-green-50 rounded-lg text-green-700 hover:bg-green-100 transition-colors"
                  >
                    <Globe className="h-6 w-6 mb-1" />
                    <span className="text-xs">Website</span>
                  </a>
                ) : (
                  <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg text-gray-400">
                    <Globe className="h-6 w-6 mb-1" />
                    <span className="text-xs">Website</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CandidateProfile;