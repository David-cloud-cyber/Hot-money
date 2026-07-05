import { ArrowLeft, Sun, Moon, Monitor, Check } from 'lucide-react';

interface SettingsProps {
  onBack: () => void;
  themeSetting: 'system' | 'light' | 'dark';
  onThemeChange: (theme: 'system' | 'light' | 'dark') => void;
}

export default function Settings({ onBack, themeSetting, onThemeChange }: SettingsProps) {
  const themes = [
    {
      id: 'system' as const,
      name: 'Automatique (Système)',
      description: 'S\'adapte aux préférences de votre appareil',
      icon: Monitor,
    },
    {
      id: 'light' as const,
      name: 'Mode Clair',
      description: 'Thème lumineux et épuré',
      icon: Sun,
    },
    {
      id: 'dark' as const,
      name: 'Mode Sombre',
      description: 'Thème sombre classique Hot Money',
      icon: Moon,
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 max-w-4xl mx-auto w-full space-y-6 select-none">
      {/* Back Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-white p-2 rounded-lg bg-[#111126]/60 border border-[#1f1f3d] transition-all hover:bg-[#111126] cursor-pointer"
        >
          <ArrowLeft size={16} />
        </button>
        <h1 className="text-lg md:text-xl font-display font-bold text-white tracking-tight">
          Paramètres
        </h1>
      </div>

      {/* Theme Settings Card */}
      <div className="bg-[#111126]/80 border border-[#1f1f3d] rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#5e5bf0]/5 to-[#8a87ff]/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="space-y-4">
          <div>
            <h2 className="text-sm md:text-base font-semibold text-white font-display mb-1">
              Thème de l'application
            </h2>
            <p className="text-xs text-gray-400">
              Choisissez comment Hot Money s'affiche sur votre appareil. L'option automatique synchronise l'application avec le système.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 pt-2">
            {themes.map((theme) => {
              const Icon = theme.icon;
              const isSelected = themeSetting === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => onThemeChange(theme.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left cursor-pointer ${
                    isSelected
                      ? 'bg-[#5e5bf0]/10 border-[#5e5bf0] text-white shadow-[0_4px_20px_rgba(94,91,240,0.15)]'
                      : 'bg-[#111126] border-[#1f1f3d] text-gray-300 hover:border-[#1f1f3d]/80 hover:bg-[#1f1f3d]/20'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-lg ${
                      isSelected ? 'bg-[#5e5bf0] text-white' : 'bg-[#1c1c3c] text-gray-400'
                    }`}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <span className="block text-sm font-semibold">
                        {theme.name}
                      </span>
                      <span className="block text-xs text-gray-400 mt-0.5">
                        {theme.description}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[#5e5bf0] flex items-center justify-center text-white shrink-0">
                      <Check size={12} strokeWidth={3} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-[#111126]/40 border border-[#1f1f3d]/50 rounded-2xl p-6 text-center space-y-1">
        <p className="text-xs text-gray-400">Application : <span className="text-white font-semibold">Hot Money 🔥</span></p>
        <p className="text-xs text-gray-400">Version de l'application : <span className="text-white">v2.1.0</span></p>
        <p className="text-[10px] text-gray-500 mt-2">© 2026 Hot Money. Tous droits réservés.</p>
      </div>
    </div>
  );
}
