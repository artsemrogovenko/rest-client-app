import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { Link, useNavigate } from 'react-router';
import { signInFormSchema } from './validationSchema';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '~/firebase/firebaseConfig';
import { useState } from 'react';
import { toast } from 'sonner';
import useLangNav from '~/hooks/langLink';
import { useTranslation } from 'react-i18next';
import useErrorMessage from '~/firebase/firebase-error-messages';

export default function SignIn() {
  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const { link } = useLangNav();
  const { t } = useTranslation();
  const getErrorMessage = useErrorMessage();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(values: z.infer<typeof signInFormSchema>) {
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      navigate(link(''));
    } catch {
      setError(getErrorMessage('auth/wrong-password-or-email'));
      toast.error(error);
    }
  }

  return (
    <div className="m-auto min-w-sm border-muted bg-background flex w-full max-w-sm flex-col items-center gap-y-4 rounded-md border px-6 py-8 shadow-md">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6 w-full"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('email')}</FormLabel>
                <FormControl>
                  <Input type="email" placeholder={t('email')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('password')}</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={t('password')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full cursor-pointer">
            {t('signIn')}
          </Button>
        </form>
      </Form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <div className="text-muted-foreground flex justify-center gap-1 text-sm">
        <p>{t('not-have-account')}</p>
        <Link
          to={link('auth/register')}
          className="text-primary font-medium hover:underline"
        >
          {t('signUp')}
        </Link>
      </div>
    </div>
  );
}
