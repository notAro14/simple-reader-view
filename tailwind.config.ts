import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  plugins: [require("@tailwindcss/typography")],
  corePlugins: {
    preflight: false,
  },

  theme: {
    extend: {
      textColor: {
        current: "currentColor",
      },
    },
  },
};
export default config;
