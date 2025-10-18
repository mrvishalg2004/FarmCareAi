import React, { useState, useEffect } from 'react';
import { isSupabaseConfigured } from '../lib/supabase';

/**
 * A component that shows a banner when the app is running in demo mode
 */
const DemoModeBanner: React.FC = () => {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check if we're in demo mode
    setIsDemoMode(!isSupabaseConfigured());
  }, []);

  if (!isDemoMode || !isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-yellow-500 text-black p-2 text-center z-50 shadow-lg">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-4">
        <div className="flex-1 text-left">
          <span className="font-bold">🔧 Demo Mode</span>
        </div>
        <div className="flex-grow text-center">
          <span>Running with mock authentication and data. Login with any email/password.</span>
        </div>
        <div className="flex-1 text-right">
          <button 
            onClick={() => setIsVisible(false)} 
            className="ml-2 px-2 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

export default DemoModeBanner;