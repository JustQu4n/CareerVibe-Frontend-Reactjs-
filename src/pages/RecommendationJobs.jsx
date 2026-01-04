/**
 * Recommendation Jobs Page
 * Displays personalized job recommendations for the user
 * Clean, minimalist design without gradients
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/components_lite/Footer';
import apiClient from '@/api/client';
import { 
  Sparkles, 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Clock, 
  Building2,
  Bookmark,
  ExternalLink,
  Loader2,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'react-toastify';

const RecommendationJobs = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth?.user);

  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState(new Set());

  useEffect(() => {
    if (user?.user_id) {
      fetchRecommendations();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchRecommendations = async (retryCount = 0) => {
    try {
      setLoading(true);
      
      // Increase timeout to 60 seconds for ML/AI processing
      const response = await apiClient.get(
        `http://127.0.0.1:8000/recommendations/${user?.job_seeker_id}`,
        { 
          timeout: 60000 // 60 seconds for recommendation processing
        }
      );
      
      // Transform backend data to component format
      const transformedJobs = response.data.map((job) => ({
        job_id: job.job_post_id,
        title: job.title,
        company: {
          name: job.company_name,
          logo_url: job.company_logo,
        },
        location: job.location,
        salary_range: job.salary_range,
        job_type: job.job_type === 'full_time' ? 'Full-time' : 
                  job.job_type === 'part_time' ? 'Part-time' :
                  job.job_type === 'contract' ? 'Contract' : job.job_type,
        match_score: Math.round(job.score * 100), // Convert 0-1 to percentage
        posted_at: job.posted_date || 'Recently',
        description: job.description,
        snippet: job.snippet,
        skills: job.skills || [], // Add empty array as fallback
      }));
      
      setJobs(transformedJobs);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      
      // Retry logic for timeout errors
      if (error.code === 'ECONNABORTED' && retryCount < 2) {
        toast.warning(`Request timeout. Retrying... (${retryCount + 1}/2)`);
        setTimeout(() => fetchRecommendations(retryCount + 1), 2000);
        return;
      }
      
      // Better error messages
      if (error.code === 'ECONNABORTED') {
        toast.error('The recommendation service is taking too long. Please try again later.');
      } else if (error.response?.status === 404) {
        toast.error('Recommendation service not available. Please check your profile.');
      } else if (error.code === 'ERR_NETWORK') {
        toast.error('Cannot connect to server. Please check your connection.');
      } else {
        toast.error('Failed to load recommendations. Please try again.');
      }
      
      setLoading(false);
    }
  };

  const handleSaveJob = (jobId) => {
    setSavedJobs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
        toast.success('Job removed from saved items');
      } else {
        newSet.add(jobId);
        toast.success('Job saved successfully');
      }
      return newSet;
    });
  };

  const handleViewDetails = (jobId) => {
    navigate(`/job/${jobId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 max-w-6xl">
          {/* Header Skeleton */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-9 h-9 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="h-4 w-96 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="h-3 w-20 bg-gray-200 rounded animate-pulse mb-2"></div>
                      <div className="h-8 w-12 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Job Cards Skeleton */}
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-2">
                        <div className="flex-1">
                          <div className="h-5 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
                          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                        <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                      </div>
                      <div className="flex gap-3 mb-3">
                        {[1, 2, 3, 4].map((j) => (
                          <div key={j} className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <div className="h-9 w-28 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-9 w-20 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Recommended for You
            </h1>
          </div>
          <p className="text-sm text-gray-600">
            Personalized job matches based on your profile, skills, and preferences
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Total Matches</p>
                  <p className="text-2xl font-bold text-gray-900">{jobs.length}</p>
                </div>
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Avg Match Score</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {jobs.length > 0 
                      ? Math.round(jobs.reduce((acc, job) => acc + job.match_score, 0) / jobs.length)
                      : 0}%
                  </p>
                </div>
                <Sparkles className="w-5 h-5 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Saved Jobs</p>
                  <p className="text-2xl font-bold text-gray-900">{savedJobs.size}</p>
                </div>
                <Bookmark className="w-5 h-5 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Jobs List */}
        <div className="space-y-4">
          {jobs.length === 0 ? (
            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="p-8 text-center">
                <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No recommendations yet
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Complete your profile to get personalized job recommendations
                </p>
                <Button
                  onClick={() => navigate('/profile/edit')}
                  className="bg-blue-600 hover:bg-blue-700 text-white h-9 px-5 text-sm"
                >
                  Complete Profile
                </Button>
              </CardContent>
            </Card>
          ) : (
            jobs.map((job) => (
              <Card key={job.job_id} className="border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all">
                <CardContent className="p-4">
                  <div className="flex flex-col lg:flex-row gap-4">
                    {/* Company Logo */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg border border-gray-200 flex items-center justify-center bg-gray-50">
                        {job.company.logo_url ? (
                          <img
                            src={job.company.logo_url}
                            alt={job.company.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Building2 className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                    </div>

                    {/* Job Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-0.5">
                            {job.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {job.company.name}
                          </p>
                        </div>
                        <Badge 
                          variant="outline" 
                          className="border border-blue-600 text-blue-600 bg-blue-50 font-medium px-2 py-0.5 text-xs"
                        >
                          {job.match_score}% Match
                        </Badge>
                      </div>

                      {/* Job Info */}
                      <div className="flex flex-wrap gap-3 mb-3 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-gray-500" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3.5 h-3.5 text-gray-500" />
                          {job.salary_range}
                        </div>
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-3.5 h-3.5 text-gray-500" />
                          {job.job_type}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-gray-500" />
                          {job.posted_at}
                        </div>
                      </div>

                      {/* Skills */}
                      {job.skills && job.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {job.skills.map((skill, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="border border-gray-300 text-gray-700 bg-gray-50 text-xs px-2 py-0.5"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleViewDetails(job.job_id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white h-9 px-4 text-sm"
                        >
                          <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                          View Details
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleSaveJob(job.job_id)}
                          className={`border h-9 px-4 text-sm ${
                            savedJobs.has(job.job_id)
                              ? 'border-blue-600 bg-blue-50 text-blue-600 hover:bg-blue-100'
                              : 'border-gray-300 text-gray-700 hover:border-gray-400'
                          }`}
                        >
                          <Bookmark
                            className={`w-3.5 h-3.5 mr-1.5 ${savedJobs.has(job.job_id) ? 'fill-blue-600' : ''}`}
                          />
                          {savedJobs.has(job.job_id) ? 'Saved' : 'Save'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Load More */}
        {jobs.length > 0 && (
          <div className="text-center mt-6">
            <Button
              variant="outline"
              className="border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 h-9 px-6 text-sm"
            >
              Load More Recommendations
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default RecommendationJobs;
