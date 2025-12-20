import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Linkedin, 
  Github,
  Briefcase, 
  GraduationCap, 
  Award,
  Code,
  FolderGit2,
  Calendar,
  Download,
  Share2,
  ArrowLeft,
  ExternalLink,
  CheckCircle
} from 'lucide-react';
import { toast } from 'react-toastify';
import apiClient from '@/api/client';
import { motion } from 'framer-motion';

const PublicProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPublicProfile = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/api/jobseeker/profile/${userId}`);
        const data = response.data?.data || null;
        console.log('Public Profile Data:', data);
        console.log('Projects:', data?.projects);
        setProfileData(data);
      } catch (err) {
        console.error('Error fetching public profile:', err);
        setError('Unable to load profile');
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchPublicProfile();
    }
  }, [userId]);

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: `${profileData?.user?.fullname || 'User'}'s Profile`,
        url: url
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Profile link copied to clipboard!');
    }
  };

  const handleDownload = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-100 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-6">This profile doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-semibold"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const { user, experiences = [], educations = [], projects = [], skills = [], bio } = profileData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Print-hidden action bar */}
      <div className="print:hidden sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors font-medium"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium text-sm"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium text-sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Download CV
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CV Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print:py-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden print:shadow-none print:rounded-none"
        >
          {/* Header Section */}
          <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-8 py-12 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
              </div>
            </div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 text-gray-900">
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/30 shadow-2xl bg-white">
                  {user?.avatar_url ? (
                    <img 
                      src={user.avatar_url} 
                      alt={user.full_name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-4xl font-bold">
                      {user?.full_name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl font-bold mb-2">{user?.full_name || 'User'}</h1>
                <p className="text-xl text-gray-900 mb-4">{user?.title || 'Professional'}</p>
                
                <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm">
                  {user?.email && (
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                      <Mail className="h-4 w-4" />
                      <span>{user.email}</span>
                    </div>
                  )}
                  {user?.phone && (
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                      <Phone className="h-4 w-4" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  {(user?.location || user?.address) && (
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                      <MapPin className="h-4 w-4" />
                      <span>{user.location || user.address}</span>
                    </div>
                  )}
                </div>
                
                {(user?.website_url || user?.linkedin_url || user?.github_url) && (
                  <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
                    {user?.website_url && (
                      <a 
                        href={user.website_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm hover:text-indigo-200 transition-colors"
                      >
                        <Globe className="h-4 w-4" />
                        <span>Website</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    {user?.linkedin_url && (
                      <a 
                        href={user.linkedin_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm hover:text-indigo-200 transition-colors"
                      >
                        <Linkedin className="h-4 w-4" />
                        <span>LinkedIn</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    {user?.github_url && (
                      <a 
                        href={user.github_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm hover:text-indigo-200 transition-colors"
                      >
                        <Github className="h-4 w-4" />
                        <span>GitHub</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="px-8 py-8">
            {/* About Section - Always show */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <div className="w-1 h-8 bg-gradient-to-b from-indigo-600 to-purple-600 mr-3 rounded-full"></div>
                About Me
              </h2>
              {(bio || user?.bio) ? (
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{bio || user.bio}</p>
              ) : (
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <p className="text-gray-500 text-center italic">No bio added yet</p>
                </div>
              )}
            </section>

            {/* Skills Section */}
            {skills.length > 0 && (
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <div className="w-1 h-8 bg-gradient-to-b from-indigo-600 to-purple-600 mr-3 rounded-full"></div>
                  <Code className="h-6 w-6 mr-2 text-indigo-600" />
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <div
                      key={index}
                      className="group px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl text-gray-800 font-medium text-sm hover:from-indigo-100 hover:to-purple-100 transition-all"
                    >
                      <CheckCircle className="h-3 w-3 text-indigo-600 inline mr-1.5" />
                      {skill.skill_name}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Experience Section */}
            {experiences.length > 0 && (
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-1 h-8 bg-gradient-to-b from-indigo-600 to-purple-600 mr-3 rounded-full"></div>
                  <Briefcase className="h-6 w-6 mr-2 text-indigo-600" />
                  Experience
                </h2>
                <div className="space-y-6">
                  {experiences.map((exp, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative pl-8 pb-6 border-l-2 border-indigo-200 last:border-l-0 last:pb-0"
                    >
                      <div className="absolute -left-2 top-0 w-4 h-4 bg-indigo-600 rounded-full border-4 border-white"></div>
                      
                      <div className="bg-gray-50 rounded-xl p-5 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{exp.title}</h3>
                            <p className="text-blue-600 font-semibold">{exp.company_name}</p>
                            <p className="text-sm text-gray-600">{exp.location}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600 mb-3">
                          <Calendar className="h-4 w-4 mr-2" />
                          {new Date(exp.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                          {' - '}
                          {exp.end_date ? new Date(exp.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'}
                        </div>
                        
                        {exp.description && (
                          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* Education Section */}
            {educations.length > 0 && (
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-1 h-8 bg-gradient-to-b from-indigo-600 to-purple-600 mr-3 rounded-full"></div>
                  <GraduationCap className="h-6 w-6 mr-2 text-indigo-600" />
                  Education
                </h2>
                <div className="space-y-6">
                  {educations.map((edu, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative pl-8 pb-6 border-l-2 border-purple-200 last:border-l-0 last:pb-0"
                    >
                      <div className="absolute -left-2 top-0 w-4 h-4 bg-purple-600 rounded-full border-4 border-white"></div>
                      
                      <div className="bg-gray-50 rounded-xl p-5 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{edu.school}</h3>
                            <p className="text-blue-600 font-semibold">{edu.degree}</p>
                          </div>
                          {edu.grade && (
                            <div className="text-right">
                              <p className="text-sm text-gray-600">GPA</p>
                              <p className="text-lg font-bold text-indigo-600">{edu.grade}</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600 mb-3">
                          <Calendar className="h-4 w-4 mr-2" />
                          {new Date(edu.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                          {' - '}
                          {edu.end_date ? new Date(edu.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'}
                        </div>
                        
                        {edu.field && (
                          <p className="text-gray-700">
                            <span className="font-medium">Field of Study:</span> {edu.field}
                          </p>
                        )}
                        
                        {edu.description && edu.description !== (edu.school || edu.institution) && (
                          <p className="text-gray-700 text-sm mt-2 italic">
                            {edu.description}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* Projects Section */}
            {projects && projects.length > 0 && (
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-1 h-8 bg-gradient-to-b from-indigo-600 to-purple-600 mr-3 rounded-full"></div>
                  <FolderGit2 className="h-6 w-6 mr-2 text-indigo-600" />
                  Projects ({projects.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {projects.map((project, index) => (
                    <motion.div
                      key={project.id || index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gradient-to-br from-gray-50 to-indigo-50 rounded-xl p-5 border border-indigo-100 hover:shadow-lg transition-all"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{project.title}</h3>
                      </div>
                      
                      {project.role && (
                        <p className="text-indigo-600 text-sm font-semibold mb-2">{project.role}</p>
                      )}
                      
                      {project.description && (
                        <p className="text-gray-700 text-sm mb-3 line-clamp-3">{project.description}</p>
                      )}
                      
                      {project.start_date && (
                        <div className="flex items-center text-xs text-gray-600 mb-3">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(project.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                          {project.end_date && (
                            <> {' - '} {new Date(project.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</>
                          )}
                        </div>
                      )}
                      
                      {(project.technologies || project.skills) && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {(project.technologies || project.skills).split(',').map((tech, i) => (
                            <span 
                              key={i}
                              className="px-2 py-1 bg-white text-indigo-700 text-xs font-medium rounded-md border border-indigo-200"
                            >
                              {tech.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                          View Project
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      )}
                    </motion.div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Footer */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 print:hidden">
            <p className="text-center text-sm text-gray-600">
              This profile is publicly accessible. Generated on {new Date().toLocaleDateString()}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PublicProfile;
