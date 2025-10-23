interface Window {
    _gainNode?: GainNode;
    _audioCtx?: AudioContext;
    webkitAudioContext?: typeof AudioContext;
}

interface HTMLMediaElement {
    _sourceNode?: MediaElementAudioSourceNode;
}
