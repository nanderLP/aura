module.exports = {
  content: ["./index.html", "./src/**/*.tsx"],
  darkMode: "media",
  theme: {
    extend: {
      gridTemplateColumns: {
        autoFill: "repeat(auto-fit, minmax(0, 1fr))",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        high: "rgba(255,255,255,0.87)",
        med: "rgba(255,255,255,0.6)",
        dp: {
          1: "rgba(255,255,255,0.05)",
          2: "rgba(255,255,255,0.07)",
        },
      },
    },
  },
  plugins: [],
};
