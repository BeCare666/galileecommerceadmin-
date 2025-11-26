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
      {/* Bloc météo / greeting */}
      <div className="flex items-center rounded-xl bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 p-6 text-white shadow-lg backdrop-blur-sm">
        <div className="text-5xl mr-5 animate-pulse">{icon}</div>
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            {greeting}, <span className="font-bold">{userName}</span> 👋
          </h2>
          <p className="text-sm opacity-80 mt-1">
            Heureux de vous revoir sur votre tableau de bord.
          </p>
        </div>
      </div>

      {/* Bloc action */}
      {shop ? (
        <div
          onClick={() => router.push(`/${shop.slug}`)}
          className="group cursor-pointer flex items-center justify-between rounded-xl bg-white/90 p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-indigo-200"
        >
          <div className="flex items-center gap-5">
            <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-indigo-50 group-hover:bg-indigo-100 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-7 h-7 text-indigo-600"
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
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Espace vendeur
              </h3>
              <p className="text-sm text-gray-500">
                Accédez à votre B space <span className="font-medium">{shop.name}</span>.
              </p>
            </div>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-gray-400 group-hover:text-indigo-500 transition-transform group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      ) : (
        <div className="flex items-center justify-between rounded-xl bg-white/90 p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-emerald-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{actionTitle}</h3>
            <p className="text-sm text-gray-500 mt-1">{actionDescription}</p>
          </div>
          <button
            onClick={onActionClick}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 text-white text-3xl shadow-md hover:shadow-lg hover:scale-110 transition-transform"
          >
            +
          </button>
        </div>
      )}
    </div>
  );

}
