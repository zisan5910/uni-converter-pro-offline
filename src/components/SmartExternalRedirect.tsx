import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

const SmartExternalRedirect = () => {
  const [showRedirectMessage, setShowRedirectMessage] = useState(false);

  useEffect(() => {
    // Detect if app is opened from social media or in-app browser
    const detectInAppBrowser = () => {
      const userAgent = navigator.userAgent || navigator.vendor;
      const referrer = document.referrer.toLowerCase();
      
      // Check for common in-app browsers
      const isInAppBrowser = 
        // Facebook/Instagram in-app browser
        userAgent.includes('FBAN') || 
        userAgent.includes('FBAV') || 
        userAgent.includes('Instagram') ||
        // WhatsApp in-app browser
        userAgent.includes('WhatsApp') ||
        // Messenger in-app browser
        userAgent.includes('MessengerLiteForiOS') ||
        userAgent.includes('MessengerForiOS') ||
        // Check referrer for social media
        referrer.includes('facebook.com') ||
        referrer.includes('instagram.com') ||
        referrer.includes('whatsapp.com') ||
        referrer.includes('messenger.com') ||
        referrer.includes('m.me') ||
        // Generic in-app browser detection
        (userAgent.includes('Mobile') && !userAgent.includes('Chrome') && !userAgent.includes('Safari'));

      if (isInAppBrowser) {
        setShowRedirectMessage(true);
      }
    };

    detectInAppBrowser();
  }, []);

  const handleOpenInBrowser = () => {
    const currentUrl = window.location.href;
    
    // For iOS Safari
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      window.location.href = `x-web-search://?${currentUrl}`;
      // Fallback to default browser
      setTimeout(() => {
        window.open(currentUrl, '_blank');
      }, 500);
    } else {
      // For Android Chrome
      const intent = `intent://${window.location.host}${window.location.pathname}${window.location.search}#Intent;scheme=https;package=com.android.chrome;end`;
      window.location.href = intent;
    }
    
    setShowRedirectMessage(false);
  };

  const handleDismiss = () => {
    setShowRedirectMessage(false);
    localStorage.setItem('dismissedExternalRedirect', 'true');
  };

  // Don't show if user has dismissed before
  if (localStorage.getItem('dismissedExternalRedirect') || !showRedirectMessage) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-blue-600 text-white px-4 py-3 shadow-lg">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex-1 text-center">
            <p className="text-sm font-medium">
              সেরা অভিজ্ঞতার জন্য Chrome-এ খুলুন
            </p>
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            <Button
              size="sm"
              variant="secondary"
              onClick={handleOpenInBrowser}
              className="bg-white text-blue-600 hover:bg-gray-100 text-xs px-3 py-1 h-7"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              ক্রোমে খুলুন
            </Button>
            
            <button
              onClick={handleDismiss}
              className="text-white hover:text-gray-200 ml-2 text-lg leading-none"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartExternalRedirect;