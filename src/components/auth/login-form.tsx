import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import PasswordInput from '@/components/ui/password-input';
import { useTranslation } from 'next-i18next';
import * as yup from 'yup';
import Link from '@/components/ui/link';
import Form from '@/components/ui/forms/form';
import { Routes } from '@/config/routes';
import { useLogin } from '@/data/user';
import type { LoginInput } from '@/types';
import { useState } from 'react';
import Alert from '@/components/ui/alert';
import Router from 'next/router';

import { toast } from 'react-toastify';
import {
  allowedRoles,
  hasAccess,
  setAuthCredentials,
} from '@/utils/auth-utils';
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
const loginFormSchema = yup.object().shape({
  email: yup
    .string()
    .email('form:error-email-format')
    .required('form:error-email-required'),
  password: yup.string().required('form:error-password-required'),
});
const defaultValues = {
  email: "",
  password: "",
};

const LoginForm = () => {
  const { t } = useTranslation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { mutate: login, isLoading, error } = useLogin();
  const searchParams = useSearchParams();
  const becomeSeller = searchParams.get("become_seller");
  const router = useRouter();
  function onSubmit(
    data: LoginInput,
    event?: React.BaseSyntheticEvent
  ) {
    event?.preventDefault(); // <-- empêche le rechargement

    login(
      { email: data.email, password: data.password },
      {
        onSuccess: (data) => {
          // Pas de token -> erreur d'identifiants
          if (!data?.token) {
            setErrorMessage('form:error-credential-wrong');
            return;
          }

          // Toast de succès (conserve ton comportement existant)
          if (becomeSeller === "1") {
            toast.success(t('common:successfully-connexion-auth'));
          } else {
            toast.success(t('common:successfully-connexion'));
          }

          // 1) Sauvegarder les credentials AVANT la redirection
          //    (Important : permet d'avoir le token dispo sur la page de destination)
          setAuthCredentials(data?.token, data?.permissions ?? [], data?.role);

          // 2) Si le backend a renvoyé une URL de redirection -> on la suit (prioritaire)
          if (data?.redirect) {
            const redirectUrl = String(data.redirect);

            // Si c'est une URL externe (http(s)://...), on fait un hard redirect
            //if (/^https?:\/\//i.test(redirectUrl)) {
            // window.location.href = redirectUrl;
            //return;
            // }

            // Sinon, route interne Next.js
            router.push('/');
            return;
          }

          // 3) Fallback (le backend n'a pas fourni de redirect)
          //    On applique la logique de permission locale puis on redirige vers dashboard
          const allowed = hasAccess(allowedRoles, data?.permissions ?? []);
          if (!allowed) {
            // informe l'utilisateur qu'il n'a pas assez de permission
            setErrorMessage('form:error-enough-permission');

            // Optionnel : aussi un toast d'erreur si tu veux un retour immédiat
            // toast.error(t('form:error-enough-permission'));
          }

          // navigation par défaut si aucune redirect fournie
          //Router.push(Routes.dashboard);
        },
        onError: (error: any) => {
          console.error('Erreur pendant la connexion:', error);
          if (error?.response?.data?.message) {
            setErrorMessage(error.response.data.message);
          } else if (error?.message) {
            setErrorMessage(error.message);
          } else {
            setErrorMessage('form:error-something-wrong');
          }
        },
      }
    );
  }



  return (
    <>
      <Form<LoginInput>
        validationSchema={loginFormSchema}
        onSubmit={onSubmit}
        useFormProps={{ defaultValues }}
      >
        {({ register, formState: { errors } }) => (
          <>
            <Input
              label={t('form:input-label-email')}
              {...register('email')}
              type="email"
              variant="outline"
              className="mb-4"
              error={t(errors?.email?.message!)}
            />
            <PasswordInput
              label={t('form:input-label-password')}
              forgotPassHelpText={t('form:input-forgot-password-label')}
              {...register('password')}
              error={t(errors?.password?.message!)}
              variant="outline"
              className="mb-4"
              forgotPageLink={Routes.forgotPassword}
            />
            <Button className="w-full" loading={isLoading} disabled={isLoading}>
              {t('form:button-label-login')}
            </Button>

            <div className="hidden relative mt-8 mb-6 flex flex-col items-center justify-center text-sm text-heading sm:mt-11 sm:mb-8">
              <hr className="w-full" />
              <span className="absolute -top-2.5 bg-light px-2 -ms-4 start-2/4">
                {t('common:text-or')}
              </span>
            </div>

            <div className="hidden text-center text-sm text-body sm:text-base hindeed mt-5">
              {t('form:text-no-account')}{' '}
              <Link
                href="https://galileecommerce.vercel.app/become_seller/become_seller"
                className="font-semibold text-accent underline transition-colors duration-200 ms-1 hover:text-accent-hover hover:no-underline focus:text-accent-700 focus:no-underline focus:outline-none"
              >
                {t('form:link-register-shop-owner')}
              </Link>
            </div>
          </>
        )}
      </Form>
      {errorMessage ? (
        <Alert
          message={t(errorMessage)}
          variant="error"
          closeable={true}
          className="mt-5"
          onClose={() => setErrorMessage(null)}
        />
      ) : null}
    </>
  );
};

export default LoginForm;

{
  /* {errorMsg ? (
          <Alert
            message={t(errorMsg)}
            variant="error"
            closeable={true}
            className="mt-5"
            onClose={() => setErrorMsg('')}
          />
        ) : null} */
}
