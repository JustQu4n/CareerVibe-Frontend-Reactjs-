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
    <div className="relative mb-12">
      {/* Cover Image */}
      {cover_url ? (
        <div className="h-56 sm:h-72 w-full rounded-xl overflow-hidden border-2 border-gray-200">
          <img
            src={cover_url}
            alt={full_name ? `${full_name} cover` : 'Profile cover'}
            className="w-full h-full object-cover object-center"
          />
        </div>
      ) : (
        <div className="h-56 sm:h-72 w-full bg-gray-100 rounded-xl border-2 border-gray-200"></div>
      )}
      
      {/* Avatar */}
      <div className="absolute -bottom-16 left-6 sm:left-10">
        <div className="relative">
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white">
            {avatar_url ? (
              <img
                src={avatar_url}
                alt={full_name}
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <User className="w-16 h-16 sm:w-20 sm:h-20 text-gray-400" />
              </div>
            )}
          </div>
          
          {/* Edit Button */}
          <button
            onClick={() => navigate('/profile/edit')}
            className="absolute bottom-2 right-2 bg-black hover:bg-gray-800 text-white p-3 rounded-full shadow-lg transition-all hover:scale-105 border-2 border-white"
            aria-label="Edit profile"
          >
            <Edit size={18} />
          </button>
        </div>
      </div>
    </div>
  );
});

ProfileHeader.displayName = 'ProfileHeader';

export default ProfileHeader;
