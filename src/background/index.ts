async function applyVolume(tabId: number, url: string) {
    if (url.startsWith("chrome://") || url.startsWith("chrome-extension://")) return;

    const domain = new URL(url).hostname;
    const data = await chrome.storage.local.get([domain]);
    const volume = data[domain] ?? 1;

    chrome.scripting.executeScript({
        target: { tabId },
        func: (volume) => {
            const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextConstructor) return;

            if (!window._audioCtx) {
                window._audioCtx = new AudioContextConstructor();
                window._gainNode = window._audioCtx.createGain();
                window._gainNode.connect(window._audioCtx.destination);
            }

            const _audioCtx = window._audioCtx!;
            const _gainNode = window._gainNode!;
            if (_audioCtx.state === "suspended") _audioCtx.resume();
            _gainNode.gain.value = volume;

            (document.querySelectorAll("audio, video") as NodeListOf<HTMLMediaElement>).forEach((el) => {
                if (!el._sourceNode) {
                    try {
                        const src = _audioCtx.createMediaElementSource(el);
                        src.connect(_gainNode);
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

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url) {
        await applyVolume(tabId, tab.url);
    }
});

chrome.tabs.onActivated.addListener(async ({ tabId }) => {
    const tab = await chrome.tabs.get(tabId);
    if (tab.url) {
        await applyVolume(tabId, tab.url);
    }
});
