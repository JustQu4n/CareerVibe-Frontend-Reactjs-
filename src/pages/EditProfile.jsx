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
  const [coverPreviewUrl, setCoverPreviewUrl] = useState(null);
  
  const [formData, setFormData] = useState({
    bio: "",
    phone: "",
    address: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [coverFile, setCoverFile] = useState(null);
  const [uploadingCover, setUploadingCover] = useState(false);

  // Fetch current profile data~
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
          const userData = profileData.user || {};
          setFormData({
            bio: userData.bio || "",
            phone: userData.phone || "",
            address: userData.address || "",
          });
          setPreviewUrl(userData.avatar_url || profileData.avatar_url);
          setCoverPreviewUrl(userData.cover_url || profileData.cover_url || null);
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

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      if (file.size > 8 * 1024 * 1024) {
        toast.error('Cover image should be less than 8MB');
        return;
      }
      setCoverFile(file);
      setCoverPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) {
      toast.error('Please select an image first');
      return;
    }

    try {
      setUploadingAvatar(true);
      const formData = new FormData();
      formData.append('avatar', avatarFile);

      // PATCH /api/jobseeker/profile/avatar
      const response = await apiClient.patch(
        API_ENDPOINTS.USER.AVATAR_UPDATE,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        toast.success('Avatar updated successfully!');
        setAvatarFile(null);
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error(error.response?.data?.message || 'Failed to upload avatar');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleCoverUpload = async () => {
    if (!coverFile) {
      toast.error('Please select a cover image first');
      return;
    }

    try {
      setUploadingCover(true);
      const fd = new FormData();
      fd.append('cover', coverFile);

      const response = await apiClient.patch(
        API_ENDPOINTS.USER.COVER_UPDATE,
        fd,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        toast.success('Cover updated successfully!');
        setCoverFile(null);
      }
    } catch (error) {
      console.error('Error uploading cover:', error);
      toast.error(error.response?.data?.message || 'Failed to upload cover image');
    } finally {
      setUploadingCover(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!authUser?.id) {
      toast.error("User not authenticated");
      return;
    }

    try {
      setLoading(true);
      
      // Prepare data according to new UpdateProfileDto (all fields optional)
      const updateData = {};
      if (formData.bio?.trim()) updateData.bio = formData.bio.trim();
      if (formData.phone?.trim()) updateData.phone = formData.phone.trim();
      if (formData.address?.trim()) updateData.address = formData.address.trim();

      // PUT /api/jobseeker/profile/:id
      const response = await apiClient.put(
        API_ENDPOINTS.USER.JOBSEEKER_PROFILE(authUser.id),
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
          {/* Avatar Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Upload className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Profile Picture</h2>
            </div>
            
            <div className="flex items-start gap-6">
              {/* Avatar Preview */}
              <div className="flex-shrink-0">
                <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Avatar preview"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <User className="w-16 h-16 text-white" />
                  )}
                </div>
              </div>
              
              {/* Upload Controls */}
              <div className="flex-1 space-y-3">
                <div>
                  <Label htmlFor="avatar" className="text-sm font-medium text-gray-700">
                    Upload New Avatar
                  </Label>
                  <input
                    type="file"
                    id="avatar"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="mt-2 w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <p className="text-sm text-gray-500 mt-2">Recommended: Square image, at least 400x400px, max 5MB</p>
                </div>
                
                {avatarFile && (
                  <Button
                    type="button"
                    onClick={handleAvatarUpload}
                    disabled={uploadingAvatar}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {uploadingAvatar ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Avatar
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Cover Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Upload className="w-5 h-5 text-yellow-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Profile Cover</h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="cover" className="text-sm font-medium text-gray-700">Upload Cover Image</Label>
                <input
                  type="file"
                  id="cover"
                  accept="image/*"
                  onChange={handleCoverChange}
                  className="mt-2 w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
                />
                <p className="text-sm text-gray-500 mt-2">Recommended: Landscape image (1200x300px), max 8MB</p>
              </div>

              {coverPreviewUrl && (
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="w-full h-40 rounded-lg overflow-hidden bg-gray-50">
                      <img src={coverPreviewUrl} alt="Cover preview" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <Button
                      type="button"
                      onClick={handleCoverUpload}
                      disabled={uploadingCover}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white"
                    >
                      {uploadingCover ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Cover
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

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

          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Contact Information</h2>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  Phone Number <span className="text-gray-400">(Optional)</span>
                </Label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="e.g., 0987654321"
                />
                <p className="text-sm text-gray-500">Provide a phone number for employers to contact you</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                  Address <span className="text-gray-400">(Optional)</span>
                </Label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="e.g., 123 Nguyen Van Linh, District 7, Ho Chi Minh City"
                />
                <p className="text-sm text-gray-500">Your current address or preferred work location</p>
              </div>
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
