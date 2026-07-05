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
  const [themeSetting, setThemeSetting] = useState<'system' | 'light' | 'dark'>('system');
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

  // Check if session exists in localStorage on startup
  useEffect(() => {
    const savedUser = localStorage.getItem('skill_money_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser) as User;
        setUser(parsed);
        setIsLoggedIn(true);
      } catch (e) {
        console.error('Failed to parse saved user', e);
      }
    }
  }, []);

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

  // Load theme setting from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('hot_money_theme') as 'system' | 'light' | 'dark' | null;
    if (savedTheme) {
      setThemeSetting(savedTheme);
    }
  }, []);

  // Update document theme classes dynamically based on theme preference
  useEffect(() => {
    const updateTheme = () => {
      let resolvedTheme: 'light' | 'dark' = 'dark';
      if (themeSetting === 'system') {
        const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        resolvedTheme = isSystemDark ? 'dark' : 'light';
      } else {
        resolvedTheme = themeSetting;
      }

      if (resolvedTheme === 'light') {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      } else {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      }
    };

    updateTheme();

    if (themeSetting === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = (e: MediaQueryListEvent) => {
        const resolved = e.matches ? 'dark' : 'light';
        if (resolved === 'light') {
          document.documentElement.classList.add('light');
          document.documentElement.classList.remove('dark');
        } else {
          document.documentElement.classList.add('dark');
          document.documentElement.classList.remove('light');
        }
      };
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [themeSetting]);

  const handleThemeChange = (newTheme: 'system' | 'light' | 'dark') => {
    setThemeSetting(newTheme);
    localStorage.setItem('hot_money_theme', newTheme);
  };

  const handleAuthSuccess = (userData: { name: string; email: string; referralCodeEntered: string }) => {
    const newUserState: User = {
      name: userData.name || 'Awa Diop',
      email: userData.email,
      balance: 800, // Starting balance from screenshots
      referralCode: generateReferralCode(), // Generate unique referral code on signup/login!
      invites: 0,
      earningsFromInvites: 0,
      hasJoinedWhatsApp: false,
      hasClaimedWhatsApp: false,
      unlockedAdLevel: 1,
      withdrawalHistory: [],
    };

    // If they used a valid referral code, let's pre-add a bonus or simulate things!
    setUser(newUserState);
    localStorage.setItem('skill_money_user', JSON.stringify(newUserState));
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
              themeSetting={themeSetting}
              onThemeChange={handleThemeChange}
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
