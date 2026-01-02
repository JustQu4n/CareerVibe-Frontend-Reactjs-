import React from 'react';
import { Send } from 'lucide-react';

/**
 * SubmitSection Component
 * Terms checkbox và submit button
 * 
 * @param {Object} props
 * @param {boolean} props.loading - Loading state
 */
const SubmitSection = ({ loading }) => {
  return (
    <div>
      <div className="flex items-start mb-4">
        <input
          id="terms"
          type="checkbox"
          required
          className="mt-1 w-4 h-4 border border-gray-300 rounded focus:ring-1 focus:ring-gray-400"
        />
        <label htmlFor="terms" className="ml-2 text-xs text-gray-600">
          I certify that all information is accurate and understand false information may disqualify me.
        </label>
      </div>
      
      <button 
        type="submit"
        disabled={loading}
        className={`w-full flex items-center justify-center gap-2 py-2.5 px-6 rounded text-sm text-white font-medium transition-colors ${
          loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gray-900 hover:bg-gray-800'
        }`}
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Submitting...
          </>
        ) : (
          <>
            Submit Application
          </>
        )}
      </button>
    </div>
  );
};

export default React.memo(SubmitSection);
