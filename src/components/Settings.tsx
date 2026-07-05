import { ArrowLeft, Moon, ShieldCheck, Sparkles } from 'lucide-react';

interface SettingsProps {
  onBack: () => void;
}

export default function Settings({ onBack }: SettingsProps) {
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
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#ff6b00]/5 to-[#ffaa44]/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="space-y-4">
          <div>
            <h2 className="text-sm md:text-base font-semibold text-white font-display mb-1 flex items-center gap-2">
              <Moon size={18} className="text-[#ffaa44]" />
              Thème de l'application
            </h2>
            <p className="text-xs text-gray-400">
              Hot Money s'affiche exclusivement en Mode Sombre (Dark Mode) de manière permanente.
            </p>
          </div>

          <div className="p-4 bg-[#1c1c3c]/50 border border-[#1f1f3d]/80 rounded-xl space-y-2.5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#ff6b00]/15 text-[#ffaa44] rounded-lg">
                <Moon size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Mode Sombre Activé</p>
                <p className="text-xs text-gray-400">Le thème sombre est optimisé pour votre confort visuel.</p>
              </div>
            </div>
            <div className="h-[1px] bg-[#1f1f3d]/60" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="flex items-start gap-2.5">
                <ShieldCheck size={14} className="text-emerald-400 mt-0.5 shrink-0" />
                <p className="text-[11px] text-gray-400">
                  <strong className="text-gray-300">Moins de fatigue oculaire :</strong> Idéal pour les longues sessions d'activités et de tâches rémunérées.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <Sparkles size={14} className="text-[#ffaa44] mt-0.5 shrink-0" />
                <p className="text-[11px] text-gray-400">
                  <strong className="text-gray-300">Économie d'énergie :</strong> Consomme moins de batterie sur les écrans OLED et AMOLED.
                </p>
              </div>
            </div>
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
