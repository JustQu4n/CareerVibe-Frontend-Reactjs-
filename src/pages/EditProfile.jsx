import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import apiClient from "@/api/client";
import { API_ENDPOINTS } from "@/config/api.config";
import { toast } from "react-toastify";
import { 
  Loader2, 
  ArrowLeft, 
  Upload,
  Save,
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Link as LinkIcon
} from "lucide-react";

const EditProfile = () => {
  const navigate = useNavigate();
  const { user: authUser } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(true);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  const [formData, setFormData] = useState({
    resume_url: "",
    skills: "",
    bio: "",
    experience: "",
    education: "",
  });

  // Fetch current profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!authUser?.id) {
        setFetchingProfile(false);
        return;
      }

      try {
        // GET /api/jobseeker/profile/:user_id (using user_id from auth)
        const response = await apiClient.get(API_ENDPOINTS.USER.JOBSEEKER_PROFILE(authUser.id));
        
        if (response.data?.data) {
          const profileData = response.data.data;
          setFormData({
            resume_url: profileData.resume_url || "",
            skills: profileData.skills || "",
            bio: profileData.user?.bio || "",
            experience: profileData.experience || "",
            education: profileData.education || "",
          });
          setPreviewUrl(profileData.avatar_url || profileData.user?.avatar_url);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile data');
      } finally {
        setFetchingProfile(false);
      }
    };

    fetchProfile();
  }, [authUser?.id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!authUser?.id) {
      toast.error("User not authenticated");
      return;
    }

    try {
      setLoading(true);
      
      // Prepare data according to UpdateJobSeekerDto
      const updateData = {
        resume_url: formData.resume_url || undefined,
        skills: formData.skills || undefined,
        bio: formData.bio || undefined,
        experience: formData.experience || undefined,
        education: formData.education || undefined,
      };

      // Remove undefined fields
      Object.keys(updateData).forEach(key => 
        updateData[key] === undefined && delete updateData[key]
      );

      // PUT /api/jobseeker/profile/:user_id (using user_id, not job_seeker_id)
      const response = await apiClient.put(
        `${API_ENDPOINTS.USER.JOBSEEKER_PROFILE(authUser.id)}`,
        updateData
      );
      
      // Check if response is successful (status 200-299)
      if (response.status >= 200 && response.status < 300) {
        toast.success("Profile updated successfully! Redirecting...");
        setTimeout(() => {
          navigate('/profile');
        }, 1500);
      } else {
        toast.error("Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update profile. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (fetchingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <Navbar />
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading profile data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/profile')}
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </Button>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
            <p className="text-gray-600 mt-2">Update your professional information</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Bio Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">About You</h2>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-sm font-medium text-gray-700">
                Bio <span className="text-gray-400">(Optional)</span>
              </Label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Tell employers about yourself, your career goals, and what makes you unique..."
              />
              <p className="text-sm text-gray-500">A compelling bio helps employers understand your background and aspirations</p>
            </div>
          </div>

          {/* Skills Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Skills</h2>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="skills" className="text-sm font-medium text-gray-700">
                Skills <span className="text-gray-400">(Comma-separated)</span>
              </Label>
              <input
                type="text"
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="e.g., React, NodeJS, Docker, SQL, MongoDB, AWS, Python, JavaScript"
              />
              <p className="text-sm text-gray-500">List your technical and professional skills separated by commas</p>
            </div>
          </div>

          {/* Resume URL Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <LinkIcon className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Resume</h2>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="resume_url" className="text-sm font-medium text-gray-700">
                Resume URL <span className="text-gray-400">(Optional)</span>
              </Label>
              <input
                type="url"
                id="resume_url"
                name="resume_url"
                value={formData.resume_url}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="https://drive.google.com/your-resume"
                maxLength={2048}
              />
              <p className="text-sm text-gray-500">Provide a link to your online resume (Google Drive, Dropbox, etc.)</p>
            </div>
          </div>

          {/* Experience Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-orange-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Experience</h2>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="experience" className="text-sm font-medium text-gray-700">
                Work Experience <span className="text-gray-400">(Optional)</span>
              </Label>
              <textarea
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Describe your work experience, including job titles, companies, and key achievements..."
              />
              <p className="text-sm text-gray-500">Detail your professional experience and accomplishments</p>
            </div>
          </div>

          {/* Education Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-indigo-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Education</h2>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="education" className="text-sm font-medium text-gray-700">
                Educational Background <span className="text-gray-400">(Optional)</span>
              </Label>
              <textarea
                id="education"
                name="education"
                value={formData.education}
                onChange={handleInputChange}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="List your degrees, certifications, and educational achievements..."
              />
              <p className="text-sm text-gray-500">Include your degrees, institutions, and relevant coursework</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end bg-white rounded-xl shadow-sm p-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/profile')}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
