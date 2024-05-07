import { z } from "zod";
export declare const Config: z.ZodObject<{
    baseUrl: z.ZodOptional<z.ZodString>;
    imageDir: z.ZodString;
    maxWidth: z.ZodOptional<z.ZodNumber>;
    maxHeight: z.ZodOptional<z.ZodNumber>;
    maxArea: z.ZodOptional<z.ZodNumber>;
    quality: z.ZodOptional<z.ZodEnum<["bitonal", "color", "gray"]>>;
    rights: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    quality?: "bitonal" | "color" | "gray";
    baseUrl?: string;
    imageDir?: string;
    maxWidth?: number;
    maxHeight?: number;
    maxArea?: number;
    rights?: string;
}, {
    quality?: "bitonal" | "color" | "gray";
    baseUrl?: string;
    imageDir?: string;
    maxWidth?: number;
    maxHeight?: number;
    maxArea?: number;
    rights?: string;
}>;
export type Config = z.infer<typeof Config>;
