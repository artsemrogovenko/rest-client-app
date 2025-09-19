import type { UseFormReturn } from 'react-hook-form';
import type { TRestfulSchema } from '~/routes/dashboard/restful-client/validate';

export type CodeSnippetProps = {
  form: UseFormReturn<TRestfulSchema>;
};
