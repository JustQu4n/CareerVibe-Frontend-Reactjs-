import React, { useCallback } from 'react';
import { Facebook, Twitter, Linkedin, Mail, Share2 } from 'lucide-react';
import { toast } from 'sonner';

/**
 * ShareJobSection Component
 * Hiển thị các nút chia sẻ job trên mạng xã hội
 * 
 * @param {Object} props
 * @param {string} props.jobTitle - Tiêu đề job
 * @param {string} props.jobId - ID của job
 */
const ShareJobSection = ({ jobTitle, jobId }) => {
  // Xử lý copy link
  const handleCopyLink = useCallback(() => {
    const jobUrl = `${window.location.origin}/view-job-detail/${jobId}`;
    
    navigator.clipboard.writeText(jobUrl)
      .then(() => {
        toast.success('Link copied to clipboard!');
      })
      .catch(() => {
        toast.error('Failed to copy link');
      });
  }, [jobId]);

  // Xử lý chia sẻ lên Facebook
  const handleFacebookShare = useCallback(() => {
    const jobUrl = `${window.location.origin}/view-job-detail/${jobId}`;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(jobUrl)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  }, [jobId]);

  // Xử lý chia sẻ lên Twitter
  const handleTwitterShare = useCallback(() => {
    const jobUrl = `${window.location.origin}/view-job-detail/${jobId}`;
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(jobUrl)}&text=${encodeURIComponent(`Check out this job: ${jobTitle}`)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  }, [jobId, jobTitle]);

  // Xử lý chia sẻ lên LinkedIn
  const handleLinkedinShare = useCallback(() => {
    const jobUrl = `${window.location.origin}/view-job-detail/${jobId}`;
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(jobUrl)}`;
    window.open(linkedinUrl, '_blank', 'width=600,height=400');
  }, [jobId]);

  // Xử lý chia sẻ qua Email
  const handleEmailShare = useCallback(() => {
    const jobUrl = `${window.location.origin}/view-job-detail/${jobId}`;
    const subject = encodeURIComponent(`Job Opportunity: ${jobTitle}`);
    const body = encodeURIComponent(`I found this job that might interest you:\n\n${jobUrl}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }, [jobId, jobTitle]);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center">
          <span className="text-gray-700 font-medium mr-4">Share this job:</span>
          <div className="flex space-x-2">
            <SocialButton 
              icon={Facebook} 
              onClick={handleFacebookShare}
              className="bg-blue-600 hover:bg-blue-700"
              ariaLabel="Share on Facebook"
            />
            <SocialButton 
              icon={Twitter} 
              onClick={handleTwitterShare}
              className="bg-blue-400 hover:bg-blue-500"
              ariaLabel="Share on Twitter"
            />
            <SocialButton 
              icon={Linkedin} 
              onClick={handleLinkedinShare}
              className="bg-blue-700 hover:bg-blue-800"
              ariaLabel="Share on LinkedIn"
            />
            <SocialButton 
              icon={Mail} 
              onClick={handleEmailShare}
              className="bg-red-600 hover:bg-red-700"
              ariaLabel="Share via Email"
            />
          </div>
        </div>
        <button
          onClick={handleCopyLink}
          className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm"
        >
          <Share2 className="h-4 w-4" />
          <span>Copy Link</span>
        </button>
      </div>
    </div>
  );
};

/**
 * SocialButton - Button component cho social sharing
 */
const SocialButton = React.memo(({ icon: Icon, onClick, className, ariaLabel }) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-center h-9 w-9 rounded-full text-white transition-colors ${className}`}
    aria-label={ariaLabel}
  >
    <Icon className="h-4 w-4" />
  </button>
));

SocialButton.displayName = 'SocialButton';

export default React.memo(ShareJobSection);
