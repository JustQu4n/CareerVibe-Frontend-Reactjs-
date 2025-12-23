/**
 * ProfileHeader Component
 * Displays profile cover image and avatar with edit button
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, User } from 'lucide-react';

const ProfileHeader = React.memo(({ avatar_url, full_name, cover_url }) => {
  const navigate = useNavigate();

  return (
    <div className="relative mb-8">
      {/* Cover Image */}
      {cover_url ? (
        <div className="h-48 sm:h-64 w-full rounded-2xl shadow-lg overflow-hidden">
          <img
            src={cover_url}
            alt={full_name ? `${full_name} cover` : 'Profile cover'}
            className="w-full h-full object-cover object-center"
          />
        </div>
      ) : (
        <div className="h-48 sm:h-64 w-full bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 rounded-2xl shadow-lg"></div>
      )}
      
      {/* Avatar */}
      <div className="absolute -bottom-1 left-4 sm:left-8">
        <div className="relative">
          <div className="w-30 h-32 sm:w-36 sm:h-36 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-white ring-2 ring-gray-100">
            {avatar_url ? (
              <img
                src={avatar_url}
                alt={full_name}
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100">
                <User className="w-14 h-14 sm:w-16 sm:h-16 text-blue-500" />
              </div>
            )}
          </div>
          
          {/* Edit Button */}
          <button
            onClick={() => navigate('/profile/edit')}
            className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-full shadow-lg transition-all hover:scale-110 border-2 border-white"
            aria-label="Edit profile"
          >
            <Edit size={16} />
          </button>
        </div>
      </div>
    </div>
  );
});

ProfileHeader.displayName = 'ProfileHeader';

export default ProfileHeader;
