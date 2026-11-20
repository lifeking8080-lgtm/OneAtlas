import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: { colors: { ink: "#0a0f24", panel: "#121a36", line: "#243157", violet: "#8b7bff", sky: "#4ea8ff" } } },
  plugins: [],
};
export default config;
