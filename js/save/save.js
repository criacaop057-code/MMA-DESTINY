const SAVE_KEY = "mma_destiny_save";
const SAVE_VERSION = 1;

export function serializeGameState(state) {
    return JSON.stringify({
        version: SAVE_VERSION,
        savedAt: new Date().toISOString(),
        state
    });
}

export function saveGame(state) {
    if (!state) {
        return {
            success: false,
            error: "Estado do jogo inválido."
        };
    }

    try {
        const data = serializeGameState(state);

        localStorage.setItem(
            SAVE_KEY,
            data
        );

        return {
            success: true,
            savedAt: new Date().toISOString()
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

export function loadGame() {
    try {
        const raw =
            localStorage.getItem(SAVE_KEY);

        if (!raw) {
            return null;
        }

        const save = JSON.parse(raw);

        if (!save.state) {
            return null;
        }

        return save;
    } catch (error) {
        console.error(
            "Erro ao carregar save:",
            error
        );

        return null;
    }
}

export function deleteSave() {
    localStorage.removeItem(SAVE_KEY);

    return true;
}

export function hasSave() {
    return (
        localStorage.getItem(SAVE_KEY) !== null
    );
}

export function getSaveInfo() {
    const save = loadGame();

    if (!save) {
        return null;
    }

    return {
        version: save.version,
        savedAt: save.savedAt
    };
}
