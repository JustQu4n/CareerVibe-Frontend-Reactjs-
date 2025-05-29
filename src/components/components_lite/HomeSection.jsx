import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  BriefcaseBusiness,
  Building2,
  UsersRound,
  Rss,
  MapPin,
  Briefcase,
  Search,
  ChevronRight,
  ChevronLeft,
  Clock,
  Star,
  TrendingUp,
  Bookmark,
  ExternalLink,
  ChevronsRight,
  Award,
  Users,
  DollarSign,
  Heart,
  Globe,
  Calendar,
  User,
  Check,
  ArrowRight,
  AlertTriangle,
  Layers
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import JobCard from "./JobCard";

export default function HomePage() {
  const navigate = useNavigate();
  const allJobs = useSelector((state) => state.jobs?.allJobs || []);
  const stats = [
    {
      icon: <BriefcaseBusiness size={24} className="text-blue-600" />,
      value: "175,324",
      label: "Live Jobs",
    },
    {
      icon: <Building2 size={24} className="text-blue-600" />,
      value: "97,354",
      label: "Companies",
    },
    {
      icon: <UsersRound size={24} className="text-blue-600" />,
      value: "3,847,154",
      label: "Candidates",
    },
    {
      icon: <Rss size={24} className="text-blue-600" />,
      value: "7,532",
      label: "New Jobs",
    },
  ];
  const { user } = useSelector((state) => state.auth);

  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [searchTitle, setSearchTitle] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  
  // For featured jobs pagination
  const [currentPage, setCurrentPage] = useState(0);
  const jobsPerPage = 6;
  const totalPages = Math.ceil(allJobs.length / jobsPerPage);

  useEffect(() => {
    const fetchRecommendations = async () => {
      // Only fetch if user is logged in
      if (!user?.jobseeker?.id) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `http://localhost:8000/recommend/${user?.jobseeker?.id}`
        );

        // Filter recommendations with score > 0
        const filteredRecommendations = response.data.recommendations.filter(
          (rec) => rec.score > 0
        );

        setRecommendations(filteredRecommendations);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        setError("Failed to load recommendations");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [user]);

  const getRecommendedJobs = () => {
    if (!recommendations.length) return [];

    return recommendations
      .map((rec) => {
        // Find the full job details from allJobs using job_id
        const jobDetails = allJobs.find((job) => job._id === rec.job_id);

        // Return combined data - recommendation info + job details
        return {
          ...rec,
          ...jobDetails,
        };
      })
      .filter((job) => job.title); // Filter out any jobs that couldn't be found
  };

  const recommendedJobs = getRecommendedJobs();

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsSearching(true);
    setSearchError(null);
    setHasSearched(true);

    try {
      const response = await axios.get(
        `http://localhost:5000/api/job-posts/search`,
        {
          params: {
            title: searchTitle,
            location: searchLocation,
          },
        }
      );

      navigate({
        pathname: "/search-results",
        search: `?title=${encodeURIComponent(
          searchTitle
        )}&location=${encodeURIComponent(searchLocation)}`,
      });
    } catch (error) {
      console.error("Search error:", error);
      setSearchError("Failed to fetch search results. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };
  
  const getTimeAgo = (date) => {
    // Sample function - in real app, use date-fns or similar
    return "3 hours ago";
  };
  
  // Calculate the current visible jobs based on pagination
  const currentJobs = allJobs.slice(currentPage * jobsPerPage, (currentPage + 1) * jobsPerPage);
  
  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 pt-16 pb-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-blue-100 to-transparent opacity-70"></div>
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4 text-gray-900">
              Find a job that matches your <span className="text-blue-600 relative">
                passion
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 12" preserveAspectRatio="none">
                  <path d="M0,0 Q50,12 100,0" fill="none" stroke="#3b82f6" strokeWidth="3" />
                </svg>
              </span> & expertise
            </h1>
            <p className="text-lg mb-8 text-gray-600 leading-relaxed">
              Explore thousands of job opportunities with all the information you need. Make your future happen.
            </p>
            
            <form onSubmit={handleSearch} className="bg-white p-2 rounded-xl shadow-xl flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                <Input
                  placeholder="Job title or keyword"
                  className="pl-10 h-12 w-full bg-gray-50 border-0 focus:ring-2 focus:ring-blue-500"
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                />
              </div>
              <div className="relative md:w-1/3">
                <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                <Input
                  placeholder="Location"
                  className="pl-10 h-12 w-full bg-gray-50 border-0 focus:ring-2 focus:ring-blue-500"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                className="h-12 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-all"
                disabled={isSearching}
              >
                {isSearching ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Find Jobs
                  </>
                )}
              </Button>
            </form>
            
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="text-sm text-gray-500">Popular Searches:</span>
              {["Software Engineer", "Data Analyst", "Product Manager", "UX Designer"].map((term, i) => (
                <button 
                  key={i}
                  onClick={() => setSearchTitle(term)}
                  className="text-sm px-3 py-1 bg-white border border-gray-200 rounded-full text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden md:block"
          >
            <img
              src="/src/assets/Illustration.png"
              alt="Job search illustration"
              className="w-full h-auto drop-shadow-xl"
            />
          </motion.div>
        </div>
        
        {/* Wave SVG at bottom */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" fill="#ffffff">
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,100L1360,100C1280,100,1120,100,960,100C800,100,640,100,480,100C320,100,160,100,80,100L0,100Z"></path>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-100 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg text-blue-600">{item.icon}</div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{item.value}</h2>
                    <p className="text-gray-500 text-sm">{item.label}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-6 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-blue-600 font-semibold text-sm bg-blue-50 px-4 py-1.5 rounded-full">How It Works</span>
            <h2 className="text-3xl font-bold mt-3 text-gray-900">Find Your Dream Job in 3 Simple Steps</h2>
            <p className="text-gray-600 mt-3 max-w-2xl mx-auto">Our streamlined process helps you discover and apply to the perfect positions matching your skills and career goals.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[
              {
                icon: <Search className="h-8 w-8 text-blue-600" />,
                title: "Search Jobs",
                desc: "Browse thousands of jobs across different categories and locations."
              },
              {
                icon: <Briefcase className="h-8 w-8 text-blue-600" />,
                title: "Apply Instantly",
                desc: "Submit your application with just a few clicks using your saved profile."
              },
              {
                icon: <Star className="h-8 w-8 text-blue-600" />,
                title: "Get Hired",
                desc: "Connect with employers and start your new career journey."
              }
            ].map((step, i) => (
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
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recommend Jobs */}
      {user?.jobseeker?.id && (
        <section className="py-16 px-6 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
              <div>
                <span className="text-blue-600 font-semibold text-sm bg-blue-100 px-4 py-1.5 rounded-full">
                  Personalized For You
                </span>
                <h2 className="text-3xl font-bold mt-3 text-gray-900 flex items-center">
                  Recommended Jobs
                  <div className="ml-3 px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-md flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    AI Powered
                  </div>
                </h2>
                <p className="text-gray-600 mt-2">
                  Jobs matching your skills, experience, and preferences
                </p>
              </div>
              
              <button 
                onClick={() => navigate('/find-job')}
                className="mt-4 md:mt-0 flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                View All Recommendations
                <ChevronRight className="h-5 w-5 ml-1" />
              </button>
            </div>

            {isLoading && (
              <div className="flex items-center justify-center py-16">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                <p className="ml-4 text-gray-600 font-medium">Finding the perfect matches for you...</p>
              </div>
            )}

            {error && (
              <div className="text-center py-10 px-6 bg-red-50 rounded-xl border border-red-100">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 mb-4">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">Unable to Load Recommendations</h3>
                <p className="text-red-600">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {!isLoading && !error && recommendedJobs.length === 0 && (
              <div className="text-center py-12 px-6 bg-blue-50 rounded-xl border border-blue-100">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                  <Layers className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Recommendations Yet</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  We're still learning about your preferences. Update your profile or browse jobs to help us provide better recommendations.
                </p>
                <button 
                  onClick={() => navigate('/profile')}
                  className="mt-6 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Update Your Profile
                </button>
              </div>
            )}

            {!isLoading && !error && recommendedJobs.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedJobs.map((job, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center mr-3">
                            <img 
                              src={job.company_id?.logo || "https://via.placeholder.com/40x40"} 
                              alt={`${job.company_id?.name || "Company"} logo`}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{job.company_id?.name || "Company"}</h3>
                            <div className="flex items-center text-xs text-gray-500">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span>{job.location || "Remote"}</span>
                            </div>
                          </div>
                        </div>
                        <div className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-md flex items-center">
                          <Star className="h-3 w-3 mr-1" />
                          {Math.round(job.score * 100)}% Match
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{job.title}</h3>
                      
                      <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                        <div className="flex items-center">
                          <Briefcase className="h-4 w-4 mr-1 text-gray-400" />
                          <span>{job.job_type === "full_time"
                                ? "Full-time"
                                : job.job_type === "part_time"
                                ? "Part-time"
                                : job.job_type}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-gray-400" />
                          <span>{getTimeAgo(job.created_at)}</span>
                        </div>
                      </div>
                      
                      <div className="mb-4 flex flex-wrap gap-2">
                        {job.skills?.slice(0, 3).map((skill, idx) => (
                          <span 
                            key={idx}
                            className="inline-block px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                        {job.skills?.length > 3 && (
                          <span className="inline-block px-2.5 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                            +{job.skills.length - 3} more
                          </span>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                        <div className="text-blue-600 text-sm font-medium">
                          {/* {job.salary ? `$${job.salary.toLocaleString()}` : "Competitive Salary"} */}
                        </div>
                        <button 
                          onClick={() => navigate(`/view-job-detail/${job._id}`)}
                          className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-600 hover:text-white transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Feature Jobs */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
            <div>
              <span className="text-blue-600 font-semibold text-sm bg-blue-50 px-4 py-1.5  rounded-full">
                Explore Opportunities
              </span>
              <h2 className="text-3xl font-bold mt-3 text-gray-900">Featured Jobs</h2>
              <p className="text-gray-600 mt-2">
                Discover handpicked positions from top employers
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <div className="flex">
                <button 
                  onClick={prevPage}
                  disabled={currentPage === 0}
                  className={`w-10 h-10 flex items-center justify-center rounded-l-lg border border-r-0 ${
                    currentPage === 0 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button 
                  onClick={nextPage}
                  disabled={currentPage >= totalPages - 1}
                  className={`w-10 h-10 flex items-center justify-center rounded-r-lg border ${
                    currentPage >= totalPages - 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
              <button 
                onClick={() => navigate('/find-job')}
                className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                Browse All Jobs
                <ChevronRight className="h-5 w-5 ml-1" />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentJobs.map((job, idx) => (
              <motion.div
                key={job._id || idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                onClick={() => navigate(`/view-job-detail/${job._id}`)}
                className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all duration-300 cursor-pointer relative group"
              >
                {/* Top badge */}
                <div className="absolute top-4 right-4 z-10">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-600 text-white">
                    <Star className="h-3 w-3 mr-1 fill-white" />
                    Featured
                  </span>
                </div>
                
                {/* Bookmark button - appears on hover */}
                <button className="absolute top-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50">
                  <Bookmark className="h-4 w-4 text-gray-500 hover:text-blue-600" />
                </button>
                
                <div className="p-6">
                  {/* Company info */}
                  <div className="flex items-start space-x-3 mb-4">
                    <div className="h-12 w-12 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      {job.company_id?.logo ? (
                        <img 
                          src={job.company_id.logo} 
                          alt={`${job.company_id.name} logo`}
                          className="h-full w-full object-contain" 
                        />
                      ) : (
                        <Building2 className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <span className="block text-gray-500 text-sm">
                        <Clock className="h-3.5 w-3.5 inline mr-1" />
                        Posted {getTimeAgo(job.created_at)}
                      </span>
                      <h3 className="font-medium text-gray-900 mt-0.5">
                        {job.company_id?.name || "Company Name"}
                      </h3>
                    </div>
                  </div>
                  
                  {/* Job title */}
                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {job.title}
                  </h2>
                  
                  {/* Job details */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 text-gray-400 mr-1.5" />
                      <span className="truncate">{job.location || "Remote"}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Briefcase className="h-4 w-4 text-gray-400 mr-1.5" />
                      <span>{job.job_type === "full_time"
                                ? "Full-time"
                                : job.job_type === "part_time"
                                ? "Part-time"
                                : job.job_type}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="h-4 w-4 text-gray-400 mr-1.5" />
                      <span>{job.salary ? `$${job.salary.toLocaleString()}` : "Competitive"}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 text-gray-400 mr-1.5" />
                      <span>{job.experience || "1-3 years"}</span>
                    </div>
                  </div>
                  
                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skills?.slice(0, 3).map((tag, tagIdx) => (
                      <span
                        key={tagIdx}
                        className="px-3 py-1 text-xs bg-gray-50 text-gray-700 rounded-full font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                    {(job.skills?.length || 0) > 3 && (
                      <span className="px-3 py-1 text-xs bg-gray-50 text-gray-500 rounded-full">
                        +{job.skills.length - 3} more
                      </span>
                    )}
                  </div>
                  
                  {/* Action bar */}
                  <div className="pt-3 mt-2 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-sm font-medium text-blue-600">
                      <Award className="h-4 w-4 inline mr-1" />
                      Top Employer
                    </span>
                    <span className="inline-flex items-center text-sm font-medium text-blue-600 group-hover:translate-x-1 transition-transform">
                      Apply Now
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Mobile pagination */}
          <div className="mt-8 flex justify-center md:hidden">
            <div className="flex items-center space-x-2">
              <button 
                onClick={prevPage}
                disabled={currentPage === 0}
                className={`w-10 h-10 flex items-center justify-center rounded-lg border ${
                  currentPage === 0 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700'
                }`}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage + 1} of {totalPages}
              </span>
              <button 
                onClick={nextPage}
                disabled={currentPage >= totalPages - 1}
                className={`w-10 h-10 flex items-center justify-center rounded-lg border ${
                  currentPage >= totalPages - 1 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700'
                }`}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {/* View all jobs link (mobile) */}
          <div className="mt-8 text-center md:hidden">
            <button 
              onClick={() => navigate('/find-job')}
              className="inline-flex items-center text-blue-600 font-medium"
            >
              Browse All Jobs
              <ChevronsRight className="ml-1 h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Top Companies */}
      <section className="py-16 px-6 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-blue-600 font-semibold text-sm bg-blue-50 px-4 py-1.5 rounded-full">
              Top Employers
            </span>
            <h2 className="text-3xl font-bold mt-3 text-gray-900">Featured Companies Hiring Now</h2>
            <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
              Explore opportunities with these leading organizations across various industries
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 transition-all duration-300 text-center group"
              >
                <div className="h-16 w-16 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                  <Building2 className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {["Google", "Microsoft", "Amazon", "Apple", "Meta", "Netflix", "Adobe", "Shopify"][i % 8]}
                </h3>
                <p className="text-sm text-gray-500 mb-3">
                  {["Mountain View, CA", "Redmond, WA", "Seattle, WA", "Cupertino, CA", "Menlo Park, CA", "Los Gatos, CA", "San Jose, CA", "Ottawa, Canada"][i % 8]}
                </p>
                <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-sm font-medium rounded-full">
                  {Math.floor(Math.random() * 20) + 1} open positions
                </span>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <button 
              onClick={() => navigate('/companies')}
              className="inline-flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors"
            >
              View All Companies
              <ChevronRight className="ml-1 h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-6 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <span className="text-blue-600 font-semibold text-sm bg-blue-100 px-4 py-1.5 rounded-full">
              Success Stories
            </span>
            <h2 className="text-3xl font-bold mt-3 text-gray-900">What Our Users Say</h2>
            <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
              Hear from people who found their dream jobs through our platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "CareerVibe helped me find the perfect role that matched my skills and career aspirations. The personalized job recommendations were spot on!",
                name: "Sarah Johnson",
                title: "UX/UI Designer",
                company: "at Adobe"
              },
              {
                quote: "I was amazed by how quickly I received responses after applying through CareerVibe. The platform made the job search process so much easier.",
                name: "Michael Chen",
                title: "Software Engineer",
                company: "at Microsoft"
              },
              {
                quote: "The AI-powered matching feature saved me countless hours of searching through irrelevant job postings. I found my dream job in just two weeks!",
                name: "Emma Rodriguez",
                title: "Marketing Director",
                company: "at Spotify"
              }
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.2 }}
                className="bg-white p-6 rounded-xl shadow-md border border-gray-100 relative"
              >
                <div className="absolute top-6 right-6 text-blue-100">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.4 27H8.8V19.4C8.8 14.2 12.2 10.4 17 8.2L19.4 11.8C16.2 13.2 14.6 15.4 14 18.2H16.4V27ZM34.4 27H26.8V19.4C26.8 14.2 30.2 10.4 35 8.2L37.4 11.8C34.2 13.2 32.6 15.4 32 18.2H34.4V27Z" fill="currentColor"/>
                  </svg>
                </div>
                <p className="text-gray-700 mb-6 relative z-10">{testimonial.quote}</p>
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-gray-200 mr-4"></div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">
                      {testimonial.title} <span className="text-blue-600">{testimonial.company}</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Register CTA */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200 relative overflow-hidden group hover:shadow-md transition-shadow"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gray-200 rounded-full -mr-16 -mt-16 opacity-30"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gray-200 rounded-full -ml-12 -mb-12 opacity-30"></div>
              
              <div className="relative z-10">
                <div className="h-16 w-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Job Seekers</h3>
                <p className="text-gray-600 mb-6">
                  Create a profile, upload your resume, and start applying to thousands of jobs from top companies.
                </p>
                <ul className="space-y-3 mb-8">
                  {["Personalized job recommendations", "Easy 1-click apply", "Track your applications", "Career resources"].map((item, i) => (
                    <li key={i} className="flex items-center text-gray-700">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      {item}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate('/register')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors group-hover:shadow-lg"
                >
                  Create Free Account
                </button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white relative overflow-hidden group hover:shadow-md transition-shadow"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16 opacity-10"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full -ml-12 -mb-12 opacity-10"></div>
              
              <div className="relative z-10">
                <div className="h-16 w-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Employers</h3>
                <p className="text-blue-100 mb-6">
                  Post jobs, find top talent, and build your team with our powerful recruiting tools.
                </p>
                <ul className="space-y-3 mb-8">
                  {["Reach thousands of qualified candidates", "AI-powered candidate matching", "Applicant tracking system", "Employer branding tools"].map((item, i) => (
                    <li key={i} className="flex items-center text-blue-50">
                      <Check className="h-5 w-5 text-blue-200 mr-2" />
                      {item}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate('/employer/register')}
                  className="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors group-hover:shadow-lg"
                >
                  Post a Job
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Download App CTA */}
      <section className="py-16 px-6 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="mb-8 md:mb-0 md:max-w-md">
            <h2 className="text-3xl font-bold mb-4">Get the CareerVibe App</h2>
            <p className="text-gray-300 mb-6">
              Search jobs, get notifications, and stay connected with employers on the go.
              Download our mobile app today.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="flex items-center bg-black px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-colors">
                <svg className="h-6 w-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.6,13.8l-0.5-0.9l-0.5-0.9c-0.3-0.5-0.5-1-0.5-1.6c0-0.5,0.2-1,0.5-1.4l1-1.8C14.9,5.7,12.5,4.7,9.9,4.7 C4.9,4.7,0.8,8.8,0.8,13.8S4.9,22.9,9.9,22.9c2.6,0,5-0.9,6.8-2.5L15.6,18C14.6,17.3,13.3,16.9,12,16.9c-2.1,0-3.8,1.7-3.8,3.8 c0,0,0,0,0,0.1c-3.2-0.7-5.5-3.5-5.5-6.9c0-3.9,3.1-7,7-7c3.9,0,7,3.1,7,7c0,0,0,0,0,0.1L17.6,13.8z"></path>
                  <path d="M9.9,19.7c-0.9,0-1.7-0.8-1.7-1.7s0.8-1.7,1.7-1.7c0.9,0,1.7,0.8,1.7,1.7S10.8,19.7,9.9,19.7z"></path>
                  <path d="M18.7,7.3l-1.8,3.2l1.8,3.2c0.1,0.2,0.4,0.3,0.6,0.2c0.1,0,0.1-0.1,0.2-0.2c0.8-1.5,0.8-3.4,0-4.9 c-0.1-0.2-0.3-0.3-0.5-0.3C18.9,7.2,18.8,7.2,18.7,7.3z"></path>
                  <path d="M21.3,5.7l-1.8,3.2l1.8,3.2c0.1,0.2,0.4,0.3,0.6,0.2c0.1,0,0.1-0.1,0.2-0.2c0.8-1.5,0.8-3.4,0-4.9 c-0.1-0.2-0.3-0.3-0.5-0.3C21.4,5.7,21.3,5.7,21.3,5.7z"></path>
                </svg>
                <div className="text-left">
                  <div className="text-xs">Download on the</div>
                  <div className="text-sm font-medium">App Store</div>
                </div>
              </button>
              <button className="flex items-center bg-black px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-colors">
                <svg className="h-6 w-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.9,5.6L17.9,5.6l-3.3,3.3L12,6.3L5.6,12l3.3,3.3L5.6,18.4l0,0c-0.2,0.2-0.3,0.4-0.3,0.7c0,0.6,0.4,1,1,1 c0.3,0,0.5-0.1,0.7-0.3l0,0l3.3-3.3L12,18.4l6.4-5.7l-3.3-3.3l3.3-3.3l0,0c0.2-0.2,0.3-0.4,0.3-0.7c0-0.6-0.4-1-1-1 C18.3,5.3,18.1,5.4,17.9,5.6z"></path>
                  <polygon points="12,8.4 15.6,12 12,15.6 8.4,12"></polygon>
                </svg>
                <div className="text-left">
                  <div className="text-xs">GET IT ON</div>
                  <div className="text-sm font-medium">Google Play</div>
                </div>
              </button>
            </div>
          </div>
          <div className="hidden md:block">
            <img 
              src="https://via.placeholder.com/300x400" 
              alt="CareerVibe Mobile App" 
              className="h-64 object-cover rounded-xl"
            />
          </div>
        </div>
      </section>
    </div>
  );
}