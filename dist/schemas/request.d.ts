import { z } from "zod";
export declare const Region: z.ZodEffects<z.ZodEffects<z.ZodObject<{
    full: z.ZodDefault<z.ZodBoolean>;
    square: z.ZodDefault<z.ZodBoolean>;
    pct: z.ZodDefault<z.ZodBoolean>;
    x: z.ZodDefault<z.ZodNullable<z.ZodNumber>>;
    y: z.ZodDefault<z.ZodNullable<z.ZodNumber>>;
    w: z.ZodDefault<z.ZodNullable<z.ZodNumber>>;
    h: z.ZodDefault<z.ZodNullable<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    x?: number;
    y?: number;
    w?: number;
    h?: number;
    full?: boolean;
    square?: boolean;
    pct?: boolean;
}, {
    x?: number;
    y?: number;
    w?: number;
    h?: number;
    full?: boolean;
    square?: boolean;
    pct?: boolean;
}>, {
    x?: number;
    y?: number;
    w?: number;
    h?: number;
    full?: boolean;
    square?: boolean;
    pct?: boolean;
}, {
    x?: number;
    y?: number;
    w?: number;
    h?: number;
    full?: boolean;
    square?: boolean;
    pct?: boolean;
}>, {
    x?: number;
    y?: number;
    w?: number;
    h?: number;
    full?: boolean;
    square?: boolean;
    pct?: boolean;
}, unknown>;
export declare const Size: z.ZodEffects<z.ZodEffects<z.ZodObject<{
    max: z.ZodDefault<z.ZodBoolean>;
    upscale: z.ZodDefault<z.ZodBoolean>;
    maintainAspectRatio: z.ZodDefault<z.ZodBoolean>;
    pct: z.ZodDefault<z.ZodBoolean>;
    n: z.ZodDefault<z.ZodNullable<z.ZodNumber>>;
    w: z.ZodDefault<z.ZodNullable<z.ZodNumber>>;
    h: z.ZodDefault<z.ZodNullable<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    n?: number;
    w?: number;
    h?: number;
    max?: boolean;
    pct?: boolean;
    upscale?: boolean;
    maintainAspectRatio?: boolean;
}, {
    n?: number;
    w?: number;
    h?: number;
    max?: boolean;
    pct?: boolean;
    upscale?: boolean;
    maintainAspectRatio?: boolean;
}>, {
    n?: number;
    w?: number;
    h?: number;
    max?: boolean;
    pct?: boolean;
    upscale?: boolean;
    maintainAspectRatio?: boolean;
}, {
    n?: number;
    w?: number;
    h?: number;
    max?: boolean;
    pct?: boolean;
    upscale?: boolean;
    maintainAspectRatio?: boolean;
}>, {
    n?: number;
    w?: number;
    h?: number;
    max?: boolean;
    pct?: boolean;
    upscale?: boolean;
    maintainAspectRatio?: boolean;
}, unknown>;
export declare const Rotation: z.ZodEffects<z.ZodObject<{
    n: z.ZodDefault<z.ZodNumber>;
    mirror: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    n?: number;
    mirror?: boolean;
}, {
    n?: number;
    mirror?: boolean;
}>, {
    n?: number;
    mirror?: boolean;
}, unknown>;
export declare const Quality: z.ZodEnum<["color", "gray", "bitonal", "default"]>;
export declare const Format: z.ZodEnum<["jpg", "tif", "png", "gif", "jp2", "pdf", "webp"]>;
export declare const Identifier: z.ZodString;
