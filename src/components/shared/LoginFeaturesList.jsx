/**
 * LoginFeaturesList Component
 * Displays features/benefits list in login page
 */
import React from 'react';
import PropTypes from 'prop-types';

const FeatureItem = React.memo(({ icon, title, description }) => (
  <div className="flex items-start mb-4 last:mb-0">
    <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mr-3 flex-shrink-0">
      {icon}
    </div>
    <div>
      <h3 className="text-white font-medium">{title}</h3>
      <p className="text-blue-100 text-sm">{description}</p>
    </div>
  </div>
));

FeatureItem.displayName = 'FeatureItem';

FeatureItem.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

const CheckIcon = () => (
  <svg 
    className="h-5 w-5 text-white" 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
  </svg>
);

const LoginFeaturesList = React.memo(({ features }) => {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
      {features.map((feature, index) => (
        <FeatureItem
          key={index}
          icon={<CheckIcon />}
          title={feature.title}
          description={feature.description}
        />
      ))}
    </div>
  );
});

LoginFeaturesList.displayName = 'LoginFeaturesList';

LoginFeaturesList.propTypes = {
  features: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
};

// Default features
LoginFeaturesList.defaultProps = {
  features: [
    {
      title: 'Access to exclusive jobs',
      description: 'Find opportunities not listed anywhere else',
    },
    {
      title: 'AI-powered job matching',
      description: 'Get recommendations tailored to your profile',
    },
    {
      title: 'Track applications',
      description: 'Manage your job search process in one place',
    },
  ],
};

export default LoginFeaturesList;
