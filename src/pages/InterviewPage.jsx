/**
 * InterviewPage
 * 
 * Trang quản lý interviews của jobseeker
 * Bao gồm:
 * - Applications với interviews được assigned
 * - Lịch sử interviews đã hoàn thành với điểm và feedback
 */

import React from 'react';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/components_lite/Footer';
import { ApplicationsWithInterviews, InterviewHistory } from '@/components/applications';
import { Briefcase, GraduationCap } from 'lucide-react';

/**
 * InterviewHero Component
 * Hero section for interviews page
 */
const InterviewHero = () => {
  return (
    <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">My Interviews</h1>
        </div>
        <p className="mt-2 text-blue-100 max-w-2xl text-lg">
          Manage your assigned interviews and view your interview history with results
        </p>
      </div>
    </div>
  );
};

/**
 * Main InterviewPage Component
 */
const InterviewPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Navbar */}
      <Navbar />
      
      {/* Hero Section */}
      <InterviewHero />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Dashboard Content */}
        <div className="relative z-10">
          {/* Applications with Interviews Section */}
          <ApplicationsWithInterviews />

          {/* Interview History Section */}
          <InterviewHistory />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default InterviewPage;
