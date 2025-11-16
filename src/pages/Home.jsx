import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { MainLayout } from '@/layouts';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { useHomeData } from '@/hooks/useHomeData';

import {
  HeroSection,
  StatsSection,
  HowItWorksSection,
  RecommendedJobsSection,
  FeaturedJobsSection,
} from '@/components/home';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  
  useGetAllJobs();

  const {
    currentJobs,
    currentPage,
    totalPages,
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
  } = useHomeData();

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

      <HowItWorksSection />

      <RecommendedJobsSection
        jobs={recommendedJobs}
        isLoading={isLoadingRecommendations}
        error={recommendationError}
        user={user}
      />

      <FeaturedJobsSection
        jobs={currentJobs}
        currentPage={currentPage}
        totalPages={totalPages}
        onNextPage={nextPage}
        onPrevPage={prevPage}
      />
    </MainLayout>
  );
};

export default Home;
