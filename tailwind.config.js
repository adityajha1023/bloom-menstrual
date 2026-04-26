module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        h1: ["2.986rem", { lineHeight: "1.2", fontWeight: "600" }],
        h2: ["2.488rem", { lineHeight: "1.25", fontWeight: "600" }],
        h3: ["2.074rem", { lineHeight: "1.3", fontWeight: "500" }],
        h4: ["1.728rem", { lineHeight: "1.35", fontWeight: "500" }],
        h5: ["1.44rem", { lineHeight: "1.4", fontWeight: "500" }],
        h6: ["1.2rem", { lineHeight: "1.4", fontWeight: "500" }],
        body: ["1rem", { lineHeight: "1.6" }],
      },
    },
  },
  plugins: [],
};