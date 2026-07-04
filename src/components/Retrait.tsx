import { useState, Dispatch, SetStateAction, FormEvent } from 'react';
import { User, WithdrawalTransaction } from '../types';
import { Wallet, History, AlertCircle, ArrowLeft, Send, CheckCircle, Star, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RetraitProps {
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
}

interface Country {
  code: string;
  name: string;
  flag: string;
}

const COUNTRIES: Country[] = [
  { code: 'CM', name: 'Cameroun', flag: '🇨🇲' },
  { code: 'CF', name: 'République centrafricaine', flag: '🇨🇫' },
  { code: 'TD', name: 'Tchad', flag: '🇹🇩' },
  { code: 'CG', name: 'République du Congo', flag: '🇨🇬' },
  { code: 'GQ', name: 'Guinée équatoriale', flag: '🇬🇶' },
  { code: 'GA', name: 'Gabon', flag: '🇬🇦' },
  { code: 'BJ', name: 'Bénin', flag: '🇧🇯' },
  { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫' },
  { code: 'CI', name: 'Côte d’Ivoire', flag: '🇨🇮' },
  { code: 'GW', name: 'Guinée-Bissau', flag: '🇬🇼' },
  { code: 'ML', name: 'Mali', flag: '🇲🇱' },
  { code: 'NE', name: 'Niger', flag: '🇳🇪' },
  { code: 'SN', name: 'Sénégal', flag: '🇸🇳' },
  { code: 'TG', name: 'Togo', flag: '🇹🇬' }
];

const COMMUNITY_REVIEWS = [
  { name: 'Fatou Sow', rating: 5, timeAgo: 'il y a 12 min', comment: '69 000 F CFA reçus sur Moov Money au Gabon, tout s’est bien passé.', initial: 'FS' },
  { name: 'Awa Diop', rating: 5, timeAgo: 'il y a 28 min', comment: '15 000 F CFA reçus sur Orange Money au Sénégal, merci beaucoup !', initial: 'AD' },
  { name: 'Moussa Diallo', rating: 5, timeAgo: 'il y a 1 heure', comment: '45 000 F CFA reçus sur Wave en Côte d’Ivoire, très rapide !', initial: 'MD' },
  { name: 'Ibrahim Touré', rating: 5, timeAgo: 'il y a 2 heures', comment: '100 000 F CFA reçus sur MTN MoMo au Cameroun, service incroyable.', initial: 'IT' }
];

export default function Retrait({ user, setUser }: RetraitProps) {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [withdrawMethod, setWithdrawMethod] = useState('MTN MoMo');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('10000');
  const [error, setError] = useState('');
  const [withdrawalSuccess, setWithdrawalSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleCountrySelect = (country: Country) => {
    if (user.balance < 10000) {
      setError('Votre solde disponible est inférieur au montant minimum de retrait de 10 000 F CFA.');
      showToast('Solde insuffisant pour initier un retrait.');
      setTimeout(() => setError(''), 4000);
      return;
    }
    setError('');
    setSelectedCountry(country);
    setWithdrawalSuccess(false);
  };

  const handleWithdrawSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const parsedAmount = parseInt(amount, 10);
    if (isNaN(parsedAmount) || parsedAmount < 10000) {
      setError('Le montant minimum de retrait est de 10 000 F CFA.');
      return;
    }

    if (parsedAmount > user.balance) {
      setError('Votre solde disponible est insuffisant.');
      return;
    }

    if (!phone || phone.length < 8) {
      setError('Veuillez saisir un numéro de téléphone valide pour le paiement.');
      return;
    }

    // Submit withdrawal success
    const newTx: WithdrawalTransaction = {
      id: Math.random().toString().slice(2, 9),
      amount: parsedAmount,
      method: withdrawMethod,
      country: selectedCountry?.name || '',
      status: 'En attente',
      date: new Date().toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    setUser((prev) => {
      const updatedUser = {
        ...prev,
        balance: prev.balance - parsedAmount,
        withdrawalHistory: [newTx, ...prev.withdrawalHistory]
      };
      localStorage.setItem('skill_money_user', JSON.stringify(updatedUser));
      return updatedUser;
    });

    setWithdrawalSuccess(true);
    showToast('Demande de retrait soumise avec succès ! 🎉');
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('fr-FR').format(val);
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 max-w-4xl mx-auto w-full space-y-8 select-none">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-6 right-6 z-50 bg-[#1c1c3c] border border-[#5e5bf0]/45 px-5 py-3.5 rounded-xl shadow-[0_8px_30px_rgba(94,91,240,0.3)] flex items-center gap-3 max-w-sm"
          >
            <div className="w-8 h-8 rounded-full bg-[#5e5bf0]/20 flex items-center justify-center text-[#8a87ff] shrink-0">
              <CheckCircle size={18} />
            </div>
            <p className="text-sm font-semibold text-white">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Title Row & History button */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-display font-bold text-white tracking-tight">Retirer</h1>
          <p className="text-[#a0aec0] text-xs font-light">
            Minimum 10 000 F CFA • Franc CFA BEAC (XAF) et BCEAO selon votre pays
          </p>
        </div>

        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center gap-1.5 border border-[#1f1f3d] bg-[#111126]/80 text-gray-300 hover:text-white px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition shadow"
        >
          <History size={14} />
          <span>{showHistory ? 'Fermer l’historique' : 'Historique'}</span>
        </button>
      </div>

      {showHistory ? (
        /* Transaction History Module */
        <div className="bg-[#111126] border border-[#1f1f3d] rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <History className="text-[#8a87ff]" size={18} />
            <h2 className="text-sm font-bold text-white tracking-tight">Historique des transactions</h2>
          </div>

          {user.withdrawalHistory.length === 0 ? (
            <div className="py-12 text-center text-gray-400 font-light space-y-2">
              <p>Aucune demande de retrait effectuée pour le moment.</p>
              <p className="text-2xs text-gray-500">Le seuil de retrait est de 10 000 F CFA.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {user.withdrawalHistory.map((tx) => (
                <div key={tx.id} className="bg-[#090915] border border-[#1f1f3d] rounded-xl px-4 py-3.5 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-white">{tx.method} ({tx.country})</p>
                    <p className="text-2xs text-gray-500 mt-1">{tx.date} • ID: {tx.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white">{formatCurrency(tx.amount)} F CFA</p>
                    <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full mt-1.5 ${
                      tx.status === 'En attente'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : tx.status === 'Approuvé'
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : selectedCountry ? (
        /* Selected Country Form Details Drawer/Modal */
        <div className="bg-[#111126] border border-[#1f1f3d] rounded-2xl p-6 space-y-6 relative overflow-hidden">
          {/* Back button */}
          <button
            onClick={() => setSelectedCountry(null)}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition py-1"
          >
            <ArrowLeft size={14} />
            <span>Changer de pays</span>
          </button>

          {!withdrawalSuccess ? (
            <form onSubmit={handleWithdrawSubmit} className="space-y-5">
              <div className="pb-2 border-b border-[#1f1f3d]/50">
                <span className="text-[10px] uppercase font-bold text-[#8a87ff] tracking-widest block">FORMULAIRE DE RETRAIT</span>
                <div className="flex items-center gap-2.5 mt-1">
                  <img
                    src={`https://flagcdn.com/w40/${selectedCountry.code.toLowerCase()}.png`}
                    alt={selectedCountry.name}
                    className="w-6 h-4 object-cover rounded shadow-md shrink-0 border border-white/10"
                    referrerPolicy="no-referrer"
                  />
                  <h2 className="text-base font-bold text-white">Retrait vers le {selectedCountry.name}</h2>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs py-3 px-4 rounded-xl text-center">
                  {error}
                </div>
              )}

              {/* Operator select */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#a0aec0] tracking-wide block">
                  Sélectionnez l'opérateur de paiement
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['MTN MoMo', 'Orange Money', 'Wave', 'Moov Money'].map((op) => (
                    <button
                      key={op}
                      type="button"
                      onClick={() => setWithdrawMethod(op)}
                      className={`py-3 px-4 rounded-xl text-xs font-bold text-center border cursor-pointer transition ${
                        withdrawMethod === op
                          ? 'bg-[#5e5bf0] border-[#7f7cf3] text-white shadow-lg shadow-[#5e5bf0]/15'
                          : 'bg-[#090915] border-[#1f1f3d] text-gray-400 hover:text-white hover:bg-[#111126]'
                      }`}
                    >
                      {op}
                    </button>
                  ))}
                </div>
              </div>

              {/* Phone number */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#a0aec0] tracking-wide block">
                  Numéro de téléphone mobile money
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500 font-bold text-xs">
                    {selectedCountry.code}
                  </div>
                  <input
                    type="tel"
                    required
                    placeholder="Ex: 0588992211"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#090915] border border-[#1f1f3d] rounded-xl py-3 pl-14 pr-4 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[#5e5bf0] focus:ring-1 focus:ring-[#5e5bf0] transition duration-200"
                  />
                </div>
              </div>

              {/* Amount input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#a0aec0] tracking-wide block">
                  Montant à retirer (F CFA)
                </label>
                <input
                  type="number"
                  required
                  min="10000"
                  max={user.balance}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-[#090915] border border-[#1f1f3d] rounded-xl py-3 px-4 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[#5e5bf0] focus:ring-1 focus:ring-[#5e5bf0] transition duration-200"
                />
                <span className="text-[10px] text-gray-400 block px-1">
                  Solde disponible maximum : {formatCurrency(user.balance)} F CFA
                </span>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-[#5e5bf0] hover:bg-[#4d4ae0] text-white py-3.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#5e5bf0]/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Send size={14} />
                <span>Confirmer la demande de retrait ({formatCurrency(parseInt(amount || '0', 10))} F CFA)</span>
              </button>
            </form>
          ) : (
            /* Withdrawal Success screen overlay */
            <div className="py-10 text-center space-y-4 max-w-sm mx-auto flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 flex items-center justify-center animate-bounce shadow-lg">
                <CheckCircle size={32} />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-white">Demande de retrait reçue !</h3>
                <p className="text-xs text-gray-400 font-light leading-relaxed">
                  Votre demande de retrait de <span className="text-white font-semibold">{formatCurrency(parseInt(amount || '0', 10))} F CFA</span> via {withdrawMethod} est actuellement en cours de traitement.
                </p>
                <p className="text-2xs text-[#8a87ff] font-medium pt-1">
                  Le traitement prend généralement entre 5 et 30 minutes.
                </p>
              </div>
              <button
                onClick={() => setSelectedCountry(null)}
                className="bg-[#1f1f3d] hover:bg-[#2c2c52] text-white px-6 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition mt-2 w-full"
              >
                Retour au menu principal
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Main Withdraw Tab Body with Balance & notice & country grid */
        <>
          {/* Solde Disponible Card */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#5e5bf0] to-[#7f7cf3] rounded-2xl blur-lg opacity-35" />
            <div className="relative bg-gradient-to-r from-[#5e5bf0] to-[#7f7cf3] rounded-2xl p-6 text-center text-white shadow-[0_8px_30px_rgba(94,91,240,0.35)] flex flex-col items-center justify-center overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />

              <div className="flex items-center gap-2 text-white/80 text-xs font-semibold tracking-widest uppercase">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <line x1="2" x2="22" y1="10" y2="10" />
                </svg>
                <span>SOLDE DISPONIBLE</span>
              </div>

              <div className="mt-2.5 flex items-baseline justify-center gap-1.5 font-display">
                <span className="text-5xl font-extrabold tracking-tight">{formatCurrency(user.balance)}</span>
                <span className="text-lg font-bold opacity-90">F CFA</span>
              </div>
            </div>
          </div>

          {/* Alert minimum notice */}
          <div className="bg-[#111126]/60 border border-[#1f1f3d] rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle size={18} className="text-[#8a87ff] shrink-0 mt-0.5" />
            <div className="text-2xs leading-relaxed font-light text-gray-300">
              <p className="font-semibold text-[#8a87ff]">Le montant minimum de retrait est de 10 000 F CFA.</p>
              <p className="text-gray-400 mt-1">Pour les pays d'Afrique centrale, les paiements sont traités en Franc CFA BEAC (XAF).</p>
            </div>
          </div>

          {/* Country Selection Section */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-white tracking-tight uppercase">Sélectionnez votre pays</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {COUNTRIES.map((country) => (
                <div
                  key={country.code}
                  onClick={() => handleCountrySelect(country)}
                  className={`bg-[#111126]/60 border border-[#1f1f3d] hover:border-[#5e5bf0]/40 rounded-xl px-4 py-3.5 flex items-center justify-between text-xs transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5 ${
                    user.balance < 10000 ? 'hover:bg-red-500/5' : 'hover:bg-[#1a1a38]/40'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    {/* Country Code & Flag Block */}
                    <div className="flex items-center gap-2.5 w-18 shrink-0">
                      <img
                        src={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png`}
                        alt={country.name}
                        className="w-5.5 h-4 object-cover rounded shadow-sm shrink-0 border border-white/10"
                        referrerPolicy="no-referrer"
                      />
                      <span className="font-display font-black text-xs text-[#8a87ff] uppercase tracking-wide">
                        {country.code}
                      </span>
                    </div>
                    {/* Country Name */}
                    <span className="font-semibold text-white tracking-tight">
                      {country.name}
                    </span>
                  </div>

                  {/* Tiny wallet/arrow icon */}
                  <div className="text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Community Feedback Section */}
          <div className="space-y-4 pt-4 border-t border-[#1f1f3d]/50">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5 uppercase">
                <MessageSquare size={16} className="text-gray-400" />
                <span>Avis de la communauté</span>
              </h2>
              <div className="flex items-center gap-1 text-[#fbbf24] text-xs font-bold">
                <Star size={14} fill="currentColor" />
                <span>4.8 <span className="text-gray-400 font-light text-2xs">(100+)</span></span>
              </div>
            </div>

            <p className="text-2xs font-light text-gray-400 pb-1">Utilisateurs ayant reçu leurs retraits</p>

            <div className="grid gap-3.5">
              {COMMUNITY_REVIEWS.map((rev, index) => (
                <div key={index} className="bg-[#111126]/40 border border-[#1f1f3d]/60 rounded-xl p-4 space-y-2.5">
                  <div className="flex items-center justify-between text-2xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#5e5bf0]/15 text-[#8a87ff] font-bold text-xs flex items-center justify-center border border-[#5e5bf0]/25 uppercase">
                        {rev.initial}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{rev.name}</p>
                        {/* 5 gold stars */}
                        <div className="flex items-center gap-0.5 text-[#fbbf24] mt-0.5">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} size={10} fill="currentColor" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-gray-500 font-light">{rev.timeAgo}</span>
                  </div>
                  <p className="text-xs text-gray-300 font-light leading-relaxed pl-10">
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
