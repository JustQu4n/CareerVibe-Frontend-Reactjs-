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
      <div className="flex items-start mb-6">
        <div className="flex items-center h-5">
          <input
            id="terms"
            type="checkbox"
            required
            className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"
          />
        </div>
        <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
          I certify that all information provided is true and complete to the best of my knowledge. 
          I understand that false information may disqualify me from consideration.
        </label>
      </div>
      
      <button 
        type="submit"
        disabled={loading}
        className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg text-white font-medium transition-all ${
          loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0'
        }`}
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Submitting Application...
          </>
        ) : (
          <>
            <Send className="h-5 w-5" />
            Submit Application
          </>
        )}
      </button>
      
      <p className="text-center text-sm text-gray-500 mt-4">
        By clicking Submit, you acknowledge our{' '}
        <a href="#" className="text-blue-600 hover:text-blue-800">Privacy Policy</a> and{' '}
        <a href="#" className="text-blue-600 hover:text-blue-800">Terms of Service</a>
      </p>
    </div>
  );
};

export default React.memo(SubmitSection);
