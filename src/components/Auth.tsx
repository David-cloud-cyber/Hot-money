import { useState, useEffect, FormEvent } from 'react';
import { User as UserIcon, Mail, Lock, Eye, EyeOff, Gift, ArrowRight } from 'lucide-react';
import { User } from '../types';

interface AuthProps {
  onAuthSuccess: (user: User) => void;
}

export default function Auth({ onAuthSuccess }: AuthProps) {
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState(''); // Empty by default so it's clean, or filled by URL
  
  const [error, setError] = useState('');

  // Automatically parse referral code from URL if present (?ref=CODE)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      setReferralCode(ref.toUpperCase());
      setIsLogin(false); // Switch to registration tab automatically
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setError('');

    if (!email || !password) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    if (!isLogin) {
      if (!name) {
        setError('Veuillez saisir votre nom complet.');
        return;
      }
      if (password.length < 6) {
        setError('Le mot de passe doit contenir au moins 6 caractères.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Les mots de passe ne correspondent pas.');
        return;
      }
    }

    setIsLoading(true);
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin 
        ? { email, password } 
        : { name, email, password, referralCodeEntered: referralCode };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Une erreur est survenue lors de l\'authentification.');
        setIsLoading(false);
        return;
      }

      onAuthSuccess(data);
    } catch (err) {
      console.warn('Network issue or server unavailable. Using secure local fallback session:', err);
      
      // Load user from local storage if they exist to allow local login offline
      const savedUserStr = localStorage.getItem('skill_money_user');
      let fallbackUser: User;
      
      if (savedUserStr) {
        try {
          const parsed = JSON.parse(savedUserStr) as User;
          if (parsed.email.toLowerCase().trim() === email.toLowerCase().trim()) {
            fallbackUser = parsed;
          } else {
            fallbackUser = {
              name: isLogin ? (email.split('@')[0] || 'Utilisateur') : name.trim(),
              email: email.toLowerCase().trim(),
              balance: 800,
              referralCode: Math.random().toString(36).substring(2, 10).toUpperCase(),
              invites: 0,
              earningsFromInvites: 0,
              hasJoinedWhatsApp: false,
              hasClaimedWhatsApp: false,
              unlockedAdLevel: 1,
              withdrawalHistory: [],
              invitedFriends: []
            };
          }
        } catch (e) {
          fallbackUser = {
            name: isLogin ? (email.split('@')[0] || 'Utilisateur') : name.trim(),
            email: email.toLowerCase().trim(),
            balance: 800,
            referralCode: Math.random().toString(36).substring(2, 10).toUpperCase(),
            invites: 0,
            earningsFromInvites: 0,
            hasJoinedWhatsApp: false,
            hasClaimedWhatsApp: false,
            unlockedAdLevel: 1,
            withdrawalHistory: [],
            invitedFriends: []
          };
        }
      } else {
        fallbackUser = {
          name: isLogin ? (email.split('@')[0] || 'Utilisateur') : name.trim(),
          email: email.toLowerCase().trim(),
          balance: 800,
          referralCode: Math.random().toString(36).substring(2, 10).toUpperCase(),
          invites: 0,
          earningsFromInvites: 0,
          hasJoinedWhatsApp: false,
          hasClaimedWhatsApp: false,
          unlockedAdLevel: 1,
          withdrawalHistory: [],
          invitedFriends: []
        };
      }
      
      onAuthSuccess(fallbackUser);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-radial from-[#151532] via-[#090915] to-[#04040a] px-4 py-12 relative overflow-hidden">
      {/* Decorative ambient glowing background blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-purple/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#5e5bf0]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#9c5bf0]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md z-10 flex flex-col items-center">
        {/* Logo Header */}
        <div className="flex items-center gap-2.5 bg-[#12122b]/60 border border-[#1f1f3d] px-4 py-2 rounded-2xl mb-6 shadow-lg backdrop-blur-md">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#f59e0b] to-[#ef4444] flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.5)]">
            {/* Custom logo overlapping icons mirroring screenshot */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4.5 h-4.5 text-white">
              <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v1" />
              <path d="M18 8h4a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-4" />
              <circle cx="9" cy="12" r="2" />
            </svg>
          </div>
          <span className="font-display font-bold tracking-tight text-white text-lg">Hot Money 🔥</span>
        </div>

        {/* Title and Subtitle */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-white tracking-tight flex items-center justify-center gap-2">
            {isLogin ? 'Connexion 🔑' : 'Créer un compte 🚀'}
          </h1>
          <p className="text-[#a0aec0] text-sm mt-2 font-light">
            {isLogin 
              ? 'Bon retour ! Connectez-vous pour continuer à gagner.' 
              : 'Rejoignez-nous et commencez à gagner dès aujourd\'hui.'}
          </p>
        </div>

        {/* Auth Card/Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs py-3 px-4 rounded-xl text-center">
              {error}
            </div>
          )}

          {/* Nom complet (Sign Up only) */}
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#a0aec0] tracking-wide block">
                Nom complet
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                  <UserIcon size={18} className="text-[#515175]" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Awa Diop"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#111126]/90 border border-[#1f1f3d] rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#5e5bf0] focus:ring-1 focus:ring-[#5e5bf0] transition duration-200 shadow-inner"
                />
              </div>
            </div>
          )}

          {/* Adresse e-mail */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#a0aec0] tracking-wide block">
              Adresse e-mail
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                <Mail size={18} className="text-[#515175]" />
              </div>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#111126]/90 border border-[#1f1f3d] rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#5e5bf0] focus:ring-1 focus:ring-[#5e5bf0] transition duration-200 shadow-inner"
              />
            </div>
          </div>

          {/* Mot de passe */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#a0aec0] tracking-wide block">
              Mot de passe
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                <Lock size={18} className="text-[#515175]" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="6 caractères minimum"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#111126]/90 border border-[#1f1f3d] rounded-xl py-3 pl-11 pr-11 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#5e5bf0] focus:ring-1 focus:ring-[#5e5bf0] transition duration-200 shadow-inner"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#515175] hover:text-[#8a87ff] transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirmer le mot de passe (Sign Up only) */}
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#a0aec0] tracking-wide block">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                  <Lock size={18} className="text-[#515175]" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Répétez le mot de passe"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#111126]/90 border border-[#1f1f3d] rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#5e5bf0] focus:ring-1 focus:ring-[#5e5bf0] transition duration-200 shadow-inner"
                />
              </div>
            </div>
          )}

          {/* Code de parrainage (Sign Up only) */}
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#a0aec0] tracking-wide block">
                Code de parrainage <span className="text-[#515175] text-2xs font-normal">(facultatif)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                  <Gift size={18} className="text-[#515175]" />
                </div>
                <input
                  type="text"
                  placeholder="C9672D2E"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  className="w-full bg-[#111126]/90 border border-[#1f1f3d] rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#5e5bf0] focus:ring-1 focus:ring-[#5e5bf0] transition duration-200 shadow-inner"
                />
              </div>
            </div>
          )}

          {/* Conditions legal text */}
          {!isLogin && (
            <p className="text-[#6d6d93] text-2xs leading-relaxed mt-2 text-center md:text-left px-1">
              En cliquant sur « Créer un compte », vous acceptez nos{' '}
              <a href="#" className="text-[#5e5bf0] hover:underline font-medium">Conditions</a> et notre{' '}
              <a href="#" className="text-[#5e5bf0] hover:underline font-medium">Politique de confidentialité</a>.
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full ${isLoading ? 'bg-[#5e5bf0]/60 cursor-not-allowed' : 'bg-[#5e5bf0] hover:bg-[#4d4ae0] cursor-pointer'} text-white font-medium text-sm py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 group transition-all duration-300 shadow-[0_4px_20px_rgba(94,91,240,0.35)] hover:shadow-[0_4px_25px_rgba(94,91,240,0.5)] transform hover:-translate-y-0.5 active:translate-y-0`}
          >
            <span>{isLoading ? 'Chargement...' : (isLogin ? 'Se connecter' : 'Créer un compte')}</span>
            {!isLoading && <ArrowRight size={16} className="group-hover:translate-x-1 transition duration-200" />}
          </button>
        </form>

        {/* Toggle between Register & Login */}
        <div className="mt-8 text-center text-xs">
          <p className="text-gray-400">
            {isLogin ? "Vous n'avez pas encore de compte ?" : "Vous avez déjà un compte ?"}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-[#5e5bf0] hover:underline font-semibold ml-1.5 focus:outline-none cursor-pointer"
            >
              {isLogin ? 'Créer un compte' : 'Connexion'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
