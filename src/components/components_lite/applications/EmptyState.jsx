import React from 'react';
import { FileText, ChevronRight } from 'lucide-react';

/**
 * EmptyState Component
 * Hiển thị khi chưa có applications nào
 */
const EmptyState = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-10 text-center">
      <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <FileText className="h-12 w-12 text-blue-500" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-3">No Applications Yet</h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        You haven't applied to any jobs yet. Start exploring opportunities and kickstart your career journey!
      </p>
      <a 
        href="/jobs" 
        className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition font-medium inline-flex items-center"
      >
        Browse Jobs
        <ChevronRight className="ml-2 h-4 w-4" />
      </a>
    </div>
  );
};

export default React.memo(EmptyState);
