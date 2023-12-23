"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var max_1 = __importDefault(require("lodash/max"));
var min_1 = __importDefault(require("lodash/min"));
var path_1 = __importDefault(require("path"));
var pdf_lib_1 = require("pdf-lib");
var sharp_1 = __importDefault(require("sharp"));
var config_1 = require("./schemas/config");
var request_1 = require("./schemas/request");
function iiif(config) {
    var _this = this;
    var router = (0, express_1.Router)();
    router.use(function (_req, _res, next) {
        try {
            config_1.Config.parse(config);
            next();
        }
        catch (error) {
            next(error);
        }
    });
    router.get("/*/info.json", function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var identifier, source, metadata, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    identifier = request_1.Identifier.parse(req.params[0]);
                    source = (0, sharp_1.default)(path_1.default.join(config.imageDir, identifier));
                    return [4 /*yield*/, source.metadata()];
                case 1:
                    metadata = _a.sent();
                    res.contentType('application/ld+json;profile="http://iiif.io/api/image/3/context.json"');
                    res.json({
                        "@context": "http://iiif.io/api/image/3/context.json",
                        id: new URL(path_1.default.join(req.baseUrl, identifier), config.baseUrl || "".concat(req.protocol, "://").concat(req.get("host"))).toString(),
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
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    next(error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    router.get("/*/:region/:size/:rotation/:quality.:format", function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var identifier, region, size, rotation, quality, format, source, metadata, info, _a, data, info_1, document_1, page, pdfImage, _b, _c, _d, _e, _f, _g, error_2;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    _h.trys.push([0, 10, , 11]);
                    identifier = request_1.Identifier.parse(req.params[0]);
                    region = request_1.Region.parse(req.params.region);
                    size = request_1.Size.parse(req.params.size);
                    rotation = request_1.Rotation.parse(req.params.rotation);
                    quality = request_1.Quality.parse(req.params.quality);
                    format = request_1.Format.parse(req.params.format);
                    source = (0, sharp_1.default)(path_1.default.join(config.imageDir, identifier));
                    return [4 /*yield*/, source.metadata()];
                case 1:
                    metadata = _h.sent();
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
                    return [4 /*yield*/, source.toBuffer({ resolveWithObject: true })];
                case 2:
                    info = (_h.sent()).info;
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
                    if (!(format === "pdf")) return [3 /*break*/, 7];
                    return [4 /*yield*/, source.toBuffer({
                            resolveWithObject: true,
                        })];
                case 3:
                    _a = _h.sent(), data = _a.data, info_1 = _a.info;
                    return [4 /*yield*/, pdf_lib_1.PDFDocument.create()];
                case 4:
                    document_1 = _h.sent();
                    page = document_1.addPage([info_1.width, info_1.height]);
                    return [4 /*yield*/, document_1.embedJpg(data)];
                case 5:
                    pdfImage = _h.sent();
                    page.drawImage(pdfImage, {
                        x: 0,
                        y: 0,
                        width: info_1.width,
                        height: info_1.height,
                    });
                    res.contentType("application/pdf");
                    _c = (_b = res).send;
                    _e = (_d = Buffer).from;
                    return [4 /*yield*/, document_1.saveAsBase64()];
                case 6:
                    _c.apply(_b, [_e.apply(_d, [_h.sent(), "base64"])]);
                    return [3 /*break*/, 9];
                case 7:
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
                    _g = (_f = res).send;
                    return [4 /*yield*/, source.toBuffer()];
                case 8:
                    _g.apply(_f, [_h.sent()]);
                    _h.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    error_2 = _h.sent();
                    next(error_2);
                    return [3 /*break*/, 11];
                case 11: return [2 /*return*/];
            }
        });
    }); });
    return router;
}
exports.default = iiif;
