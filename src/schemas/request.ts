import { z } from "zod";

// Region: full | square | pct:x,y,w,h | x,y,w,h,
export const Region = z.preprocess(
  (region: string) => {
    const [x, y, w, h] = region
      .replace("square", "")
      .replace("full", "")
      .replace("pct:", "")
      .split(",")
      .filter(Boolean)
      .map(Number);

    return {
      full: region === "full",
      square: region === "square",
      pct: region.includes("pct"),
      x: typeof x === "number" ? x : null,
      y: typeof y === "number" ? y : null,
      w: typeof w === "number" ? w : null,
      h: typeof h === "number" ? h : null,
    };
  },
  z
    .object({
      full: z.boolean().default(false),
      square: z.boolean().default(false),
      pct: z.boolean().default(false),
      x: z.number().min(0).nullable().default(null),
      y: z.number().min(0).nullable().default(null),
      w: z.number().min(0).nullable().default(null),
      h: z.number().min(0).nullable().default(null),
    })
    .refine((region) => {
      if (region.full) return true;
      if (region.square) return true;
      if (
        region.x !== null &&
        region.y !== null &&
        region.w !== null &&
        region.h !== null
      ) {
        return true;
      }
      if (
        region.pct === true &&
        region.x !== null &&
        region.y !== null &&
        region.w !== null &&
        region.h !== null
      ) {
        return true;
      }

      return false;
    })
);

// Size: max | ^max | w, | ^w, | ,h | ^,h | pct:n | ^pct:n | w,h | ^w,h | !w,h | ^!w,h
export const Size = z.preprocess(
  (size: string) => {
    const [n] = size.includes("pct")
      ? [size.replace("^", "").replace("pct:", "")].filter(Boolean).map(Number)
      : [null];

    const [w, h] = size.includes(",")
      ? size
          .replace("^", "")
          .replace("!", "")
          .split(",")
          .map((val) => (val ? Number(val) : null))
      : [null, null];

    return {
      max: size.includes("max"),
      upscale: size.includes("^"),
      maintainAspectRatio: size.includes("!"),
      pct: size.includes("pct"),
      w,
      h,
      n,
    };
  },
  z
    .object({
      max: z.boolean().default(false),
      upscale: z.boolean().default(false),
      maintainAspectRatio: z.boolean().default(false),
      pct: z.boolean().default(false),
      n: z.number().min(0).max(100).nullable().default(null),
      w: z.number().min(0).nullable().default(null),
      h: z.number().min(0).nullable().default(null),
    })
    .refine((size) => {
      if (size.max) return true;
      if (size.upscale && size.max) return true;
      if (size.w !== null) return true;
      if (size.upscale && size.w !== null) return true;
      if (size.h !== null) return true;
      if (size.upscale && size.h !== null) return true;
      if (size.pct && size.n !== null) return true;
      if (size.upscale && size.pct && size.n !== null) return true;
      if (size.w !== null && size.h !== null) return true;
      if (size.upscale && size.w !== null && size.h !== null) return true;
      if (size.maintainAspectRatio && size.w !== null && size.h !== null) {
        return true;
      }
      if (size.upscale && size.maintainAspectRatio && size.w && size.h) {
        return true;
      }
      return false;
    })
);

// n | !n
export const Rotation = z.preprocess(
  (rotation: string) => ({
    n: Number(rotation.replace("!", "")),
    mirror: rotation.includes("!"),
  }),
  z.object({
    n: z.number().min(0).max(360).default(0),
    mirror: z.boolean().default(false),
  })
);

// Quality: color | gray | bitonal | default
export const Quality = z.enum(["color", "gray", "bitonal", "default"]);

// Format: jpg | tif | png | gif | jp2 | pdf | webp
export const Format = z.enum([
  "jpg",
  "tif",
  "png",
  "gif",
  "jp2",
  "pdf",
  "webp",
]);

export const Identifier = z.string();
