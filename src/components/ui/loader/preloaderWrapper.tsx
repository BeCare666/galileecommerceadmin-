'use client';

import { useEffect, useState } from 'react';
import Preloader from './loader'; // adapte le chemin

const PreloaderWrapper = ({ children }: { children: React.ReactNode }) => {
  const [showPreloader, setShowPreloader] = useState(false);

  useEffect(() => {
    // Vérifie si le préloader a déjà été montré dans cette session
    const alreadyShown = sessionStorage.getItem('preloaderShown');

    if (!alreadyShown) {
      setShowPreloader(true);
      sessionStorage.setItem('preloaderShown', 'true');

      // Masque le préloader après 10 secondes
      const timer = setTimeout(() => {
        setShowPreloader(false);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, []);

  // Si le préloader doit s'afficher, on le retourne
  if (showPreloader) {
    return <Preloader />;
  }

  // Sinon on retourne le contenu normal
  return <>{children}</>;
};

export default PreloaderWrapper;
