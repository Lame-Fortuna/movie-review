import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@next/next/no-async-client-component": "off",
      "@typescript-eslint/no-unused-vars": "off",

      // Disable the 'no-explicit-any' rule globally
      "@typescript-eslint/no-explicit-any": "off",
      
      // You can disable other rules here as needed:
      "no-unused-vars": "off",
      "react-hooks/rules-of-hooks": "off", // Example for React hooks rule
      "react/jsx-uses-react": "off", // Example for React's jsx rule in Next.js
    },
  },
];

export default eslintConfig;
