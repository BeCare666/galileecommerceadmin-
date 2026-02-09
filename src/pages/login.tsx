import LoginForm from '@/components/auth/login-form';
import LoginFormCard from '@/components/auth/login-form-card';
import LoginHero from '@/components/auth/login-hero';
import { useTranslation } from 'next-i18next';
import type { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { getAuthCredentials, isAuthenticated } from '@/utils/auth-utils';
import { useRouter } from 'next/router';
import { Routes } from '@/config/routes';
import { useSearchParams } from 'next/navigation';

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale!, ['common', 'form'])),
  },
});

export default function LoginPage() {
  const router = useRouter();
  const { token, permissions } = getAuthCredentials();
  if (isAuthenticated({ token, permissions })) {
    router.replace(Routes.dashboard);
  }
  const { t } = useTranslation('common');
  const searchParams = useSearchParams();
  const becomeSeller = searchParams.get('become_seller');

  const headerMessage =
    becomeSeller === '1' ? t('admin-login-title-auth') : undefined;

return (
  <div className="min-h-screen w-full flex flex-col lg:flex-row">
    
    {/* Hero à gauche — visible seulement sur desktop */}
    <div className="hidden lg:flex lg:w-1/2">
      <LoginHero />
    </div>

    {/* Formulaire à droite — toujours visible */}
    <div className="flex w-full lg:w-1/2 items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <LoginFormCard headerMessage={headerMessage}>
        <LoginForm />
      </LoginFormCard>
    </div>

  </div>
);

}  