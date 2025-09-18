import { useVariablesValidator } from '~/routes/dashboard/restful-client/hooks';
import { useForm } from 'react-hook-form';
import {
  clientSchema,
  type TRestfulSchema,
} from '~/routes/dashboard/restful-client/validate';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  languageCode,
  payloadTypes,
  queryMethods,
} from '~/routes/dashboard/restful-client/constants';
import { convertValues } from '~/routes/dashboard/restful-client/utils';
import type { LocalVariables } from '~/routes/dashboard/restful-client/types';
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
import { Copy } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ClientForm() {
  const { validateFormWithVariables, variables } = useVariablesValidator();
  const { t } = useTranslation();
  const form = useForm<TRestfulSchema>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      endpoint: '',
      method: queryMethods[0],
      header: [],
    },
  });
  const submitForm = (data: TRestfulSchema) => {
    const variablesValidation = validateFormWithVariables(data);

    if (!variablesValidation.isValid) {
      Object.entries(variablesValidation.errors).forEach(([path, message]) => {
        form.setError(path as keyof TRestfulSchema, { message });
      });
      return;
    }

    const newValues = convertValues(data, variables as LocalVariables);
    const updatedHeaders = newValues.header?.map((item) => ({ ...item })) || [];
    form.reset({ ...newValues, header: updatedHeaders });
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
                  <FormLabel htmlFor={field.name}>{t('rest-client-p.query-method')}</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger id={field.name} className="w-[100px]">
                        <SelectValue placeholder={t('rest-client-p.query-method')} />
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
                    <FormLabel htmlFor={field.name}>{t('rest-client-p.endpoint')}</FormLabel>
                    <FormMessage />
                    <FormControl>
                      <Input id={field.name} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="uppercase">
              {t('rest-client-p.send')}
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
              <h3>{t("rest-client-p.body")}</h3>
              <div>
                <FormField
                  control={form.control}
                  name="type"
                  defaultValue={payloadTypes[0]}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor={field.name}>{t("rest-client-p.type-payload")}</FormLabel>
                      <FormControl>
                        <Select value={field.value}>
                          <SelectTrigger id={field.name} className="w-[100px]">
                            <SelectValue placeholder={t("rest-client-p.type-payload")} />
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

          <article className="flex flex-col gap-2 rounded-lg border p-5">
            <div className="flex items-end justify-between gap-y-2">
              <h3>{("rest-client-p.generated-code")}</h3>
              <div>
                <FormField
                  control={form.control}
                  name="language"
                  defaultValue={languageCode[0]}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor={field.name}>
                        {t("rest-client-p.select-language")}
                      </FormLabel>
                      <FormControl>
                        <Select
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger id={field.name} className="w-[120px]">
                            <SelectValue placeholder={t("rest-client-p.select-language")} />
                          </SelectTrigger>
                          <SelectContent>
                            {languageCode.map((method) => (
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
              </div>
            </div>

            <div className="flex flex-col w-full gap-2 rounded-lg border p-2">
              <span className="break-all">{t('rest-client-p.code')}</span>
              <Button>
                <Copy />
                {t('rest-client-p.copy-code')}
              </Button>
            </div>
          </article>
        </section>
      </form>
    </Form>
  );
}
