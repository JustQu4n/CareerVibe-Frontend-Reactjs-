import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import employerService from '@/modules/admin/services/employerService';
import { Edit, Camera, Building, Mail, Phone, Loader2, MapPin, Briefcase, Link as LinkIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import EmployerProfileEditModal from './EmployerProfileEditModal';
import CompanyUpdateModal from './CompanyUpdateModal';

export default function EmployerProfileView() {
  const { user } = useSelector((s) => s.auth);
  const employerId = user?.user_id || user?.employer?.employer_id || user?.id;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [showCompanyEdit, setShowCompanyEdit] = useState(false);
  const fileRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      if (!employerId) return setLoading(false);
      try {
        setLoading(true);
        const res = await employerService.getProfile(employerId);
        setProfile(res.data || res);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load employer profile');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [employerId]);

  const handleOpenFile = () => fileRef.current?.click();

  const handleFile = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    if (!['image/jpeg', 'image/png', 'image/gif'].includes(f.type)) {
      toast.error('Please upload JPG, PNG or GIF image');
      return;
    }

    // Show local preview immediately
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
    setUploading(true);

    const fd = new FormData();
    fd.append('avatar', f);

    try {
      const res = await employerService.updateAvatar(fd);
      const data = res.data || res;
      const avatarUrl = data?.avatar_url || data?.avatar_download_url || data?.avatar;
      setProfile((p) => ({ ...p, avatar_url: avatarUrl }));
      setPreviewUrl(null);
      toast.success(res.message || 'Avatar updated successfully!');
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Failed to upload avatar');
      setPreviewUrl(null);
    } finally {
      setUploading(false);
      setTimeout(() => {
        if (url) URL.revokeObjectURL(url);
      }, 3000);
    }
  };

  const handleUpdateSuccess = (updated) => {
    setProfile(updated);
    setShowEdit(false);
    toast.success('Profile updated');
  };

  const handleCompanyUpdateSuccess = async (updated) => {
    // Refresh entire profile to get updated company data
    try {
      const res = await employerService.getProfile(employerId);
      setProfile(res.data || res);
      setShowCompanyEdit(false);
      toast.success('Company updated successfully');
    } catch (err) {
      console.error(err);
      setShowCompanyEdit(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-white rounded-2xl shadow p-8 text-center">
        <Building className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Profile Found</h3>
        <p className="text-gray-500">Unable to load employer profile data.</p>
      </div>
    );
  }

  const displayAvatar = previewUrl || profile.avatar_url;

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Cover Image with Gradient */}
      <div className="h-48 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative">
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Profile Content */}
      <div className="px-6 pb-6">
        {/* Avatar & Main Info */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-4">
            {/* Avatar */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative group"
            >
              <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-white">
                {displayAvatar ? (
                  <img 
                    src={displayAvatar} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <Building className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                
                {uploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                )}
              </div>

              {/* Camera Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleOpenFile}
                disabled={uploading}
                className="absolute -bottom-2 -right-2 bg-white p-3 rounded-xl shadow-lg border-2 border-white hover:bg-indigo-50 transition-colors disabled:opacity-50"
                title="Change avatar"
              >
                {uploading ? (
                  <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
                ) : (
                  <Camera className="w-4 h-4 text-indigo-600" />
                )}
              </motion.button>
              <input 
                ref={fileRef} 
                type="file" 
                accept="image/jpeg,image/png,image/gif" 
                className="hidden" 
                onChange={handleFile} 
              />
            </motion.div>

            {/* Name & Position */}
            <div className="text-center md:text-left mb-4 md:mb-0">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                {profile.user?.full_name || 'No name set'}
              </h1>
              <div className="flex flex-col md:flex-row items-center gap-2 text-gray-600">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-indigo-500" />
                  <span className="text-sm font-medium">{profile.position || 'No position'}</span>
                </div>
                {profile.company && (
                  <>
                    <span className="hidden md:inline text-gray-400">•</span>
                    <a 
                      href={`/company-details/${profile.company._id || profile.company.id}`}
                      className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 hover:underline"
                    >
                      <Building className="w-4 h-4" />
                      {profile.company.name}
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowEdit(true)}
            className="mt-4 md:mt-0 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 font-medium"
          >
            <Edit className="w-4 h-4" />
            Edit Profile
          </motion.button>
        </div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Contact Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Mail className="w-4 h-4 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Contact</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700 truncate">{profile.user?.email || '-'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">{profile.user?.phone || 'No phone'}</span>
              </div>
            </div>
          </motion.div>

          {/* Company Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-100"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Building className="w-4 h-4 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Company</h3>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCompanyEdit(true)}
                className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-1"
              >
                <Edit className="w-3 h-3" />
                Edit
              </motion.button>
            </div>
            {profile.company ? (
              <div>
                <a 
                  href={`/company-details/${profile.company._id || profile.company.id}`}
                  className="text-sm font-medium text-purple-600 hover:text-purple-700 hover:underline flex items-center gap-1"
                >
                  {profile.company.name}
                  <LinkIcon className="w-3 h-3" />
                </a>
                {profile.company.tagline && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{profile.company.tagline}</p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No company associated</p>
            )}
          </motion.div>

          {/* Additional Info Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <MapPin className="w-4 h-4 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Location</h3>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-700">
                {profile.user?.address || profile.company?.location || 'No location set'}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Bio Section */}
        {profile.user?.bio && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 bg-gray-50 rounded-xl p-5"
          >
            <h3 className="font-semibold text-gray-900 mb-2">About</h3>
            <p className="text-sm text-gray-700 leading-relaxed">{profile.user.bio}</p>
          </motion.div>
        )}
      </div>

      {/* Edit Modal */}
      {showEdit && (
        <EmployerProfileEditModal
          profile={profile}
          onClose={() => setShowEdit(false)}
          onSuccess={handleUpdateSuccess}
        />
      )}

      {/* Company Update Modal */}
      {showCompanyEdit && (
        <CompanyUpdateModal
          profile={profile}
          onClose={() => setShowCompanyEdit(false)}
          onSuccess={handleCompanyUpdateSuccess}
        />
      )}
    </div>
  );
}
