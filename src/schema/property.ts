import { z } from "zod";

export const PropertySchema = z.object({
  contractName: z.string(),
  address: z.string(),
  zipcode: z.number(),
  thumbnail: z.string().url().optional(),
  sharePrice: z.number(),
  shareCount: z.number().min(1),
  symbol: z.string().length(3),
  description: z.string(),
});

export type TProperty = z.infer<typeof PropertySchema>;
