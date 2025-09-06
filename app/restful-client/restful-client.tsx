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
import { Label } from '@/components/ui/label';
import {
  languageCode,
  payloadTypes,
  queryMethods,
} from '~/restful-client/constants';
import DynamicList from '~/restful-client/DynamicList';
import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

export function RestfulClient() {
  const form = useForm();

  return (
    <Form {...form}>
      <form>
        <section className="flex flex-col gap-2 rounded-lg border md:-mx-1 p-10">
          <h2>Restful Client</h2>
          <div className="flex gap-2 w-full items-end">
            <div>
              <FormField
                name="method"
                render={() => (
                  <FormItem>
                    <FormLabel>Query method</FormLabel>
                    <Select defaultValue={queryMethods[0]}>
                      <SelectTrigger className="w-[100px]">
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
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full">
              <Label htmlFor={'endpoint'}>Endpoint</Label>
              <Input id={'endpoint'} />
            </div>
            <Button type="submit" className="uppercase">
              send
            </Button>
          </div>
          <DynamicList title="header" />

          <article className="flex flex-col gap-2 rounded-lg border md:-mx-1 p-5">
            <div className="inline-flex items-end justify-between">
              <h3>Body</h3>
              <div>
                <FormField
                  name="type"
                  render={() => (
                    <FormItem>
                      <FormLabel>Type payload</FormLabel>
                      <Select defaultValue={payloadTypes[0]}>
                        <SelectTrigger className="w-[100px]">
                          <SelectValue placeholder="Payload" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={payloadTypes[0]}>TEXT</SelectItem>
                          <SelectItem value={payloadTypes[1]}>JSON</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Textarea name="body" />
          </article>

          <article>
            <div className="flex items-end justify-between gap-y-2">
              <h3>Generated code</h3>
              <div>
                <FormField
                  name="language"
                  render={() => (
                    <FormItem>
                      <FormLabel>Select language</FormLabel>
                      <Select defaultValue={languageCode[0]}>
                        <SelectTrigger className="w-[120px]">
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
