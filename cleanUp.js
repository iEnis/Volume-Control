import { rmSync, existsSync } from "fs";
import path from "path";

const files = [
    path.join(import.meta.dirname, "extention/popup.js.map"),
    path.join(import.meta.dirname, "extention/background.js.map"),
];

for (const file of files) {
    if (!existsSync(file)) continue;
    rmSync(file);
}
