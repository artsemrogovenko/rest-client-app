import { z } from 'zod';

export const listSchema = z.record(
  z.string().min(1),
  z.array(
    z.object({
      name: z.string().min(1),
      value: z.string().min(1),
    })
  )
);
export type TListSchema = z.infer<typeof listSchema>;

export const clientSchema = z
  .object({
    method: z.string().min(3),
    endpoint: z.string().min(1),
    header: z.array(listSchema),
    variable: z.array(listSchema),
    body: z.string().min(1),
  })
  .partial();

export const variablesSchema = clientSchema.pick({ variable: true });
export type TRestfulSchema = z.infer<typeof clientSchema>;
export type TVariablesSchema = z.infer<typeof variablesSchema>;
