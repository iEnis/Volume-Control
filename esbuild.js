import { build } from "esbuild";
const isDev = process.argv.includes("dev");

build({
    entryPoints: ["src/popup/index.ts"],
    outfile: "extention/popup.js",
    format: "esm",
    platform: "browser",
    target: ["chrome138"],
    sourcemap: isDev,
    bundle: true,
    minify: true,
});

build({
    entryPoints: ["src/background/index.ts"],
    outfile: "extention/background.js",
    format: "esm",
    platform: "browser",
    target: ["chrome138"],
    sourcemap: isDev,
    bundle: true,
    minify: true,
});
