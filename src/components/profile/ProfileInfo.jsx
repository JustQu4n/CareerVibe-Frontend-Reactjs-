/**
 * ProfileInfo Component
 * Displays user's basic information (name, email, phone, address)
 * and action buttons (Edit Profile, View Resume)
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Edit, FileText, Share2, Download } from 'lucide-react';
import { toast } from 'react-toastify';

const ProfileInfo = React.memo(({ user, resume_url }) => {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth?.user);

  const handleShareProfile = () => {
    const publicUrl = `${window.location.origin}/public-profile/${currentUser?.user_id || user?.user_id}`;
    
    if (navigator.share) {
      navigator.share({
        title: `${user?.full_name || 'User'}'s Profile`,
        url: publicUrl
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(publicUrl);
      toast.success('Public profile link copied to clipboard!');
    }
  };

  const handleDownloadCV = () => {
    const publicUrl = `${window.location.origin}/public-profile/${currentUser?.user_id || user?.user_id}`;
    const printWindow = window.open(publicUrl, '_blank');
    
    if (printWindow) {
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
        }, 1000);
      };
    } else {
      toast.error('Please allow pop-ups to download CV');
    }
  };

  return (
    <div className="pt-24 pb-8 px-6 sm:px-10 border-b border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        {/* User Info */}
        <div>
          <h1 className="text-4xl font-bold text-black mb-3">
            {user?.full_name || "Update your name"}
          </h1>
          <div className="flex flex-wrap items-center gap-5 text-gray-700">
            <div className="flex items-center gap-2">
              <Mail size={18} className="text-black" />
              <span className="text-base">{user?.email}</span>
            </div>
            {user?.phone && (
              <div className="flex items-center gap-2">
                <Phone size={18} className="text-black" />
                <span className="text-base">{user.phone}</span>
              </div>
            )}
            {user?.address && (
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-black" />
                <span className="text-base">{user.address}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            className="border-blue-500 text-blue-600 hover:bg-blue-50 flex items-center gap-2"
            onClick={() => navigate('/profile/edit')}
          >
            <Edit size={18} />
            Edit Profile
          </Button>
          <Button
            variant="outline"
            className="border-indigo-500 text-indigo-600 hover:bg-indigo-50 flex items-center gap-2"
            onClick={handleShareProfile}
          >
            <Share2 size={18} />
            Share
          </Button>
          <Button
            variant="outline"
            className="border-green-500 text-green-600 hover:bg-green-50 flex items-center gap-2"
            onClick={handleDownloadCV}
          >
            <Download size={16} />
            Download CV
          </Button>
          {resume_url && (
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
              onClick={() => window.open(resume_url, "_blank")}
            >
              <FileText size={16} />
              View Resume
            </Button>
          )}
        </div>
      </div>
    </div>
  );
});

ProfileInfo.displayName = 'ProfileInfo';

export default ProfileInfo;
