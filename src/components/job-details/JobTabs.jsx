import React from 'react';
import { Briefcase, CheckCircle, Award, Heart, Star } from 'lucide-react';

/**
 * JobTabs Component
 * Hiển thị các tabs chứa thông tin chi tiết về job
 * 
 * @param {Object} props
 * @param {string} props.activeTab - Tab hiện tại đang active
 * @param {Function} props.setActiveTab - Function để thay đổi active tab
 * @param {string} props.description - Mô tả công việc
 */
const JobTabs = ({ activeTab, setActiveTab, description }) => {
  // Hardcoded data - nên được truyền từ props hoặc API trong tương lai
  const responsibilities = [
    'Develop and maintain web applications using React.js and related technologies',
    'Write clean, maintainable, and efficient code',
    'Collaborate with backend developers and designers',
    'Implement responsive design and ensure cross-browser compatibility',
    'Optimize applications for maximum speed and scalability',
    'Participate in code reviews and contribute to team discussions',
    'Stay updated on emerging technologies and industry trends',
  ];

  const requirements = [
    '3+ years of experience in frontend development',
    'Strong proficiency in JavaScript, HTML, CSS, and React.js',
    'Familiarity with RESTful APIs and modern frontend practices',
    'Experience with responsive design and cross-browser compatibility',
    'Knowledge of state management libraries (Redux, MobX, etc.)',
    "Bachelor's degree in Computer Science or related field",
    'Strong problem-solving skills and attention to detail',
  ];

  const benefits = [
    'Competitive salary',
    'Flexible working hours',
    'Remote work options',
    'Health insurance',
    'Professional development budget',
    'Regular team events',
    'Modern office space',
    'Gym membership',
  ];

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'responsibilities', label: 'Responsibilities' },
    { id: 'requirements', label: 'Requirements' },
    { id: 'benefits', label: 'Benefits' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Tab Headers */}
      <div className="border-b border-gray-100">
        <div className="flex overflow-x-auto hide-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'description' && (
          <TabDescription description={description} />
        )}

        {activeTab === 'responsibilities' && (
          <TabResponsibilities items={responsibilities} />
        )}

        {activeTab === 'requirements' && (
          <TabRequirements items={requirements} />
        )}

        {activeTab === 'benefits' && (
          <TabBenefits items={benefits} />
        )}
      </div>
    </div>
  );
};

/**
 * TabDescription - Hiển thị mô tả công việc
 */
const TabDescription = React.memo(({ description }) => (
  <div>
    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
      <Briefcase className="mr-2 h-5 w-5 text-blue-600" />
      Job Description
    </h2>
    <div
      className="text-gray-600 space-y-4 prose max-w-none"
      dangerouslySetInnerHTML={{ __html: description }}
    />
  </div>
));

TabDescription.displayName = 'TabDescription';

/**
 * TabResponsibilities - Hiển thị trách nhiệm công việc
 */
const TabResponsibilities = React.memo(({ items }) => (
  <div>
    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
      <CheckCircle className="mr-2 h-5 w-5 text-blue-600" />
      Responsibilities
    </h2>
    <ul className="text-gray-600 space-y-3">
      {items.map((item, index) => (
        <li key={index} className="flex items-start">
          <div className="h-5 w-5 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center mt-0.5 mr-3">
            <CheckCircle className="h-3 w-3 text-blue-600" />
          </div>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
));

TabResponsibilities.displayName = 'TabResponsibilities';

/**
 * TabRequirements - Hiển thị yêu cầu công việc
 */
const TabRequirements = React.memo(({ items }) => (
  <div>
    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
      <Award className="mr-2 h-5 w-5 text-blue-600" />
      Requirements
    </h2>
    <ul className="text-gray-600 space-y-3">
      {items.map((item, index) => (
        <li key={index} className="flex items-start">
          <div className="h-5 w-5 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center mt-0.5 mr-3">
            <Star className="h-3 w-3 text-blue-600" />
          </div>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
));

TabRequirements.displayName = 'TabRequirements';

/**
 * TabBenefits - Hiển thị quyền lợi
 */
const TabBenefits = React.memo(({ items }) => (
  <div>
    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
      <Heart className="mr-2 h-5 w-5 text-blue-600" />
      Benefits & Perks
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {items.map((benefit, index) => (
        <div key={index} className="flex items-start bg-blue-50 rounded-lg p-3">
          <CheckCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
          <span className="text-gray-800">{benefit}</span>
        </div>
      ))}
    </div>
  </div>
));

TabBenefits.displayName = 'TabBenefits';

export default React.memo(JobTabs);
