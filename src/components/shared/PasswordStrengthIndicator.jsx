/**
 * PasswordStrengthIndicator Component
 * Shows password strength with visual indicator
 */
import React from 'react';
import PropTypes from 'prop-types';

const PasswordStrengthIndicator = React.memo(({ password, strength }) => {
  if (!password) return null;
  
  const getStrengthLabel = () => {
    switch (strength) {
      case 0: return 'Enter a password';
      case 1: return 'Password is weak';
      case 2: return 'Password is fair';
      case 3: return 'Password is good';
      case 4: return 'Password is strong';
      default: return '';
    }
  };
  
  const getStrengthColor = (index) => {
    if (index >= strength) return 'bg-gray-200';
    
    switch (strength) {
      case 1: return 'bg-red-500';
      case 2: return 'bg-orange-500';
      case 3: return 'bg-yellow-500';
      case 4: return 'bg-green-500';
      default: return 'bg-gray-200';
    }
  };
  
  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className={`h-1.5 flex-1 rounded-full transition-colors ${getStrengthColor(index)}`}
          ></div>
        ))}
      </div>
      <p className="text-xs mt-1 text-gray-600">{getStrengthLabel()}</p>
    </div>
  );
});

PasswordStrengthIndicator.displayName = 'PasswordStrengthIndicator';

PasswordStrengthIndicator.propTypes = {
  password: PropTypes.string.isRequired,
  strength: PropTypes.number.isRequired,
};

export default PasswordStrengthIndicator;
