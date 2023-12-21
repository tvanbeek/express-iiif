"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
var zod_1 = require("zod");
exports.Config = zod_1.z.object({
    baseUrl: zod_1.z.string().optional(),
    imageDir: zod_1.z.string(),
    maxWidth: zod_1.z.number().optional(),
    maxHeight: zod_1.z.number().optional(),
    maxArea: zod_1.z.number().optional(),
    quality: zod_1.z.enum(["bitonal", "color", "gray"]).optional(),
    rights: zod_1.z.string().optional(),
});
