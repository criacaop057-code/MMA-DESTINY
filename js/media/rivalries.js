import { createId } from "../core/ids.js";

const RIVALRY_STAGES = {
    NONE: "none",
    TENSION: "tension",
    RIVALRY: "rivalry",
    HEATED: "heated",
    ICONIC: "iconic"
};

function createRivalry(
    fighterAId,
    fighterBId,
    reason = "competition"
) {
    return {
        id: createId("rivalry"),

        fighterAId,
        fighterBId,

        reason,

        intensity: 10,

        stage: RIVALRY_STAGES.TENSION,

        encounters: [],

        wins: {
            [fighterAId]: 0,
            [fighterBId]: 0
        },

        mediaHeat: 0,
        fanInterest: 0,

        active: true,

        createdAt: new Date().toISOString(),
        lastActivity: null
    };
}

function getRivalryStage(intensity) {
    if (intensity >= 90) {
        return RIVALRY_STAGES.ICONIC;
    }

    if (intensity >= 70) {
        return RIVALRY_STAGES.HEATED;
    }

    if (intensity >= 40) {
        return RIVALRY_STAGES.RIVALRY;
    }

    if (intensity >= 15) {
        return RIVALRY_STAGES.TENSION;
    }

    return RIVALRY_STAGES.NONE;
}

function increaseRivalry(
    rivalry,
    amount,
    reason = null
) {
    if (!rivalry) return null;

    rivalry.intensity =
        Math.max(
            0,
            Math.min(
                100,
                rivalry.intensity + amount
            )
        );

    if (reason) {
        rivalry.reason = reason;
    }

    rivalry.stage =
        getRivalryStage(
            rivalry.intensity
        );

    rivalry.lastActivity =
        new Date().toISOString();

    return rivalry;
}

function recordEncounter(
    rivalry,
    fightId,
    winnerId = null
) {
    if (!rivalry) return null;

    rivalry.encounters.push({
        fightId,
        winnerId,
        date: new Date().toISOString()
    });

    if (
        winnerId === rivalry.fighterAId ||
        winnerId === rivalry.fighterBId
    ) {
        rivalry.wins[winnerId]++;
    }

    increaseRivalry(
        rivalry,
        5
    );

    return rivalry;
}

function addMediaHeat(
    rivalry,
    amount
) {
    if (!rivalry) return null;

    rivalry.mediaHeat =
        Math.max(
            0,
            Math.min(
                100,
                rivalry.mediaHeat + amount
            )
        );

    increaseRivalry(
        rivalry,
        Math.floor(amount / 2)
    );

    return rivalry;
}

function addFanInterest(
    rivalry,
    amount
) {
    if (!rivalry) return null;

    rivalry.fanInterest =
        Math.max(
            0,
            Math.min(
                100,
                rivalry.fanInterest + amount
            )
        );

    return rivalry;
}

function findRivalry(
    rivalries,
    fighterAId,
    fighterBId
) {
    if (!Array.isArray(rivalries)) {
        return null;
    }

    return (
        rivalries.find(rivalry =>
            (
                rivalry.fighterAId === fighterAId &&
                rivalry.fighterBId === fighterBId
            ) ||
            (
                rivalry.fighterAId === fighterBId &&
                rivalry.fighterBId === fighterAId
            )
        ) || null
    );
}

function getActiveRivalries(rivalries) {
    if (!Array.isArray(rivalries)) {
        return [];
    }

    return rivalries.filter(
        rivalry => rivalry.active
    );
}

function processWeeklyRivalries(rivalries) {
    if (!Array.isArray(rivalries)) {
        return [];
    }

    for (const rivalry of rivalries) {
        if (!rivalry.active) continue;

        // Rivalidades esfriam lentamente quando não há atividade.
        rivalry.mediaHeat =
            Math.max(
                0,
                rivalry.mediaHeat - 1
            );

        rivalry.fanInterest =
            Math.max(
                0,
                rivalry.fanInterest - 0.5
            );

        if (
            rivalry.intensity > 0 &&
            rivalry.mediaHeat === 0
        ) {
            rivalry.intensity =
                Math.max(
                    0,
                    rivalry.intensity - 0.25
                );

            rivalry.stage =
                getRivalryStage(
                    rivalry.intensity
                );
        }

        if (rivalry.intensity <= 0) {
            rivalry.active = false;
            rivalry.stage =
                RIVALRY_STAGES.NONE;
        }
    }

    return rivalries;
}

export {
    RIVALRY_STAGES,
    createRivalry,
    getRivalryStage,
    increaseRivalry,
    recordEncounter,
    addMediaHeat,
    addFanInterest,
    findRivalry,
    getActiveRivalries,
    processWeeklyRivalries
};
