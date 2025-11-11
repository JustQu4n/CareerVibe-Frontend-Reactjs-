/**
 * FormProgress Component
 * Shows multi-step form progress indicator
 */
import React from 'react';
import PropTypes from 'prop-types';

const FormProgress = React.memo(({ currentStep, totalSteps, stepLabels }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-center">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1;
          const isActive = currentStep >= stepNumber;
          const isLast = stepNumber === totalSteps;
          
          return (
            <div key={stepNumber} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  isActive ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {stepNumber}
              </div>
              {!isLast && (
                <div
                  className={`h-1 w-16 transition-colors ${
                    currentStep > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                ></div>
              )}
            </div>
          );
        })}
      </div>
      
      {stepLabels && (
        <div className="flex justify-center mt-2">
          {stepLabels.map((label, index) => (
            <div key={index} className="text-xs text-gray-600 w-24 text-center">
              {label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

FormProgress.displayName = 'FormProgress';

FormProgress.propTypes = {
  currentStep: PropTypes.number.isRequired,
  totalSteps: PropTypes.number.isRequired,
  stepLabels: PropTypes.arrayOf(PropTypes.string),
};

export default FormProgress;
