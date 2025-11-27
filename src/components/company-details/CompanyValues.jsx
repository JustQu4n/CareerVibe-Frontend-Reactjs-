import React from 'react';
import { Award, Lightbulb, Globe, Zap } from 'lucide-react';

/**
 * CompanyValues Component
 * Hiển thị vision, mission, innovation, sustainability
 */
const CompanyValues = ({ vision, mission, innovation, sustainability }) => {
  const items = [
    { key: 'vision', title: 'Vision', value: vision, icon: <Award className="w-5 h-5 text-blue-600" /> },
    { key: 'mission', title: 'Mission', value: mission, icon: <Lightbulb className="w-5 h-5 text-indigo-600" /> },
    { key: 'innovation', title: 'Innovation', value: innovation, icon: <Zap className="w-5 h-5 text-purple-600" /> },
    { key: 'sustainability', title: 'Sustainability', value: sustainability, icon: <Globe className="w-5 h-5 text-emerald-600" /> },
  ];

  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Award className="w-6 h-6 text-blue-600" />
        Company Values
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map(item => (
          <div key={item.key} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-md bg-gray-50 flex items-center justify-center">{item.icon}</div>
              <div>
                <h4 className="text-sm font-semibold text-gray-700">{item.title}</h4>
                <p className="text-gray-600 text-sm mt-1">{item.value || 'Not specified'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(CompanyValues);
