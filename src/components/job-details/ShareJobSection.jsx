import React, { useCallback } from 'react';
import { Facebook, Twitter, Linkedin, Mail, Share2, Copy } from 'lucide-react';
import { toast } from 'sonner';

/**
 * ShareJobSection Component - Modern social sharing interface
 */
const ShareJobSection = ({ jobTitle, jobId }) => {
  const handleCopyLink = useCallback(() => {
    const jobUrl = `${window.location.origin}/view-job-detail/${jobId}`;
    
    navigator.clipboard.writeText(jobUrl)
      .then(() => {
        toast.success('✨ Link copied to clipboard!', {
          description: 'Share this job with your network'
        });
      })
      .catch(() => {
        toast.error('Failed to copy link');
      });
  }, [jobId]);

  const handleFacebookShare = useCallback(() => {
    const jobUrl = `${window.location.origin}/view-job-detail/${jobId}`;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(jobUrl)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  }, [jobId]);

  const handleTwitterShare = useCallback(() => {
    const jobUrl = `${window.location.origin}/view-job-detail/${jobId}`;
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(jobUrl)}&text=${encodeURIComponent(`Check out this job: ${jobTitle}`)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  }, [jobId, jobTitle]);

  const handleLinkedinShare = useCallback(() => {
    const jobUrl = `${window.location.origin}/view-job-detail/${jobId}`;
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(jobUrl)}`;
    window.open(linkedinUrl, '_blank', 'width=600,height=400');
  }, [jobId]);

  const handleEmailShare = useCallback(() => {
    const jobUrl = `${window.location.origin}/view-job-detail/${jobId}`;
    const subject = encodeURIComponent(`Job Opportunity: ${jobTitle}`);
    const body = encodeURIComponent(`I found this job that might interest you:\n\n${jobUrl}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }, [jobId, jobTitle]);

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md border border-gray-100 p-4">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Share2 className="h-4 w-4 text-blue-600" />
          <span className="text-base font-bold text-gray-900">Share this opportunity</span>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex gap-2">
            <SocialButton 
              icon={Facebook} 
              onClick={handleFacebookShare}
              className="bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg"
              ariaLabel="Share on Facebook"
            />
            <SocialButton 
              icon={Twitter} 
              onClick={handleTwitterShare}
              className="bg-gradient-to-br from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 shadow-md hover:shadow-lg"
              ariaLabel="Share on Twitter"
            />
            <SocialButton 
              icon={Linkedin} 
              onClick={handleLinkedinShare}
              className="bg-gradient-to-br from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 shadow-md hover:shadow-lg"
              ariaLabel="Share on LinkedIn"
            />
            <SocialButton 
              icon={Mail} 
              onClick={handleEmailShare}
              className="bg-gradient-to-br from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-md hover:shadow-lg"
              ariaLabel="Share via Email"
            />
          </div>
          
          <button
            onClick={handleCopyLink}
            className="flex items-center justify-center gap-1.5 px-4 py-2 border-2 border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all font-semibold text-sm shadow-sm hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Copy className="h-3.5 w-3.5" />
            <span>Copy Link</span>
          </button>
        </div>
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
