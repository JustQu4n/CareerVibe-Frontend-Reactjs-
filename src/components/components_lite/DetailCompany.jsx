/**
 * DetailCompany - Refactored Version
 * 
 * Component hiển thị chi tiết về công ty
 * Đã được refactor để:
 * - Tách UI components riêng biệt vào thư mục company-details/
 * - Sử dụng custom hook (useCompanyDetails) để quản lý state
 * - Tách API calls vào service file (companyService)
 * - Tối ưu performance với React.memo và useCallback
 * - Clean code, loại bỏ console.log và code không cần thiết
 * - Tuân thủ React best practices
 */

import React, { useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Navbar } from '../navbar';
import Footer from './Footer';

// Import UI Components đã được tách riêng
import {
  LoadingState,
  ErrorState,
  EmptyState,
  CompanyBreadcrumb,
  CompanyHeroBanner,
  CompanyHeader,
  CompanyDescription,
  CompanyBenefits,
  CompanyInfoGrid,
  ContactInformation,
  OpenPositions,
  CompanyValues,
} from '../company-details';

// Import Custom Hook
import useCompanyDetails from '@/hooks/useCompanyDetails';

/**
 * Main Component
 */
const DetailCompany = () => {
  const { id } = useParams();
  
  // Custom hook - Tách logic fetch data và state management
  const { companyData, loading, error } = useCompanyDetails(id);

  // Ensure page scrolls to top when viewing company detail (fix focus under footer)
  useEffect(() => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    } catch (err) {
      if (typeof window !== 'undefined') window.scrollTo(0, 0);
    }
  }, [id]);

  // Handler: Scroll to open positions section - sử dụng useCallback
  const handleViewPositions = useCallback(() => {
    const element = document.getElementById('open-positions');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Render states - Đã tách thành components riêng
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="sticky top-0 z-50 bg-white shadow-md">
          <Navbar />
        </div>
        <LoadingState />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="sticky top-0 z-50 bg-white shadow-md">
          <Navbar />
        </div>
        <ErrorState error={error} />
      </div>
    );
  }

  if (!companyData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="sticky top-0 z-50 bg-white shadow-md">
          <Navbar />
        </div>
        <EmptyState />
      </div>
    );
  }

  const { company, jobPosts = [], activeJobPostsCount = 0 } = companyData;

  // Normalize benefits into an array when API returns a string
  const benefitsList = (() => {
    if (!company) return undefined;
    const b = company.benefits;
    if (!b) return undefined;
    if (Array.isArray(b)) return b;
    // Split by newlines, semicolons, or periods and filter empties
    return b.split(/\r?\n|;|\.|,/).map(s => s.trim()).filter(Boolean);
  })();

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      {/* Navbar - Sticky navigation */}
      <div className="sticky top-0 z-50 bg-white shadow-md">
        <Navbar />
      </div>

      {/* Breadcrumb Navigation */}
      <CompanyBreadcrumb companyName={company.name} />

      {/* Hero Banner */}
      <CompanyHeroBanner company={company} />

      {/* Main Content */}
      <div className="container mx-auto px-4 -mt-16 relative z-10 pb-12">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Company Header - Logo và View Positions Button */}
          <CompanyHeader 
            company={company}
            jobPosts={jobPosts}
            onViewPositions={handleViewPositions}
          />

          {/* Company Description (use overview if available) */}
          <CompanyDescription description={company.overview || company.description} />

          {/* Company Benefits */}
          <CompanyBenefits benefits={benefitsList} />

          {/* Company Values (vision, mission, innovation, sustainability) */}
          <CompanyValues
            vision={company.vision}
            mission={company.mission}
            innovation={company.innovation}
            sustainability={company.sustainability}
          />

          {/* Company Info Grid và Contact Information */}
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <CompanyInfoGrid 
              company={company}
              jobPostsCount={activeJobPostsCount || jobPosts.length}
            />
            <ContactInformation company={company} />
          </div>

          {/* Open Positions Section */}
          <div id="open-positions">
            <OpenPositions jobPosts={jobPosts} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default DetailCompany;