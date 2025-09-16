import { z } from 'zod';
import { payloadTypes, queryMethods } from './constants';

export const listSchema = z
  .object({
    name: z.string().min(1, 'Fill it'),
    value: z.string().min(1, 'Fill it'),
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
    language: z.string().refine((arg) => typeof arg !== 'undefined'),
    body: z.string(),
    snippet: z.string().optional(),
  })
  .partial();

export const variablesSchema = clientSchema
  .pick({ variable: true })
  .superRefine((variables, ctx) => {
    const names = new Set<string>();

    variables.variable?.forEach((value, index) => {
      if (names.has(value.name)) {
        ctx.addIssue({
          code: 'custom',
          message: 'Name already exists',
          path: [`variable`, index, 'name'],
        });
      } else {
        names.add(value.name);
      }
    });
  });
export type TRestfulSchema = z.infer<typeof clientSchema>;
export type TVariablesSchema = z.infer<typeof variablesSchema>;

export const storageVariablesSchema = z.record(z.string(), z.string());
