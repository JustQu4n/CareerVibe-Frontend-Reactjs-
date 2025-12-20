import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  UserCircle, 
  Building2, 
  Search, 
  Briefcase, 
  ArrowRight,
  CheckCircle,
  Upload,
  FileText
} from 'lucide-react';

const CTASection = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);

  const handleJobSeekerClick = () => {
    if (user) {
      navigate('/jobs');
    } else {
      navigate('/signup?type=jobseeker');
    }
  };

  const handleEmployerClick = () => {
    if (user) {
      navigate('/post-job');
    } else {
      navigate('/signup?type=employer');
    }
  };

  const jobSeekerFeatures = [
    'Browse thousands of job listings',
    'AI-powered job recommendations',
    'Easy one-click apply',
    'Track your applications',
    'Get hired faster'
  ];

  const employerFeatures = [
    'Post unlimited jobs',
    'Access to talent pool',
    'AI candidate matching',
    'Applicant tracking system',
    'Hire top talent quickly'
  ];

  return (
    <section className="py-12 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Ready to Get Started?
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Join thousands of job seekers and employers finding success on CareerVibe
          </p>
        </motion.div>

        {/* CTA Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {/* Job Seeker Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative group"
          >
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-200 h-full">
              {/* Icon */}
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <UserCircle className="w-6 h-6 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                For Job Seekers
              </h3>
              <p className="text-gray-600 mb-5 text-base">
                Discover your dream job and advance your career with AI-powered matching
              </p>

              {/* Features List */}
              <ul className="space-y-2 mb-6">
                {jobSeekerFeatures.map((feature, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center gap-2 text-gray-700 text-sm"
                  >
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </motion.li>
                ))}
              </ul>

              {/* Button */}
              <button
                onClick={handleJobSeekerClick}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all group-hover:scale-105 text-sm"
              >
                <Search className="w-4 h-4" />
                {user ? 'Browse Jobs' : 'Sign Up as Job Seeker'}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Decorative Element */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl -z-10 group-hover:scale-150 transition-transform"></div>
            </div>
          </motion.div>

          {/* Employer Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative group"
          >
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-purple-200 h-full">
              {/* Icon */}
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Building2 className="w-6 h-6 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                For Employers
              </h3>
              <p className="text-gray-600 mb-5 text-base">
                Find qualified candidates and build your dream team efficiently
              </p>

              {/* Features List */}
              <ul className="space-y-2 mb-6">
                {employerFeatures.map((feature, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center gap-2 text-gray-700 text-sm"
                  >
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </motion.li>
                ))}
              </ul>

              {/* Button */}
              <button
                onClick={handleEmployerClick}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all group-hover:scale-105 text-sm"
              >
                <Briefcase className="w-4 h-4" />
                {user ? 'Post a Job' : 'Sign Up as Employer'}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Decorative Element */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl -z-10 group-hover:scale-150 transition-transform"></div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold mb-2">
                Still Have Questions?
              </h3>
              <p className="text-gray-300 text-base">
                Our team is here to help you get started
              </p>
            </div>
            <button
              onClick={() => navigate('/contact')}
              className="px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-all flex items-center gap-2 whitespace-nowrap text-sm"
            >
              Contact Us
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
