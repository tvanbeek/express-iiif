import { Router } from "express";
import max from "lodash/max";
import min from "lodash/min";
import path from "path";
import { PDFDocument } from "pdf-lib";
import sharp from "sharp";
import { Config } from "./schemas/config";
import {
  Format,
  Identifier,
  Quality,
  Region,
  Rotation,
  Size,
} from "./schemas/request";

export default function iiif(config: Config) {
  const router = Router();

  router.use((_req, _res, next) => {
    try {
      Config.parse(config);
      next();
    } catch (error) {
      next(error);
    }
  });

  router.get("/:identifier/info.json", async (req, res, next) => {
    try {
      const identifier = Identifier.parse(req.params.identifier);
      const source = sharp(path.join(config.imageDir, identifier));
      const metadata = await source.metadata();

      res.contentType(
        'application/ld+json;profile="http://iiif.io/api/image/3/context.json"'
      );
      res.json({
        "@context": "http://iiif.io/api/image/3/context.json",
        id: new URL(
          path.join(req.baseUrl, identifier),
          config.baseUrl || `${req.protocol}://${req.get("host")}`
        ).toString(),
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
    } catch (error) {
      next(error);
    }
  });

  router.get(
    "/:identifier/:region/:size/:rotation/:quality.:format",
    async (req, res, next) => {
      try {
        const identifier = Identifier.parse(req.params.identifier);
        const region = Region.parse(req.params.region);
        const size = Size.parse(req.params.size);
        const rotation = Rotation.parse(req.params.rotation);
        const quality = Quality.parse(req.params.quality);
        const format = Format.parse(req.params.format);

        const source = sharp(path.join(config.imageDir, identifier));
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
          } else {
            source.extract({
              left: 0,
              top: Math.floor((metadata.height - metadata.width) / 2),
              width: metadata.width,
              height: metadata.width,
            });
          }
        } else if (region.pct) {
          source.extract({
            left: Math.floor((metadata.width * region.x) / 100),
            top: Math.floor((metadata.height * region.y) / 100),
            width: Math.floor((metadata.width * region.w) / 100),
            height: Math.floor((metadata.height * region.h) / 100),
          });
        } else if (
          typeof region.x === "number" &&
          typeof region.y === "number" &&
          typeof region.w === "number" &&
          typeof region.h === "number"
        ) {
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
              width: min([info.width, config.maxWidth]),
              height: min([info.height, config.maxHeight]),
              fit: "inside",
            });
          }
        }

        // ^max
        if (size.max === true && size.upscale === true) {
          source.resize({
            width: max([info.width, config.maxWidth]),
            height: max([info.height, config.maxHeight]),
            fit: "inside",
          });
        }

        // ^pct:n
        if (size.upscale === true && size.pct) {
          source.resize({ width: info.width * (size.n / 100) });
        }

        // pct:n
        if (size.upscale === false && size.pct) {
          source.resize({ width: info.width * (min([size.n, 100]) / 100) });
        }

        // w,h
        if (
          size.upscale === false &&
          size.maintainAspectRatio === false &&
          size.w &&
          size.h
        ) {
          if (size.w < info.width && size.h < info.height) {
            source.resize({
              width: size.w,
              height: size.h,
              fit: "fill",
            });
          } else if (size.w > size.h) {
            source.resize({
              width: info.width,
              height: Math.floor(info.height * (size.h / size.w)),
              fit: "fill",
            });
          } else if (size.w < size.h) {
            source.resize({
              width: Math.floor(info.width * (size.w / size.h)),
              height: info.height,
              fit: "fill",
            });
          }
        }

        // ^w,h
        if (
          size.upscale === true &&
          size.maintainAspectRatio === false &&
          size.w &&
          size.h
        ) {
          source.resize({ width: size.w, height: size.h, fit: "fill" });
        }

        // !w,h
        if (
          size.upscale === false &&
          size.maintainAspectRatio === true &&
          size.w &&
          size.h
        ) {
          source.resize({
            width: min([size.w, info.width]),
            height: min([size.h, info.height]),
            fit: "inside",
          });
        }

        // ^!w,h
        if (
          size.upscale === true &&
          size.maintainAspectRatio === true &&
          size.w &&
          size.h
        ) {
          source.resize({ width: size.w, height: size.h, fit: "inside" });
        }

        // w,
        if (size.upscale === false && size.w && !size.h) {
          source.resize({ width: min([size.w, info.width]) });
        }

        // ^w,
        if (size.upscale === true && size.w && !size.h) {
          source.resize({ width: size.w });
        }

        // ,h
        if (size.upscale === false && !size.w && size.h) {
          source.resize({ height: min([size.h, info.height]) });
        }

        // ^,h
        if (size.upscale === true && !size.w && size.h) {
          source.resize({ height: size.h });
        }

        /** 3. Rotation: https://iiif.io/api/image/3.0/#43-rotation */
        if (rotation.mirror) source.flop();
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
            if (config.quality === "gray") source.grayscale();
            if (config.quality === "bitonal") source.threshold();
          default:
            break;
        }

        /** 5. Format: https://iiif.io/api/image/3.0/#45-format */
        if (format === "pdf") {
          const { data, info } = await source.toBuffer({
            resolveWithObject: true,
          });

          const document = await PDFDocument.create();
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
        } else {
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
      } catch (error) {
        next(error);
      }
    }
  );

  return router;
}
