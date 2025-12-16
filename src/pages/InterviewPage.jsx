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
 * Hero section cho trang interviews
 */
const InterviewHero = () => {
  return (
    <div className="bg-blue-600 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-2">
          <GraduationCap className="w-10 h-10" />
          <h1 className="text-3xl md:text-4xl font-bold">My Interviews</h1>
        </div>
        <p className="mt-2 text-blue-100 max-w-2xl">
          Quản lý các bài phỏng vấn được giao và xem lịch sử kết quả phỏng vấn của bạn
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
