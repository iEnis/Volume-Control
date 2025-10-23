export default class DB {
    protected constructor() {}

    public static label: HTMLParagraphElement;
    public static slider: HTMLInputElement;
    public static button: HTMLButtonElement;
    public static title: HTMLSpanElement;

    public static async getCurrentDomain(): Promise<string | undefined> {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        const tab = tabs[0];
        if (!tab.id || !tab.url) return undefined;

        const url = new URL(tab.url);
        const domain = url.hostname;

        return domain;
    }

    public static async load() {
        const domain = await this.getCurrentDomain();
        if (!domain) return;
        DB.title.innerText = domain;

        const volume: number = (await chrome.storage.local.get([domain]))?.[domain] || 1;
        console.log(`Volume: ${JSON.stringify(volume)}`);
        if (!volume) return;

        this.label.textContent = `${Math.round(volume * 100)}%`;
        this.slider.value = (volume * 10).toString();

        const value = Number(DB.slider.value);
        const percent = ((value - Number(DB.slider.min)) / (Number(DB.slider.max) - Number(DB.slider.min))) * 100;
        DB.slider.style.background = `linear-gradient(to right, var(--primary-color) 0%, var(--primary-color) ${percent}%, var(--secondary-color) ${percent}%, var(--secondary-color) 100%)`;
    }

    public static async storeData(volume: number, domain?: string | Promise<string>) {
        if (typeof domain !== "string") domain = await this.getCurrentDomain();
        if (!domain) return;

        await chrome.storage.local.set({ [domain]: volume });
        console.log((await chrome.storage.local.get([domain]))?.[domain]);
    }

    public static async setVolume(volume: number, tab: chrome.tabs.Tab) {
        const domain = await this.getCurrentDomain();
        if (!domain) return;
        this.storeData(volume, domain);

        chrome.scripting.executeScript({
            target: { tabId: tab.id! },
            func: (volume: number) => {
                const AudioContextConstructor = window.AudioContext || (window as any).webkitAudioContext;
                if (!AudioContextConstructor) return;

                if (!window._audioCtx) {
                    window._audioCtx = new AudioContextConstructor();
                    window._gainNode = window._audioCtx.createGain();
                    window._gainNode.connect(window._audioCtx.destination);
                }

                const { _audioCtx, _gainNode } = window;
                if (_audioCtx.state === "suspended") _audioCtx.resume();
                _gainNode!.gain.value = volume;

                const mediaEls = document.querySelectorAll("audio, video") as NodeListOf<HTMLMediaElement>;
                mediaEls.forEach((el) => {
                    if (!el._sourceNode) {
                        try {
                            const src = _audioCtx.createMediaElementSource(el);
                            src.connect(_gainNode!);
                            el._sourceNode = src;
                        } catch (e) {
                            console.warn("Already connected element skipped:", e);
                        }
                    }
                });
            },
            args: [volume],
        });
    }
}
