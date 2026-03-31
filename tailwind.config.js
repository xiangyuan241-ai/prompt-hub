/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#101727",
        mist: "#f5f7fb",
        signal: "#f97316",
        ocean: "#0f766e",
        sky: "#dff4ff",
      },
      boxShadow: {
        panel: "0 24px 60px rgba(16, 23, 39, 0.12)",
      },
      fontFamily: {
        display: ['"Segoe UI"', '"PingFang SC"', '"Microsoft YaHei"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
