import React, { useState, useCallback } from 'react';
import { Gift, Check } from 'lucide-react';

/**
 * CompanyBenefits Component
 * Hiển thị danh sách benefits với show more/less
 * 
 * @param {Object} props
 * @param {Array} props.benefits - Array of benefits (mặc định có sẵn)
 */
const CompanyBenefits = ({ benefits = [
  "Competitive salary package",
  "Flexible work arrangements",
  "Professional development opportunities",
  "Collaborative work environment",
  "Health insurance coverage",
  "Annual performance bonuses",
  "Remote work options",
  "Modern office facilities"
] }) => {
  const [showAll, setShowAll] = useState(false);
  
  const benefitsToShow = showAll ? benefits : benefits.slice(0, 4);
  
  const handleToggle = useCallback(() => {
    setShowAll(prev => !prev);
  }, []);

  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Gift className="w-6 h-6 text-blue-600" />
        Company Benefits
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {benefitsToShow.map((benefit, idx) => (
          <div 
            key={idx} 
            className="flex items-start p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover:shadow-md transition-shadow"
          >
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <p className="text-gray-700 font-medium">{benefit}</p>
          </div>
        ))}
      </div>
      {benefits.length > 4 && (
        <button 
          className="mt-4 text-blue-600 font-semibold hover:text-blue-700 transition-colors flex items-center gap-2"
          onClick={handleToggle}
        >
          {showAll ? '− Show Less' : '+ Show More Benefits'}
        </button>
      )}
    </div>
  );
};

export default React.memo(CompanyBenefits);
