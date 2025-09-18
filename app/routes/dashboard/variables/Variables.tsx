'use client';

import { useForm } from 'react-hook-form';
import { Form, FormField, FormItem } from '~/components/ui/form';
import DynamicList from '~/routes/dashboard/restful-client/DynamicList';
import { Button } from '~/components/ui/button';
import {
  type TVariablesSchema,
  variablesSchema,
} from '~/routes/dashboard/restful-client/validate';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalStorage } from '~/routes/dashboard/restful-client/hooks';
import { useContext, useEffect, useState } from 'react';
import { Skeleton } from '~/components/ui/skeleton';
import type {
  LocalVariables,
  PairFields,
} from '~/routes/dashboard/restful-client/types';
import { LOCAL_STORAGE_KEY } from '~/routes/dashboard/restful-client/constants';
import { deleteBrackets } from '~/routes/dashboard/restful-client/utils';
import AuthContext from '~/contexts/auth/AuthContext';

export default function Variables() {
  const { setStorageValue, getStorageValue } = useLocalStorage();
  const [isClient, setIsClient] = useState(false);
  const [initValues, setInitValues] = useState<PairFields[]>([]);
  const userId = useContext(AuthContext)?.user?.uid || '';

  const form = useForm<TVariablesSchema>({
    defaultValues: { variable: initValues },
    mode: 'onChange',
    resolver: zodResolver(variablesSchema),
  });
  const {
    formState: { isDirty },
  } = form;

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const localVariables = JSON.parse(
        getStorageValue(LOCAL_STORAGE_KEY + userId) || '{}'
      ) as Record<string, string>;
      const values = Array.from(
        Object.entries(localVariables).map(([k, v]) => {
          return { name: deleteBrackets(k), value: v };
        })
      );
      setInitValues(values);
    }
  }, [getStorageValue, userId]);

  useEffect(() => {
    if (initValues.length > 0) {
      form.reset({ variable: initValues });
    }
  }, [initValues, form]);

  const submitForm = (e: TVariablesSchema) => {
    const variables = e.variable?.reduce((acc, line) => {
      acc[`{{${line.name}}}`] = line.value;
      return acc;
    }, {} as LocalVariables);
    setStorageValue(LOCAL_STORAGE_KEY + userId, JSON.stringify(variables));
    form.reset({}, { keepValues: true });
  };

  if (!isClient) return <Skeleton className="h-[86px] w-[354px]" />;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submitForm)}
        className="flex flex-col h-full w-1/2 gap-3 rounded-lg border p-5"
      >
        <FormField
          control={form.control}
          name="variable"
          render={() => (
            <FormItem>
              <DynamicList role="variable" values={[]} control={form.control} />
            </FormItem>
          )}
        />

        {isDirty && (
          <Button
            type="submit"
            className="uppercase"
            disabled={!form.formState.isValid}
          >
            save
          </Button>
        )}
      </form>
    </Form>
  );
}
