import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

/**
 * FloatingJDSummaryButton Component
 * Nút floating để mở modal JD Summary
 * 
 * @param {Object} props
 * @param {Function} props.onClick - Callback khi click button
 */
const FloatingJDSummaryButton = ({ onClick }) => {
  return (
    <div className="fixed bottom-24 right-6 z-40">
      <motion.button
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1 }}
        onClick={onClick}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center space-x-2 pr-4 group"
      >
        <div className="bg-white bg-opacity-20 rounded-full p-2">
          <Sparkles />
        </div>
        <span className="font-medium text-sm">Job Summary</span>
      </motion.button>
    </div>
  );
};

export default React.memo(FloatingJDSummaryButton);
