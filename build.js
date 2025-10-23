import { rmSync, existsSync, readFileSync, writeFileSync } from "fs";
import path from "path";
const versionFile = path.join(import.meta.dirname, "version.txt");

const currentVersion = readFileSync(versionFile).toString();

const splitVersion = currentVersion.split(".").map((x) => Number(x));
splitVersion[splitVersion.length - 1] += 1;

const newVersion = splitVersion.join(".");

const files = [
    path.join(import.meta.dirname, "extention/popup.js.map"),
    path.join(import.meta.dirname, "extention/background.js.map"),
];

for (const file of files) {
    if (!existsSync(file)) continue;
    rmSync(file);
}

const versionFiles = [
    path.join(import.meta.dirname, "package.json"),
    path.join(import.meta.dirname, "extention/manifest.json"),
    path.join(import.meta.dirname, "updates.xml"),
];

for (const file of versionFiles) {
    if (!existsSync(file)) continue;
    writeFileSync(file, readFileSync(file).toString().replace(currentVersion, newVersion));
}

writeFileSync(versionFile, newVersion);
