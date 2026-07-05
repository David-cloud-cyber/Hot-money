import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { User, TabType } from '../types';
import { Play, Lock, CheckCircle, X, Sparkles, Trophy, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GagnerProps {
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
  setActiveTab: (tab: TabType) => void;
}

interface AdCard {
  level: number;
  reward: number;
}

const AD_CARDS: AdCard[] = Array.from({ length: 18 }, (_, i) => ({
  level: i + 1,
  reward: 50 + i * 5, // each level pays a little more
}));

// Mock ad topics to make the simulation incredibly detailed and engaging
const MOCK_ADS = [
  { title: "CoinBase - Tradez instantanément", sponsor: "Coinbase Pro", image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=500&auto=format&fit=crop&q=60" },
  { title: "Binance S&P - Le futur du trading", sponsor: "Binance", image: "https://images.unsplash.com/photo-1622790694511-ac6345dc33a4?w=500&auto=format&fit=crop&q=60" },
  { title: "Krypton - Finance Décentralisée", sponsor: "Krypton Capital", image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=500&auto=format&fit=crop&q=60" },
  { title: "Neobank - Gérer son argent intelligemment", sponsor: "Revolut Partner", image: "https://images.unsplash.com/photo-1563013544-824ae1d704d3?w=500&auto=format&fit=crop&q=60" },
];

export default function Gagner({ user, setUser, setActiveTab }: GagnerProps) {
  const [activeAd, setActiveAd] = useState<AdCard | null>(null);
  const [countdown, setCountdown] = useState(5);
  const [adFinished, setAdFinished] = useState(false);
  const [currentMockAd, setCurrentMockAd] = useState(MOCK_ADS[0]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'warning'>('success');

  // Countdown effect when activeAd is playing
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activeAd && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (activeAd && countdown === 0) {
      setAdFinished(true);
    }
    return () => clearTimeout(timer);
  }, [activeAd, countdown]);

  const handleStartAd = (card: AdCard) => {
    // Only allow clicking the current active level
    if (card.level !== user.unlockedAdLevel) return;

    setToastType('warning');
    setToastMessage("Les publicités sont temporairement indisponibles. Redirection vers le parrainage...");
    
    setTimeout(() => {
      setActiveTab('inviter');
    }, 2500);
  };

  const handleClaimReward = () => {
    if (!activeAd || !adFinished) return;

    const reward = activeAd.reward;
    const nextLevel = Math.min(activeAd.level + 1, 18);

    setUser((prev) => {
      const updatedUser = {
        ...prev,
        balance: prev.balance + reward,
        unlockedAdLevel: nextLevel,
      };
      localStorage.setItem('skill_money_user', JSON.stringify(updatedUser));
      return updatedUser;
    });

    setToastMessage(`Félicitations ! +${reward} F CFA ajoutés à votre solde ! 🎉`);
    setActiveAd(null);

    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const getTierInfo = (currentLevel: number) => {
    if (currentLevel <= 6) {
      const remaining = 7 - currentLevel;
      const progress = ((currentLevel - 1) / 6) * 100;
      return {
        currentTierName: "Bronze 🥉",
        nextTierName: "Argent 🥈",
        remaining,
        progress,
        tierTargetLevel: 7,
        multiplier: "1.5x",
        rewardBonus: "Augmentation des gains (+50%)"
      };
    } else if (currentLevel <= 12) {
      const remaining = 13 - currentLevel;
      const progress = ((currentLevel - 7) / 6) * 100;
      return {
        currentTierName: "Argent 🥈",
        nextTierName: "Or 🥇",
        remaining,
        progress,
        tierTargetLevel: 13,
        multiplier: "2.0x",
        rewardBonus: "Doublement des gains (+100%)"
      };
    } else {
      const remaining = 18 - currentLevel + 1;
      const progress = ((currentLevel - 13) / 6) * 100;
      return {
        currentTierName: "Or 🥇",
        nextTierName: "Diamant 💎",
        remaining,
        progress: Math.min(progress, 100),
        tierTargetLevel: 18,
        multiplier: "3.0x",
        rewardBonus: "Accès aux tirages spéciaux et Retrait Immédiat"
      };
    }
  };

  const tierInfo = getTierInfo(user.unlockedAdLevel);
  const isAllCompleted = user.unlockedAdLevel > 18;

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 max-w-5xl mx-auto w-full space-y-8 select-none">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={`fixed top-6 right-6 z-50 bg-[#1c1c3c] border ${
              toastType === 'warning' ? 'border-amber-500/30 shadow-[0_8px_30px_rgba(245,158,11,0.3)]' : 'border-green-500/30 shadow-[0_8px_30px_rgba(34,197,94,0.3)]'
            } px-5 py-3.5 rounded-xl flex items-center gap-3 max-w-sm`}
          >
            <div className={`w-8 h-8 rounded-full ${
              toastType === 'warning' ? 'bg-amber-500/20 text-amber-400' : 'bg-green-500/20 text-green-400'
            } flex items-center justify-center shrink-0`}>
              {toastType === 'warning' ? <AlertTriangle size={18} /> : <Sparkles size={18} />}
            </div>
            <p className="text-sm font-semibold text-white">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Title Row & Header menu */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-white tracking-tight">Gagner</h1>
        <button className="text-gray-400 hover:text-white p-2 rounded-lg bg-[#111126] border border-[#1f1f3d] transition">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="w-4 h-4">
            <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
          </svg>
        </button>
      </div>

      {/* Visual Progress Bar Card */}
      <div className="bg-[#111126]/80 border border-[#1f1f3d] rounded-2xl p-5 md:p-6 relative overflow-hidden shadow-2xl">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#f59e0b]/10 to-[#ef4444]/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#f59e0b] tracking-wider flex items-center gap-1.5">
              <Trophy size={12} className="text-[#f59e0b]" />
              Progression des paliers de gain
            </span>
            <h2 className="text-base font-bold text-white tracking-tight">
              {isAllCompleted ? (
                <span>Palier Actuel : <span className="text-glow-orange text-[#f59e0b]">Diamant 💎</span></span>
              ) : (
                <span>Palier Actuel : <span className="text-glow-orange text-[#f59e0b]">{tierInfo.currentTierName}</span></span>
              )}
            </h2>
          </div>

          {!isAllCompleted && (
            <div className="text-left md:text-right">
              <span className="text-[10px] text-gray-400 font-medium block">Prochain Palier</span>
              <span className="text-xs font-bold text-white bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg inline-block mt-0.5">
                {tierInfo.nextTierName}
              </span>
            </div>
          )}
        </div>

        {/* Progress bar container */}
        <div className="space-y-3">
          <div className="relative w-full h-3 bg-[#090915] rounded-full border border-[#1f1f3d] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${isAllCompleted ? 100 : tierInfo.progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#f59e0b] via-[#ef4444] to-[#7f7cf3] rounded-full"
              style={{ boxShadow: '0 0 12px rgba(245, 158, 11, 0.4)' }}
            />
          </div>

          <div className="flex justify-between items-center text-[11px] text-gray-400 font-medium px-0.5">
            {isAllCompleted ? (
              <span className="text-green-400">100% Complété ! Toutes les tâches sont complétées.</span>
            ) : (
              <>
                <span>Niveau {user.unlockedAdLevel}</span>
                <span className="text-[#f59e0b] font-bold">
                  {tierInfo.remaining} {tierInfo.remaining > 1 ? 'tâches restantes' : 'tâche restante'} avant le palier {tierInfo.nextTierName}
                </span>
                <span>Niveau {tierInfo.tierTargetLevel}</span>
              </>
            )}
          </div>
        </div>

        {/* Informative tier box */}
        {!isAllCompleted && (
          <div className="mt-5 p-4 bg-[#090915]/50 border border-[#1f1f3d]/50 rounded-xl flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#f59e0b]/20 to-[#ef4444]/20 flex items-center justify-center text-[#f59e0b] border border-[#f59e0b]/20 shrink-0">
              <Sparkles size={16} />
            </div>
            <div className="space-y-1 text-xs">
              <p className="font-semibold text-white">
                Avantage du palier {tierInfo.nextTierName} :
              </p>
              <p className="text-gray-400 leading-relaxed font-light">
                {tierInfo.rewardBonus} • Multiplicateur de gains : <span className="text-white font-bold">{tierInfo.multiplier}</span>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Ads Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {AD_CARDS.map((card) => {
          const isCompleted = card.level < user.unlockedAdLevel;
          const isActive = card.level === user.unlockedAdLevel;
          const isLocked = card.level > user.unlockedAdLevel;

          return (
            <div
              key={card.level}
              onClick={() => isActive && handleStartAd(card)}
              className={`aspect-[4/3.2] rounded-2xl relative overflow-hidden transition-all duration-300 flex flex-col items-center justify-center border ${
                isCompleted
                  ? 'bg-[#111126]/40 border-[#1f1f3d] opacity-50 cursor-default'
                  : isActive
                  ? 'bg-gradient-to-tr from-[#5e5bf0] to-[#7f7cf3] border-[#7f7cf3] shadow-[0_0_20px_rgba(94,91,240,0.45)] hover:shadow-[0_0_25px_rgba(94,91,240,0.6)] cursor-pointer transform hover:-translate-y-1 active:translate-y-0 text-white'
                  : 'bg-[#111126]/60 border-[#1f1f3d] text-gray-400/80 cursor-not-allowed opacity-90'
              }`}
            >
              {/* Level indicator */}
              <span className={`absolute top-2.5 left-3 text-[10px] font-bold ${isActive ? 'text-white/70' : 'text-gray-500'}`}>
                #{card.level}
              </span>

              {/* Reward Tag */}
              {isActive && (
                <span className="absolute top-2 right-2 text-[9px] font-bold bg-white/20 px-1.5 py-0.5 rounded-md text-white">
                  +{card.reward} F
                </span>
              )}

              {/* Status Icon & Label */}
              <div className="flex flex-col items-center justify-center gap-2 mt-2">
                {isCompleted ? (
                  <>
                    <CheckCircle size={24} className="text-green-400/90" />
                    <span className="text-[10px] font-medium text-green-400/80">Complétée</span>
                  </>
                ) : isActive ? (
                  <>
                    <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center animate-pulse">
                      <Play size={18} fill="currentColor" className="text-white ml-0.5" />
                    </div>
                    <span className="text-xs font-semibold tracking-wide">Voir la pub</span>
                  </>
                ) : (
                  <>
                    <Lock size={18} className="text-[#3c3c5c]" />
                    <span className="text-2xs font-semibold text-[#5c5c7c] tracking-wide">Verrouillée</span>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Ad Viewer Modal */}
      <AnimatePresence>
        {activeAd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-[#111126] border border-[#1f1f3d] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              {/* Ad Header */}
              <div className="px-5 py-4 border-b border-[#1f1f3d]/50 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#8a87ff]">PUBLICITÉ COMMANDITÉE</span>
                  <h3 className="text-sm font-bold text-white mt-0.5">{currentMockAd.sponsor}</h3>
                </div>
                {adFinished && (
                  <button
                    onClick={() => setActiveAd(null)}
                    className="text-gray-400 hover:text-white transition"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              {/* Ad content body */}
              <div className="p-5 space-y-4">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-black/40 border border-[#1f1f3d]">
                  <img
                    src={currentMockAd.image}
                    referrerPolicy="no-referrer"
                    alt="Sponsor visual representation"
                    className="w-full h-full object-cover opacity-85"
                  />
                  {/* Countdown blur circle */}
                  {!adFinished && (
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm border border-white/10 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white">
                      {countdown}s
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 bg-gradient-to-t from-black/80 p-2 rounded-lg text-white">
                    <p className="text-xs font-bold">{currentMockAd.title}</p>
                    <p className="text-[10px] text-gray-300">Inscrivez-vous maintenant</p>
                  </div>
                </div>

                <div className="text-center space-y-1">
                  <p className="text-xs text-gray-400 font-light leading-relaxed">
                    Découvrez des opportunités financières incroyables avec nos partenaires mondiaux.
                  </p>
                  <p className="text-[10px] text-[#5e5bf0] font-semibold mt-1">
                    Récompense pour ce niveau : +{activeAd.reward} F CFA
                  </p>
                </div>
              </div>

              {/* Ad Footer button */}
              <div className="px-5 py-4.5 bg-[#14142d] border-t border-[#1f1f3d]/50">
                {adFinished ? (
                  <button
                    onClick={handleClaimReward}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-green-500/15 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <Trophy size={14} />
                    <span>Réclamer {activeAd.reward} F CFA</span>
                  </button>
                ) : (
                  <div className="w-full bg-[#1b1b36] border border-[#2c2c52] text-gray-400 py-3.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#5e5bf0] animate-ping" />
                    <span>Regardez la pub ({countdown}s restantes)...</span>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
