// app/components/DashboardHeader.tsx
import { useMemo } from "react";
import { useRouter } from "next/router";
import { useMeQuery } from "@/data/user";

interface DashboardHeaderProps {
  actionTitle?: string;
  actionDescription?: string;
  onActionClick?: () => void;
}

export default function DashboardHeader({
  actionTitle = "Ajoutez un nouveau produit",
  actionDescription = "Créez votre premier article en quelques clics.",
  onActionClick,
}: DashboardHeaderProps) {
  const router = useRouter();

  // Récupération de l'utilisateur
  const { data } = useMeQuery();
  const userName = data?.name || "Utilisateur";
  const shop = data?.shops?.[0];

  // Gestion du message d’accueil
  const { greeting, icon } = useMemo(() => {
    const hour = new Date().getHours();

    if (hour < 12) return { greeting: "Bonjour", icon: "🌅" };
    if (hour < 18) return { greeting: "Bon après-midi", icon: "☀️" };
    if (hour < 22) return { greeting: "Bonsoir", icon: "🌙" };

    return { greeting: "Bonne nuit", icon: "🌑" };
  }, []);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* Bloc météo/greeting */}
      <div className="flex items-center rounded-[5px] bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white shadow-lg">
        <div className="text-5xl mr-4 animate-bounce">{icon}</div>
        <div>
          <h2 className="text-2xl font-bold">
            {greeting}, {userName} 👋
          </h2>
          <p className="text-sm opacity-80">
            Content de vous revoir sur votre tableau de bord.
          </p>
        </div>
      </div>

      {/* Bloc action */}
      {shop ? (
        <div
          onClick={() => router.push(`/${shop.slug}`)}
          className="cursor-pointer flex items-center justify-between rounded-[5px] bg-white p-6 shadow-lg hover:shadow-2xl transition"
        >
          <div className="flex items-center gap-4">
            {/* Icône boutique */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-12 h-12 text-indigo-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 9l1-4h16l1 4M4 9h16v11a1 1 0 01-1 1H5a1 1 0 01-1-1V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 13h6v5H9z"
              />
            </svg>

            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Visiter votre espace vendeur
              </h3>
              <p className="text-sm text-gray-500">
                Accédez à votre boutique {shop.name}.
              </p>
            </div>
          </div>
        </div>

      ) : (
        <div className="flex items-center justify-between rounded-[5px] bg-white p-6 shadow-lg hover:shadow-2xl transition">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{actionTitle}</h3>
            <p className="text-sm text-gray-500">{actionDescription}</p>
          </div>
          <button
            onClick={onActionClick}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 text-white text-3xl shadow-lg hover:scale-110 transition-transform"
          >
            +
          </button>
        </div>
      )}
    </div>
  );
}
