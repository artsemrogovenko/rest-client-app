import { useVariablesValidator } from '~/routes/dashboard/restful-client/hooks';
import { useForm } from 'react-hook-form';
import {
  clientSchema,
  type TRestfulSchema,
} from '~/routes/dashboard/restful-client/validate';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  payloadTypes,
  queryMethods,
} from '~/routes/dashboard/restful-client/constants';
import { defaultLanguage } from '../restful-client/constants';

import type { ClientFormProps } from '~/routes/dashboard/restful-client/types';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import DynamicList from '~/routes/dashboard/restful-client/DynamicList';
import { Textarea } from '~/components/ui/textarea';
import { useTranslation } from 'react-i18next';
import CodeSnippet from '../snippet/CodeSnippet';
import { useEffect } from 'react';

export default function ClientForm(props: ClientFormProps) {
  const { t } = useTranslation();
  const { validateValues } = useVariablesValidator();
  const form = useForm<TRestfulSchema>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      endpoint: '',
      method: queryMethods[0],
      header: [],
      language: defaultLanguage,
    },
  });
  useEffect(() => {
    form.clearErrors();
    form.reset({ ...props.newData, language: form.getValues('language') });
  }, [props.newData]);

  const submitForm = () => {
    const newValues = validateValues(form);
    if (!newValues) return;
    const updatedHeaders = newValues.header?.map((item) => ({ ...item })) || [];
    props.onSubmit({ ...newValues, header: updatedHeaders });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submitForm)}
        className="min-w-[450px] w-1/2 flex-1 h-full"
      >
        <section className="flex flex-col gap-2 rounded-lg border p-5">
          <div className="flex gap-2 w-full items-end">
            <FormField
              control={form.control}
              name="method"
              defaultValue={queryMethods[0]}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>
                    {t('query-method')}
                  </FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id={field.name} className="w-[100px]">
                        <SelectValue placeholder={t('query-method')} />
                      </SelectTrigger>
                      <SelectContent>
                        {queryMethods.map((method) => (
                          <SelectItem value={method} key={method}>
                            {method}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="w-full">
              <FormField
                control={form.control}
                name="endpoint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name}>{t('endpoint')}</FormLabel>
                    <FormMessage />
                    <FormControl>
                      <Input id={field.name} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="submit"
              className={`${props.isSubmitting && 'opacity-20 '}`}
              disabled={props.isLoading}
            >
              {t('send')}
            </Button>
          </div>
          <FormField
            control={form.control}
            name="header"
            render={() => (
              <FormItem>
                <DynamicList role="header" values={[]} control={form.control} />
              </FormItem>
            )}
          />
          <article className="flex flex-col gap-2 rounded-lg border p-5">
            <div className="inline-flex items-end justify-between">
              <h3>{t('body')}</h3>
              <div>
                <FormField
                  control={form.control}
                  name="type"
                  defaultValue={payloadTypes[0]}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor={field.name}>
                        {t('type-payload')}
                      </FormLabel>
                      <FormControl>
                        <Select value={field.value}>
                          <SelectTrigger id={field.name} className="w-[100px]">
                            <SelectValue placeholder={t('type-payload')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={payloadTypes[0]}>
                              TEXT
                            </SelectItem>
                            <SelectItem value={payloadTypes[1]}>
                              JSON
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormMessage />
                  <FormControl>
                    <Textarea id={field.name} {...field} value={field.value} />
                  </FormControl>
                </FormItem>
              )}
            />
          </article>

          <CodeSnippet form={form} />
        </section>
      </form>
    </Form>
  );
}
