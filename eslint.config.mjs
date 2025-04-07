import stylistic from "@stylistic/eslint-plugin";
import { FlatCompat } from "@eslint/eslintrc";
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    plugins: {
      "@stylistic": stylistic,
    },
    rules: {
      "@stylistic/padding-line-between-statements": [
        "error",
        { blankLine: "always", prev: "function", next: "function" },
        {
          blankLine: "always",
          prev: ["const", "let", "var"],
          next: "function",
        },
        { blankLine: "always", prev: "import", next: "function" },
      ],
    },
  },
];

export default eslintConfig;
