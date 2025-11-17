import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { 
  Heart, 
  Building2, 
  MapPin, 
  Briefcase, 
  ChevronRight, 
  Search,
  Loader2,
  XCircle
} from 'lucide-react';
import { Navbar } from '../navbar';
import Footer from '../components_lite/Footer';
import { getFollowedCompanies, unfollowCompany } from '@/services/companyFollowService';

const FollowedCompanies = () => {
  const navigate = useNavigate();
  const [followedCompanies, setFollowedCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [unfollowingId, setUnfollowingId] = useState(null);

  useEffect(() => {
    fetchFollowedCompanies();
  }, [currentPage]);

  const fetchFollowedCompanies = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        toast.error('Please login to view followed companies');
        navigate('/login');
        return;
      }

      const response = await getFollowedCompanies(token, { 
        page: currentPage, 
        limit: 12 
      });

      if (response.data) {
        setFollowedCompanies(response.data);
        setTotalPages(response.totalPages || 1);
      }
    } catch (error) {
      console.error('Error fetching followed companies:', error);
      toast.error(error.response?.data?.message || 'Failed to load followed companies');
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollow = async (companyId, companyName) => {
    try {
      setUnfollowingId(companyId);
      const token = localStorage.getItem('accessToken');
      
      await unfollowCompany(companyId, token);
      setFollowedCompanies(followedCompanies.filter(item => item.company.company_id !== companyId));
      toast.success(`Unfollowed ${companyName}`);
    } catch (error) {
      console.error('Error unfollowing company:', error);
      toast.error(error.response?.data?.message || 'Failed to unfollow company');
    } finally {
      setUnfollowingId(null);
    }
  };

  const filteredCompanies = followedCompanies.filter(item => {
    const company = item.company;
    return company?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           company?.industry?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           company?.location?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navbar */}
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <Navbar />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3 flex items-center">
            <div className="bg-pink-100 p-2 rounded-lg mr-4">
              <Heart className="h-8 w-8 text-pink-600 fill-current" />
            </div>
            Followed Companies
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Stay updated with companies you're interested in and never miss new job opportunities
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-sm p-5 mb-8 border border-gray-100">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search followed companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full py-3 px-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
            />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-12 h-12 text-pink-600 animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Loading followed companies...</p>
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-pink-100 text-pink-600 mb-6">
              <Heart className="h-10 w-10" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No followed companies</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              {searchQuery 
                ? "No companies match your search criteria."
                : "You haven't followed any companies yet. Start following companies to stay updated with their latest job postings."}
            </p>
            {!searchQuery && (
              <button
                onClick={() => navigate('/browse')}
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg hover:shadow-lg transition-all font-medium"
              >
                Browse Companies
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="mb-6 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Showing <span className="font-medium text-pink-600">{filteredCompanies.length}</span> followed companies
              </p>
            </div>

            {/* Companies Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredCompanies.map((item) => {
                  const company = item.company;
                  return (
                    <motion.div
                      key={company.company_id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-pink-200 overflow-hidden"
                    >
                      {/* Header with gradient */}
                      <div className="h-24 bg-gradient-to-r from-pink-500 to-red-500 relative">
                        <div className="absolute bottom-0 translate-y-1/2 left-6">
                          <div className="h-16 w-16 bg-white rounded-xl shadow-md flex items-center justify-center overflow-hidden p-2">
                            {company.logo_url ? (
                              <img src={company.logo_url} alt={company.name} className="h-full w-full object-contain" />
                            ) : (
                              <Building2 className="h-8 w-8 text-gray-400" />
                            )}
                          </div>
                        </div>
                        <button 
                          onClick={() => handleUnfollow(company.company_id, company.name)}
                          disabled={unfollowingId === company.company_id}
                          className="absolute top-3 right-3 text-white hover:text-red-200 transition-colors p-1 hover:bg-white/20 rounded-full disabled:opacity-50"
                          aria-label="Unfollow company"
                        >
                          {unfollowingId === company.company_id ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <XCircle className="h-5 w-5" />
                          )}
                        </button>
                      </div>

                      <div className="p-6 pt-12">
                        <h3 
                          onClick={() => navigate(`/company-details/${company.company_id}`)}
                          className="font-semibold text-lg text-gray-900 group-hover:text-pink-600 transition-colors cursor-pointer mb-1"
                        >
                          {company.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">{company.industry || "Technology"}</p>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-500">
                            <div className="bg-gray-100 p-1 rounded-full mr-2">
                              <MapPin className="h-3.5 w-3.5 text-gray-600" />
                            </div>
                            {company.location || "Location not specified"}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <div className="bg-gray-100 p-1 rounded-full mr-2">
                              <Briefcase className="h-3.5 w-3.5 text-gray-600" />
                            </div>
                            {company.activeJobPostsCount || 0} open positions
                          </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                          <div className="flex items-center text-xs text-gray-500">
                            <Heart className="h-3.5 w-3.5 mr-1 fill-current text-pink-500" />
                            Followed {item.followed_at ? format(new Date(item.followed_at), 'MMM d, yyyy') : "Recently"}
                          </div>
                          <button
                            onClick={() => navigate(`/company-details/${company.company_id}`)}
                            className="inline-flex items-center text-sm font-medium text-pink-600 hover:text-pink-800 transition-colors"
                          >
                            View
                            <ChevronRight className="ml-1 h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default FollowedCompanies;
