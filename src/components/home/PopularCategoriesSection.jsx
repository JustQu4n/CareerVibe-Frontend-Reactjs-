import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Code,
  Palette,
  TrendingUp,
  DollarSign,
  Briefcase,
  Users,
  Megaphone,
  Building2,
  Shield,
  LineChart,
  Stethoscope,
  GraduationCap,
} from 'lucide-react';

const CATEGORIES = [
  { name: 'Technology', icon: Code, count: '1,500+', color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-50', textColor: 'text-blue-600' },
  { name: 'Design', icon: Palette, count: '850+', color: 'from-purple-500 to-pink-500', bg: 'bg-purple-50', textColor: 'text-purple-600' },
  { name: 'Marketing', icon: Megaphone, count: '920+', color: 'from-orange-500 to-red-500', bg: 'bg-orange-50', textColor: 'text-orange-600' },
  { name: 'Sales', icon: TrendingUp, count: '1,200+', color: 'from-green-500 to-emerald-500', bg: 'bg-green-50', textColor: 'text-green-600' },
  { name: 'Finance', icon: DollarSign, count: '680+', color: 'from-yellow-500 to-amber-500', bg: 'bg-yellow-50', textColor: 'text-yellow-600' },
  { name: 'Management', icon: Briefcase, count: '550+', color: 'from-indigo-500 to-blue-500', bg: 'bg-indigo-50', textColor: 'text-indigo-600' },
  { name: 'Human Resources', icon: Users, count: '420+', color: 'from-pink-500 to-rose-500', bg: 'bg-pink-50', textColor: 'text-pink-600' },
  { name: 'Business', icon: Building2, count: '890+', color: 'from-slate-500 to-gray-500', bg: 'bg-slate-50', textColor: 'text-slate-600' },
  { name: 'Legal', icon: Shield, count: '310+', color: 'from-red-500 to-rose-500', bg: 'bg-red-50', textColor: 'text-red-600' },
  { name: 'Data & Analytics', icon: LineChart, count: '760+', color: 'from-teal-500 to-cyan-500', bg: 'bg-teal-50', textColor: 'text-teal-600' },
  { name: 'Healthcare', icon: Stethoscope, count: '640+', color: 'from-red-500 to-pink-500', bg: 'bg-red-50', textColor: 'text-red-600' },
  { name: 'Education', icon: GraduationCap, count: '480+', color: 'from-blue-500 to-indigo-500', bg: 'bg-blue-50', textColor: 'text-blue-600' },
];

const PopularCategoriesSection = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName) => {
    navigate(`/jobs?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <section className="py-12 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-2xl font-bold text-gray-900 mb-3">
              Popular Job Categories
            </h2>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              Explore opportunities across diverse industries and find your perfect match
            </p>
          </motion.div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {CATEGORIES.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <button
                  onClick={() => handleCategoryClick(category.name)}
                  className="w-full group relative bg-white rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-transparent overflow-hidden"
                >
                  {/* Gradient Background on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                  
                  <div className="relative">
                    {/* Icon */}
                    <div className={`${category.bg} w-12 h-12 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-6 h-6 ${category.textColor}`} />
                    </div>
                    
                    {/* Category Info */}
                    <h3 className="text-base font-semibold text-gray-900 mb-1.5 text-left">
                      {category.name}
                    </h3>
                    <p className="text-xs text-gray-500 text-left flex items-center gap-1">
                      <span className={`${category.textColor} font-semibold`}>{category.count}</span>
                      <span>jobs available</span>
                    </p>

                    {/* Arrow Icon */}
                    <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                      <svg 
                        className={`w-4 h-4 ${category.textColor}`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-8"
        >
          <button
            onClick={() => navigate('/jobs')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 text-sm"
          >
            Browse All Categories
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default PopularCategoriesSection;
