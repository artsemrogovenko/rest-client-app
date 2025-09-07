'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  languageCode,
  payloadTypes,
  queryMethods,
} from '~/restful-client/constants';
import DynamicList from '~/restful-client/DynamicList';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { clientSchema, type TRestfulSchema } from '~/restful-client/validate';
import { zodResolver } from '@hookform/resolvers/zod';

export function RestfulClient() {
  const form = useForm<TRestfulSchema>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      endpoint: '',
      method: queryMethods[0],
    },
  });
  const submitForm = (e: TRestfulSchema) => {
    console.log(e);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitForm)}>
        <section className="flex flex-col gap-2 rounded-lg border md:-mx-1 p-10">
          <h2>Restful Client</h2>
          <div className="flex gap-2 w-full items-end">
            <div>
              <FormField
                control={form.control}
                name="method"
                defaultValue={queryMethods[0]}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name}>Query method</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger id={field.name} className="w-[100px]">
                          <SelectValue placeholder="Method" />
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
            </div>
            <div className="w-full">
              <FormField
                control={form.control}
                name="endpoint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name}>Endpoint</FormLabel>
                    <FormControl>
                      <Input id={field.name} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="uppercase">
              send
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
          <article className="flex flex-col gap-2 rounded-lg border md:-mx-1 p-5">
            <div className="inline-flex items-end justify-between">
              <h3>Body</h3>
              <div>
                <FormField
                  control={form.control}
                  name="type"
                  defaultValue={payloadTypes[0]}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor={field.name}>Type payload</FormLabel>
                      <FormControl>
                        <Select value={field.value}>
                          <SelectTrigger id={field.name} className="w-[100px]">
                            <SelectValue placeholder="Payload" />
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
                  <FormControl>
                    <Textarea id={field.name} {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </article>

          <article>
            <div className="flex items-end justify-between gap-y-2">
              <h3>Generated code</h3>
              <div>
                <FormField
                  control={form.control}
                  name="language"
                  defaultValue={languageCode[0]}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor={field.name}>
                        Select language
                      </FormLabel>
                      <FormControl>
                        <Select
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger id={field.name} className="w-[120px]">
                            <SelectValue placeholder="Language" />
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
              <span className="break-all">Code</span>
              <Button>
                <Copy />
                Copy code
              </Button>
            </div>
          </article>
        </section>
      </form>
    </Form>
  );
}
