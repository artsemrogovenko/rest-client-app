import type { Control } from 'react-hook-form';
import type { TRestfulSchema, TVariablesSchema } from './validate';

export type PairFields = {
  name: string;
  value: string;
};
export type DynamicListProps = {
  role: 'header' | 'variable';
  values: PairFields[];
  control: Control<TRestfulSchema | TVariablesSchema>;
};

export type LocalVariables = Record<string, string>;

export type ClientFormProps = {
  initialData: TRestfulSchema;
  onSubmit: (data: TRestfulSchema) => void;
  isLoading: boolean;
  error: string | null;
  isSubmiting?: boolean;
};

export type ResponseComponentProps = ReturnResponse & {
  isLoading: boolean;
};

export type ReturnResponse = {
  response: ResponseResult | null;
  error: string | null;
};

export type ResponseResult = {
  status: number;
  statusText: string;
  body: string | object;
};

export type RequestType = {
  params: {
    method: string;
    encodedUrl: string;
    encodedData: string | undefined;
  };
  headers: Record<string, string> | undefined;
  code: string;
  uuid: string;
};
