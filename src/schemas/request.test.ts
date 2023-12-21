import { Quality, Region, Rotation, Size, Format } from "./request";

test("Region", () => {
  expect(Region.parse("full")).toEqual({
    full: true,
    square: false,
    pct: false,
    w: null,
    h: null,
    x: null,
    y: null,
  });
  expect(Region.parse("square")).toEqual({
    full: false,
    square: true,
    pct: false,
    w: null,
    h: null,
    x: null,
    y: null,
  });
  expect(Region.parse("pct:10,10,10,10")).toEqual({
    full: false,
    square: false,
    pct: true,
    w: 10,
    h: 10,
    x: 10,
    y: 10,
  });
  expect(Region.parse("10,10,10,10")).toEqual({
    full: false,
    square: false,
    pct: false,
    w: 10,
    h: 10,
    x: 10,
    y: 10,
  });

  expect(Region.parse("pct:0,0,0,0")).toEqual({
    full: false,
    square: false,
    pct: true,
    w: 0,
    h: 0,
    x: 0,
    y: 0,
  });

  expect(() => Region.parse("pct:foo,bar,zaz")).toThrow();
  expect(() => Region.parse("foo")).toThrow();
  expect(() => Region.parse("pct:10")).toThrow();
  expect(() => Region.parse("pct:10,10")).toThrow();
  expect(() => Region.parse("10")).toThrow();
  expect(() => Region.parse("10,10")).toThrow();
});

test("Size", () => {
  expect(Size.parse("max")).toEqual({
    max: true,
    upscale: false,
    maintainAspectRatio: false,
    pct: false,
    w: null,
    h: null,
    n: null,
  });
  expect(Size.parse("^max")).toEqual({
    max: true,
    upscale: true,
    maintainAspectRatio: false,
    pct: false,
    w: null,
    h: null,
    n: null,
  });
  expect(Size.parse("10,")).toEqual({
    max: false,
    upscale: false,
    maintainAspectRatio: false,
    pct: false,
    w: 10,
    h: null,
    n: null,
  });
  expect(Size.parse("^10,")).toEqual({
    max: false,
    upscale: true,
    maintainAspectRatio: false,
    pct: false,
    w: 10,
    h: null,
    n: null,
  });
  expect(Size.parse(",10")).toEqual({
    max: false,
    upscale: false,
    maintainAspectRatio: false,
    pct: false,
    w: null,
    h: 10,
    n: null,
  });
  expect(Size.parse("^,10")).toEqual({
    max: false,
    upscale: true,
    maintainAspectRatio: false,
    pct: false,
    w: null,
    h: 10,
    n: null,
  });
  expect(Size.parse("pct:10")).toEqual({
    max: false,
    upscale: false,
    maintainAspectRatio: false,
    pct: true,
    w: null,
    h: null,
    n: 10,
  });
  expect(Size.parse("^pct:10")).toEqual({
    max: false,
    upscale: true,
    maintainAspectRatio: false,
    pct: true,
    w: null,
    h: null,
    n: 10,
  });
  expect(Size.parse("10,10")).toEqual({
    max: false,
    upscale: false,
    maintainAspectRatio: false,
    pct: false,
    w: 10,
    h: 10,
    n: null,
  });
  expect(Size.parse("^10,10")).toEqual({
    max: false,
    upscale: true,
    maintainAspectRatio: false,
    pct: false,
    w: 10,
    h: 10,
    n: null,
  });
  expect(Size.parse("!10,10")).toEqual({
    max: false,
    upscale: false,
    maintainAspectRatio: true,
    pct: false,
    w: 10,
    h: 10,
    n: null,
  });
  expect(Size.parse("^!10,10")).toEqual({
    max: false,
    upscale: true,
    maintainAspectRatio: true,
    pct: false,
    w: 10,
    h: 10,
    n: null,
  });
  expect(() => Size.parse("pct:101")).toThrow();
});

test("Rotation", () => {
  expect(Rotation.parse("10")).toEqual({
    n: 10,
    mirror: false,
  });
  expect(Rotation.parse("!10")).toEqual({
    n: 10,
    mirror: true,
  });
  expect(() => Rotation.parse("361")).toThrow();
});

test("Quality", () => {
  expect(Quality.parse("color")).toEqual("color");
  expect(Quality.parse("gray")).toEqual("gray");
  expect(Quality.parse("bitonal")).toEqual("bitonal");
  expect(Quality.parse("default")).toEqual("default");
  expect(() => Quality.parse("foo")).toThrow();
});

test("Format", () => {
  expect(Format.parse("jpg")).toEqual("jpg");
  expect(Format.parse("tif")).toEqual("tif");
  expect(Format.parse("png")).toEqual("png");
  expect(Format.parse("gif")).toEqual("gif");
  expect(Format.parse("jp2")).toEqual("jp2");
  expect(Format.parse("pdf")).toEqual("pdf");
  expect(Format.parse("webp")).toEqual("webp");
  expect(() => Format.parse("foo")).toThrow();
});
