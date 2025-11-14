import React, { useCallback } from 'react';
import { ArrowUpRight, Bookmark } from 'lucide-react';

/**
 * JobActionButtons Component
 * Hiển thị các nút hành động (Apply, Save, thông tin hết hạn)
 * 
 * @param {Object} props
 * @param {Function} props.onApply - Callback khi click Apply
 * @param {Function} props.onToggleBookmark - Callback khi click Save/Bookmark
 * @param {boolean} props.isBookmarked - Trạng thái đã bookmark hay chưa
 * @param {number|null} props.daysRemaining - Số ngày còn lại trước khi hết hạn
 */
const JobActionButtons = ({
  onApply,
  onToggleBookmark,
  isBookmarked,
  daysRemaining,
}) => {
  const expirationColor = daysRemaining && daysRemaining < 7 ? 'text-red-600' : 'text-green-600';

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex flex-col space-y-3">
        {/* Apply Button */}
        <button
          onClick={onApply}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl flex items-center justify-center font-medium shadow-sm transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Apply Now
          <ArrowUpRight className="h-5 w-5 ml-1" />
        </button>

        {/* Save Job Button */}
        <button
          className={`w-full py-3 px-4 rounded-xl flex items-center justify-center font-medium transition-colors ${
            isBookmarked
              ? 'bg-blue-50 text-blue-700 border border-blue-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent'
          }`}
          onClick={onToggleBookmark}
        >
          {isBookmarked ? (
            <>
              <Bookmark className="h-5 w-5 mr-2 fill-blue-700 text-blue-700" />
              Saved
            </>
          ) : (
            <>
              <Bookmark className="h-5 w-5 mr-2" />
              Save Job
            </>
          )}
        </button>

        {/* Expiration Info */}
        {daysRemaining !== null && (
          <div className="mt-3 bg-gray-50 p-3 rounded-lg border border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              {daysRemaining > 0 ? (
                <>
                  Expires in:{' '}
                  <span className={`${expirationColor} font-medium`}>
                    {daysRemaining} days
                  </span>
                </>
              ) : (
                <span className="text-red-600 font-medium">
                  This job has expired
                </span>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(JobActionButtons);
