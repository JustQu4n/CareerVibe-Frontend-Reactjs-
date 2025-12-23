import React from 'react';
import { Send, Bookmark, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

/**
 * JobActionButtons Component - Modern action buttons with enhanced UI
 */
const JobActionButtons = ({
  onApply,
  onToggleBookmark,
  isBookmarked,
  daysRemaining,
}) => {
  const isExpiring = daysRemaining && daysRemaining < 7;
  const isExpired = daysRemaining !== null && daysRemaining <= 0;

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 ">
      <div className="space-y-3">
        {/* Apply Button */}
        <button
          onClick={onApply}
          disabled={isExpired}
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white rounded-lg flex items-center justify-center font-semibold text-base shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group relative overflow-hidden"
        >
          <span className="absolute inset-0 w-0 bg-white/20 transition-all duration-500 ease-out group-hover:w-full"></span>
          <span className="relative flex items-center gap-2">
            <Send className="h-5 w-5" />
            Apply Now
          </span>
        </button>

        {/* Save Job Button */}
        <button
          onClick={onToggleBookmark}
          className={`w-full py-2.5 px-4 rounded-lg flex items-center justify-center font-semibold text-sm transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
            isBookmarked
              ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-2 border-blue-200 hover:border-blue-300 shadow-sm'
              : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-2 border-gray-200 hover:border-gray-300'
          }`}
        >
          <Bookmark className={`h-4 w-4 mr-1.5 transition-all ${
            isBookmarked ? 'fill-blue-600 text-blue-600' : ''
          }`} />
          {isBookmarked ? 'Saved' : 'Save Job'}
        </button>

        {/* Expiration Info */}
        {daysRemaining !== null && (
          <div className={`p-3 rounded-lg border ${
            isExpired 
              ? 'bg-red-50 border-red-200'
              : isExpiring 
              ? 'bg-amber-50 border-amber-200' 
              : 'bg-emerald-50 border-emerald-200'
          }`}>
            <div className="flex items-center justify-center gap-1.5">
              {isExpired ? (
                <>
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-xs font-semibold text-red-700">
                    Job Expired
                  </span>
                </>
              ) : isExpiring ? (
                <>
                  <Clock className="h-4 w-4 text-amber-600 animate-pulse" />
                  <span className="text-xs font-semibold text-amber-700">
                    Expires in {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'}
                  </span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs font-semibold text-emerald-700">
                    {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} remaining
                  </span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="pt-3 border-t border-gray-100">
          <div className="text-xs text-gray-500 text-center">
            <p className="font-medium">✨ Quick & Easy Application</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(JobActionButtons);
