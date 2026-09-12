import { getState } from "../core/state.js";
import { AGE } from "../core/constants.js";

export function validateState(state = getState()) {
    const errors = [];
    const warnings = [];

    if (!state) {
        errors.push("Estado inexistente.");
        return { valid: false, errors, warnings };
    }

    if (!state.meta) {
        errors.push("Meta ausente.");
    }

    if (!state.calendar) {
        errors.push("Calendário ausente.");
    }

    if (!state.world) {
        errors.push("Mundo ausente.");
    }

    if (!state.player && state.meta?.gamePhase === "playing") {
        errors.push("Jogo iniciado sem jogador.");
    }

    if (state.player) {
        if (
            typeof state.player.age === "number" &&
            (
                state.player.age < AGE.MIN_START ||
                state.player.age > AGE.MAX
            )
        ) {
            errors.push("Idade do jogador inválida.");
        }

        if (
            state.player.attributes &&
            typeof state.player.attributes !== "object"
        ) {
            errors.push("Atributos do jogador inválidos.");
        }
    }

    if (
        state.calendar &&
        (
            state.calendar.month < 0 ||
            state.calendar.month > 11
        )
    ) {
        errors.push("Mês do calendário inválido.");
    }

    if (
        state.calendar &&
        (
            state.calendar.day < 1 ||
            state.calendar.day > 31
        )
    ) {
        errors.push("Dia do calendário inválido.");
    }

    if (state.finance?.balances) {
        for (const [currency, value] of Object.entries(
            state.finance.balances
        )) {
            if (typeof value !== "number" || Number.isNaN(value)) {
                errors.push(
                    `Saldo inválido na moeda ${currency}.`
                );
            }
        }
    }

    if (state.engine?.errors?.length > 50) {
        warnings.push("Grande quantidade de erros acumulados.");
    }

    return {
        valid: errors.length === 0,
        errors,
        warnings
    };
}

export function assertValidState(state = getState()) {
    const result = validateState(state);

    if (!result.valid) {
        throw new Error(
            `Estado inválido: ${result.errors.join(" | ")}`
        );
    }

    return true;
}
