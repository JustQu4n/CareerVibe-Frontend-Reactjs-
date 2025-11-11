/**
 * SkillsInput Component
 * Reusable skills input with tags
 */
import React from 'react';
import PropTypes from 'prop-types';
import { X, Plus } from 'lucide-react';

const SkillsInput = React.memo(({
  skills,
  skillInput,
  onSkillInputChange,
  onSkillKeyDown,
  onRemoveSkill,
  onAddPopularSkill,
  popularSkills = [],
  placeholder = 'Type skill and press Enter',
  label = 'Skills',
  disabled = false
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      
      {/* Skills Input */}
      <div className={`w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 text-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 flex flex-wrap gap-2 min-h-[48px] transition-colors ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}>
        {skills.map((skill, index) => (
          <div
            key={index}
            className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
          >
            {skill}
            <button
              type="button"
              className="ml-1.5 text-blue-600 hover:text-blue-800 focus:outline-none"
              onClick={() => onRemoveSkill(index)}
              disabled={disabled}
              aria-label={`Remove ${skill}`}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        <input
          className="flex-grow bg-transparent outline-none text-sm px-2 py-1"
          type="text"
          placeholder={placeholder}
          value={skillInput}
          onChange={onSkillInputChange}
          onKeyDown={onSkillKeyDown}
          disabled={disabled}
        />
      </div>
      
      {/* Popular Skills */}
      {popularSkills.length > 0 && (
        <div className="mt-2">
          <p className="text-xs text-gray-600 mb-1.5">Popular skills:</p>
          <div className="flex flex-wrap gap-2">
            {popularSkills.map((skill, index) => (
              <button
                key={index}
                type="button"
                className="px-2 py-1 text-xs border border-gray-200 hover:border-blue-500 hover:bg-blue-50 rounded-full flex items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => onAddPopularSkill(skill)}
                disabled={disabled}
              >
                <Plus className="h-3 w-3 mr-1" />
                {skill}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

SkillsInput.displayName = 'SkillsInput';

SkillsInput.propTypes = {
  skills: PropTypes.arrayOf(PropTypes.string).isRequired,
  skillInput: PropTypes.string.isRequired,
  onSkillInputChange: PropTypes.func.isRequired,
  onSkillKeyDown: PropTypes.func.isRequired,
  onRemoveSkill: PropTypes.func.isRequired,
  onAddPopularSkill: PropTypes.func.isRequired,
  popularSkills: PropTypes.arrayOf(PropTypes.string),
  placeholder: PropTypes.string,
  label: PropTypes.string,
  disabled: PropTypes.bool,
};

export default SkillsInput;
