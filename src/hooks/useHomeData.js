/**
 * Custom Hook: useHomeData
 * Manages home page data including recommendations, search, and pagination
 */
import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import apiClient from '@/api/client';

const JOBS_PER_PAGE = 6;
const RECOMMENDATION_API_URL = import.meta.env.VITE_RECOMMENDATION_API_URL || 'http://localhost:8000';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const useHomeData = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const allJobs = useSelector((state) => state.jobs?.allJobs || []);
  
  const [recommendations, setRecommendations] = useState([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [recommendationError, setRecommendationError] = useState(null);
  
  // Featured jobs state
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(false);
  const [featuredError, setFeaturedError] = useState(null);
  const [featuredPage, setFeaturedPage] = useState(1);
  const [featuredTotalPages, setFeaturedTotalPages] = useState(1);
  
  // Most viewed jobs state
  const [mostViewedJobs, setMostViewedJobs] = useState([]);
  const [isLoadingMostViewed, setIsLoadingMostViewed] = useState(false);
  const [mostViewedError, setMostViewedError] = useState(null);
  const [mostViewedPage, setMostViewedPage] = useState(1);
  const [mostViewedTotalPages, setMostViewedTotalPages] = useState(1);
  
  const [searchTitle, setSearchTitle] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(0);
  
  const totalPages = Math.ceil(allJobs.length / JOBS_PER_PAGE);
  const currentJobs = allJobs.slice(
    currentPage * JOBS_PER_PAGE,
    (currentPage + 1) * JOBS_PER_PAGE
  );

  // Fetch featured jobs from API
  useEffect(() => {
    const fetchFeaturedJobs = async () => {
      setIsLoadingFeatured(true);
      setFeaturedError(null);

      try {
        const response = await apiClient.get('/api/jobseeker/job-posts/featured', {
          params: {
            page: featuredPage,
            limit: 6,
          },
        });

        const data = response.data?.data || response.data || [];
        const pagination = response.data?.pagination || {};
        
        setFeaturedJobs(Array.isArray(data) ? data : []);
        setFeaturedTotalPages(pagination.totalPages || 1);
      } catch (err) {
        console.error('Error fetching featured jobs:', err);
        setFeaturedError('Failed to load featured jobs');
        setFeaturedJobs([]);
      } finally {
        setIsLoadingFeatured(false);
      }
    };

    fetchFeaturedJobs();
  }, [featuredPage]);

  // Fetch most viewed jobs from API
  useEffect(() => {
    const fetchMostViewedJobs = async () => {
      setIsLoadingMostViewed(true);
      setMostViewedError(null);

      try {
        const response = await apiClient.get('/api/jobseeker/job-posts/most-viewed', {
          params: {
            page: mostViewedPage,
            limit: 6,
          },
        });

        const data = response.data?.data || response.data || [];
        const pagination = response.data?.pagination || {};
        
        setMostViewedJobs(Array.isArray(data) ? data : []);
        setMostViewedTotalPages(pagination.totalPages || 1);
      } catch (err) {
        console.error('Error fetching most viewed jobs:', err);
        setMostViewedError('Failed to load most viewed jobs');
        setMostViewedJobs([]);
      } finally {
        setIsLoadingMostViewed(false);
      }
    };

    fetchMostViewedJobs();
  }, [mostViewedPage]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user?.jobseeker?.id) return;

      setIsLoadingRecommendations(true);
      setRecommendationError(null);

      try {
        const response = await axios.get(
          `${RECOMMENDATION_API_URL}/recommend/${user.jobseeker.id}`
        );

        const filteredRecommendations = response.data.recommendations.filter(
          (rec) => rec.score > 0
        );

        setRecommendations(filteredRecommendations);
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        setRecommendationError('Failed to load recommendations');
      } finally {
        setIsLoadingRecommendations(false);
      }
    };

    fetchRecommendations();
  }, [user]);

  const recommendedJobs = recommendations
    .map((rec) => {
      const jobDetails = allJobs.find((job) => job._id === rec.job_id);
      return {
        ...rec,
        ...jobDetails,
      };
    })
    .filter((job) => job.title);

  const handleSearch = useCallback(async (e) => {
    e.preventDefault();
    setIsSearching(true);

    try {
      // Build params object with only non-empty values
      const params = {};
      if (searchTitle?.trim()) {
        params.keyword = searchTitle.trim();
      }
      if (searchLocation?.trim()) {
        params.location = searchLocation.trim();
      }

      await apiClient.get('/api/jobseeker/job-posts/search', {
        params,
      });

      // Build search URL
      const searchParams = new URLSearchParams();
      if (searchTitle?.trim()) {
        searchParams.append('keyword', searchTitle.trim());
      }
      if (searchLocation?.trim()) {
        searchParams.append('location', searchLocation.trim());
      }

      navigate({
        pathname: '/search-results',
        search: searchParams.toString() ? `?${searchParams.toString()}` : '',
      });
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to fetch search results. Please try again.');
    } finally {
      setIsSearching(false);
    }
  }, [searchTitle, searchLocation, navigate]);

  const setSearchTerm = useCallback((term) => {
    setSearchTitle(term);
  }, []);

  const nextPage = useCallback(() => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [currentPage, totalPages]);

  const prevPage = useCallback(() => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [currentPage]);

  // Featured jobs pagination
  const nextFeaturedPage = useCallback(() => {
    if (featuredPage < featuredTotalPages) {
      setFeaturedPage((prev) => prev + 1);
    }
  }, [featuredPage, featuredTotalPages]);

  const prevFeaturedPage = useCallback(() => {
    if (featuredPage > 1) {
      setFeaturedPage((prev) => prev - 1);
    }
  }, [featuredPage]);

  // Most viewed jobs pagination
  const nextMostViewedPage = useCallback(() => {
    if (mostViewedPage < mostViewedTotalPages) {
      setMostViewedPage((prev) => prev + 1);
    }
  }, [mostViewedPage, mostViewedTotalPages]);

  const prevMostViewedPage = useCallback(() => {
    if (mostViewedPage > 1) {
      setMostViewedPage((prev) => prev - 1);
    }
  }, [mostViewedPage]);

  return {
    user,
    allJobs,
    currentJobs,
    currentPage,
    totalPages,
    
    // Featured jobs data
    featuredJobs,
    isLoadingFeatured,
    featuredError,
    featuredPage,
    featuredTotalPages,
    
    // Most viewed jobs data
    mostViewedJobs,
    isLoadingMostViewed,
    mostViewedError,
    mostViewedPage,
    mostViewedTotalPages,
    
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
  };
};

export default useHomeData;
