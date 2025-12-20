import React from 'react';
import { Briefcase, Search, TrendingUp, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * EmptyState Component
 * Hiển thị khi chưa có applications nào
 */
const EmptyState = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-3xl shadow-xl p-12 text-center border border-blue-100"
    >
      {/* Illustration */}
      <div className="relative w-48 h-48 mx-auto mb-8">
        {/* Background circles */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute inset-0 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full blur-2xl"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.7, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-4 bg-gradient-to-br from-blue-300 to-indigo-300 rounded-full blur-xl"
        />
        
        {/* Main icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl"
          >
            <Briefcase className="h-16 w-16 text-white" />
          </motion.div>
        </div>
        
        {/* Floating elements */}
        <motion.div
          animate={{ y: [-5, 5, -5], x: [-5, 5, -5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center shadow-lg"
        >
          <Search className="h-8 w-8 text-white" />
        </motion.div>
        <motion.div
          animate={{ y: [5, -5, 5], x: [5, -5, 5] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-2xl flex items-center justify-center shadow-lg"
        >
          <TrendingUp className="h-8 w-8 text-white" />
        </motion.div>
      </div>
      
      {/* Content */}
      <h2 className="text-3xl font-bold text-gray-800 mb-4">
        No Applications Yet
      </h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg leading-relaxed">
        You haven't applied to any jobs yet. Start exploring opportunities and kickstart your career journey today!
      </p>
      
      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a 
          href="/Browse" 
          className="group bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all font-semibold inline-flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          <Search className="mr-2 h-5 w-5" />
          Browse Jobs
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </a>
        <a 
          href="/Browse" 
          className="bg-white text-gray-700 px-8 py-4 rounded-xl hover:bg-gray-50 transition-all font-semibold inline-flex items-center justify-center border-2 border-gray-200 hover:border-gray-300 shadow-md hover:shadow-lg"
        >
          Learn More
        </a>
      </div>
    </motion.div>
  );
};

export default React.memo(EmptyState);
