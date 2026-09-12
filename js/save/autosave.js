import { saveGame } from "./save.js";

let autosaveEnabled = true;
let autosaveInterval = null;

export function enableAutosave() {
    autosaveEnabled = true;
}

export function disableAutosave() {
    autosaveEnabled = false;
}

export function isAutosaveEnabled() {
    return autosaveEnabled;
}

export function performAutosave(state) {
    if (!autosaveEnabled) {
        return {
            success: false,
            skipped: true
        };
    }

    return saveGame(state);
}

export function startAutosave(
    getState,
    interval = 60000
) {
    stopAutosave();

    autosaveInterval = setInterval(() => {
        const state = getState?.();

        if (state) {
            performAutosave(state);
        }
    }, interval);

    return autosaveInterval;
}

export function stopAutosave() {
    if (autosaveInterval) {
        clearInterval(autosaveInterval);
        autosaveInterval = null;
    }
}
