'use client';

import React from 'react';
import { useTranslation } from 'next-i18next';

/**
 * Left-side hero for login page: gradient background, marketplace visuals, tagline.
 * Tailwind only, accessible, responsive.
 */
export default function LoginHero() {
  const { t } = useTranslation('common');

  return (
    <div
      className="relative flex min-h-full flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-900 via-blue-900 to-violet-900 px-8 py-12 md:px-12 lg:px-16"
      role="banner"
      aria-label={t('admin-login-title')}
    >
      {/* Soft overlay for readability */}
      <div
        className="pointer-events-none absolute inset-0 bg-black/20"
        aria-hidden
      />

      {/* Abstract background shapes */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-0 h-96 w-96 rounded-full bg-violet-400/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-64 w-64 rounded-full bg-blue-400/10 blur-3xl" />
      </div>

      {/* Floating UI elements: product card, cart, users */}
      <div className="relative z-10 flex flex-col gap-8">
        <div className="flex flex-wrap gap-4 opacity-90">
          <FloatingCard className="translate-y-0" />
          <FloatingIcon type="cart" className="-translate-y-4 translate-x-2" />
          <FloatingIcon type="users" className="translate-y-2 translate-x-4" />
        </div>
      </div>

      {/* Tagline & value proposition */}
      <div className="relative z-10 mt-auto max-w-lg">
        <h2 className="text-2xl font-semibold leading-tight text-white drop-shadow-sm md:text-3xl lg:text-4xl">
          {t('login-hero-tagline')}
        </h2>
        <p className="mt-4 text-base text-white/90 drop-shadow-sm md:text-lg">
          {t('login-hero-value')}
        </p>
      </div>
    </div>
  );
}

function FloatingCard({ className = '' }: { className?: string }) {
  return (
    <div
      className={`flex h-24 w-36 flex-col rounded-xl border border-white/20 bg-white/10 p-3 shadow-xl backdrop-blur-sm ${className}`}
      aria-hidden
    >
      <div className="mb-2 h-8 w-full rounded-md bg-white/30" />
      <div className="h-2 w-2/3 rounded bg-white/20" />
      <div className="mt-1 h-2 w-1/2 rounded bg-white/20" />
    </div>
  );
}

function FloatingIcon({
  type,
  className = '',
}: {
  type: 'cart' | 'users';
  className?: string;
}) {
  const icon =
    type === 'cart' ? (
      <svg className="h-8 w-8 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ) : (
      <svg className="h-8 w-8 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    );
  return (
    <div
      className={`flex h-14 w-14 items-center justify-center rounded-xl border border-white/20 bg-white/10 shadow-lg backdrop-blur-sm ${className}`}
      aria-hidden
    >
      {icon}
    </div>
  );
}

/**
 * Compact hero for mobile: gradient strip + tagline.
 */
export function LoginHeroCompact() {
  const { t } = useTranslation('common');
  return (
    <div
      className="bg-gradient-to-r from-indigo-900 via-blue-900 to-violet-900 px-6 py-8"
      role="banner"
    >
      <p className="text-lg font-semibold text-white drop-shadow-sm">
        {t('login-hero-tagline')}
      </p>
    </div>
  );
}
