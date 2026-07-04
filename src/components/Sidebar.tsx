import { TabType } from '../types';
import { Home, Zap, Trophy, Users, Wallet, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onLogout: () => void;
  userName: string;
}

export default function Sidebar({ activeTab, setActiveTab, onLogout, userName }: SidebarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'accueil' as TabType, label: 'Accueil', icon: Home },
    { id: 'gagner' as TabType, label: 'Gagner', icon: Zap },
    { id: 'top' as TabType, label: 'Top', icon: Trophy },
    { id: 'inviter' as TabType, label: 'Inviter', icon: Users },
    { id: 'retrait' as TabType, label: 'Retrait', icon: Wallet },
  ];

  const handleTabClick = (tabId: TabType) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#111126] border-b border-[#1f1f3d] fixed top-0 left-0 w-full z-30">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#f59e0b] to-[#ef4444] flex items-center justify-center shadow-[0_0_10px_rgba(239,68,68,0.4)]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white">
              <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v1" />
              <path d="M18 8h4a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-4" />
              <circle cx="9" cy="12" r="2" />
            </svg>
          </div>
          <span className="font-display font-bold tracking-tight text-white text-base">Hot Money 🔥</span>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-gray-400 hover:text-white p-1"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar container (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 h-[calc(100vh-2rem)] my-4 ml-4 bg-[#111126] border border-[#1f1f3d] rounded-2xl p-5 sticky top-4 select-none justify-between shadow-2xl shrink-0">
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#f59e0b] to-[#ef4444] flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.5)]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4.5 h-4.5 text-white">
                <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v1" />
                <path d="M18 8h4a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-4" />
                <circle cx="9" cy="12" r="2" />
              </svg>
            </div>
            <span className="font-display font-bold tracking-tight text-white text-lg">Hot Money 🔥</span>
          </div>

          {/* Navigation */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#5e5bf0] text-white shadow-[0_4px_15px_rgba(94,91,240,0.3)]'
                      : 'text-gray-400 hover:text-white hover:bg-[#1c1c3c]/50'
                  }`}
                >
                  <IconComponent size={18} className={isActive ? 'text-white' : 'text-gray-400'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User profile info & Logout */}
        <div className="space-y-4 pt-4 border-t border-[#1f1f3d]/50">
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-8 h-8 rounded-full bg-[#5e5bf0]/20 flex items-center justify-center text-[#8a87ff] font-bold text-sm border border-[#5e5bf0]/30">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-gray-400">Connecté en tant que</span>
              <span className="text-sm font-semibold text-white truncate">{userName}</span>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-[#ea5656] hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 cursor-pointer"
          >
            <LogOut size={18} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
          <div
            className="w-64 h-full bg-[#111126] border-r border-[#1f1f3d] p-5 flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-8">
              {/* Mobile Header Inside Drawer */}
              <div className="flex items-center gap-3 px-2 pt-14">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#f59e0b] to-[#ef4444] flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4.5 h-4.5 text-white">
                    <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v1" />
                    <path d="M18 8h4a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-4" />
                    <circle cx="9" cy="12" r="2" />
                  </svg>
                </div>
                <span className="font-display font-bold tracking-tight text-white text-lg">Hot Money 🔥</span>
              </div>

              {/* Navigation */}
              <nav className="space-y-1.5">
                {navItems.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabClick(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-[#5e5bf0] text-white shadow-[0_4px_15px_rgba(94,91,240,0.3)]'
                          : 'text-gray-400 hover:text-white hover:bg-[#1c1c3c]/50'
                      }`}
                    >
                      <IconComponent size={18} className={isActive ? 'text-white' : 'text-gray-400'} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Profile & Logout */}
            <div className="space-y-4 pt-4 border-t border-[#1f1f3d]/50">
              <div className="flex items-center gap-3 px-2 py-1">
                <div className="w-8 h-8 rounded-full bg-[#5e5bf0]/20 flex items-center justify-center text-[#8a87ff] font-bold text-sm">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs text-gray-400">Connecté</span>
                  <span className="text-sm font-semibold text-white truncate">{userName}</span>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-[#ea5656] hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
              >
                <LogOut size={18} />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
