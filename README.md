# express-iiif

express-iiif is [Express.js](https://expressjs.com/) [middleware](https://expressjs.com/en/guide/using-middleware.html) to provide your application with a [IIIF](https://iiif.io/) server, written in TypeScript, and compatible with [Image API 3.0](https://iiif.io/api/image/3.0/).

## Installation

```bash
npm install express-iiif
```

## Usage

Add the middleware to your Express.js application, and provide the path to the directory containing your images.

```typescript
import express, { Express } from "express";
import iiif from "express-iiif";

const app: Express = express();

app.use(
  "/iiif",
  iiif({
    imageDir: "./images", // Path to the directory containing the images
  })
);

app.listen(3000, () => {
  console.log("⚡️[server]: Server is running at http://localhost:3000");
});
```

In the previous example the following URLs are available:

- `http://localhost:3000/iiif/my-image.jpg/info.json`,
- `http://localhost:3000/iiif/my-image.jpg/full/max/0/default.jpg`.

## Options

The following options can be passed to the middleware:

| Option      | Type     | Description                                                          |
| ----------- | -------- | -------------------------------------------------------------------- |
| `baseUrl`   | `string` | The base URL of the IIIF server. Defaults to the URL of the request. |
| `imageDir`  | `string` | The path to the directory containing the images.                     |
| `maxWidth`  | `number` | https://iiif.io/api/image/3.0/#42-size                               |
| `maxHeight` | `number` | https://iiif.io/api/image/3.0/#42-size                               |
| `maxArea`   | `number` | https://iiif.io/api/image/3.0/#42-size                               |
| `quality`   | `string` | https://iiif.io/api/image/3.0/#43-quality                            |
| `rights`    | `string` | https://iiif.io/api/image/3.0/#56-rights                             |

## License

[BSD 3-Clause License](LICENSE)
