import { ArrowLeft } from 'lucide-react';

interface ConditionsProps {
  onBack: () => void;
}

export default function Conditions({ onBack }: ConditionsProps) {
  const sections = [
    {
      title: "1. Acceptation des conditions",
      text: "En accédant à Hot Money ou en l'utilisant, vous acceptez d'être lié par les présentes conditions générales. Si vous n'acceptez pas une partie de ces conditions, veuillez cesser immédiatement d'utiliser la plateforme."
    },
    {
      title: "2. Admissibilité",
      text: "Vous devez avoir au moins 18 ans pour créer un compte et utiliser nos services. En vous inscrivant, vous confirmez que les informations fournies sont exactes et que vous êtes légalement autorisé à utiliser cette plateforme."
    },
    {
      title: "3. Utilisation du contenu",
      text: "Tout le contenu disponible sur Hot Money, notamment les supports pédagogiques, articles, éléments graphiques, logos et ressources numériques, appartient à Hot Money ou à ses concédants et est protégé par les lois applicables en matière de propriété intellectuelle. Vous pouvez consulter et utiliser ce contenu uniquement à des fins personnelles, non commerciales et d'apprentissage. Toute redistribution, reproduction ou utilisation commerciale sans autorisation écrite préalable est strictement interdite."
    },
    {
      title: "4. Modification de la plateforme",
      text: "Hot Money se réserve le droit de modifier, suspendre ou supprimer toute fonctionnalité, tout service ou toute section de la plateforme à tout moment, avec ou sans préavis. Nous pouvons également mettre à jour ces conditions afin de tenir compte de l'évolution de nos services, de la technologie ou des exigences légales. La poursuite de l'utilisation de la plateforme après une modification vaut acceptation des conditions mises à jour."
    },
    {
      title: "5. Comportement des utilisateurs",
      text: "Vous acceptez d'utiliser la plateforme de manière responsable et de ne participer à aucune activité illégale, abusive ou perturbatrice. L'utilisation de robots, de scripts automatisés, de faux comptes ou toute tentative visant à compromettre l'intégrité de la plateforme est strictement interdite."
    },
    {
      title: "6. Sécurité du compte",
      text: "Vous êtes responsable de la confidentialité de vos identifiants et de toutes les activités effectuées depuis votre compte. Informez-nous immédiatement si vous soupçonnez un accès non autorisé ou une atteinte à la sécurité."
    },
    {
      title: "7. Suspension ou fermeture du compte",
      text: "Nous nous réservons le droit de suspendre ou de fermer, sans préavis ni responsabilité, tout compte qui enfreint ces conditions ou adopte un comportement jugé nuisible à la plateforme ou à ses utilisateurs."
    },
    {
      title: "8. Limitation de garantie",
      text: "La plateforme et son contenu sont fournis « en l'état » et « selon disponibilité ». Hot Money ne donne aucune garantie, expresse ou implicite, concernant l'exactitude, la fiabilité ou la disponibilité des services."
    },
    {
      title: "9. Modification des conditions",
      text: "Les présentes conditions générales peuvent être mises à jour périodiquement. La version la plus récente sera toujours disponible sur cette page et la poursuite de l'utilisation de la plateforme indique votre acceptation des modifications."
    },
    {
      title: "10. Contact",
      text: "Pour toute question ou préoccupation concernant ces conditions, veuillez nous contacter par l'intermédiaire de nos canaux d'assistance officiels."
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 max-w-4xl mx-auto w-full space-y-6 select-none">
      {/* Back Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-white p-2 rounded-lg bg-[#111126]/60 border border-[#1f1f3d] transition-all hover:bg-[#111126]"
        >
          <ArrowLeft size={16} />
        </button>
        <h1 className="text-lg md:text-xl font-display font-bold text-white tracking-tight">
          Conditions générales
        </h1>
      </div>

      {/* Main terms card */}
      <div className="bg-[#111126]/80 border border-[#1f1f3d] rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#5e5bf0]/5 to-[#8a87ff]/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="space-y-6 text-xs md:text-sm text-gray-300 leading-relaxed font-light">
          {sections.map((section, index) => (
            <div key={index} className="space-y-1.5 border-b border-[#1f1f3d]/30 pb-4 last:border-b-0 last:pb-0">
              <h2 className="font-semibold text-white font-display text-sm md:text-base">
                {section.title}
              </h2>
              <p className="text-gray-400">
                {section.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
