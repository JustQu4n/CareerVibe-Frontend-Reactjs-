import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Building2, MapPin, Users, Briefcase, ArrowRight, TrendingUp } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/components_lite/Footer';
import { jobseekerListCompanies, jobseekerSearchCompanies } from '@/services/companyService';

const Companies = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const debounced = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

    // load initial list
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const resp = await jobseekerListCompanies();
        if (!mounted) return;
        setResults(Array.isArray(resp.data) ? resp.data : []);
      } catch (err) {
        if (!mounted) return;
        setError(err.message || 'Failed to load companies');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const doSearch = async (q) => {
    setError(null);
    if (!q || q.trim().length === 0) {
      // reload list
      try {
        setLoading(true);
        const resp = await jobseekerListCompanies();
        setResults(Array.isArray(resp.data) ? resp.data : []);
      } catch (err) {
        setError(err.message || 'Failed to load companies');
      } finally {
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    try {
      const resp = await jobseekerSearchCompanies(q);
      setResults(Array.isArray(resp.data) ? resp.data : []);
    } catch (err) {
      setError(err.message || 'Search failed');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const v = e.target.value;
    setQuery(v);
    clearTimeout(debounced.current);
    debounced.current = setTimeout(() => doSearch(v), 300);
  };

  const goToCompany = (c) => {
    navigate(`/company-details/${c.company_id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <div className="sticky top-0 z-50 bg-white shadow-md">
        <Navbar />
      </div>

      {/* Hero Section */}
      <div className="relative bg-blue-100 text-gray-800 py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
          </div>
        </div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-6xl md:text-2xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
              Explore Top Companies
            </h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
              Discover amazing companies and find your dream career opportunity
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="search"
                value={query}
                onChange={handleChange}
                placeholder="Search companies by name..."
                className="w-full pl-12 pr-4 py-4 text-gray-900 rounded-xl border-2 border-transparent focus:outline-none focus:ring-4 focus:ring-white/30 shadow-2xl text-base transition-all"
                aria-label="Search companies"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20">
              <div className="text-3xl font-bold">{results.length}+</div>
              <div className="text-sm text-gray-700">Companies</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20">
              <div className="text-3xl font-bold flex items-center justify-center gap-1">
                <TrendingUp className="h-6 w-6" />
                100+
              </div>
              <div className="text-sm text-gray-700">Industries</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20 col-span-2 md:col-span-1">
              <div className="text-3xl font-bold">1000+</div>
              <div className="text-sm text-gray-700">Job Opportunities</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600 font-medium">Loading companies...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-center">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && results.length === 0 && (
          <div className="text-center py-16">
            <Building2 className="h-20 w-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No companies found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        )}

        {/* Companies Grid */}
        {!loading && !error && results.length > 0 && (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {query ? `Search Results (${results.length})` : `All Companies (${results.length})`}
              </h2>
              <p className="text-gray-600 mt-1">Click on any company to view details and open positions</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((company) => (
                <div
                  key={company.company_id}
                  onClick={() => goToCompany(company)}
                  className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100 hover:border-blue-300 transform hover:-translate-y-1"
                >
                  {/* Company Header */}
                  <div className="h-32 bg-blue-300 relative">
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
                    {company.logo_url && (
                      <img
                        src={company.logo_url}
                        alt={company.name}
                        className="absolute bottom-0 left-6 transform translate-y-1/2 h-20 w-20 rounded-xl bg-white p-2 shadow-lg object-contain"
                      />
                    )}
                    {!company.logo_url && (
                      <div className="absolute bottom-0 left-6 transform translate-y-1/2 h-20 w-20 rounded-xl bg-white shadow-lg flex items-center justify-center">
                        <Building2 className="h-10 w-10 text-blue-600" />
                      </div>
                    )}
                  </div>

                  {/* Company Info */}
                  <div className="pt-12 px-6 pb-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {company.name}
                    </h3>

                    {/* Industry Badge */}
                    {company.industry && (
                      <div className="flex items-center gap-1 text-sm text-blue-600 mb-3">
                        <Briefcase className="h-4 w-4" />
                        <span className="font-medium">{company.industry}</span>
                      </div>
                    )}

                    {/* Location & Employees */}
                    <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-4">
                      {company.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="line-clamp-1">{company.location}</span>
                        </div>
                      )}
                      {company.employees_range && (
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span>{company.employees_range}</span>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                      {company.overview || company.description || 'Discover more about this company and explore career opportunities.'}
                    </p>

                    {/* View Button */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-sm font-medium text-blue-600 group-hover:text-blue-700">
                        View Company
                      </span>
                      <ArrowRight className="h-5 w-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Companies;
