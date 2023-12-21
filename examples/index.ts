import express, { Express } from "express";
import iiif from "./../";

const app: Express = express();

app.use(
  "/iiif",
  iiif({
    baseUrl: "http://localhost:3000",
    imageDir: "./examples/images",
  })
);

app.use("/", (_req, res) => {
  res.sendFile("./osd.html", { root: __dirname });
});

app.listen(3000, () => {
  console.log("⚡️[server]: Server is running at http://localhost:3000");
});
