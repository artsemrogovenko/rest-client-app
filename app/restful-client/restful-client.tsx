import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Copy, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { HeaderLine } from '~/restful-client/types';
import {
  payloadTypes,
  queryMethods,
  languageCode,
} from '~/restful-client/constants';

export function RestfulClient() {
  const [headers, setHeaders] = useState<HeaderLine[]>([]);

  const addHeader = () => {
    setHeaders((prev) => [...prev, { name: '', value: '' }]);
  };

  const updateHeader = (
    index: number,
    field: keyof HeaderLine,
    value: string
  ) => {
    setHeaders((prev) =>
      prev.map((header, i) =>
        i === index ? { ...header, [field]: value } : header
      )
    );
  };

  const deleteHeader = (index: number) => {
    setHeaders([...headers].filter((line, pos) => pos !== index));
  };

  return (
    <section className="flex flex-col gap-2 rounded-lg border md:-mx-1 p-10">
      <h2>Restful Client</h2>
      <div className="flex gap-2 w-full">
        <div>
          <Label htmlFor={'method'}>Query method</Label>
          <Select name={'method'} defaultValue={queryMethods[0]}>
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
        </div>
        <div className="w-full">
          <Label htmlFor={'endpoint'}>Endpoint</Label>
          <Input name={'endpoint'} />
        </div>
      </div>
      <article className="flex flex-col gap-2 rounded-lg border md:-mx-1 p-5">
        <div className="flex items-center gap-2">
          <h4>Headers</h4>
          <Button onClick={addHeader}>Add Header</Button>
        </div>

        <div className="flex flex-col w-[320px] gap-2">
          {headers.map((header, index) => (
            <div className="flex gap-2" key={index}>
              <Input
                value={header.name}
                onChange={(e) => updateHeader(index, 'name', e.target.value)}
                placeholder="name"
              />
              <Input
                value={header.value}
                onChange={(e) => updateHeader(index, 'value', e.target.value)}
                placeholder="value"
              />
              <Button
                variant="secondary"
                size="icon"
                className="size-8"
                onClick={() => deleteHeader(index)}
              >
                <X color="red" />
              </Button>
            </div>
          ))}
        </div>
      </article>

      <article className="flex flex-col gap-2 rounded-lg border md:-mx-1 p-5">
        <div className="inline-flex items-end justify-between">
          <h3>Body</h3>
          <div>
            <Label htmlFor={'type'}>Type payload</Label>
            <Select name={'type'} defaultValue={payloadTypes[0]}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Payload" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={payloadTypes[0]}>TEXT</SelectItem>
                <SelectItem value={payloadTypes[1]}>JSON</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Textarea name="body" />
      </article>

      <article>
        <div className="flex items-end justify-between gap-y-2">
          <h3>Generated code</h3>
          <div>
            <Label htmlFor={'language'}>Select language</Label>
            <Select name={'language'} defaultValue={languageCode[0]}>
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
          </div>
        </div>

        <div className="flex flex-col w-full gap-2 rounded-lg border p-2">
          <span>Code</span>
          <Button>
            <Copy />
            Copy code
          </Button>
        </div>
      </article>
    </section>
  );
}
