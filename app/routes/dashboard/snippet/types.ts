import type { UseFormReturn } from 'react-hook-form';
import type { TRestfulSchema } from '~/routes/dashboard/restful-client/validate';
import type { LocalVariables } from '~/routes/dashboard/restful-client/types';

export type CodeSnippetProps = {
  form: UseFormReturn<TRestfulSchema>;
  variables: LocalVariables;
};
