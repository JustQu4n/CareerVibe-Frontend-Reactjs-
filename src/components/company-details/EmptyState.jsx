import React from 'react';
import { Building } from 'lucide-react';

/**
 * EmptyState Component
 * Hiển thị khi không có dữ liệu company
 */
const EmptyState = () => {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh]">
      <div className="text-center p-8">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Building className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500 text-lg">No company information available</p>
      </div>
    </div>
  );
};

export default React.memo(EmptyState);
