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
import { useState } from 'react';

export default function SignIn() {
  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(values: z.infer<typeof signInFormSchema>) {
    try {
      console.log(values)
      navigate('/dashboard');
    } catch (error) {
      setError('Failed to Sign In. Please try again');
      console.error('Sign In Error', error);
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
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="email" {...field} />
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Sign In
          </Button>
        </form>
      </Form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <div className="text-muted-foreground flex justify-center gap-1 text-sm">
        <p>Don&apos;t have an account?</p>
        <Link
          to="/register"
          className="text-primary font-medium hover:underline"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}
