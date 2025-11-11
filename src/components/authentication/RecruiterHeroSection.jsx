/**
 * RecruiterHeroSection Component
 * 
 * @description
 * Left panel of the recruiter login page displaying marketing content,
 * features, and testimonials to engage potential recruiters.
 * 
 * Features:
 * - Responsive design (hidden on mobile, visible on md+)
 * - Animated background pattern
 * - Feature highlights with icons
 * - Testimonial section
 * - Modern gradient styling
 * 
 * @component
 */

import React from 'react';
import { Building2, Users, Briefcase } from 'lucide-react';

/**
 * Feature Item Component
 * Displays a single feature with icon and description
 */
const FeatureItem = React.memo(({ icon: Icon, title, description }) => (
  <div className="flex items-start">
    <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mr-3 flex-shrink-0">
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-blue-100">{description}</p>
    </div>
  </div>
));

FeatureItem.displayName = 'FeatureItem';

/**
 * Testimonial Component
 * Displays customer testimonial with avatar
 */
const Testimonial = React.memo(({ quote, name, title }) => (
  <div className="mt-12 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
    <p className="italic text-sm text-blue-50 mb-4">"{quote}"</p>
    <div className="flex items-center">
      <div className="h-10 w-10 rounded-full bg-blue-500 mr-3"></div>
      <div>
        <h4 className="font-medium">{name}</h4>
        <p className="text-xs text-blue-200">{title}</p>
      </div>
    </div>
  </div>
));

Testimonial.displayName = 'Testimonial';

/**
 * RecruiterHeroSection Component
 */
export const RecruiterHeroSection = React.memo(() => {
  return (
    <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-12 relative overflow-hidden">
      {/* Background Pattern - Decorative SVG */}
      <div className="absolute inset-0 opacity-10">
        <svg className="h-full w-full" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
          <path 
            fill="none" 
            stroke="white" 
            strokeWidth="2" 
            d="M769 229L1037 260.9M927 880L731 737 520 660 309 538 40 599 295 764 126.5 879.5 40 599-197 493 102 382-31 229 126.5 
            79.5-69-63M-24 -199L1 -155M-88 -85L-80 -131M1 -155L162 -80M1 -155L-80 -131M1 -155L-69 -63M1 -155L101 -30M1 -155L162 
            -80M162 -80L294 -63M162 -80L251 -161M162 -80L176 -272M162 -80L294 -63M176 -272L251 -161M-88 -85L-80 -131M-88 -85L-42 
            -79M-88 -85L-38 -169M-88 -85L1 -155M-69 -63L1 -155M-69 -63L101 -30M-69 -63L-88 -85M101 -30L1 -155M101 -30L162 -80M101 
            -30L251 -161M101 -30L294 -63M251 -161L294 -63M251 -161L176 -272M-80 -131L1 -155M-80 -131L-42 -79M-80 -131L-38 -169M-38 
            -169L-42 -79M-38 -169L1 -155M-38 -169L-80 -131M294 -63L162 -80M294 -63L101 -30M-42 -79L-88 -85M-42 -79L-80 -131M-42 -79L-38 -169"
          />
        </svg>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center mb-8">
          <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
            <Building2 className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold">CareerVibe Recruiters</h2>
        </div>
        
        {/* Main Heading */}
        <h1 className="text-3xl md:text-4xl font-bold mb-6">
          Hire the best talent for your team
        </h1>
        <p className="text-blue-100 mb-8 text-lg">
          Access our pool of qualified candidates and streamline your hiring process with our powerful recruitment tools.
        </p>
        
        {/* Features List */}
        <div className="space-y-6 mb-8">
          <FeatureItem
            icon={Users}
            title="Access top talent"
            description="Connect with thousands of qualified professionals"
          />
          
          <FeatureItem
            icon={Briefcase}
            title="Streamlined hiring"
            description="Post jobs, review applications, and manage candidates in one place"
          />
        </div>
        
        {/* Testimonial */}
        <Testimonial
          quote="CareerVibe has transformed our recruitment process. We've reduced our time-to-hire by 40% and found exceptional candidates."
          name="Sarah Thompson"
          title="HR Director, TechGrowth Inc."
        />
      </div>
      
      {/* Decorative Circle */}
      <div className="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4">
        <div className="w-64 h-64 rounded-full bg-white/10 backdrop-blur-sm"></div>
      </div>
    </div>
  );
});

RecruiterHeroSection.displayName = 'RecruiterHeroSection';

export default RecruiterHeroSection;
