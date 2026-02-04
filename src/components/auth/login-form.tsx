import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import PasswordInput from '@/components/ui/password-input';
import Checkbox from '@/components/ui/checkbox/checkbox';
import { useTranslation } from 'next-i18next';
import * as yup from 'yup';
import Form from '@/components/ui/forms/form';
import { useLogin } from '@/data/user';
import type { LoginInput } from '@/types';
import { useState } from 'react';
import Alert from '@/components/ui/alert';
import { toast } from 'react-toastify';
import {
  allowedRoles,
  hasAccess,
  setAuthCredentials,
} from '@/utils/auth-utils';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
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
      {errorMessage ? (
        <Alert
          message={t(errorMessage)}
          variant="error"
          closeable={true}
          className="mb-5"
          onClose={() => setErrorMessage(null)}
        />
      ) : null}
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
              autoComplete="email"
              variant="outline"
              className="mb-5 border-gray-200 transition-shadow focus:ring-2 focus:ring-accent/25 focus:border-accent"
              error={t(errors?.email?.message!)}
            />
            <PasswordInput
              label={t('form:input-label-password')}
              forgotPassHelpText=""
              forgotPageLink=""
              {...register('password')}
              autoComplete="current-password"
              error={t(errors?.password?.message!)}
              variant="outline"
              className="mb-5 border-gray-200"
            />
            <div className="mb-6 flex items-center">
              <Checkbox
                id="remember"
                name="remember"
                label={t('form:input-label-remember-me')}
                className="text-sm text-body"
              />
            </div>
            <Button
              type="submit"
              className="h-12 w-full font-medium shadow-sm transition-all hover:shadow focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
              loading={isLoading}
              disabled={isLoading}
            >
              {t('form:button-label-login')}
            </Button>
          </>
        )}
      </Form>
    </>
  );
};

export default LoginForm;
