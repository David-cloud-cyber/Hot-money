import { Crown, Trophy, Medal } from 'lucide-react';

interface LeaderboardUser {
  rank: number;
  name: string;
  amount: number;
  withdrawals: number;
  initial: string;
}

const LEADERBOARD_DATA: LeaderboardUser[] = [
  { rank: 4, name: 'Fatou_Sow', amount: 870000, withdrawals: 8, initial: 'F' },
  { rank: 5, name: 'Ibrahim_T', amount: 760000, withdrawals: 7, initial: 'I' },
  { rank: 6, name: 'Mariama_B', amount: 690000, withdrawals: 6, initial: 'M' },
  { rank: 7, name: 'Roosevelt Babela', amount: 643900, withdrawals: 6, initial: 'R' },
  { rank: 8, name: 'Steve Mitchell', amount: 636900, withdrawals: 3, initial: 'S' },
  { rank: 9, name: 'Koffi_A', amount: 610000, withdrawals: 6, initial: 'K' },
  { rank: 10, name: 'Aïcha_O', amount: 540000, withdrawals: 5, initial: 'A' },
  { rank: 11, name: 'Mon bonheur Obambi', amount: 519000, withdrawals: 2, initial: 'M' },
  { rank: 12, name: 'Ousmane_N', amount: 480000, withdrawals: 4, initial: 'O' }
];

export default function Top() {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('fr-FR').format(val);
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 max-w-4xl mx-auto w-full space-y-8 select-none">
      {/* Title & Subtitle row */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-display font-bold text-white tracking-tight flex items-center gap-2">
            <Trophy className="text-[#8a87ff]" size={22} />
            <span>Meilleurs gains</span>
          </h1>
          <p className="text-[#a0aec0] text-xs font-light">
            Classement en direct · mise à jour instantanée
          </p>
        </div>
        <button className="text-gray-400 hover:text-white p-2 rounded-lg bg-[#111126] border border-[#1f1f3d] transition">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="w-4 h-4">
            <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
          </svg>
        </button>
      </div>

      {/* Podium (Columns: #2, #1, #3) */}
      <div className="flex items-end justify-center gap-3 sm:gap-6 pt-10 pb-4 max-w-lg mx-auto">
        {/* #2 Rank: Awa_Diop */}
        <div className="flex flex-col items-center flex-1">
          <div className="relative mb-2 flex flex-col items-center">
            {/* Medal decoration */}
            <Medal size={16} className="text-slate-400 mb-1" />
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#3b82f6] to-[#60a5fa] flex items-center justify-center text-white font-bold text-base shadow-[0_0_15px_rgba(59,130,246,0.3)] border-2 border-slate-400">
              A
            </div>
          </div>
          <div className="text-center mb-2.5 min-w-0 px-1">
            <p className="font-semibold text-xs text-white truncate max-w-[90px] sm:max-w-full">Awa_Diop</p>
            <p className="text-[10px] font-bold text-[#8a87ff] mt-0.5">{formatCurrency(1250000)}</p>
            <p className="text-[9px] text-gray-400 mt-0.5 flex items-center justify-center gap-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1f1f3d] border border-gray-500/20" />
              12x
            </p>
          </div>
          {/* Podium block */}
          <div className="w-16 sm:w-20 h-20 bg-[#111126] border-t-2 border-x border-[#1f1f3d] rounded-t-xl flex flex-col items-center justify-start pt-3 shadow-inner">
            <span className="font-display font-extrabold text-white text-base text-glow">#2</span>
          </div>
        </div>

        {/* #1 Rank: Jean CULE TAMERE (Center) */}
        <div className="flex flex-col items-center flex-1">
          <div className="relative mb-2 flex flex-col items-center">
            {/* Crown decoration */}
            <Crown size={22} className="text-amber-400 animate-bounce mb-0.5" />
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#5e5bf0] to-[#a855f7] flex items-center justify-center text-white font-bold text-lg shadow-[0_0_20px_rgba(94,91,240,0.5)] border-2 border-amber-400">
              J
            </div>
          </div>
          <div className="text-center mb-2.5 min-w-0 px-1">
            <p className="font-bold text-xs text-white truncate max-w-[100px] sm:max-w-full">Jean C. (Leader)</p>
            <p className="text-[11px] font-extrabold text-amber-400 mt-0.5">{formatCurrency(3493400)}</p>
            <p className="text-[9px] text-gray-400 mt-0.5 flex items-center justify-center gap-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1f1f3d] border border-gray-500/20" />
              0x
            </p>
          </div>
          {/* Podium block */}
          <div className="w-18 sm:w-24 h-28 bg-[#161633] border-t-2 border-x border-[#5e5bf0]/40 rounded-t-xl flex flex-col items-center justify-start pt-3 shadow-[0_-5px_20px_rgba(94,91,240,0.15)] relative">
            <span className="font-display font-black text-amber-400 text-xl text-glow">#1</span>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[#5e5bf0] to-[#a855f7]" />
          </div>
        </div>

        {/* #3 Rank: Mamadou_K */}
        <div className="flex flex-col items-center flex-1">
          <div className="relative mb-2 flex flex-col items-center">
            {/* Medal decoration */}
            <Medal size={16} className="text-amber-700 mb-1" />
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#ec4899] to-[#f472b6] flex items-center justify-center text-white font-bold text-sm shadow-[0_0_12px_rgba(236,72,153,0.3)] border-2 border-amber-700">
              M
            </div>
          </div>
          <div className="text-center mb-2.5 min-w-0 px-1">
            <p className="font-semibold text-xs text-white truncate max-w-[90px] sm:max-w-full">Mamadou_K</p>
            <p className="text-[10px] font-bold text-[#8a87ff] mt-0.5">{formatCurrency(980000)}</p>
            <p className="text-[9px] text-gray-400 mt-0.5 flex items-center justify-center gap-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1f1f3d] border border-gray-500/20" />
              9x
            </p>
          </div>
          {/* Podium block */}
          <div className="w-16 sm:w-20 h-16 bg-[#111126] border-t-2 border-x border-[#1f1f3d] rounded-t-xl flex flex-col items-center justify-start pt-2 shadow-inner">
            <span className="font-display font-extrabold text-white text-sm text-glow">#3</span>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="space-y-2 max-w-2xl mx-auto">
        {LEADERBOARD_DATA.map((user) => (
          <div
            key={user.rank}
            className="bg-[#111126]/60 border border-[#1f1f3d] rounded-xl px-4 py-3.5 flex items-center justify-between text-xs transition hover:border-[#5e5bf0]/30"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              {/* Rank number */}
              <span className="w-4 font-bold text-gray-400 text-center">{user.rank}</span>

              {/* Avatar circle letter with background based on name */}
              <div className="w-9 h-9 rounded-full bg-[#5e5bf0]/20 text-[#8a87ff] border border-[#5e5bf0]/30 flex items-center justify-center font-bold text-sm shrink-0 uppercase">
                {user.initial}
              </div>

              {/* Name and withdraw count */}
              <div className="min-w-0">
                <p className="font-semibold text-white truncate">{user.name}</p>
                <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1f1f3d] border border-gray-500/20" />
                  {user.withdrawals} retraits
                </p>
              </div>
            </div>

            {/* Total earnings */}
            <div className="text-right shrink-0">
              <span className="font-bold text-white text-sm">{formatCurrency(user.amount)} F CFA</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
