import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { MainLayout } from '@/layouts';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { useHomeData } from '@/hooks/useHomeData';
import useAIRecommendations from '@/hooks/useAIRecommendations';

import {
  HeroSection,
  StatsSection,
  HowItWorksSection,
  RecommendedJobsSection,
  AIRecommendedJobsSection,
  FeaturedJobsSection,
  MostViewedJobsSection,
  PopularCategoriesSection,
  TopCompaniesSection,
  AIMatchingSection,
  CTASection,
} from '@/components/home';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  
  useGetAllJobs();

  const {
    currentJobs,
    currentPage,
    totalPages,
    featuredJobs,
    featuredPage,
    featuredTotalPages,
    isLoadingFeatured,
    mostViewedJobs,
    mostViewedPage,
    mostViewedTotalPages,
    isLoadingMostViewed,
    recommendedJobs,
    isLoadingRecommendations,
    recommendationError,
    searchTitle,
    searchLocation,
    isSearching,
    setSearchTitle,
    setSearchLocation,
    setSearchTerm,
    handleSearch,
    nextPage,
    prevPage,
    nextFeaturedPage,
    prevFeaturedPage,
    nextMostViewedPage,
    prevMostViewedPage,
  } = useHomeData();

  // Fetch AI recommendations from Python service
  const {
    recommendations: aiRecommendations,
    isLoading: isLoadingAI,
    error: aiError,
  } = useAIRecommendations();

  useEffect(() => {
    if (user?.role === 'Recruiter') {
      navigate('/admin/dashboard');
    }
  }, [user, navigate]);

  return (
    <MainLayout>
      <HeroSection
        searchTitle={searchTitle}
        searchLocation={searchLocation}
        isSearching={isSearching}
        onSearchTitleChange={setSearchTitle}
        onSearchLocationChange={setSearchLocation}
        onSearchSubmit={handleSearch}
        onPopularSearchClick={setSearchTerm}
      />

      <StatsSection />

      <PopularCategoriesSection />
      {/*
      <RecommendedJobsSection
        jobs={recommendedJobs}
        isLoading={isLoadingRecommendations}
        error={recommendationError}
        user={user}
      />
      <AIRecommendedJobsSection
        recommendations={aiRecommendations}
        isLoading={isLoadingAI}
        error={aiError}
        user={user}
      />
      */}

      <FeaturedJobsSection
        jobs={featuredJobs}
        currentPage={featuredPage - 1}
        totalPages={featuredTotalPages}
        onNextPage={nextFeaturedPage}
        onPrevPage={prevFeaturedPage}
        isLoading={isLoadingFeatured}
      />

      <MostViewedJobsSection
        jobs={mostViewedJobs}
        currentPage={mostViewedPage - 1}
        totalPages={mostViewedTotalPages}
        onNextPage={nextMostViewedPage}
        onPrevPage={prevMostViewedPage}
        isLoading={isLoadingMostViewed}
      />

      <AIMatchingSection />



      <TopCompaniesSection />

    

     {/* <HowItWorksSection /> */}

    

      <CTASection />
    </MainLayout>
  );
};

export default Home;
