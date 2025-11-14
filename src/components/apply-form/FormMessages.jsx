import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertTriangle } from 'lucide-react';

/**
 * FormMessages Component
 * Hiển thị success và error messages với animations
 * 
 * @param {Object} props
 * @param {boolean} props.success - Success state
 * @param {string} props.error - Error message
 */
const FormMessages = ({ success, error }) => {
  return (
    <>
      {/* Success Message */}
      <AnimatePresence>
        {success && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 bg-green-50 border border-green-200 rounded-lg px-4 py-3"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 mr-3">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div>
                <h4 className="text-green-800 font-semibold mb-1">Application Submitted!</h4>
                <p className="text-green-700 text-sm">
                  Your application has been submitted successfully. Redirecting to your applications...
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 bg-red-50 border border-red-200 rounded-lg px-4 py-3"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 mr-3">
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
              </div>
              <div>
                <h4 className="text-red-800 font-semibold mb-1">Application Error</h4>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default React.memo(FormMessages);
