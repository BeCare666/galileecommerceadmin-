import LoginForm from '@/components/auth/login-form';
import { useTranslation } from 'next-i18next';
import type { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { getAuthCredentials, isAuthenticated } from '@/utils/auth-utils';
import { useRouter } from 'next/router';
import AuthPageLayout from '@/components/layouts/auth-layout';
import { Routes } from '@/config/routes';
import { useSearchParams } from "next/navigation";
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
  const becomeSeller = searchParams.get("become_seller");
  return (
    <AuthPageLayout>
      {becomeSeller === "1" ? (
        <h3 className="mb-6 mt-4 text-center text-base italic text-body">
          {t('admin-login-title-auth')}
        </h3>
      ) : (
        <h3 className="mb-6 mt-4 text-center text-base italic text-body">
          {t('admin-login-title')}
        </h3>
      )}
      <LoginForm />
    </AuthPageLayout>
  );
}
