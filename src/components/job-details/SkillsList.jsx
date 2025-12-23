import React from 'react';
import { Sparkles, Code } from 'lucide-react';

/**
 * SkillsList Component - Modern skills display with colorful badges
 */
const SkillsList = ({ skills = [] }) => {
  const colors = [
    'bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 border-blue-200',
    'bg-gradient-to-br from-purple-50 to-purple-100 text-purple-700 border-purple-200',
    'bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-700 border-indigo-200',
    'bg-gradient-to-br from-pink-50 to-pink-100 text-pink-700 border-pink-200',
    'bg-gradient-to-br from-green-50 to-green-100 text-green-700 border-green-200',
    'bg-gradient-to-br from-amber-50 to-amber-100 text-amber-700 border-amber-200',
    'bg-gradient-to-br from-teal-50 to-teal-100 text-teal-700 border-teal-200',
    'bg-gradient-to-br from-cyan-50 to-cyan-100 text-cyan-700 border-cyan-200',
  ];

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
        <div className="p-1.5 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg shadow-sm">
          <Code className="h-4 w-4 text-white" />
        </div>
        <h2 className="text-base font-bold text-gray-900">
          Skills Required
        </h2>
        {skills.length > 0 && (
          <span className="ml-auto px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
            {skills.length}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {skills.length > 0 ? (
          skills.map((skill, index) => {
            const label = typeof skill === 'string' ? skill : skill?.name || '';
            const key = typeof skill === 'string' ? `${label}-${index}` : skill.id || skill.name || index;
            const colorClass = colors[index % colors.length];

            return (
              <span
                key={key}
                className={`${colorClass} px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-300 transform hover:scale-105 hover:shadow-sm flex items-center gap-1 cursor-default`}
              >
                <Sparkles className="h-3 w-3" />
                {label}
              </span>
            );
          })
        ) : (
          <div className="w-full text-center py-6">
            <div className="inline-flex flex-col items-center gap-2">
              <div className="p-3 bg-gray-100 rounded-full">
                <Code className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm font-medium">
                No specific skills listed for this position
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(SkillsList);
