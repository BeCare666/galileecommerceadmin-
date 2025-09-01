import Input from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import Description from '@/components/ui/description';
import Card from '@/components/common/card';
import { useUpdateUserMutation } from '@/data/user';
import TextArea from '@/components/ui/text-area';
import { useTranslation } from 'next-i18next';
import FileInput from '@/components/ui/file-input';
import pick from 'lodash/pick';
import SwitchInput from '@/components/ui/switch-input';
import Label from '@/components/ui/label';
import { adminOnly, getAuthCredentials, hasAccess } from '@/utils/auth-utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { profileValidationSchema } from './profile-validation-schema';
import PhoneNumberInput from '@/components/ui/phone-input';
import { uploadToS3 } from '@/utils/mockUpload';
import { uploadClient } from '@/data/client/upload';
import { Attachment } from '@/types';
type FormValues = {
  name: string;
  profile: {
    id: string;
    bio: string;
    contact: string;
    avatar: {
      thumbnail: string;
      original: string;
      id: string;
    };
    notifications: {
      email: string;
      enable: boolean;
    };
  };
};

export default function ProfileUpdate({ me }: any) {
  const { t } = useTranslation();
  const { mutate: updateUser, isLoading: loading } = useUpdateUserMutation();
  const { permissions } = getAuthCredentials();
  let permission = hasAccess(adminOnly, permissions);
  console.log('Permissions:', permissions);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    //@ts-ignore
    resolver: yupResolver(profileValidationSchema),
    defaultValues: {
      ...(me &&
        pick(me, [
          'name',
          'profile.bio',
          'profile.contact',
          'profile.avatar',
          'profile.notifications.email',
          'profile.notifications.enable',
        ])),
    },
  });

  // adapte le chemin selon ton projet

  async function onSubmit(values: FormValues) {
    const { name, profile } = values;
    let avatarData = profile.avatar;
    console.log('Avant upload:', avatarData);

    // Si un fichier est sélectionné
    if (avatarData && (avatarData as any).file) {
      // upload vers backend
      const uploadedFiles = await uploadClient.upload([(avatarData as any).file]) as Attachment[];
      console.log('Après upload:', uploadedFiles);
      // Si tout est OK, on prend le premier fichier uploadé
      if (uploadedFiles && uploadedFiles.length > 0) {
        const uploaded = uploadedFiles[0];
        const url = `http://localhost:5000/uploads/${uploaded.filename}`;

        avatarData = {
          thumbnail: url,
          original: url,
          id: '', // on laisse vide car le back ne renvoie pas d'id
        };
      }
    }

    console.log('Avatar final à envoyer:', avatarData);

    const input = {
      id: me?.id,
      input: {
        name,
        profile: {
          id: me?.profile?.id,
          bio: profile.bio,
          contact: profile.contact,
          avatar: avatarData,
          notifications: profile.notifications,
        },
      },
    };

    updateUser({ ...input });
  }





  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-wrap pb-8 my-5 border-b border-dashed border-border-base sm:my-8">
        <Description
          title={t('form:input-label-avatar')}
          details={t('form:avatar-help-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <FileInput name="profile.avatar" control={control} multiple={false} />
        </Card>
      </div>
      {permission ? (
        <div className="flex flex-wrap pb-8 my-5 border-b border-dashed border-border-base sm:my-8">
          <Description
            title={t('form:form-notification-title')}
            details={t('form:form-notification-description')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />

          <Card className="w-full mb-5 sm:w-8/12 md:w-2/3">
            <Input
              label={t('form:input-notification-email')}
              {...register('profile.notifications.email')}
              error={t(errors?.profile?.notifications?.email?.message!)}
              variant="outline"
              className="mb-5"
              type="email"
            />
            <div className="flex items-center gap-x-4">
              <SwitchInput
                name="profile.notifications.enable"
                control={control}
              />
              <Label className="!mb-0.5">
                {t('form:input-enable-notification')}
              </Label>
            </div>
          </Card>
        </div>
      ) : (
        ''
      )}
      <div className="flex flex-wrap pb-8 my-5 border-b border-dashed border-border-base sm:my-8">
        <Description
          title={t('form:form-title-information')}
          details={t('form:profile-info-help-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full mb-5 sm:w-8/12 md:w-2/3">
          <Input
            label={t('form:input-label-name')}
            {...register('name')}
            error={t(errors.name?.message!)}
            variant="outline"
            className="mb-5"
          />
          <TextArea
            label={t('form:input-label-bio')}
            {...register('profile.bio')}
            error={t(errors.profile?.bio?.message!)}
            variant="outline"
            className="mb-6"
          />
          <PhoneNumberInput
            label={t('form:input-label-contact')}
            {...register('profile.contact')}
            control={control}
            error={t(errors.profile?.contact?.message!)}
          />
        </Card>
        <div className="w-full text-end">
          <Button loading={loading} disabled={loading}>
            {t('form:button-label-save')}
          </Button>
        </div>
      </div>
    </form>
  );
}
