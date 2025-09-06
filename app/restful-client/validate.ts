import { z } from 'zod';
import {
  languageCode,
  payloadTypes,
  queryMethods,
} from '~/restful-client/constants';

export const listSchema = z
  .object({
    name: z.string().min(1),
    value: z.string().min(1),
  })
  .required();
export type TListSchema = z.infer<typeof listSchema>;

export const clientSchema = z
  .object({
    method: z.enum(queryMethods),
    endpoint: z
      .string()
      .min(1, 'Endpoint is required')
      .refine((value) => value.includes(':'), {
        message: "Must include ':'",
      }),
    header: z.array(listSchema),
    variable: z.array(listSchema),
    type: z.enum(payloadTypes),
    language: z.enum(languageCode),
    body: z.string().min(1),
  })
  .partial();

export const variablesSchema = clientSchema.pick({ variable: true });
export type TRestfulSchema = z.infer<typeof clientSchema>;
export type TVariablesSchema = z.infer<typeof variablesSchema>;
