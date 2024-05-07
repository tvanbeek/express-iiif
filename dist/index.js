"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const max_1 = __importDefault(require("lodash/max"));
const min_1 = __importDefault(require("lodash/min"));
const path_1 = __importDefault(require("path"));
const pdf_lib_1 = require("pdf-lib");
const sharp_1 = __importDefault(require("sharp"));
const config_1 = require("./schemas/config");
const request_1 = require("./schemas/request");
function iiif(config) {
    const router = (0, express_1.Router)();
    router.use((_req, _res, next) => {
        try {
            config_1.Config.parse(config);
            next();
        }
        catch (error) {
            next(error);
        }
    });
    router.get("/*/info.json", async (req, res, next) => {
        try {
            const identifier = request_1.Identifier.parse(req.params[0]);
            const source = (0, sharp_1.default)(path_1.default.resolve(config.imageDir, identifier));
            const metadata = await source.metadata();
            const id = config.baseUrl
                ? new URL(config.baseUrl)
                : new URL(`${req.protocol}://${req.get("host")}/${req.baseUrl}`);
            id.pathname = path_1.default.join(id.pathname, identifier);
            res.contentType('application/ld+json;profile="http://iiif.io/api/image/3/context.json"');
            res.json({
                "@context": "http://iiif.io/api/image/3/context.json",
                id,
                type: "ImageService3",
                protocol: "http://iiif.io/api/image",
                profile: "level2",
                width: metadata.width,
                height: metadata.height,
                maxHeight: config.maxHeight,
                maxWidth: config.maxWidth,
                maxArea: config.maxArea,
                rights: config.rights,
            });
        }
        catch (error) {
            next(error);
        }
    });
    router.get("/*/:region/:size/:rotation/:quality.:format", async (req, res, next) => {
        try {
            const identifier = request_1.Identifier.parse(req.params[0]);
            const region = request_1.Region.parse(req.params.region);
            const size = request_1.Size.parse(req.params.size);
            const rotation = request_1.Rotation.parse(req.params.rotation);
            const quality = request_1.Quality.parse(req.params.quality);
            const format = request_1.Format.parse(req.params.format);
            const source = (0, sharp_1.default)(path_1.default.resolve(config.imageDir, identifier));
            const metadata = await source.metadata();
            /** 1. Region: https://iiif.io/api/image/3.0/#41-region */
            if (region.square) {
                if (metadata.width > metadata.height) {
                    source.extract({
                        left: Math.floor((metadata.width - metadata.height) / 2),
                        top: 0,
                        width: metadata.height,
                        height: metadata.height,
                    });
                }
                else {
                    source.extract({
                        left: 0,
                        top: Math.floor((metadata.height - metadata.width) / 2),
                        width: metadata.width,
                        height: metadata.width,
                    });
                }
            }
            else if (region.pct) {
                source.extract({
                    left: Math.floor((metadata.width * region.x) / 100),
                    top: Math.floor((metadata.height * region.y) / 100),
                    width: Math.floor((metadata.width * region.w) / 100),
                    height: Math.floor((metadata.height * region.h) / 100),
                });
            }
            else if (typeof region.x === "number" &&
                typeof region.y === "number" &&
                typeof region.w === "number" &&
                typeof region.h === "number") {
                source.extract({
                    left: region.x,
                    top: region.y,
                    width: region.w,
                    height: region.h,
                });
            }
            /** 2. Size: https://iiif.io/api/image/3.0/#42-size */
            const info = (await source.toBuffer({ resolveWithObject: true })).info;
            // max
            if (size.max === true && size.upscale === false) {
                if (config.maxWidth < info.width || config.maxHeight < info.height) {
                    source.resize({
                        width: (0, min_1.default)([info.width, config.maxWidth]),
                        height: (0, min_1.default)([info.height, config.maxHeight]),
                        fit: "inside",
                    });
                }
            }
            // ^max
            if (size.max === true && size.upscale === true) {
                source.resize({
                    width: (0, max_1.default)([info.width, config.maxWidth]),
                    height: (0, max_1.default)([info.height, config.maxHeight]),
                    fit: "inside",
                });
            }
            // ^pct:n
            if (size.upscale === true && size.pct) {
                source.resize({ width: info.width * (size.n / 100) });
            }
            // pct:n
            if (size.upscale === false && size.pct) {
                source.resize({ width: info.width * ((0, min_1.default)([size.n, 100]) / 100) });
            }
            // w,h
            if (size.upscale === false &&
                size.maintainAspectRatio === false &&
                size.w &&
                size.h) {
                if (size.w < info.width && size.h < info.height) {
                    source.resize({
                        width: size.w,
                        height: size.h,
                        fit: "fill",
                    });
                }
                else if (size.w > size.h) {
                    source.resize({
                        width: info.width,
                        height: Math.floor(info.height * (size.h / size.w)),
                        fit: "fill",
                    });
                }
                else if (size.w < size.h) {
                    source.resize({
                        width: Math.floor(info.width * (size.w / size.h)),
                        height: info.height,
                        fit: "fill",
                    });
                }
            }
            // ^w,h
            if (size.upscale === true &&
                size.maintainAspectRatio === false &&
                size.w &&
                size.h) {
                source.resize({ width: size.w, height: size.h, fit: "fill" });
            }
            // !w,h
            if (size.upscale === false &&
                size.maintainAspectRatio === true &&
                size.w &&
                size.h) {
                source.resize({
                    width: (0, min_1.default)([size.w, info.width]),
                    height: (0, min_1.default)([size.h, info.height]),
                    fit: "inside",
                });
            }
            // ^!w,h
            if (size.upscale === true &&
                size.maintainAspectRatio === true &&
                size.w &&
                size.h) {
                source.resize({ width: size.w, height: size.h, fit: "inside" });
            }
            // w,
            if (size.upscale === false && size.w && !size.h) {
                source.resize({ width: (0, min_1.default)([size.w, info.width]) });
            }
            // ^w,
            if (size.upscale === true && size.w && !size.h) {
                source.resize({ width: size.w });
            }
            // ,h
            if (size.upscale === false && !size.w && size.h) {
                source.resize({ height: (0, min_1.default)([size.h, info.height]) });
            }
            // ^,h
            if (size.upscale === true && !size.w && size.h) {
                source.resize({ height: size.h });
            }
            /** 3. Rotation: https://iiif.io/api/image/3.0/#43-rotation */
            if (rotation.mirror)
                source.flop();
            if (rotation.n > 0 && rotation.n < 360) {
                source.rotate(rotation.n);
            }
            /** 4. Quality: https://iiif.io/api/image/3.0/#quality */
            switch (quality) {
                case "gray":
                    source.grayscale();
                    break;
                case "bitonal":
                    source.threshold();
                    break;
                case "default":
                    if (config.quality === "gray")
                        source.grayscale();
                    if (config.quality === "bitonal")
                        source.threshold();
                default:
                    break;
            }
            /** 5. Format: https://iiif.io/api/image/3.0/#45-format */
            if (format === "pdf") {
                const { data, info } = await source.toBuffer({
                    resolveWithObject: true,
                });
                const document = await pdf_lib_1.PDFDocument.create();
                const page = document.addPage([info.width, info.height]);
                const pdfImage = await document.embedJpg(data);
                page.drawImage(pdfImage, {
                    x: 0,
                    y: 0,
                    width: info.width,
                    height: info.height,
                });
                res.contentType("application/pdf");
                res.send(Buffer.from(await document.saveAsBase64(), "base64"));
            }
            else {
                switch (format) {
                    case "jpg":
                        res.contentType("image/jpeg");
                        source.jpeg();
                        break;
                    case "tif":
                        res.contentType("image/tiff");
                        source.tiff();
                        break;
                    case "png":
                        source.png();
                        res.contentType("image/png");
                        break;
                    case "gif":
                        source.gif();
                        res.contentType("image/gif");
                        break;
                    case "jp2":
                        source.jp2();
                        res.contentType("image/jp2");
                        break;
                    case "webp":
                        source.webp();
                        res.contentType("image/webp");
                        break;
                    default:
                        break;
                }
                res.send(await source.toBuffer());
            }
        }
        catch (error) {
            next(error);
        }
    });
    return router;
}
exports.default = iiif;
