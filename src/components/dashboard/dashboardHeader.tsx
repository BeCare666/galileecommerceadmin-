// app/components/DashboardHeader.tsx
import { useMemo } from "react";
import { useRouter } from "next/router";
import { useMeQuery } from "@/data/user";

interface DashboardHeaderProps {
  actionTitle?: string;
  actionDescription?: string;
  onActionClick?: () => void;
  /** Masquer la carte CTA "Créer un B space" quand l'utilisateur n'a pas de shop */
  showCreateShopCTA?: boolean;
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
      {/* Welcome card — premium gradient, soft & pro */}
      <div className="relative flex items-center overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 p-8 text-white shadow-elevated">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.25),transparent)]" />
        <div className="relative flex items-center gap-6">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm text-4xl">
            {icon}
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-white/95">
              {greeting}, <span className="font-bold text-white">{userName}</span>
            </h2>
            <p className="mt-1 text-sm text-white/70">
              Heureux de vous revoir sur votre tableau de bord.
            </p>
          </div>
        </div>
      </div>

      {/* CTA card — clean, elevated */}
      {shop ? (
        <div
          onClick={() => router.push(`/${shop.slug}`)}
          className="group flex cursor-pointer items-center justify-between rounded-2xl border border-gray-200/80 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200/60 hover:shadow-elevated"
        >
          <div className="flex items-center gap-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9l1-4h16l1 4M4 9h16v11a1 1 0 01-1 1H5a1 1 0 01-1-1V9z M9 13h6v5H9z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Espace vendeur</h3>
              <p className="text-sm text-gray-500">
                Accédez à votre B space <span className="font-medium text-gray-700">{shop.name}</span>.
              </p>
            </div>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 transition-all group-hover:translate-x-1 group-hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      ) : showCreateShopCTA ? (
        <div className="flex items-center justify-between rounded-2xl border border-gray-200/80 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-200/60 hover:shadow-elevated">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{actionTitle}</h3>
            <p className="mt-1 text-sm text-gray-500">{actionDescription}</p>
          </div>
          <button
            onClick={onActionClick}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-lg font-medium text-white shadow-card transition-all hover:shadow-elevated hover:scale-105"
          >
            +
          </button>
        </div>
      ) : null}
    </div>
  );

}
