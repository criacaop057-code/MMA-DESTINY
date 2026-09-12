import { updateState, getState } from "../core/state.js";
import { ID } from "../core/ids.js";

export const CAMP_PHASES = {
    PLANNING: "planning",
    BUILD: "build",
    INTENSIFICATION: "intensification",
    PEAK: "peak",
    WEIGHT_CUT: "weight_cut",
    FIGHT_WEEK: "fight_week",
    COMPLETE: "complete"
};

export function createCamp({
    fightId = null,
    durationWeeks = 8
} = {}) {

    const camp = {

        id: ID.event(),

        fightId,

        durationWeeks,

        currentWeek: 0,

        phase:
            CAMP_PHASES.PLANNING,

        objectives: {

            striking: 0,

            wrestling: 0,

            grappling: 0,

            cardio: 0,

            strength: 0,

            weight: 0,

            recovery: 0
        },

        opponentAnalysis: null,

        startedAt:
            new Date().toISOString()
    };

    updateState(state => {

        state.training.camp =
            camp;
    });

    return camp;
}

export function advanceCampWeek() {

    let result = null;

    updateState(state => {

        const camp =
            state.training.camp;

        if (!camp) {
            result = null;
            return;
        }

        camp.currentWeek++;

        camp.phase =
            calculateCampPhase(
                camp.currentWeek,
                camp.durationWeeks
            );

        result = {
            week: camp.currentWeek,
            phase: camp.phase,
            remaining:
                Math.max(
                    0,
                    camp.durationWeeks -
                    camp.currentWeek
                )
        };
    });

    return result;
}

function calculateCampPhase(
    week,
    duration
) {

    if (week <= 1) {
        return CAMP_PHASES.PLANNING;
    }

    if (week <= duration * 0.4) {
        return CAMP_PHASES.BUILD;
    }

    if (week <= duration * 0.65) {
        return CAMP_PHASES.INTENSIFICATION;
    }

    if (week <= duration * 0.8) {
        return CAMP_PHASES.PEAK;
    }

    if (week < duration) {
        return CAMP_PHASES.WEIGHT_CUT;
    }

    if (week === duration) {
        return CAMP_PHASES.FIGHT_WEEK;
    }

    return CAMP_PHASES.COMPLETE;
}

export function finishCamp() {

    updateState(state => {

        if (!state.training.camp) {
            return;
        }

        state.training.camp.phase =
            CAMP_PHASES.COMPLETE;
    });

    return getState().training.camp;
}

export function getCurrentCamp() {

    return getState().training.camp;
}
