import DB from "./DB.js";

export function initSlider() {
    DB.slider.addEventListener("input", async () => {
        changeFillColor();

        const volume = Number(DB.slider.value) / 10;
        DB.label.textContent = `${Math.round(volume * 100)}%`;

        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab.url?.startsWith("chrome://") || tab.url?.startsWith("chrome-extension://"))
            return console.error("Cannot modify internal Chrome pages");

        await DB.setVolume(volume, tab);
    });
}

export function changeFillColor() {
    const value = Number(DB.slider.value);
    const percent = ((value - Number(DB.slider.min)) / (Number(DB.slider.max) - Number(DB.slider.min))) * 100;
    DB.slider.style.background = `linear-gradient(to right, var(--primary-color) 0%, var(--primary-color) ${percent}%, var(--secondary-color) ${percent}%, var(--secondary-color) 100%)`;
}
