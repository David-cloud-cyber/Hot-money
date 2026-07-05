import { useState, useEffect } from 'react';
import { User, TabType } from './types';
import Auth from './components/Auth';
import Sidebar from './components/Sidebar';
import Accueil from './components/Accueil';
import Gagner from './components/Gagner';
import Top from './components/Top';
import Inviter from './components/Inviter';
import Retrait from './components/Retrait';
import Conditions from './components/Conditions';
import Settings from './components/Settings';
import { WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('accueil');
  const [showConditions, setShowConditions] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [user, setUser] = useState<User>({
    name: '',
    email: '',
    balance: 800, // Matches initial value in screenshots
    referralCode: generateReferralCode(), // Matches referral link in invite tab screenshot, now unique!
    invites: 0,
    earningsFromInvites: 0,
    hasJoinedWhatsApp: false,
    hasClaimedWhatsApp: false,
    unlockedAdLevel: 1, // Card #1 is active/playable, #2-#18 are locked
    withdrawalHistory: [],
  });

  // Check if session exists in localStorage on startup and sync in background
  useEffect(() => {
    const savedUser = localStorage.getItem('skill_money_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser) as User;
        setUser(parsed);
        setIsLoggedIn(true);

        // Fetch latest version from backend to ensure real-time parrainages and data sync
        fetch('/api/user/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(parsed),
        })
        .then(res => {
          if (res.ok) return res.json();
        })
        .then(serverUser => {
          if (serverUser) {
            setUser(serverUser);
            localStorage.setItem('skill_money_user', JSON.stringify(serverUser));
          }
        })
        .catch(err => console.error('Failed initial user sync:', err));
      } catch (e) {
        console.error('Failed to parse saved user', e);
      }
    }
  }, []);

  // Save to localStorage and sync with server whenever user changes (debounced)
  useEffect(() => {
    if (isLoggedIn && user.email) {
      localStorage.setItem('skill_money_user', JSON.stringify(user));
      
      const syncUser = async () => {
        try {
          const response = await fetch('/api/user/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user),
          });
          if (response.ok) {
            const serverUser = await response.json();
            // Compare and update state if server has newer values
            if (
              serverUser.balance !== user.balance ||
              serverUser.invites !== user.invites ||
              serverUser.unlockedAdLevel !== user.unlockedAdLevel ||
              serverUser.hasJoinedWhatsApp !== user.hasJoinedWhatsApp ||
              serverUser.hasClaimedWhatsApp !== user.hasClaimedWhatsApp ||
              JSON.stringify(serverUser.withdrawalHistory) !== JSON.stringify(user.withdrawalHistory) ||
              JSON.stringify(serverUser.invitedFriends) !== JSON.stringify(user.invitedFriends)
            ) {
              setUser(serverUser);
            }
          }
        } catch (err) {
          console.error('Failed to sync user with server:', err);
        }
      };

      const timer = setTimeout(() => {
        syncUser();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [user, isLoggedIn]);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Force dark mode unconditionally on mount
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
    localStorage.setItem('hot_money_theme', 'dark');
  }, []);

  const handleAuthSuccess = (serverUser: User) => {
    setUser(serverUser);
    localStorage.setItem('skill_money_user', JSON.stringify(serverUser));
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('skill_money_user');
    setIsLoggedIn(false);
    setActiveTab('accueil');
    setShowConditions(false);
    setShowSettings(false);
  };

  // Reset conditions and settings view when changing tabs
  useEffect(() => {
    setShowConditions(false);
    setShowSettings(false);
  }, [activeTab]);

  // If not logged in, render Auth flow (Screen #1)
  if (!isLoggedIn) {
    return (
      <div className="flex flex-col min-h-screen w-full">
        <AnimatePresence>
          {isOffline && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-amber-600 text-white text-xs md:text-sm font-medium py-2.5 px-4 flex items-center justify-center gap-2 relative z-[200] shadow-md select-none text-center shrink-0"
            >
              <WifiOff size={15} className="shrink-0 animate-pulse text-amber-100" />
              <span>
                <strong>Mode hors-ligne activé.</strong> Vos données de gains locales sont conservées, mais la connexion est requise pour créer un compte ou vous connecter.
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex-1 flex flex-col">
          <Auth onAuthSuccess={handleAuthSuccess} />
        </div>
      </div>
    );
  }

  // Render main layout (Screens #2 to #7)
  return (
    <div className="flex flex-col min-h-screen md:h-screen w-full md:overflow-hidden">
      <AnimatePresence>
        {isOffline && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-amber-600 text-white text-xs md:text-sm font-medium py-2.5 px-4 flex items-center justify-center gap-2 relative z-[200] shadow-md select-none text-center shrink-0"
          >
            <WifiOff size={15} className="shrink-0 animate-pulse text-amber-100" />
            <span>
              <strong>Mode hors-ligne activé.</strong> Vos données de gains locales sont conservées, mais la connexion est requise pour certaines actions (tâches, retraits).
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-0 flex-1 bg-radial from-[#151532] via-[#090915] to-[#04040a] text-gray-100 flex flex-col md:flex-row relative overflow-hidden">
        {/* Decorative ambient glowing background blobs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#5e5bf0]/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-[#a855f7]/5 rounded-full blur-[120px] pointer-events-none" />

        {/* Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogout={handleLogout}
          userName={user.name}
        />

        {/* Main Tab Content Viewport */}
        <main className="flex-1 flex flex-col relative z-10 pt-16 md:pt-0 pb-6 overflow-y-auto">
          {showConditions ? (
            <Conditions onBack={() => setShowConditions(false)} />
          ) : showSettings ? (
            <Settings 
              onBack={() => setShowSettings(false)}
            />
          ) : (
            <>
              {activeTab === 'accueil' && (
                <Accueil 
                  user={user} 
                  setUser={setUser} 
                  setActiveTab={setActiveTab} 
                  onShowConditions={() => setShowConditions(true)}
                  onShowSettings={() => setShowSettings(true)}
                  onLogout={handleLogout}
                />
              )}
              {activeTab === 'gagner' && (
                <Gagner user={user} setUser={setUser} />
              )}
              {activeTab === 'top' && (
                <Top />
              )}
              {activeTab === 'inviter' && (
                <Inviter user={user} setUser={setUser} />
              )}
              {activeTab === 'retrait' && (
                <Retrait user={user} setUser={setUser} />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
