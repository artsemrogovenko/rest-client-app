import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '~/components/ui/form';
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { Button } from '~/components/ui/button';
import { Copy } from 'lucide-react';
import LanguagesList from '~/routes/dashboard/snippet/LanguagesList';
import { convertValues } from '~/routes/dashboard/restful-client/utils';
import type { CodeSnippetProps } from '~/routes/dashboard/snippet/types';
import { toast } from 'sonner';
import { defaultLanguage } from '~/server/constants';
import { useEffect } from 'react';

export default function CodeSnippet({ form, variables }: CodeSnippetProps) {
  const { snippet } = form.getValues();
  const {
    formState: { isSubmitting },
  } = form;

  useEffect(() => {
    if (isSubmitting) {
      generateSnippet();
    }
  }, [isSubmitting]);

  const generateSnippet = async () => {
    form.clearErrors();
    await form.trigger(['language', 'endpoint']);
    if (form.formState.isValid) {
      const unpackedVariables = convertValues(form.getValues(), variables);
      const formData = new FormData();
      formData.append('data', JSON.stringify(unpackedVariables));
      const response = await fetch('/api/code', {
        method: 'POST',
        body: formData,
      });
      const result = await response.text();

      form.setValue('snippet', result);
    }
  };

  async function copyToClipboard() {
    await navigator.clipboard.writeText(String(form.getValues('snippet')));
    toast.message('Snippet copied to clipboard');
  }

  return (
    <article className="flex flex-col gap-2 rounded-lg border p-5">
      <div className="flex items-end justify-between gap-y-2">
        <Button onClick={generateSnippet} type="button">
          Generate snippet
        </Button>
        <FormField
          control={form.control}
          defaultValue={defaultLanguage}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>Select language</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id={field.name} className="w-[240px]">
                    <SelectValue
                      placeholder={String(field.value).replace('&', ' ')}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <LanguagesList />
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      {snippet && (
        <div className="flex flex-col w-full gap-2 rounded-lg border p-2">
          <pre className="text-sm font-mono  ">
            <code style={{ whiteSpace: 'pre-wrap' }}>{snippet}</code>
          </pre>
          <Button type={'button'} onClick={copyToClipboard}>
            <Copy />
            Copy code
          </Button>
        </div>
      )}
    </article>
  );
}
