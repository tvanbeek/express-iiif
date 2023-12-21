import { z } from "zod";

export const Config = z.object({
  baseUrl: z.string().optional(),
  imageDir: z.string(),
  maxWidth: z.number().optional(),
  maxHeight: z.number().optional(),
  maxArea: z.number().optional(),
  quality: z.enum(["bitonal", "color", "gray"]).optional(),
  rights: z.string().optional(),
});

export type Config = z.infer<typeof Config>;
