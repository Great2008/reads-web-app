import React, { useState, useEffect } from 'react';
import { User, Mail, Calendar, LogOut } from 'lucide-react';
import { api } from '../../services/api';

const ProfileModule = ({ user, onLogout }) => {
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    // 1. Check if Firebase is ready and user is authenticated
    if (!api.auth || !api.auth.currentUser || !user?.uid) {
        console.warn("Database or user not ready for profile fetch.");
        return;
    }

    // 2. Setup real-time listener (onSnapshot)
    // The api.profile.getProfileData automatically sets up mock data if none exists
    const unsubscribe = api.profile.getProfileData(setProfileData);

    // 3. Cleanup the listener when the component unmounts
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user]);

  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    // Handle Firestore Timestamp object if it somehow makes it here, or ISO string
    const date = isoString.seconds ? new Date(isoString.seconds * 1000) : new Date(isoString);
    return date.toLocaleDateString();
  };

  const CardItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-xl shadow-inner-sm">
      <div className="flex items-center gap-3">
        <Icon size={20} className="text-reads-gold" />
        <span className="text-gray-600 dark:text-gray-300 font-medium">{label}</span>
      </div>
      <span className="font-semibold text-reads-dark dark:text-white break-all text-right text-sm">{value}</span>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-3xl font-bold text-reads-dark dark:text-white">User Profile</h2>
      
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-smooth p-6 space-y-4">
        <h3 className="text-xl font-semibold border-b pb-3 mb-4 border-gray-200 dark:border-slate-700">Account Details</h3>

        {/* Display Current User's ID (MANDATORY for multi-user apps) */}
        <CardItem icon={User} label="Firebase User ID" value={profileData?.displayId || user?.uid || 'Loading...'} />
        
        <CardItem icon={Mail} label="Email" value={user?.email || 'N/A'} />
        
        <CardItem icon={User} label="Name" value={profileData?.name || user?.displayName || 'Loading...'} />
        
        <CardItem 
          icon={Calendar} 
          label="Member Since" 
          value={formatDate(profileData?.joined)} 
        />
        
        <div className="pt-4">
          <button 
            onClick={onLogout}
            className="w-full py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut size={20} /> Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModule;