import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Building2, MapPin, TrendingUp, Star } from 'lucide-react';
import { jobseekerListCompanies } from '@/services/companyService';

const TopCompaniesSection = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const response = await jobseekerListCompanies();
        const companyList = response.data || [];
        
        // Take only first 8 companies for the section
        const topCompanies = companyList.slice(0, 8);
        setCompanies(topCompanies);
      } catch (error) {
        console.error('Error fetching companies:', error);
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const handleCompanyClick = (companyId) => {
    navigate(`/company/${companyId}`);
  };

  if (loading) {
    return (
      <section className="py-12 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading companies...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!companies || companies.length === 0) {
    return (
      <section className="py-12 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No companies available at the moment</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Top Companies Hiring
            </h2>
            <p className="text-base text-gray-600">
              Join the best companies in the industry
            </p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            onClick={() => navigate('/companies')}
            className="mt-4 md:mt-0 inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-all hover:shadow-lg text-sm"
          >
            View All Companies
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.button>
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {companies.map((company, index) => (
            <motion.div
              key={company.company_id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <button
                onClick={() => handleCompanyClick(company.company_id)}
                className="w-full group relative bg-white rounded-xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200"
              >
                {/* Featured Badge */}
                {company.is_featured && (
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Star className="w-2.5 h-2.5 fill-current" />
                    Featured
                  </div>
                )}

                {/* Company Logo */}
                <div className="mb-3 flex justify-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center p-2 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                    <img
                      src={company.logo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&background=random`}
                      alt={company.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&background=random`;
                      }}
                    />
                  </div>
                </div>

                {/* Company Info */}
                <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {company.name}
                </h3>

                <div className="space-y-1.5 mb-3">
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{company.location || 'Vietnam'}</span>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{company.industry || 'Technology'}</span>
                  </div>

                  {company.rating && (
                    <div className="flex items-center justify-center gap-1 text-xs">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-gray-900">{company.rating}</span>
                      <span className="text-gray-500">/5.0</span>
                    </div>
                  )}
                </div>

                {/* Open Positions */}
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-base font-bold text-gray-900">
                      {company.activeJobPostsCount || company.active_job_posts_count || 0}
                    </span>
                    <span className="text-xs text-gray-500">Open Positions</span>
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold mb-1">2,500+</div>
              <div className="text-sm text-blue-100">Companies Registered</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">15,000+</div>
              <div className="text-sm text-blue-100">Active Job Postings</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">50,000+</div>
              <div className="text-sm text-blue-100">Job Seekers</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">98%</div>
              <div className="text-sm text-blue-100">Satisfaction Rate</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TopCompaniesSection;
