'use client';

import { useForm } from 'react-hook-form';
import { Form, FormField, FormItem } from '~/components/ui/form';
import DynamicList from '~/restful-client/DynamicList';
import { Button } from '~/components/ui/button';
import {
  type TRestfulSchema,
  type TVariablesSchema,
  variablesSchema,
} from '~/restful-client/validate';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalStorage } from '~/restful-client/hooks';

export default function Variables() {
  const { setStorageValue, getStorageValue } = useLocalStorage();
  const localVariables = JSON.parse(
    getStorageValue('variables') || '{}'
  ) as Record<string, string>;
  const initValues = Array.from(
    Object.entries(localVariables).map(([k, v]) => {
      return { name: k, value: v.replace(/[{}]/g, '') };
    })
  );

  const form = useForm<TVariablesSchema>({
    defaultValues: { variable: initValues },
    mode: 'onSubmit',
    resolver: zodResolver(variablesSchema),
  });

  const submitForm = (e: TRestfulSchema) => {
    const variables = e.variable?.reduce(
      (acc, line) => {
        acc[line.name] = `{{${line.value}}}`;
        return acc;
      },
      {} as Record<string, string>
    );
    setStorageValue('variables', JSON.stringify(variables));
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submitForm)}
        className="flex flex-col gap-2 "
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

        <Button
          type="submit"
          className="uppercase"
          disabled={!form.formState.isValid}
        >
          save
        </Button>
      </form>
    </Form>
  );
}
