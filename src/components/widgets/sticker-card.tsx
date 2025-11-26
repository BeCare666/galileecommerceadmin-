'use client';
import React from 'react';
import { IosArrowDown } from '@/components/icons/ios-arrow-down';
import { NoDataFound as IosArrowUp } from '@/components/icons/ios-arrow-up';
import { useTranslation } from 'next-i18next';
import { StickerCardProps } from '@/types';
import { twMerge } from 'tailwind-merge';
import classNames from 'classnames';

const StickerCard = ({
  titleTransKey,
  icon,
  color,
  price,
  indicator,
  indicatorText,
  note,
  link,
  linkText,
  iconClassName,
}: StickerCardProps) => {
  const { t } = useTranslation('widgets');

  return (
    <div
      className={twMerge(
        'group relative flex flex-col justify-between rounded-2xl bg-white p-6 shadow-md hover:shadow-xl transition-all duration-300 ease-out hover:-translate-y-1 border border-gray-100 overflow-hidden'
      )}
    >
      {/* --- Haut de la carte --- */}
      <div className="flex items-start justify-between">
        {/* Titre et Valeur */}
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-500">
            {t(titleTransKey)}
          </span>
          <span className="mt-2 text-3xl font-semibold text-gray-900 tracking-tight">
            {price ?? '—'}
          </span>
          {note && (
            <span className="mt-1 text-xs text-gray-400">
              Comparé à {note}
            </span>
          )}
        </div>

        {/* Icône ronde colorée */}
        <div
          className={twMerge(
            classNames(
              'flex h-10 w-10 items-center justify-center rounded-full',
              iconClassName
            )
          )}
          style={{
            backgroundColor: `${color}1A`, // légère transparence
            color: color,
          }}
        >
          {icon}
        </div>
      </div>

      {/* --- Indicateur de tendance --- */}
      {indicator && (
        <div className="mt-4 flex items-center space-x-2 text-sm font-medium">
          {indicator === 'up' && (
            <span className="flex items-center text-emerald-500">
              <IosArrowUp width="10px" height="12px" className="inline-block mr-1" />
              {indicatorText}
            </span>
          )}
          {indicator === 'down' && (
            <span className="flex items-center text-rose-500">
              <IosArrowDown width="10px" height="12px" className="inline-block mr-1" />
              {indicatorText}
            </span>
          )}
        </div>
      )}

      {/* --- Graphe sparkline (statique ou prop dynamique) --- */}
      <div className="mt-6">
        <svg
          viewBox="0 0 100 30"
          fill="none"
          stroke={color}
          strokeWidth="2"
          className="w-full h-14 opacity-80"
        >
          <path d="M0 18 L10 15 L20 16 L30 10 L40 11 L50 8 L60 12 L70 10 L80 14 L90 13 L100 9" />
        </svg>
      </div>

      {/* --- Lien en bas si défini --- */}
      {link && (
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className="mt-3 text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
        >
          {linkText}
        </a>
      )}

      {/* --- Glow d’arrière-plan subtil --- */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at top right, ${color}10, transparent 70%)`,
        }}
      />
    </div>
  );
};

export default StickerCard;
