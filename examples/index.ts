import cors from "cors";
import express, { Express } from "express";
import iiif from "./../";

const app: Express = express();
app.use(cors());

app.use(
  "/iiif",
  iiif({
    imageDir: "./examples/images",
  })
);

app.use("/", (_req, res) => {
  res.sendFile("./index.html", { root: __dirname });
});

app.listen(3000, () => {
  console.log("⚡️[server]: Server is running at http://localhost:3000");
});
