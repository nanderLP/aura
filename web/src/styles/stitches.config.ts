import { createStitches } from "@stitches/react";

export const {
  config,
  createTheme,
  css,
  getCssText,
  globalCss,
  keyframes,
  prefix,
  reset,
  styled,
  theme,
} = createStitches({
  theme: {
    colors: {
      "primary": "#9c4144",
      "onPrimary": "#ffffff",
      "primaryContainer": "#ffd9d9",
      "onPrimaryContainer": "#400007",
      "secondary": "#835500",
      "onSecondary": "#ffffff",
      "secondaryContainer": "#ffddaf",
      "onSecondaryContainer": "#2a1800",
      "error": " #ba1b1b",
      "onError": "#ffffff",
      "errorContainer": "#ffdad4",
      "onErrorContainer": "#410001",
      "background": "#fcfcfc",
      "onBackground": "#201a1a",
      "surface": "#fcfcfc",
      "onSurface": "#201a1a",
      "surfaceVariant": "#f5dddc",
      "onSurfaceVariant": "#534343",
      "outline": "#857372",
      "success": "#83bd75",
    },
  },
  media: {
    dark: "(prefers-color-scheme: dark)",
  },
});

createTheme("dark", {
  colors: {
    "primary": "#ffb3b3",
    "onPrimary": "#5f131a",
    "primaryContainer": "#7e2a2f",
    "onPrimaryContainer": "#ffd9d9",
    "secondary": "#ffb94d",
    "onSecondary": "#462b00",
    "secondaryContainer": "#633f00",
    "onSecondaryContainer": "#ffddaf",
    "error": "#ffb4a9",
    "onError": "#680003",
    "errorContainer": "#930006",
    "onErrorContainer": "#ffdad4",
    "background": "#201a1a",
    "onBackground": "#ede0df",
    "surface": "#201a1a",
    "onSurface": "#ede0df",
    "surfaceVariant": "#534343",
    "onSurfaceVariant": "#d8c2c1",
    "outline": "#9f8c8b",
  },
});

// modified version of http://meyerweb.com/eric/tools/css/reset/ + extra stuff
export const globalStyles = globalCss({
  "*": {
    margin: 0,
    padding: 0,
    border: 0,
    fontSize: "100%",
    font: "inherit",
    verticalAlign: "baseline",
  },
  "article, aside, details, figcaption, figure, footer, header, hgroup, menu, nav, section":
    {
      display: "block",
    },
  "body": {
    lineHeight: 1,
    margin: 0,
    backgroundColor: "$background",
    color: "$onSurface",
    fontFamily: "'Roboto', sans-serif",
    "-webkit-font-smoothing": "antialiased",
    "-moz-osx-font-smoothing": "grayscale",
  },
  "ol, ul": {
    listStyle: "none",
  },

  "h1, h2, h3, h4, h5, h6": {
    fontFamily: "'Satoshi', sans-serif",
  },

  "body, html, #💜": {
    "height": "100%",
    "width": "100%",
  },
});
