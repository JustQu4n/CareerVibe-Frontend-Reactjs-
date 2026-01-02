import React from 'react';
import { FileText } from 'lucide-react';

/**
 * CoverLetterSection Component
 * Textarea cho cover letter với character counter
 * 
 * @param {Object} props
 * @param {string} props.value - Cover letter value
 * @param {number} props.remainingChars - Remaining characters
 * @param {Function} props.onChange - Change handler
 */
const CoverLetterSection = ({ value, remainingChars, onChange }) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium text-gray-700">
          Cover Letter <span className="text-gray-500 text-xs font-normal">(Optional)</span>
        </label>
        <span className="text-xs text-gray-500">
          {remainingChars}/500
        </span>
      </div>
      
      <textarea
        value={value}
        onChange={onChange}
        maxLength={500}
        rows={4}
        placeholder="Why are you a good fit for this position?"
        className="block w-full border border-gray-300 rounded text-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
      ></textarea>
    </div>
  );
};

export default React.memo(CoverLetterSection);
