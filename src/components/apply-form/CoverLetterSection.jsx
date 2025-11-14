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
    <div className="mb-8">
      <div className="flex justify-between items-center mb-1">
        <h4 className="text-lg font-semibold text-gray-800 flex items-center">
          <FileText className="mr-2 h-5 w-5 text-blue-600" />
          Cover Letter
        </h4>
        <span className="text-sm text-gray-500">Optional</span>
      </div>
      
      <p className="text-sm text-gray-600 mb-3">
        Explain why you're a good fit for this position
      </p>
      
      <textarea
        value={value}
        onChange={onChange}
        maxLength={500}
        rows={6}
        placeholder="Include specific examples of your relevant skills and experience that make you a strong candidate for this role..."
        className="block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      ></textarea>
      
      <div className="flex justify-end mt-2">
        <span className={`text-sm ${remainingChars < 50 ? 'text-amber-600' : 'text-gray-500'}`}>
          {remainingChars} characters remaining
        </span>
      </div>
    </div>
  );
};

export default React.memo(CoverLetterSection);
