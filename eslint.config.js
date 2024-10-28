const globals = require("globals");
const tseslint = require("typescript-eslint");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");

module.exports = [
    {files: ["**/*.{ts,tsx}"]},
    {languageOptions: {globals: globals.commonjs}},
    ...tseslint.configs.recommended,
    eslintPluginPrettierRecommended,
    {
        rules: {
            "@typescript-eslint/no-unused-expressions": [
                "error",
                {
                    "allowShortCircuit": true,
                    "allowTernary": true,
                    "allowTaggedTemplates": true
                }
            ],
            "@/comma-spacing": "error",
            "@/no-extra-semi": "error",
            "@/lines-between-class-members": "error",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-unsafe-function-type": "off",
            "@typescript-eslint/default-param-last": "error",
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    "args": "none"
                }
            ]
        }
    }
];
