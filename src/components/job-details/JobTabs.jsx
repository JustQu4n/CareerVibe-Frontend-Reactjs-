import React from 'react';
import { FileText, CheckCircle, Award, Heart, Star, Zap } from 'lucide-react';

/**
 * JobTabs Component - Modern tabbed interface with enhanced styling
 */
const JobTabs = ({ activeTab, setActiveTab, description }) => {
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
    'Competitive salary and performance bonuses',
    'Flexible working hours and remote work options',
    'Comprehensive health insurance coverage',
    'Professional development budget for courses',
    'Regular team building events and activities',
    'Modern office space with ergonomic equipment',
    'Gym membership and wellness programs',
    'Free snacks and beverages',
  ];

  const tabs = [
    { id: 'description', label: 'Description', icon: FileText },
    { id: 'responsibilities', label: 'Responsibilities', icon: CheckCircle },
    { id: 'requirements', label: 'Requirements', icon: Award },
    { id: 'benefits', label: 'Benefits', icon: Heart },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      {/* Tab Headers */}
      <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex overflow-x-auto hide-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-3 font-semibold text-xs whitespace-nowrap border-b-2 transition-all duration-300 flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-full"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-5">
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
 * TabDescription - Enhanced job description display
 */
const TabDescription = React.memo(({ description }) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2 mb-4">
      <div className="p-1.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
        <FileText className="h-4 w-4 text-white" />
      </div>
      <h2 className="text-lg font-bold text-gray-900">Job Description</h2>
    </div>
    <div
      className="text-gray-700 text-sm leading-relaxed space-y-3 prose prose-sm prose-blue max-w-none"
      dangerouslySetInnerHTML={{ __html: description }}
    />
  </div>
));

TabDescription.displayName = 'TabDescription';

/**
 * TabResponsibilities - Enhanced responsibilities display
 */
const TabResponsibilities = React.memo(({ items }) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2 mb-4">
      <div className="p-1.5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
        <CheckCircle className="h-4 w-4 text-white" />
      </div>
      <h2 className="text-lg font-bold text-gray-900">Responsibilities</h2>
    </div>
    <ul className="space-y-2.5">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-2 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100 hover:border-green-200 transition-colors group">
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
            <CheckCircle className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-gray-700 text-sm leading-relaxed flex-1">{item}</span>
        </li>
      ))}
    </ul>
  </div>
));

TabResponsibilities.displayName = 'TabResponsibilities';

/**
 * TabRequirements - Enhanced requirements display
 */
const TabRequirements = React.memo(({ items }) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2 mb-4">
      <div className="p-1.5 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
        <Award className="h-4 w-4 text-white" />
      </div>
      <h2 className="text-lg font-bold text-gray-900">Requirements</h2>
    </div>
    <ul className="space-y-2.5">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-2 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100 hover:border-purple-200 transition-colors group">
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
            <Star className="h-3.5 w-3.5 text-white fill-white" />
          </div>
          <span className="text-gray-700 text-sm leading-relaxed flex-1">{item}</span>
        </li>
      ))}
    </ul>
  </div>
));

TabRequirements.displayName = 'TabRequirements';

/**
 * TabBenefits - Enhanced benefits display with modern grid
 */
const TabBenefits = React.memo(({ items }) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2 mb-4">
      <div className="p-1.5 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg">
        <Heart className="h-4 w-4 text-white" />
      </div>
      <h2 className="text-lg font-bold text-gray-900">Benefits & Perks</h2>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {items.map((benefit, index) => (
        <div 
          key={index} 
          className="flex items-start gap-2 p-3 bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg border border-pink-100 hover:border-pink-200 hover:shadow-sm transition-all duration-300 group"
        >
          <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
            <Zap className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-gray-700 text-sm font-medium leading-relaxed flex-1">{benefit}</span>
        </div>
      ))}
    </div>
  </div>
));

TabBenefits.displayName = 'TabBenefits';

export default React.memo(JobTabs);
