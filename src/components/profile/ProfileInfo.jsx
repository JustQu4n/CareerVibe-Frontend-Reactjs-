/**
 * ProfileInfo Component
 * Displays user's basic information (name, email, phone, address)
 * and action buttons (Edit Profile, View Resume)
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Edit, FileText } from 'lucide-react';

const ProfileInfo = React.memo(({ user, resume_url }) => {
  const navigate = useNavigate();

  return (
    <div className="pt-20 pb-6 px-4 sm:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* User Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {user?.full_name || "Chưa cập nhật tên"}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-gray-600">
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-blue-500" />
              <span className="text-sm">{user?.email}</span>
            </div>
            {user?.phone && (
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-blue-500" />
                <span className="text-sm">{user.phone}</span>
              </div>
            )}
            {user?.address && (
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-blue-500" />
                <span className="text-sm">{user.address}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="border-blue-500 text-blue-600 hover:bg-blue-50 flex items-center gap-2"
            onClick={() => navigate('/profile/edit')}
          >
            <Edit size={16} />
            Edit Profile
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
