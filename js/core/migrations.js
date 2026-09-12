import { GAME_VERSION } from "./constants.js";
import { createInitialState } from "./state.js";

export function migrateState(oldState) {
    if (!oldState) {
        return createInitialState();
    }

    const state = structuredClone(oldState);

    if (!state.meta) {
        state.meta = {};
    }

    if (!state.meta.version) {
        state.meta.version = "0.0.0";
    }

    /*
     * Futuras migrações entrarão aqui.
     *
     * Exemplo:
     *
     * if (state.meta.version === "0.1.0") {
     *     ...
     *     state.meta.version = "0.2.0";
     * }
     */

    state.meta.version = GAME_VERSION;

    return state;
}
