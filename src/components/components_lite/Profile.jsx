import React, { useState, useEffect } from "react";
import { Navbar } from "../navbar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useGetAppliedJobs from "@/hooks/useGetAllAppliedJobs";
import JobseekerApplications from "@/pages/JobseekerApplications";
import apiClient from "@/api/client";
import { API_ENDPOINTS } from "@/config/api.config";
import { toast } from "react-toastify";
import { 
  Calendar, 
  MapPin, 
  Mail, 
  Phone, 
  FileText, 
  Edit, 
  Github, 
  Linkedin, 
  Twitter, 
  Instagram,
  Facebook,
  Loader2
} from "lucide-react";

const Profile = () => {
  useGetAppliedJobs();
  const navigate = useNavigate();
  const { user: authUser } = useSelector((store) => store.auth);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Fetch profile data from API
  useEffect(() => {
    const fetchProfile = async () => {
      if (!authUser?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // GET /api/jobseeker/profile/:user_id (using user_id from auth)
        const response = await apiClient.get(API_ENDPOINTS.USER.JOBSEEKER_PROFILE(authUser.id));
        
        if (response.data?.data) {
          // Merge user data with job_seeker data
          const userData = response.data.data;
          const mergedData = {
            ...userData.user,
            job_seeker_id: userData.job_seeker_id,
            resume_url: userData.resume_url,
            avatar_url: userData.avatar_url || userData.user.avatar_url,
            skills: userData.skills,
            bio: userData.bio || userData.user?.bio,
            experience: userData.experience,
            education: userData.education,
          };
          setProfileData(mergedData);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [authUser?.id]);

  const user = profileData;
  
  // Hàm xử lý và parse skills từ dữ liệu người dùng
  const parseSkills = () => {
    if (!user?.skills) return [];

    try {
      if (typeof user.skills === "string") {
        // Kiểm tra nếu là comma-separated string: "React, NodeJS, Docker"
        if (user.skills.includes(',') && !user.skills.includes('[')) {
          return user.skills.split(',').map(skill => skill.trim()).filter(Boolean);
        }
        // Kiểm tra nếu là JSON array string: "['React', 'NodeJS']"
        else if (user.skills.includes('[')) {
          const jsonString = user.skills.replace(/'/g, '"');
          return JSON.parse(jsonString);
        }
        // Single skill
        return [user.skills.trim()];
      }
      // Nếu skills đã là mảng
      else if (Array.isArray(user.skills)) {
        return user.skills;
      }
      return [];
    } catch (error) {
      console.error("Error parsing skills:", error);
      return [];
    }
  };

  const skills = parseSkills();

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <Navbar />
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  // No profile data
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <Navbar />
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="text-center bg-white rounded-2xl shadow-lg p-8 max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
            <p className="text-gray-600">Unable to load profile data. Please try logging in again.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Profile Header with Cover */}
        <div className="relative mb-8">
          <div className="h-48 sm:h-64 w-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl"></div>
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 sm:left-10 sm:translate-x-0">
            <div className="relative">
              <img
                src={user?.avatar_url || "https://via.placeholder.com/150"}
                alt="Avatar"
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
              />
              <div className="absolute bottom-0 right-0">
                <button 
                  onClick={() => navigate('/profile/edit')}
                  className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-md"
                >
                  <Edit size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-16">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
              <div className="flex flex-col items-center text-center mb-6 pt-4">
                <h1 className="text-2xl font-bold text-gray-800">
                  {user?.full_name || "Chưa cập nhật"}
                </h1>
                <p className="text-blue-600 font-medium mt-1">
                  Job Seeker
                </p>
                
                <div className="flex items-center gap-2 mt-2 text-gray-500 text-sm">
                  <MapPin size={14} />
                  <span>{user?.address || "Location not updated"}</span>
                </div>
              </div>

              <div className="flex justify-center gap-4 mb-6">
                <Button 
                  variant="default" 
                  className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
                  onClick={() => window.open(user?.resume_url || "#", "_blank")}
                  disabled={!user?.resume_url}
                >
                  <FileText size={16} />
                  Xem CV
                </Button>
                <Button 
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  onClick={() => navigate('/profile/edit')}
                >
                  <Edit size={16} />
                  Sửa
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800 border-b pb-2">
                    Contact Information
                  </h3>
                  
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center text-gray-600">
                      <Mail size={16} className="mr-3 text-blue-500" />
                      <span>{user?.email || "No email provided"}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Phone size={16} className="mr-3 text-blue-500" />
                      <span>{user?.phone || "No phone provided"}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-800 border-b pb-2">
                    Skills
                  </h3>
                  
                  {skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {skills.map((skill, index) => (
                        <Badge
                          key={index}
                          className="bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 rounded-full px-3 py-1"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 mt-3 text-sm italic">Chưa cập nhật kỹ năng</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">About Me</h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                  onClick={() => navigate('/profile/edit')}
                >
                  <Edit size={16} />
                </Button>
              </div>
              
              <div className="prose max-w-none text-gray-600">
                {user?.bio ? (
                  <p>{user.bio}</p>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4 border border-dashed border-gray-300 text-gray-500 italic">
                    <p>Ứng viên chưa có mô tả cá nhân. Vui lòng cập nhật để nhà tuyển dụng hiểu rõ hơn về bạn.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Experience</h2>
              
              {user?.experience ? (
                <div className="prose max-w-none text-gray-600 whitespace-pre-wrap">
                  {user.experience}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 border border-dashed border-gray-300 text-center">
                  <p className="text-gray-500">No experience added yet</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2 text-blue-500 border-blue-200"
                    onClick={() => navigate('/profile/edit')}
                  >
                    Add Experience
                  </Button>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Education</h2>
              
              {user?.education ? (
                <div className="prose max-w-none text-gray-600 whitespace-pre-wrap">
                  {user.education}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 border border-dashed border-gray-300 text-center">
                  <p className="text-gray-500">No education information added yet</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2 text-blue-500 border-blue-200"
                    onClick={() => navigate('/profile/edit')}
                  >
                    Add Education
                  </Button>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Connect With Me</h2>
              
              <div className="flex flex-wrap justify-center gap-6">
                <a href="#" className="social-link">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                    <Linkedin size={20} />
                  </div>
                </a>
                <a href="#" className="social-link">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors">
                    <Github size={20} />
                  </div>
                </a>
                <a href="#" className="social-link">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                    <Facebook size={20} />
                  </div>
                </a>
                <a href="#" className="social-link">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-pink-50 text-pink-600 hover:bg-pink-100 transition-colors">
                    <Instagram size={20} />
                  </div>
                </a>
                <a href="#" className="social-link">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-50 text-blue-400 hover:bg-blue-100 transition-colors">
                    <Twitter size={20} />
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;