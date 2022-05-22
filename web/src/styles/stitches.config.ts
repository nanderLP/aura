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
      "primary": "#5b50b3",
      "onPrimary": "#ffffff",
      "primaryContainer": "#e5deff",
      "onPrimaryContainer": "#150067",
      "secondary": "#5f5c71",
      "onSecondary": "#ffffff",
      // primary container and seondary container are kinda similar, good thing that i won't use a secondary card
      "secondaryContainer": "#e5dff9",
      "onSecondaryContainer": "#1b192c",
      "error": " #ba1b1b",
      "onError": "#ffffff",
      "errorContainer": "#ffdad4",
      "onErrorContainer": "#410001",
      "background": "#fffbff",
      "onBackground": "#1c1b1f",
      "surface": "#fffbff",
      "onSurface": "#1c1b1f",
      "surfaceVariant": "#e5e0ec",
      "onSurfaceVariant": "#47464f",
      "outline": "#797680",
      "warning": "#9c4144",
      "success": "#83bd75",
    },
    radii: {
      xs: "0.25rem",
      sm: "0.5rem",
      md: "0.75rem",
      lg: "1rem",
      xl: "1.75rem",
      full: "9999px",
    },
  },
  media: {
    dark: "(prefers-color-scheme: dark)",
    // breakpoints, following the material you specifications
    medium: "(min-width: 600px)",
    expanded: "(min-width: 840px)",
  },
});

createTheme("dark", {
  colors: {
    "primary": "#c8bfff",
    "onPrimary": "#2c1c82",
    "primaryContainer": "#433799",
    "onPrimaryContainer": "#e5deff",
    "secondary": "#c8c3dc",
    "onSecondary": "#302e41",
    "secondaryContainer": "#474459",
    "onSecondaryContainer": "#e5dff9",
    "error": "#ffb4a9",
    "onError": "#680003",
    "errorContainer": "#930006",
    "onErrorContainer": "#ffdad4",
    "background": "#1c1b1f",
    "onBackground": "#e5e1e5",
    "surface": "#1c1b1f",
    "onSurface": "#1c1b1f",
    "surfaceVariant": "#47464f",
    "onSurfaceVariant": "#c9c5d0",
    "outline": "#928f9a",
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
