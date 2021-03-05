import replace from "@rollup/plugin-replace";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import html from "@rollup/plugin-html";
import scss from "rollup-plugin-scss";
import { terser } from "rollup-plugin-terser";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import injectProcessEnv from "rollup-plugin-inject-process-env";

const isProd = process.env.NODE_ENV === "production";
const extensions = [".js", ".ts", ".tsx"];

export default {
    input: "src/index.tsx",
    output: {
        file: "public/index.js",
        format: "iife",
    },
    plugins: [
        replace({
            "process.env.NODE_ENV": JSON.stringify(
                isProd ? "production" : "development"
            ),
        }),
        resolve({
            extensions,
            browser: true,
            preferBuiltins: true
        }),
        injectProcessEnv({
            ...process.env,
        }),
        commonjs({
            include: [/node_modules/],
        }),
        babel({
            extensions,
            exclude: /node_modules/,
            babelrc: false,
            babelHelpers: "runtime",
            presets: [
                "@babel/preset-env",
                "@babel/preset-react",
                "@babel/preset-typescript",
            ],
            plugins: [
                "react-require",
                "@babel/plugin-syntax-dynamic-import",
                "@babel/plugin-proposal-class-properties",
                [
                    "@babel/plugin-proposal-object-rest-spread",
                    {
                        useBuiltIns: true,
                    },
                ],
                [
                    "@babel/plugin-transform-runtime",
                    {
                        corejs: 3,
                        regenerator: true,
                        useESModules: false,
                    },
                ],
            ],
        }),
        html({
            fileName: "index.html",
            title: "Rollup + TypeScript + React = ❤️",
            template: ({ title }) => {
                return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>${title}</title>
    <link rel="stylesheet" href="index.css">
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
    <div id="app"></div>
    <script src="index.js"></script>
</body>
</html>
`;
            },
        }),
        scss({
            output: "public/index.css",
        }),
        isProd && terser(),
        !isProd &&
            serve({
                host: "localhost",
                port: process.env.PORT || 3000,
                open: false,
                contentBase: ["public"],
            }),
        !isProd &&
            livereload({
                watch: "public",
            }),
    ],
};
