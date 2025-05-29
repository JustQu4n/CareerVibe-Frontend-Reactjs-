import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setUser } from "@/redux/authSlice";
import { Loader2, X, Upload, PlusCircle } from "lucide-react";

const EditProfileModal = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const [previewUrl, setPreviewUrl] = useState(user?.jobseeker?.avatar || null);

  // Parse skills properly from user data
  const parseInitialSkills = () => {
    if (!user?.jobseeker?.skills) return [];
    
    try {
      if (Array.isArray(user.jobseeker.skills) && user.jobseeker.skills.length > 0) {
        const firstItem = user.jobseeker.skills[0];
        if (typeof firstItem === 'string' && firstItem.startsWith('[')) {
          return JSON.parse(firstItem);
        }
        return user.jobseeker.skills;
      }
      return [];
    } catch (error) {
      console.error("Error parsing skills:", error);
      return [];
    }
  };

  const [input, setInput] = useState({
    full_name: user?.jobseeker?.full_name || "",
    email: user?.email || "",
    phone: user?.jobseeker?.phone || "",
    address: user?.jobseeker?.address || "",
    bio: user?.jobseeker?.bio || "",
    skills: parseInitialSkills(),
    newSkill: "",
    file: null,
  });

  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleAddSkill = () => {
    if (input.newSkill.trim() !== "" && !input.skills.includes(input.newSkill.trim())) {
      setInput({
        ...input,
        skills: [...input.skills, input.newSkill.trim()],
        newSkill: "",
      });
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setInput({
      ...input,
      skills: input.skills.filter(skill => skill !== skillToRemove),
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, file });
      
      // Create preview URL for the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("full_name", input.full_name);
    formData.append("email", input.email);
    formData.append("phone", input.phone);
    formData.append("address", input.address);
    formData.append("bio", input.bio);
    
    // Convert skills array to JSON string
    const skillsJson = JSON.stringify(input.skills);
    formData.append("skills", skillsJson);

    if (input.file) {
      formData.append("avatar", input.file);
    }

    try {
      setLoading(true);
      // Extract the correct user ID
      const jobSeekerId = user?.jobseeker?._id || user?.jobseeker?.id; 
      const token = localStorage.getItem("token");
      
      const res = await axios.put(
        `http://localhost:5000/api/jobseeker/profile/${jobSeekerId}`,
        formData,
        {
          headers: { 
            Authorization: `Bearer ${token}`
          },
          withCredentials: true,
        }
      );
      
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success("Profile updated successfully");
        setOpen(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      
      // Error handling
      if (error.response) {
        if (error.response.status === 404) {
          toast.error("API endpoint not found. Please contact support.");
        } else {
          toast.error(error.response?.data?.message || `Server error: ${error.response.status}`);
        }
      } else if (error.request) {
        toast.error("No response from server. Please check your connection.");
      } else {
        toast.error("Failed to update profile");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto bg-white rounded-xl p-0"
        onInteractOutside={() => setOpen(false)}
      >
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-t-xl">
          <DialogHeader className="text-white pb-2">
            <DialogTitle className="text-2xl font-bold">Edit Your Profile</DialogTitle>
            <p className="text-blue-100 font-light mt-1">Update your personal information and skills</p>
          </DialogHeader>
        </div>
        
        <form onSubmit={handleSubmit} className="px-6 py-4">
          {/* Profile Photo - Moved to top with modern preview */}
          <div className="mb-6 flex flex-col items-center justify-center">
            <div className="relative mb-3">
              <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-white shadow-md">
                <img 
                  src={previewUrl || "https://via.placeholder.com/150?text=Profile"} 
                  alt="Profile preview" 
                  className="h-full w-full object-cover"
                />
              </div>
              <label htmlFor="avatar" className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-blue-600 transition-colors">
                <Upload size={16} />
                <input
                  type="file"
                  id="avatar"
                  name="avatar"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-sm text-gray-500">Click the icon to upload a new photo</p>
          </div>
          
          <div className="space-y-5">
            {/* Personal Information Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Personal Information
              </h3>
              
              <div className="space-y-4">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="full_name" className="text-sm font-medium text-gray-700">
                    Full Name
                  </Label>
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    value={input.full_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter your full name"
                  />
                </div>
                
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email
                  </Label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={input.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter your email address"
                  />
                </div>
                
                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Phone
                  </Label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={input.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter your phone number"
                  />
                </div>
                
                {/* Address */}
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                    Address
                  </Label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={input.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter your address"
                  />
                </div>
              </div>
            </div>
            
            {/* Bio Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                About You
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-sm font-medium text-gray-700">
                  Bio
                </Label>
                <textarea
                  id="bio"
                  name="bio"
                  value={input.bio}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Tell us a bit about yourself..."
                />
              </div>
            </div>
            
            {/* Skills Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Skills
              </h3>
              
              <div className="space-y-4">
                <div className="min-h-[100px] p-3 bg-gray-50 rounded-md border border-gray-200">
                  {input.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {input.skills.map((skill, index) => (
                        <div 
                          key={index}
                          className="bg-blue-50 text-blue-600 border border-blue-200 rounded-full px-3 py-1 flex items-center group hover:bg-blue-100 transition-colors"
                        >
                          {skill}
                          <button 
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="ml-2 text-blue-400 group-hover:text-blue-700 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-center py-8">Add some skills to showcase your abilities</p>
                  )}
                </div>
                
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Add a skill (e.g., JavaScript, UI Design)"
                    name="newSkill"
                    value={input.newSkill}
                    onChange={handleInputChange}
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                  />
                  <button 
                    type="button"
                    onClick={handleAddSkill}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded-r-md flex items-center transition-colors"
                  >
                    <PlusCircle size={16} className="mr-1" />
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6 pt-4 border-t border-gray-200">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="mr-2 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium px-5"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;