/**
 * HowItWorksSection Component
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Search, Briefcase, Star } from 'lucide-react';

const STEPS = [
  {
    icon: Search,
    title: 'Search Jobs',
    desc: 'Browse thousands of jobs across different categories and locations.',
  },
  {
    icon: Briefcase,
    title: 'Apply Instantly',
    desc: 'Submit your application with just a few clicks using your saved profile.',
  },
  {
    icon: Star,
    title: 'Get Hired',
    desc: 'Connect with employers and start your new career journey.',
  },
];

const HowItWorksSection = React.memo(() => {
  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-blue-600 font-semibold text-sm bg-blue-50 px-4 py-1.5 rounded-full">
            How It Works
          </span>
          <h2 className="text-3xl font-bold mt-3 text-gray-900">
            Find Your Dream Job in 3 Simple Steps
          </h2>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            Our streamlined process helps you discover and apply to the perfect positions
            matching your skills and career goals.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 relative"
              >
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                  {i + 1}
                </div>
                <div className="h-14 w-14 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
});

HowItWorksSection.displayName = 'HowItWorksSection';

export default HowItWorksSection;
