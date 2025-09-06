import type { Control } from 'react-hook-form';
import type {
  TRestfulSchema,
  TVariablesSchema,
} from '~/restful-client/validate';

export type PairFields = {
  name: string;
  value: string;
};
export type DynamicListProps = {
  role: 'header' | 'variable';
  values: PairFields[];
  control: Control<TRestfulSchema | TVariablesSchema>;
};
