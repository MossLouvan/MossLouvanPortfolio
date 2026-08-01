import { defineConfig, globalIgnores } from "eslint/config";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const eslintConfig = defineConfig([
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
    rules: {
      // Ship no stray debug output. warn/error stay allowed as intentional diagnostics.
      "no-console": ["error", { allow: ["warn", "error"] }],

      // `any` switches the type checker off exactly where bugs hide. Prefer
      // `unknown` at boundaries, then narrow.
      "@typescript-eslint/no-explicit-any": "error",

      // `_`-prefixed names opt out deliberately.
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
      ],

      eqeqeq: ["error", "always", { null: "ignore" }],
      "prefer-const": "error",
      "no-var": "error",

      // The reveal-on-scroll and timer effects here are easy to get subtly
      // wrong, so a missing dependency should fail the build, not warn.
      "react-hooks/exhaustive-deps": "error",
    },
  },

  // Override default ignores of eslint-config-next.
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
