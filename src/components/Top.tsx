import React, { useState, useEffect } from 'react';
import { Crown, Trophy, Medal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LeaderboardUser {
  rank?: number;
  name: string;
  amount: number;
  withdrawals: number;
  initial: string;
}

const INITIAL_LEADERBOARD: LeaderboardUser[] = [
  { name: 'Jean C.', amount: 3493400, withdrawals: 24, initial: 'J' },
  { name: 'Awa Diop', amount: 1250000, withdrawals: 12, initial: 'A' },
  { name: 'Mamadou K.', amount: 980000, withdrawals: 9, initial: 'M' },
  { name: 'Fatou Sow', amount: 870000, withdrawals: 8, initial: 'F' },
  { name: 'Ibrahim T.', amount: 760000, withdrawals: 7, initial: 'I' },
  { name: 'Mariama B.', amount: 690000, withdrawals: 6, initial: 'M' },
  { name: 'Roosevelt B.', amount: 643900, withdrawals: 6, initial: 'R' },
  { name: 'Steve M.', amount: 636900, withdrawals: 5, initial: 'S' },
  { name: 'Koffi A.', amount: 610000, withdrawals: 6, initial: 'K' },
  { name: 'Aïcha O.', amount: 540000, withdrawals: 5, initial: 'A' },
  { name: 'Mon bonheur O.', amount: 519000, withdrawals: 4, initial: 'M' },
  { name: 'Ousmane N.', amount: 480000, withdrawals: 4, initial: 'O' }
];

const NEW_POTENTIAL_USERS = [
  { name: 'Saliou D.', initial: 'S' },
  { name: 'Sokhna M.', initial: 'S' },
  { name: 'Diallo I.', initial: 'D' },
  { name: 'Alassane S.', initial: 'A' },
  { name: 'Ndeye F.', initial: 'N' },
  { name: 'Khadija Y.', initial: 'K' }
];

export default function Top() {
  const [users, setUsers] = useState<LeaderboardUser[]>(INITIAL_LEADERBOARD);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('fr-FR').format(val);
  };

  // Simulate updates in the leaderboard every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setUsers((prevUsers) => {
        const updated = [...prevUsers];
        
        // Decide what kind of update to perform
        const updateType = Math.random();
        
        if (updateType < 0.65) {
          // 1. Update an existing user's amount (earnings increase)
          const randomIndex = Math.floor(Math.random() * updated.length);
          const user = { ...updated[randomIndex] };
          
          // Random reward increment from 5,000 to 45,000 F CFA
          const increment = Math.floor(Math.random() * 9 + 1) * 5000;
          user.amount += increment;
          
          // 50% chance to increment withdrawal count
          if (Math.random() > 0.5) {
            user.withdrawals += 1;
          }
          
          updated[randomIndex] = user;
        } else if (updateType < 0.85) {
          // 2. A brand new user climbs onto the leaderboard
          const randomMeta = NEW_POTENTIAL_USERS[Math.floor(Math.random() * NEW_POTENTIAL_USERS.length)];
          
          // Check if user already exists
          const exists = updated.some(u => u.name === randomMeta.name);
          if (!exists) {
            const newLeaderboardUser: LeaderboardUser = {
              name: randomMeta.name,
              amount: Math.floor(Math.random() * 40 + 40) * 10000, // 400,000 to 800,000 F CFA
              withdrawals: Math.floor(Math.random() * 4 + 2),
              initial: randomMeta.initial
            };
            // Replace the last ranked user
            updated[updated.length - 1] = newLeaderboardUser;
          }
        } else {
          // 3. Make the lead user (Jean C.) or another top user get a massive cashout
          const topIndices = [0, 1, 2];
          const randomIndex = topIndices[Math.floor(Math.random() * topIndices.length)];
          if (randomIndex < updated.length) {
            const user = { ...updated[randomIndex] };
            user.amount += Math.floor(Math.random() * 3 + 1) * 25000; // 25k to 75k F CFA
            user.withdrawals += 1;
            updated[randomIndex] = user;
          }
        }
        
        // Re-sort to maintain correct order of leaderboard
        return updated.sort((a, b) => b.amount - a.amount);
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Sort and extract podium spots
  const sortedUsers = [...users].sort((a, b) => b.amount - a.amount);
  const p1 = sortedUsers[0] || INITIAL_LEADERBOARD[0];
  const p2 = sortedUsers[1] || INITIAL_LEADERBOARD[1];
  const p3 = sortedUsers[2] || INITIAL_LEADERBOARD[2];
  const remaining = sortedUsers.slice(3);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 max-w-4xl mx-auto w-full space-y-8 select-none">
      {/* Title & Subtitle row */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-display font-bold text-white tracking-tight flex items-center gap-2">
            <Trophy className="text-[#ffaa44]" size={22} />
            <span>Meilleurs gains</span>
          </h1>
          <p className="text-[#a0aec0] text-xs font-light">
            Classement en direct · Mise à jour instantanée
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-[#ff6b00]/10 px-2.5 py-1 rounded-full border border-[#ff6b00]/20 text-[10px] font-bold text-[#ffaa44] uppercase tracking-wider animate-pulse">
          Mise à jour en direct
        </div>
      </div>

      {/* Podium (Columns: #2, #1, #3) */}
      <div className="flex items-end justify-center gap-3 sm:gap-6 pt-10 pb-4 max-w-lg mx-auto">
        {/* #2 Rank */}
        <div className="flex flex-col items-center flex-1">
          <div className="relative mb-2 flex flex-col items-center">
            <Medal size={16} className="text-slate-400 mb-1" />
            <motion.div 
              key={p2.name}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#3b82f6] to-[#60a5fa] flex items-center justify-center text-white font-bold text-base shadow-[0_0_15px_rgba(59,130,246,0.3)] border-2 border-slate-400"
            >
              {p2.initial}
            </motion.div>
          </div>
          <div className="text-center mb-2.5 min-w-0 px-1">
            <p className="font-semibold text-xs text-white truncate max-w-[90px] sm:max-w-full">{p2.name}</p>
            <motion.p 
              key={p2.amount}
              initial={{ scale: 1.1, color: '#60a5fa' }}
              animate={{ scale: 1, color: '#ffaa44' }}
              className="text-[10px] font-bold mt-0.5"
            >
              {formatCurrency(p2.amount)}
            </motion.p>
            <p className="text-[9px] text-gray-400 mt-0.5 flex items-center justify-center gap-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1f1f3d] border border-gray-500/20" />
              {p2.withdrawals}x
            </p>
          </div>
          <div className="w-16 sm:w-20 h-20 bg-[#111126] border-t-2 border-x border-[#1f1f3d] rounded-t-xl flex flex-col items-center justify-start pt-3 shadow-inner">
            <span className="font-display font-extrabold text-white text-base text-glow">#2</span>
          </div>
        </div>

        {/* #1 Rank (Center) */}
        <div className="flex flex-col items-center flex-1">
          <div className="relative mb-2 flex flex-col items-center">
            <Crown size={22} className="text-amber-400 animate-bounce mb-0.5" />
            <motion.div 
              key={p1.name}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#ff6b00] to-[#ff3d00] flex items-center justify-center text-white font-bold text-lg shadow-[0_0_20px_rgba(255,107,0,0.5)] border-2 border-amber-400"
            >
              {p1.initial}
            </motion.div>
          </div>
          <div className="text-center mb-2.5 min-w-0 px-1">
            <p className="font-bold text-xs text-white truncate max-w-[100px] sm:max-w-full">{p1.name}</p>
            <motion.p 
              key={p1.amount}
              initial={{ scale: 1.1, color: '#f59e0b' }}
              animate={{ scale: 1, color: '#fbbf24' }}
              className="text-[11px] font-extrabold mt-0.5"
            >
              {formatCurrency(p1.amount)}
            </motion.p>
            <p className="text-[9px] text-gray-400 mt-0.5 flex items-center justify-center gap-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1f1f3d] border border-gray-500/20" />
              {p1.withdrawals}x
            </p>
          </div>
          <div className="w-18 sm:w-24 h-28 bg-[#161633] border-t-2 border-x border-[#ff6b00]/40 rounded-t-xl flex flex-col items-center justify-start pt-3 shadow-[0_-5px_20px_rgba(255,107,0,0.15)] relative">
            <span className="font-display font-black text-amber-400 text-xl text-glow">#1</span>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[#ff6b00] to-[#ff3d00]" />
          </div>
        </div>

        {/* #3 Rank */}
        <div className="flex flex-col items-center flex-1">
          <div className="relative mb-2 flex flex-col items-center">
            <Medal size={16} className="text-amber-700 mb-1" />
            <motion.div 
              key={p3.name}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#ec4899] to-[#f472b6] flex items-center justify-center text-white font-bold text-sm shadow-[0_0_12px_rgba(236,72,153,0.3)] border-2 border-amber-700"
            >
              {p3.initial}
            </motion.div>
          </div>
          <div className="text-center mb-2.5 min-w-0 px-1">
            <p className="font-semibold text-xs text-white truncate max-w-[90px] sm:max-w-full">{p3.name}</p>
            <motion.p 
              key={p3.amount}
              initial={{ scale: 1.1, color: '#ec4899' }}
              animate={{ scale: 1, color: '#ffaa44' }}
              className="text-[10px] font-bold mt-0.5"
            >
              {formatCurrency(p3.amount)}
            </motion.p>
            <p className="text-[9px] text-gray-400 mt-0.5 flex items-center justify-center gap-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1f1f3d] border border-gray-500/20" />
              {p3.withdrawals}x
            </p>
          </div>
          <div className="w-16 sm:w-20 h-16 bg-[#111126] border-t-2 border-x border-[#1f1f3d] rounded-t-xl flex flex-col items-center justify-start pt-2 shadow-inner">
            <span className="font-display font-extrabold text-white text-sm text-glow">#3</span>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="space-y-2 max-w-2xl mx-auto">
        <LayoutGroup>
          {remaining.map((user, idx) => {
            const rankNum = idx + 4;
            return (
              <motion.div
                layout
                key={user.name}
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                className="bg-[#111126]/60 border border-[#1f1f3d] rounded-xl px-4 py-3.5 flex items-center justify-between text-xs transition hover:border-[#ff6b00]/30 overflow-hidden"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <span className="w-4 font-bold text-gray-400 text-center">{rankNum}</span>

                  <div className="w-9 h-9 rounded-full bg-[#ff6b00]/20 text-[#ffaa44] border border-[#ff6b00]/30 flex items-center justify-center font-bold text-sm shrink-0 uppercase">
                    {user.initial}
                  </div>

                  <div className="min-w-0">
                    <p className="font-semibold text-white truncate">{user.name}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1f1f3d] border border-gray-500/20" />
                      {user.withdrawals} retraits
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <motion.span 
                    key={user.amount}
                    initial={{ scale: 1.15, color: '#ffaa44' }}
                    animate={{ scale: 1, color: '#ffffff' }}
                    className="font-bold text-sm block"
                  >
                    {formatCurrency(user.amount)} F CFA
                  </motion.span>
                </div>
              </motion.div>
            );
          })}
        </LayoutGroup>
      </div>
    </div>
  );
}

// Custom wrapper helper to support layout animations smoothly
function LayoutGroup({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

