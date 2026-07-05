import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { User, InvitedFriend } from '../types';
import { Gift, Copy, Share2, Check, MessageCircle, Send, Facebook, Sparkles, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface InviterProps {
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
}

export default function Inviter({ user, setUser }: InviterProps) {
  const [copied, setCopied] = useState(false);
  const [showNotification, setShowNotification] = useState<string | null>(null);

  const inviteLink = `https://www.hotmoney.fun/?ref=${user.referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    showToast("Lien d'invitation copié avec succès ! 📋");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    let url = '';
    const text = `Rejoins-moi sur Hot Money et commence à gagner de l'argent dès aujourd'hui ! Code de parrainage : ${user.referralCode}`;
    
    switch (platform) {
      case 'whatsapp':
        url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + inviteLink)}`;
        break;
      case 'messenger':
        url = `fb-messenger://share/?link=${encodeURIComponent(inviteLink)}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(inviteLink)}`;
        break;
      case 'telegram':
        url = `https://telegram.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(text)}`;
        break;
      default:
        // Use standard Web Share API if available
        if (navigator.share) {
          navigator.share({
            title: 'Hot Money',
            text: text,
            url: inviteLink,
          }).catch(console.error);
          return;
        } else {
          handleCopy();
          return;
        }
    }
    window.open(url, '_blank');
  };

  // Auto-generate mock friends if user.invites is greater than actual invitedFriends length on mount
  useEffect(() => {
    const friendsList = user.invitedFriends || [];
    if (user.invites > friendsList.length) {
      const difference = user.invites - friendsList.length;
      const newFriends: InvitedFriend[] = [];
      
      const FIRST_NAMES = ["Abdoulaye", "Fatou", "Moustapha", "Aïssatou", "Ousmane", "Mariama", "Cheikh", "Khady", "Ibrahima", "Sokhna", "Babacar", "Aminata", "Amadou", "Rama", "Alioune", "Ndèye"];
      const LAST_NAMES = ["Ndiaye", "Sow", "Diop", "Diallo", "Fall", "Ba", "Gueye", "Diagne", "Cisse", "Faye", "Sy", "Toure", "Sane", "Seck", "Mbacke", "Badiane"];

      for (let i = 0; i < difference; i++) {
        const first = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
        const last = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
        const name = `${first} ${last}`;
        const normalized = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '.');
        const domains = ['gmail.com', 'yahoo.fr', 'outlook.com', 'hotmail.com'];
        const domain = domains[Math.floor(Math.random() * domains.length)];
        const email = `${normalized}@${domain}`;

        // Generate some past date
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - (i + 1) * 2 - Math.floor(Math.random() * 3));
        const day = String(pastDate.getDate()).padStart(2, '0');
        const monthNames = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
        const month = monthNames[pastDate.getMonth()];
        const year = pastDate.getFullYear();
        const hours = String(pastDate.getHours()).padStart(2, '0');
        const minutes = String(pastDate.getMinutes()).padStart(2, '0');
        const dateStr = `${day} ${month} ${year} à ${hours}:${minutes}`;

        newFriends.push({
          id: Math.random().toString(36).substring(2, 11).toUpperCase(),
          name,
          email,
          date: dateStr,
          status: Math.random() > 0.15 ? 'Actif' : 'En attente',
          reward: 800
        });
      }
      
      const updatedUser: User = {
        ...user,
        invitedFriends: [...friendsList, ...newFriends]
      };
      setUser(updatedUser);
      localStorage.setItem('skill_money_user', JSON.stringify(updatedUser));
    }
  }, []);

  const simulateFriendSignUp = () => {
    const FIRST_NAMES = ["Abdoulaye", "Fatou", "Moustapha", "Aïssatou", "Ousmane", "Mariama", "Cheikh", "Khady", "Ibrahima", "Sokhna", "Babacar", "Aminata", "Amadou", "Rama", "Alioune", "Ndèye"];
    const LAST_NAMES = ["Ndiaye", "Sow", "Diop", "Diallo", "Fall", "Ba", "Gueye", "Diagne", "Cisse", "Faye", "Sy", "Toure", "Sane", "Seck", "Mbacke", "Badiane"];

    const first = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const last = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    const name = `${first} ${last}`;
    const normalized = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '.');
    const domains = ['gmail.com', 'yahoo.fr', 'outlook.com', 'hotmail.com'];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const email = `${normalized}@${domain}`;

    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const monthNames = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
    const month = monthNames[now.getMonth()];
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const dateStr = `${day} ${month} ${year} à ${hours}:${minutes}`;

    const newFriend: InvitedFriend = {
      id: Math.random().toString(36).substring(2, 11).toUpperCase(),
      name,
      email,
      date: dateStr,
      status: 'Actif',
      reward: 800
    };

    setUser((prev) => {
      const updatedUser = {
        ...prev,
        invites: prev.invites + 1,
        earningsFromInvites: prev.earningsFromInvites + 800,
        balance: prev.balance + 800,
        invitedFriends: [newFriend, ...(prev.invitedFriends || [])],
      };
      localStorage.setItem('skill_money_user', JSON.stringify(updatedUser));
      return updatedUser;
    });
    showToast(`Félicitations ! ${name} s'est inscrit avec votre lien. +800 F CFA ajoutés 🎉`);
  };

  const showToast = (message: string) => {
    setShowNotification(message);
    setTimeout(() => {
      setShowNotification(null);
    }, 4000);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('fr-FR').format(val);
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
            className="fixed top-6 right-6 z-50 bg-[#1c1c3c] border border-[#5e5bf0]/45 px-5 py-3.5 rounded-xl shadow-[0_8px_30px_rgba(94,91,240,0.3)] flex items-center gap-3 max-w-sm"
          >
            <div className="w-8 h-8 rounded-full bg-[#5e5bf0]/20 flex items-center justify-center text-[#8a87ff] shrink-0">
              <Sparkles size={18} />
            </div>
            <p className="text-sm font-semibold text-white">{showNotification}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Header Row */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-display font-bold text-white tracking-tight">Inviter et gagner</h1>
          <p className="text-[#a0aec0] text-xs font-light">
            Recevez 800 F CFA pour chaque ami inscrit
          </p>
        </div>
        <button className="text-gray-400 hover:text-white p-2 rounded-lg bg-[#111126] border border-[#1f1f3d] transition">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="w-4 h-4">
            <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
          </svg>
        </button>
      </div>

      {/* Reward Card Banner (identical to Home screen style but focused on parrainage) */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-[#5e5bf0] to-[#7f7cf3] rounded-2xl blur-lg opacity-30" />
        <div className="relative bg-gradient-to-r from-[#5e5bf0] to-[#7f7cf3] rounded-2xl p-6 shadow-xl flex items-center gap-4 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
          <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center text-white shrink-0">
            <Gift size={22} className="text-white animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-white/70 tracking-widest block">PAR PARRAINAGE</span>
            <span className="text-3xl font-extrabold font-display leading-tight">800 F CFA</span>
          </div>
        </div>
      </div>

      {/* Referral Link & Social buttons container */}
      <div className="bg-[#111126] border border-[#1f1f3d] rounded-2xl p-5 md:p-6 space-y-6">
        {/* Referral Link */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">
            LIEN D'INVITATION
          </label>
          <div className="flex items-center bg-[#090915] border border-[#1f1f3d] rounded-xl overflow-hidden pr-1.5 py-1.5 pl-3.5 transition focus-within:border-[#5e5bf0]">
            <input
              type="text"
              readOnly
              value={inviteLink}
              className="bg-transparent text-white text-xs md:text-sm font-medium w-full focus:outline-none select-all truncate mr-2"
            />
            <button
              onClick={handleCopy}
              className="bg-[#1f1f3d] hover:bg-[#2c2c52] text-gray-300 px-4 py-2.5 rounded-lg text-xs font-semibold cursor-pointer transition flex items-center gap-1.5"
            >
              {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
              <span>{copied ? 'Copié !' : 'Copier'}</span>
            </button>
          </div>
        </div>

        {/* Share Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* WhatsApp */}
          <button
            onClick={() => handleShare('whatsapp')}
            className="bg-[#111126] border border-[#1f1f3d] hover:border-emerald-500/40 hover:bg-[#1a382c]/20 text-gray-200 py-3.5 px-3.5 rounded-xl text-xs font-semibold flex items-center justify-between gap-1.5 transition cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <MessageCircle size={16} className="text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>WhatsApp</span>
            </div>
            <ChevronRight size={13} className="text-gray-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
          </button>

          {/* Messenger */}
          <button
            onClick={() => handleShare('messenger')}
            className="bg-[#111126] border border-[#1f1f3d] hover:border-sky-500/40 hover:bg-[#112a45]/20 text-gray-200 py-3.5 px-3.5 rounded-xl text-xs font-semibold flex items-center justify-between gap-1.5 transition cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              {/* Custom Messenger SVG inside button */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform">
                <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.914 1.45 5.513 3.714 7.152.195.14.316.364.316.604v2.09c0 .484.53.79.94.555l2.42-1.385a.73.73 0 0 1 .5-.054c.677.166 1.383.254 2.11.254 5.523 0 10-4.146 10-9.259C22 6.145 17.523 2 12 2zm1.187 11.776l-2.074-2.213a.522.522 0 0 0-.756-.01l-2.9 2.535c-.347.304-.812-.132-.556-.514l3.1-4.634a.522.522 0 0 1 .757-.105l2.073 2.213a.522.522 0 0 0 .756.01l2.9-2.535c.348-.304.813.132.556.514l-3.1 4.634a.522.522 0 0 1-.756.105z" />
              </svg>
              <span>Messenger</span>
            </div>
            <ChevronRight size={13} className="text-gray-500 group-hover:text-sky-400 group-hover:translate-x-0.5 transition-all" />
          </button>

          {/* Facebook */}
          <button
            onClick={() => handleShare('facebook')}
            className="bg-[#111126] border border-[#1f1f3d] hover:border-blue-500/40 hover:bg-[#112245]/20 text-gray-200 py-3.5 px-3.5 rounded-xl text-xs font-semibold flex items-center justify-between gap-1.5 transition cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <Facebook size={16} className="text-blue-500 group-hover:scale-110 transition-transform" />
              <span>Facebook</span>
            </div>
            <ChevronRight size={13} className="text-gray-500 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
          </button>

          {/* Telegram */}
          <button
            onClick={() => handleShare('telegram')}
            className="bg-[#111126] border border-[#1f1f3d] hover:border-sky-400/40 hover:bg-[#113145]/20 text-gray-200 py-3.5 px-3.5 rounded-xl text-xs font-semibold flex items-center justify-between gap-1.5 transition cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <Send size={16} className="text-sky-400 -rotate-12 group-hover:scale-110 transition-transform" />
              <span>Telegram</span>
            </div>
            <ChevronRight size={13} className="text-gray-500 group-hover:text-sky-400 group-hover:translate-x-0.5 transition-all" />
          </button>

          {/* Copier (Full size block) */}
          <button
            onClick={handleCopy}
            className="bg-[#111126] border border-[#1f1f3d] hover:border-[#8a87ff]/40 hover:bg-[#191938] text-gray-200 py-3.5 px-3.5 rounded-xl text-xs font-semibold flex items-center justify-between gap-1.5 transition cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <Copy size={16} className="text-[#8a87ff]" />
              <span>Copier</span>
            </div>
            <ChevronRight size={13} className="text-gray-500 group-hover:text-[#8a87ff] group-hover:translate-x-0.5 transition-all" />
          </button>

          {/* Partager */}
          <button
            onClick={() => handleShare('native')}
            className="bg-[#5e5bf0] hover:bg-[#4d4ae0] text-white py-3.5 px-3.5 rounded-xl text-xs font-bold flex items-center justify-between gap-1.5 transition cursor-pointer shadow-lg shadow-[#5e5bf0]/15 group"
          >
            <div className="flex items-center gap-2">
              <Share2 size={16} className="group-hover:rotate-12 transition-transform" />
              <span>Partager</span>
            </div>
            <ChevronRight size={13} className="text-white/60 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
          </button>
        </div>
      </div>

      {/* Invite Stats Panel */}
      <div className="bg-[#111126] border border-[#1f1f3d] rounded-2xl p-5 md:p-6 flex items-center justify-between text-xs relative overflow-hidden">
        {/* Decorative background logo tint */}
        <div className="absolute right-2.5 bottom-1/2 translate-y-1/2 text-[#1f1f3d]/30 pointer-events-none select-none">
          <Gift size={110} strokeWidth={1} />
        </div>

        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#1f1f3d]/60 border border-[#2c2c52] flex items-center justify-center text-gray-400 shrink-0">
            {/* Custom overlapping users icon as in screenshot */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5.5 h-5.5 text-[#8a87ff]">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Amis inscrits</p>
            <p className="text-2xl font-extrabold text-white mt-1 font-display">{user.invites}</p>
          </div>
        </div>

        <div className="text-right z-10">
          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Gagné</p>
          <p className="text-base font-extrabold text-[#8a87ff] mt-1.5 font-display">{formatCurrency(user.earningsFromInvites)} F CFA</p>
        </div>
      </div>

      {/* Invited Friends List Section */}
      <div className="bg-[#111126] border border-[#1f1f3d] rounded-2xl p-5 md:p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-sm md:text-base font-semibold text-white font-display">
            Membres parrainés ({user.invitedFriends?.length || 0})
          </h2>
          <button 
            onClick={simulateFriendSignUp}
            className="text-xs bg-[#5e5bf0]/10 border border-[#5e5bf0]/30 hover:bg-[#5e5bf0]/20 text-[#8a87ff] px-3 py-1.5 rounded-lg font-medium transition cursor-pointer"
          >
            Simuler un parrainage
          </button>
        </div>

        {(!user.invitedFriends || user.invitedFriends.length === 0) ? (
          <div className="text-center py-8 border border-dashed border-[#1f1f3d] rounded-xl space-y-2">
            <p className="text-sm text-gray-400">Aucun parrainage enregistré pour le moment.</p>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              Partagez votre lien d'invitation avec vos proches sur WhatsApp ou Facebook pour commencer à voir vos filleuls s'afficher ici.
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {user.invitedFriends.map((friend) => (
              <div 
                key={friend.id}
                className="flex items-center justify-between p-3.5 bg-[#1c1c3c]/50 border border-[#1f1f3d]/70 rounded-xl hover:border-[#1f1f3d] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#5e5bf0]/10 border border-[#5e5bf0]/20 flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {friend.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs md:text-sm font-semibold text-white truncate">{friend.name}</p>
                    <p className="text-[10px] text-gray-400 truncate">{friend.email}</p>
                    <p className="text-[9px] text-gray-500 mt-0.5">{friend.date}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`inline-block text-[9px] px-2 py-0.5 rounded-full font-bold mb-1 ${
                    friend.status === 'Actif' 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {friend.status}
                  </span>
                  <p className="text-xs font-bold text-white font-display">+{formatCurrency(friend.reward)} F CFA</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
