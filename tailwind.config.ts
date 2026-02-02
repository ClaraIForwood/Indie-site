import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";


const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  
  theme: {
    fontSize: {
      ...defaultTheme.fontSize,
      sm: "0.8rem",
      base: "1rem",
    },
  },
  plugins: [],
};
export default config;

