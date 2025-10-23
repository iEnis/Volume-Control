import DB from "./DB.js";
DB.title = document.getElementById("title")! as HTMLSpanElement;
DB.slider = document.getElementById("volume")! as HTMLInputElement;
DB.label = document.getElementById("label")! as HTMLParagraphElement;
DB.button = document.getElementById("reset")! as HTMLButtonElement;
await DB.load();

import { initSlider } from "./slider.js";
import { initReset } from "./reset.js";
initSlider();
initReset();
