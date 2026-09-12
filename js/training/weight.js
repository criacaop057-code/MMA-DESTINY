import { updateState } from "../core/state.js";

const WEIGHT_CLASS_LIMITS = {

    "Peso Mosca": {
        limit: 56.7
    },

    "Peso Galo": {
        limit: 61.2
    },

    "Peso Pena": {
        limit: 65.8
    },

    "Peso Leve": {
        limit: 70.3
    },

    "Peso Meio-Médio": {
        limit: 77.1
    },

    "Peso Médio": {
        limit: 83.9
    },

    "Peso Meio-Pesado": {
        limit: 93.0
    },

    "Peso Pesado": {
        limit: 120.2
    },

    "Peso Superpesado": {
        limit: 150
    }
};

export function getWeightLimit(weightClass) {

    return (
        WEIGHT_CLASS_LIMITS[weightClass]?.limit
        ?? null
    );
}

export function setPlayerWeight(weight) {

    updateState(state => {

        if (!state.player) {
            throw new Error(
                "Lutador não encontrado."
            );
        }

        if (
            typeof weight !== "number" ||
            weight <= 0
        ) {
            throw new Error(
                "Peso inválido."
            );
        }

        state.player.currentWeight =
            Number(weight.toFixed(2));
    });

    return getCurrentWeight();
}

export function getCurrentWeight() {

    let weight = null;

    updateState(state => {

        weight =
            state.player?.currentWeight
            ?? null;
    });

    return weight;
}

export function getWeightStatus() {

    let result = null;

    updateState(state => {

        const player = state.player;

        if (!player) {
            result = null;
            return;
        }

        const limit =
            getWeightLimit(
                player.weightClass
            );

        const current =
            player.currentWeight;

        if (!limit) {
            result = {
                current,
                limit: null,
                difference: null,
                status: "unknown"
            };

            return;
        }

        const difference =
            Number(
                (current - limit)
                .toFixed(2)
            );

        let status = "on_weight";

        if (difference > 0) {
            status = "above_limit";
        }

        result = {
            current,
            limit,
            difference,
            status
        };
    });

    return result;
}

export function adjustWeight(
    kilograms
) {

    updateState(state => {

        if (!state.player) {
            return;
        }

        state.player.currentWeight =
            Number(
                Math.max(
                    1,
                    state.player.currentWeight +
                    kilograms
                ).toFixed(2)
            );
    });

    return getCurrentWeight();
}
