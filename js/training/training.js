import { updateState } from "../core/state.js";
import { applyFatigue } from "../player/health.js";
import { developAttribute } from "../player/development.js";
import { recalculatePlayer } from "../player/player.js";

export const TRAINING_TYPES = {
    STRIKING_OFFENSE: "striking_offense",
    STRIKING_DEFENSE: "striking_defense",
    WRESTLING_OFFENSE: "wrestling_offense",
    WRESTLING_DEFENSE: "takedown_defense",
    BJJ_OFFENSE: "bjj_offense",
    GRAPPLING: "grappling",
    CARDIO: "cardio",
    STRENGTH: "strength",
    SPEED: "speed",
    FIGHT_IQ: "fight_iq",
    MENTAL: "mental",
    DISCIPLINE: "discipline"
};

const TRAINING_EFFECTS = {

    striking_offense: {
        attributes: ["striking"],
        fatigue: 7
    },

    striking_defense: {
        attributes: ["strikingDefense"],
        fatigue: 7
    },

    wrestling_offense: {
        attributes: ["wrestling"],
        fatigue: 8
    },

    takedown_defense: {
        attributes: ["takedownDefense"],
        fatigue: 8
    },

    bjj_offense: {
        attributes: ["bjj", "grappling"],
        fatigue: 8
    },

    grappling: {
        attributes: ["grappling", "bjj"],
        fatigue: 8
    },

    cardio: {
        attributes: ["cardio"],
        fatigue: 6
    },

    strength: {
        attributes: ["strength"],
        fatigue: 9
    },

    speed: {
        attributes: ["speed"],
        fatigue: 6
    },

    fight_iq: {
        attributes: ["fightIQ"],
        fatigue: 4
    },

    mental: {
        attributes: ["mental", "confidence"],
        fatigue: 3
    },

    discipline: {
        attributes: ["discipline"],
        fatigue: 2
    }
};

export function performTraining(
    trainingType,
    intensity = 1
) {

    let result = null;

    updateState(state => {

        const player = state.player;

        if (!player) {
            throw new Error(
                "Não existe lutador criado."
            );
        }

        const effect =
            TRAINING_EFFECTS[trainingType];

        if (!effect) {
            throw new Error(
                `Treino desconhecido: ${trainingType}`
            );
        }

        const safeIntensity =
            Math.max(
                0.5,
                Math.min(2, intensity)
            );

        const fatigue =
            effect.fatigue *
            safeIntensity;

        applyFatigue(
            player,
            fatigue
        );

        const developed = [];

        for (const attribute of effect.attributes) {

            const success =
                developAttribute(
                    player,
                    attribute,
                    safeIntensity
                );

            if (success) {
                developed.push(attribute);
            }
        }

        recalculatePlayer(player);

        const session = {

            type: trainingType,

            intensity:
                safeIntensity,

            fatigue,

            developed,

            week:
                state.calendar.week,

            date:
                new Date().toISOString()
        };

        state.training.sessions.push(session);

        state.training.weeklyLoad +=
            fatigue;

        result = session;
    });

    return result;
}

export function clearWeeklyTraining() {

    updateState(state => {

        state.training.weeklyLoad = 0;

        state.training.sessions = [];
    });
}

export function getTrainingEffect(type) {
    return TRAINING_EFFECTS[type] ?? null;
}
