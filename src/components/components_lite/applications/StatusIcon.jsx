import React from 'react';
import { Clock, FileText, CheckCircle, XCircle } from 'lucide-react';

/**
 * StatusIcon Component
 * Render icon based on status type
 * 
 * @param {Object} props
 * @param {string} props.status - Application status
 * @param {string} props.className - Additional CSS classes
 */
const StatusIcon = ({ status, className = 'w-4 h-4' }) => {
  const iconProps = { className };
  
  switch(status?.toLowerCase()) {
    case 'pending':
      return <Clock {...iconProps} />;
    case 'reviewed':
      return <FileText {...iconProps} />;
    case 'shortlisted':
      return <CheckCircle {...iconProps} />;
    case 'rejected':
      return <XCircle {...iconProps} />;
    default:
      return <Clock {...iconProps} />;
  }
};

export default React.memo(StatusIcon);
