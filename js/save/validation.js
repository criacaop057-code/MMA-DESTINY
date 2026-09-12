export function validateSave(save) {
    const errors = [];

    if (!save) {
        errors.push(
            "Save inexistente."
        );

        return {
            valid: false,
            errors
        };
    }

    if (!save.state) {
        errors.push(
            "Estado do jogo ausente."
        );
    }

    if (!save.version) {
        errors.push(
            "Versão do save ausente."
        );
    }

    if (!save.savedAt) {
        errors.push(
            "Data do save ausente."
        );
    }

    if (
        save.state &&
        typeof save.state !== "object"
    ) {
        errors.push(
            "Estado do jogo inválido."
        );
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

export function validateGameState(state) {
    const errors = [];

    if (!state) {
        errors.push(
            "Estado não encontrado."
        );

        return {
            valid: false,
            errors
        };
    }

    const requiredSystems = [
        "meta",
        "calendar",
        "player",
        "world",
        "career",
        "training",
        "finance",
        "life",
        "academy",
        "media",
        "dynasty",
        "engine"
    ];

    requiredSystems.forEach(system => {
        if (
            state[system] === undefined ||
            state[system] === null
        ) {
            errors.push(
                `Sistema ausente: ${system}`
            );
        }
    });

    if (
        state.calendar &&
        typeof state.calendar !== "object"
    ) {
        errors.push(
            "Calendário inválido."
        );
    }

    if (
        state.player &&
        typeof state.player !== "object"
    ) {
        errors.push(
            "Jogador inválido."
        );
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

export function repairState(state) {
    if (!state) {
        return null;
    }

    const repaired =
        structuredClone(state);

    if (!repaired.eventQueue) {
        repaired.eventQueue = [];
    }

    if (!repaired.saves) {
        repaired.saves = {
            lastSave: null,
            autosave: true
        };
    }

    if (!repaired.world) {
        repaired.world = {};
    }

    if (!repaired.life) {
        repaired.life = {};
    }

    if (!repaired.academy) {
        repaired.academy = {};
    }

    if (!repaired.media) {
        repaired.media = {};
    }

    if (!repaired.dynasty) {
        repaired.dynasty = {};
    }

    return repaired;
}
