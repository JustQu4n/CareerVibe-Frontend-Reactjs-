import React from 'react';
import { Briefcase, TrendingUp, Target } from 'lucide-react';

/**
 * ApplicationsHero Component
 * Hiển thị hero section cho trang applications
 */
const ApplicationsHero = () => {
  return (
    <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left content */}
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
              <Briefcase className="h-4 w-4" />
              <span className="text-sm font-medium">Application Management</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Your Job Applications
            </h1>
            <p className="text-lg text-blue-100 max-w-2xl mb-6">
              Track the status of your applications and stay updated on your job search journey
            </p>
            
            {/* Quick stats */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <div className="h-12 w-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-blue-100">Success Rate</p>
                  <p className="text-xl font-bold">Track & Improve</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-12 w-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-blue-100">Progress</p>
                  <p className="text-xl font-bold">Real-time Updates</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right decorative element */}
          <div className="hidden lg:block">
            <div className="relative w-64 h-64">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-3xl transform rotate-6"></div>
              <div className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-3xl transform -rotate-6"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent backdrop-blur-lg rounded-3xl flex items-center justify-center">
                <Briefcase className="h-32 w-32 text-white/40" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ApplicationsHero);
