/**
 * SkillsSection Component
 * Displays user's skills with add/delete functionality
 */

import React, { useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Award, Plus, X } from 'lucide-react';

const SkillsSection = React.memo(({ skills, onAddSkill, onDeleteSkill }) => {
  // Memoized delete handler to prevent re-renders
  const handleDelete = useCallback((skillId) => {
    onDeleteSkill(skillId);
  }, [onDeleteSkill]);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Award className="w-5 h-5 text-blue-600" />
          Skills
          <span className="text-sm font-normal text-gray-500">
            ({skills.length})
          </span>
        </h2>
        <Button
          onClick={onAddSkill}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={16} />
          Add Skills
        </Button>
      </div>

      {skills.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <Badge
              key={skill.skill_id}
              className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 rounded-lg px-3 py-1.5 text-sm font-medium transition-all group relative"
            >
              {skill.skill_name}
              {skill.endorsement_count > 0 && (
                <span className="ml-1.5 text-xs text-blue-500">
                  +{skill.endorsement_count}
                </span>
              )}
              <button
                onClick={() => handleDelete(skill.skill_id)}
                className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700"
                title="Remove skill"
                aria-label={`Remove ${skill.skill_name}`}
              >
                <X size={14} />
              </button>
            </Badge>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-4 border border-dashed border-gray-300 text-center">
          <p className="text-gray-500 text-sm italic">No skills added yet</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3 text-blue-600 border-blue-200 hover:bg-blue-50"
            onClick={onAddSkill}
          >
            <Plus size={16} className="mr-2" />
            Add Skills
          </Button>
        </div>
      )}
    </div>
  );
});

SkillsSection.displayName = 'SkillsSection';

export default SkillsSection;
