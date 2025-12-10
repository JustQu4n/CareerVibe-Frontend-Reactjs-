import React from 'react';
import { Award } from 'lucide-react';

/**
 * SkillsList Component
 * Hiển thị danh sách kỹ năng yêu cầu
 * 
 * @param {Object} props
 * @param {Array<string|Object>} props.skills - Danh sách kỹ năng (string hoặc { id, name })
 */
const SkillsList = ({ skills = [] }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
        <Award className="mr-2 h-5 w-5 text-blue-600" />
        Skills Required
      </h2>
      <div className="flex flex-wrap gap-2">
        {skills.length > 0 ? (
          skills.map((skill, index) => {
            // Support both string and object formats from backend
            const label = typeof skill === 'string' ? skill : skill?.name || '';
            const key = typeof skill === 'string' ? `${label}-${index}` : skill.id || skill.name || index;

            return (
              <span
                key={key}
                className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium"
              >
                {label}
              </span>
            );
          })
        ) : (
          <p className="text-gray-500">
            No specific skills listed for this position.
          </p>
        )}
      </div>
    </div>
  );
};

export default React.memo(SkillsList);
