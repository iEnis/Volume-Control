import DB from "./DB.js";
import { changeFillColor } from "./slider.js";

export function initReset() {
    DB.button.addEventListener("click", async () => {
        DB.label.textContent = "100%";
        DB.slider.value = "10";
        changeFillColor();

        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab.url?.startsWith("chrome://") || tab.url?.startsWith("chrome-extension://"))
            return console.error("Cannot modify internal Chrome pages");

        await DB.setVolume(1, tab);
    });
}
