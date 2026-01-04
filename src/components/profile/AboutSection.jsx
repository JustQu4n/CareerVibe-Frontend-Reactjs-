/**
 * AboutSection Component
 * Displays user's bio/about section with edit button
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Edit } from 'lucide-react';

const AboutSection = React.memo(({ bio }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-black flex items-center gap-2">
          <User className="w-5 h-5 text-black" />
          About
        </h2>
        <button
          onClick={() => navigate('/profile/edit')}
          className="text-black hover:text-gray-800 p-1"
          aria-label="Edit about section"
        >
          <Edit size={16} />
        </button>
      </div>

      {bio ? (
        <p className="text-black text-sm leading-relaxed">{bio}</p>
      ) : (
        <div className="bg-gray-50 rounded-lg p-4 border border-dashed border-gray-300">
          <p className="text-black text-sm text-center italic">
            No bio added yet
          </p>
        </div>
      )}
    </div>
  );
});

AboutSection.displayName = 'AboutSection';

export default AboutSection;
