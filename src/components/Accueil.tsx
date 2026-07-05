import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { User, TabType } from '../types';
import { Wallet, ExternalLink, ArrowRight, MessageCircle, AlertCircle, CheckCircle, FileText, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AccueilProps {
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
  setActiveTab: (tab: TabType) => void;
  onShowConditions?: () => void;
  onShowSettings?: () => void;
  onLogout?: () => void;
}

interface LiveWithdrawal {
  id: string;
  name: string;
  amount: number;
  method: string;
  timeAgo: string;
  timestamp: number;
}

const INITIAL_WITHDRAWALS: LiveWithdrawal[] = [
  { id: '1', name: 'Awa D.', amount: 92000, method: 'MTN MoMo', timeAgo: 'il y a 6 min', timestamp: Date.now() - 360000 },
  { id: '2', name: 'Moussa D.', amount: 69000, method: 'Free Money', timeAgo: 'il y a 6 min', timestamp: Date.now() - 360000 },
  { id: '3', name: 'Awa D.', amount: 30000, method: 'Orange Money', timeAgo: 'il y a 9 min', timestamp: Date.now() - 540000 },
  { id: '4', name: 'Ibrahim T.', amount: 44000, method: 'Orange Money', timeAgo: 'il y a 9 min', timestamp: Date.now() - 540000 },
  { id: '5', name: 'Aminata F.', amount: 63000, method: 'Airtel Money', timeAgo: 'il y a 6 min', timestamp: Date.now() - 360000 },
  { id: '6', name: 'Koffi A.', amount: 148000, method: 'MTN MoMo', timeAgo: 'il y a 5 min', timestamp: Date.now() - 300000 },
];

const RANDOM_NAMES = [
  'Mariama B.', 'Roosevelt B.', 'Fatou S.', 'Steve M.', 'Aïcha O.', 'Ousmane N.', 
  'Saliou D.', 'Sokhna M.', 'Amadou C.', 'Bakary T.', 'Khadija Y.', 'Diallo I.'
];
const RANDOM_METHODS = ['MTN MoMo', 'Orange Money', 'Wave', 'Free Money', 'Airtel Money'];
const RANDOM_AMOUNTS = [10000, 15000, 25000, 30000, 45000, 50000, 75000, 80000, 100000, 120000, 150000];

export default function Accueil({ user, setUser, setActiveTab, onShowConditions, onShowSettings, onLogout }: AccueilProps) {
  const [joinedWhatsApp, setJoinedWhatsApp] = useState(user.hasJoinedWhatsApp);
  const [claimedWhatsApp, setClaimedWhatsApp] = useState(user.hasClaimedWhatsApp);
  const [liveWithdrawals, setLiveWithdrawals] = useState<LiveWithdrawal[]>(INITIAL_WITHDRAWALS);
  const [showNotification, setShowNotification] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Simulate new live withdrawals
  useEffect(() => {
    const interval = setInterval(() => {
      const name = RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)];
      const method = RANDOM_METHODS[Math.floor(Math.random() * RANDOM_METHODS.length)];
      const amount = RANDOM_AMOUNTS[Math.floor(Math.random() * RANDOM_AMOUNTS.length)];
      
      const newWithdrawal: LiveWithdrawal = {
        id: Math.random().toString(),
        name,
        amount,
        method,
        timeAgo: "à l'instant",
        timestamp: Date.now(),
      };

      setLiveWithdrawals((prev) => {
        // Keep up to 6 items
        const updated = [newWithdrawal, ...prev];
        return updated.slice(0, 7);
      });
    }, 15000); // Add a new one every 15 seconds

    return () => clearInterval(interval);
  }, []);

  // Update timeAgo string over time
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveWithdrawals((prev) =>
        prev.map((item) => {
          const diffSeconds = Math.floor((Date.now() - item.timestamp) / 1000);
          if (diffSeconds < 60) {
            return { ...item, timeAgo: "à l'instant" };
          } else {
            const diffMinutes = Math.floor(diffSeconds / 60);
            return { ...item, timeAgo: `il y a ${diffMinutes} min` };
          }
        })
      );
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleJoinWhatsApp = () => {
    setJoinedWhatsApp(true);
    setUser(prev => {
      const updated = { ...prev, hasJoinedWhatsApp: true };
      localStorage.setItem('skill_money_user', JSON.stringify(updated));
      return updated;
    });
    // Open WhatsApp channel link in new tab
    window.open('https://whatsapp.com/channel/0029VbDBuA89RZAQLWsC5j1l', '_blank');
    
    // Display helpful message
    showToast("Félicitations ! Vous pouvez maintenant réclamer votre récompense de 500 F CFA !");
  };

  const handleClaimReward = () => {
    if (!joinedWhatsApp) return;
    if (claimedWhatsApp) return;

    setClaimedWhatsApp(true);
    setUser((prev) => {
      const updatedUser = {
        ...prev,
        balance: prev.balance + 500,
        hasClaimedWhatsApp: true,
      };
      // Persist to localStorage
      localStorage.setItem('skill_money_user', JSON.stringify(updatedUser));
      return updatedUser;
    });

    showToast("+500 F CFA ajoutés à votre solde ! 🎉");
  };

  const showToast = (message: string) => {
    setShowNotification(message);
    setTimeout(() => {
      setShowNotification(null);
    }, 4000);
  };

  // Helper to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount);
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 max-w-4xl mx-auto w-full space-y-8 select-none">
      {/* Toast Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-6 right-6 z-50 bg-[#1c1c3c] border border-[#5e5bf0]/40 px-5 py-3.5 rounded-xl shadow-[0_8px_30px_rgba(94,91,240,0.3)] flex items-center gap-3 max-w-sm"
          >
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 shrink-0">
              <CheckCircle size={18} />
            </div>
            <p className="text-sm font-medium text-white">{showNotification}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main App Title Header (centered as in screenshot) */}
      <div className="text-center pt-2 pb-1 relative z-20">
        <h1 className="text-xl font-display font-bold text-[#8a87ff] tracking-tight text-glow">Hot Money 🔥</h1>
        <div className="absolute right-0 top-1/2 -translate-y-1/2">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-400 hover:text-white p-2 rounded-lg bg-[#111126] border border-[#1f1f3d] transition cursor-pointer relative"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="w-4 h-4">
              <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <>
                {/* Overlay to handle clicking outside to close */}
                <div 
                  className="fixed inset-0 z-40 bg-transparent" 
                  onClick={() => setIsMenuOpen(false)} 
                />
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2.5 z-50 w-56 bg-[#111126] border border-[#1f1f3d] rounded-xl shadow-2xl py-1 overflow-hidden text-left"
                >
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onShowConditions?.();
                    }}
                    className="w-full px-4 py-3.5 flex items-center gap-3.5 text-sm font-medium text-gray-200 hover:bg-[#1f1f3d]/60 hover:text-white transition-colors cursor-pointer"
                  >
                    <FileText size={16} className="text-[#8a87ff]" />
                    <span>Conditions générales</span>
                  </button>
                  <div className="h-[1px] bg-[#1f1f3d]" />
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onShowSettings?.();
                    }}
                    className="w-full px-4 py-3.5 flex items-center gap-3.5 text-sm font-medium text-gray-200 hover:bg-[#1f1f3d]/60 hover:text-white transition-colors cursor-pointer"
                  >
                    <SettingsIcon size={16} className="text-[#8a87ff]" />
                    <span>Paramètres</span>
                  </button>
                  <div className="h-[1px] bg-[#1f1f3d]" />
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onLogout?.();
                    }}
                    className="w-full px-4 py-3.5 flex items-center gap-3.5 text-sm font-medium text-red-400 hover:bg-[#1f1f3d]/60 hover:text-red-300 transition-colors cursor-pointer"
                  >
                    <LogOut size={16} className="text-red-400" />
                    <span>Déconnexion</span>
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Balance Total Card */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-[#5e5bf0] to-[#7f7cf3] rounded-2xl blur-lg opacity-35" />
        <div className="relative bg-gradient-to-r from-[#5e5bf0] to-[#7f7cf3] rounded-2xl p-6 text-center text-white shadow-[0_8px_30px_rgba(94,91,240,0.35)] flex flex-col items-center justify-center overflow-hidden">
          {/* Subtle light arc */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
          
          <div className="flex items-center gap-2 text-white/80 text-xs font-semibold tracking-widest uppercase">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
              <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v1" />
              <path d="M18 8h4a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-4" />
              <circle cx="9" cy="12" r="2" />
            </svg>
            <span>SOLDE TOTAL</span>
          </div>

          <div className="mt-2.5 flex items-baseline justify-center gap-1.5 font-display">
            <span className="text-5xl font-extrabold tracking-tight">{formatCurrency(user.balance)}</span>
            <span className="text-lg font-bold opacity-90">F CFA</span>
          </div>

          <p className="mt-3 text-white/75 text-xs font-medium bg-black/15 py-1.5 px-3.5 rounded-full backdrop-blur-sm">
            Total gagné : {formatCurrency(user.balance)} F CFA
          </p>
        </div>
      </div>

      {/* Social Tasks Section */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
          <span>Tâches sociales · Gagnez 500 F CFA</span>
        </h2>

        <div className="bg-[#111126] border border-[#1f1f3d] rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4.5">
          {/* WhatsApp green icon */}
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/30 shrink-0">
            {/* Custom SVG WhatsApp shape */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.528 1.977 14.07 1.95 11.45 1.95c-5.436 0-9.86 4.37-9.864 9.8.001 2.057.541 4.061 1.562 5.83l-.961 3.513 3.6-.94c1.64.896 3.28 1.353 4.86 1.353zm11.306-7.64c-.31-.155-1.837-.906-2.119-1.01-.282-.103-.488-.155-.693.155-.205.31-.795.98-.974 1.185-.18.205-.359.23-.669.075-1.782-.89-2.92-1.661-4.077-3.645-.306-.525.306-.488.877-1.623.096-.19.048-.359-.024-.513-.072-.154-.693-1.666-.95-2.285-.25-.6-.525-.515-.719-.525l-.612-.01c-.205 0-.539.077-.82.385-.282.31-1.077 1.051-1.077 2.564 0 1.513 1.102 2.974 1.256 3.18 1.538 2.11 3.282 3.13 5.345 3.93.43.167.86.25 1.29.25.9 0 1.83-.43 2.285-.92.282-.31.282-.577.192-.719-.09-.14-.33-.23-.64-.385z"/>
            </svg>
          </div>

          <div className="flex-1 space-y-3.5">
            <div>
              <h3 className="text-sm font-semibold text-white tracking-tight">Rejoindre la chaîne WhatsApp</h3>
              <span className="inline-block text-[#8a87ff] bg-[#5e5bf0]/10 border border-[#5e5bf0]/20 text-2xs font-bold px-2 py-0.5 rounded-full mt-1">
                +500 F CFA · une seule fois
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleJoinWhatsApp}
                disabled={joinedWhatsApp}
                className={`flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                  joinedWhatsApp
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/15'
                }`}
              >
                <span>{joinedWhatsApp ? 'Rejoint' : 'Rejoindre'}</span>
                <ExternalLink size={13} />
              </button>

              <button
                onClick={handleClaimReward}
                disabled={!joinedWhatsApp || claimedWhatsApp}
                className={`px-4.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  claimedWhatsApp
                    ? 'bg-gray-500/10 text-gray-500 border border-gray-500/10'
                    : joinedWhatsApp
                    ? 'bg-[#5e5bf0] hover:bg-[#4d4ae0] text-white shadow-lg shadow-[#5e5bf0]/20 cursor-pointer'
                    : 'bg-[#1f1f3d] text-gray-400 cursor-not-allowed border border-[#2b2b52]'
                }`}
              >
                {claimedWhatsApp ? 'Réclamé' : 'Réclamer 500 F CFA'}
              </button>
            </div>

            <p className="text-gray-400 text-2xs font-light">
              Rejoignez d'abord la chaine, puis réclamez la récompense.
            </p>
          </div>
        </div>
      </div>

      {/* Live Withdrawals Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
            {/* Custom line zig zag graph path icon */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4.5 h-4.5 text-gray-400">
              <path d="M3 3v18h18" />
              <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
            </svg>
            <span>Retraits en direct</span>
          </h2>
          <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">EN DIRECT</span>
          </div>
        </div>

        <div className="grid gap-2.5">
          <AnimatePresence initial={false}>
            {liveWithdrawals.map((withdrawal) => (
              <motion.div
                key={withdrawal.id}
                initial={{ opacity: 0, height: 0, y: -20 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: 10 }}
                transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                className="bg-[#111126]/60 border border-[#1f1f3d] rounded-xl px-4 py-3.5 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-[#1a1a38] border border-[#2b2b52] flex items-center justify-center text-gray-400 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4.5 h-4.5">
                      <rect width="20" height="14" x="2" y="5" rx="2" />
                      <line x1="2" x2="22" y1="10" y2="10" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-white">
                      {withdrawal.name} <span className="font-light text-gray-400">a retiré</span>
                    </p>
                    <p className="text-2xs text-[#8a87ff]/80 mt-0.5">
                      via {withdrawal.method} • <span className="text-gray-400">{withdrawal.timeAgo}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="font-bold text-white text-sm">{formatCurrency(withdrawal.amount)}</p>
                  <p className="text-[9px] font-bold text-gray-400">F CFA</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
