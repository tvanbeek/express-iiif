"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Identifier = exports.Format = exports.Quality = exports.Rotation = exports.Size = exports.Region = void 0;
var zod_1 = require("zod");
// Region: full | square | pct:x,y,w,h | x,y,w,h,
exports.Region = zod_1.z.preprocess(function (region) {
    var _a = region
        .replace("square", "")
        .replace("full", "")
        .replace("pct:", "")
        .split(",")
        .filter(Boolean)
        .map(Number), x = _a[0], y = _a[1], w = _a[2], h = _a[3];
    return {
        full: region === "full",
        square: region === "square",
        pct: region.includes("pct"),
        x: typeof x === "number" ? x : null,
        y: typeof y === "number" ? y : null,
        w: typeof w === "number" ? w : null,
        h: typeof h === "number" ? h : null,
    };
}, zod_1.z
    .object({
    full: zod_1.z.boolean().default(false),
    square: zod_1.z.boolean().default(false),
    pct: zod_1.z.boolean().default(false),
    x: zod_1.z.number().min(0).nullable().default(null),
    y: zod_1.z.number().min(0).nullable().default(null),
    w: zod_1.z.number().min(0).nullable().default(null),
    h: zod_1.z.number().min(0).nullable().default(null),
})
    .refine(function (region) {
    if (region.full)
        return true;
    if (region.square)
        return true;
    if (region.x !== null &&
        region.y !== null &&
        region.w !== null &&
        region.h !== null) {
        return true;
    }
    if (region.pct === true &&
        region.x !== null &&
        region.y !== null &&
        region.w !== null &&
        region.h !== null) {
        return true;
    }
    return false;
}));
// Size: max | ^max | w, | ^w, | ,h | ^,h | pct:n | ^pct:n | w,h | ^w,h | !w,h | ^!w,h
exports.Size = zod_1.z.preprocess(function (size) {
    var n = (size.includes("pct")
        ? [size.replace("^", "").replace("pct:", "")].filter(Boolean).map(Number)
        : [null])[0];
    var _a = size.includes(",")
        ? size
            .replace("^", "")
            .replace("!", "")
            .split(",")
            .map(function (val) { return (val ? Number(val) : null); })
        : [null, null], w = _a[0], h = _a[1];
    return {
        max: size.includes("max"),
        upscale: size.includes("^"),
        maintainAspectRatio: size.includes("!"),
        pct: size.includes("pct"),
        w: w,
        h: h,
        n: n,
    };
}, zod_1.z
    .object({
    max: zod_1.z.boolean().default(false),
    upscale: zod_1.z.boolean().default(false),
    maintainAspectRatio: zod_1.z.boolean().default(false),
    pct: zod_1.z.boolean().default(false),
    n: zod_1.z.number().min(0).nullable().default(null),
    w: zod_1.z.number().min(0).nullable().default(null),
    h: zod_1.z.number().min(0).nullable().default(null),
})
    .refine(function (size) {
    if (size.max)
        return true;
    if (size.upscale && size.max)
        return true;
    if (size.w !== null)
        return true;
    if (size.upscale && size.w !== null)
        return true;
    if (size.h !== null)
        return true;
    if (size.upscale && size.h !== null)
        return true;
    if (!size.upscale && size.pct && size.n <= 100 && size.n >= 0)
        return true;
    if (size.upscale && size.pct && size.n !== null)
        return true;
    if (size.w !== null && size.h !== null)
        return true;
    if (size.upscale && size.w !== null && size.h !== null)
        return true;
    if (size.maintainAspectRatio && size.w !== null && size.h !== null) {
        return true;
    }
    if (size.upscale && size.maintainAspectRatio && size.w && size.h) {
        return true;
    }
    return false;
}));
// n | !n
exports.Rotation = zod_1.z.preprocess(function (rotation) { return ({
    n: Number(rotation.replace("!", "")),
    mirror: rotation.includes("!"),
}); }, zod_1.z.object({
    n: zod_1.z.number().min(0).max(360).default(0),
    mirror: zod_1.z.boolean().default(false),
}));
// Quality: color | gray | bitonal | default
exports.Quality = zod_1.z.enum(["color", "gray", "bitonal", "default"]);
// Format: jpg | tif | png | gif | jp2 | pdf | webp
exports.Format = zod_1.z.enum([
    "jpg",
    "tif",
    "png",
    "gif",
    "jp2",
    "pdf",
    "webp",
]);
exports.Identifier = zod_1.z.string();
