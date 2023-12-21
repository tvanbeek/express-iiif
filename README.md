# express-iiif

express-iiif is [middleware](https://expressjs.com/en/guide/using-middleware.html) for [Express.js](https://expressjs.com/) to run an [Image API 3.0](https://iiif.io/api/image/3.0/) compatible [IIIF](https://iiif.io/) server.

## Installation

```bash
npm install express-iiif
```

## Usage

Add the middleware to any [Express.js](https://expressjs.com/) application and provide the path to the directory containing your images.

```javascript
import express from "express";
import iiif from "express-iiif";

const app = express();

app.use(
  "/iiif",
  iiif({
    imageDir: "./images",
  })
);

app.listen(3000, () => {
  console.log("⚡️ Server is running at http://localhost:3000");
});
```

These URLs become available:

- http://localhost:3000/iiif/my-image.jpg/info.json
- http://localhost:3000/iiif/my-image.jpg/full/max/0/default.jpg
- http://localhost:3000/iiif/my-image.jpg/square/300,300/90/gray.gif

For an overview of all available transformations and explaination of the Image Request URI Syntax, vist the [Image API 3.0](https://iiif.io/api/image/3.0/) specification.

For an example application with [OpenSeadragon](https://openseadragon.github.io/) viewer, visit the [GitHub Repository](https://github.com/tvanbeek/express-iiif/tree/main/examples) examples folder.

## Options

| Option      | Required | Type     | Description                                                          |
| ----------- | -------- | -------- | -------------------------------------------------------------------- |
| `imageDir`  | Yes      | `string` | The path to the directory containing the images.                     |
| `baseUrl`   | No       | `string` | The base URL of the IIIF server. Defaults to the URL of the request. |
| `maxWidth`  | No       | `number` | https://iiif.io/api/image/3.0/#42-size                               |
| `maxHeight` | No       | `number` | https://iiif.io/api/image/3.0/#42-size                               |
| `maxArea`   | No       | `number` | https://iiif.io/api/image/3.0/#42-size                               |
| `quality`   | No       | `string` | https://iiif.io/api/image/3.0/#43-quality                            |
| `rights`    | No       | `string` | https://iiif.io/api/image/3.0/#56-rights                             |

## License

[BSD 3-Clause License](LICENSE)
