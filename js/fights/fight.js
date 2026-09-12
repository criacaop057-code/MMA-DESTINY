import { createId } from "../core/ids.js";
import { getState } from "../core/state.js";

export const FIGHT_STATUS = {
    SCHEDULED: "scheduled",
    CAMP: "camp",
    WEIGH_IN: "weigh_in",
    READY: "ready",
    LIVE: "live",
    FINISHED: "finished",
    CANCELLED: "cancelled"
};

export const FIGHT_RESULTS = {
    WIN: "win",
    LOSS: "loss",
    DRAW: "draw",
    NO_CONTEST: "no_contest"
};

export const FIGHT_METHODS = {
    KO: "KO",
    TKO: "TKO",
    SUBMISSION: "SUBMISSION",
    DECISION_UNANIMOUS: "UNANIMOUS_DECISION",
    DECISION_SPLIT: "SPLIT_DECISION",
    DECISION_MAJORITY: "MAJORITY_DECISION",
    DOCTOR_STOPPAGE: "DOCTOR_STOPPAGE",
    DQ: "DISQUALIFICATION",
    TECHNICAL_DECISION: "TECHNICAL_DECISION",
    DRAW: "DRAW",
    NO_CONTEST: "NO_CONTEST"
};

export function createFight({
    fighterA,
    fighterB,
    organizationId = null,
    eventId = null,
    date = null,
    weightClass = null,
    rounds = 3,
    title = false,
    titleName = null,
    status = FIGHT_STATUS.SCHEDULED
}) {
    if (!fighterA || !fighterB) {
        throw new Error("Uma luta precisa de dois lutadores.");
    }

    if (fighterA.id === fighterB.id) {
        throw new Error("Um lutador não pode enfrentar a si mesmo.");
    }

    const state = getState();

    const fight = {
        id: createId("fight"),

        fighterA: fighterA.id,
        fighterB: fighterB.id,

        organizationId,
        eventId,
        date,

        weightClass: weightClass || fighterA.weightClass,

        rounds,
        title,
        titleName,

        status,

        result: {
            winnerId: null,
            loserId: null,
            resultA: null,
            resultB: null,

            method: null,
            round: null,
            time: null,

            official: false
        },

        statistics: {
            fighterA: createEmptyStats(),
            fighterB: createEmptyStats()
        },

        performance: {
            fighterA: 0,
            fighterB: 0
        },

        createdAt: state.calendar?.currentDate || null,
        finishedAt: null
    };

    return fight;
}

function createEmptyStats() {
    return {
        significantStrikes: 0,
        totalStrikes: 0,
        takedowns: 0,
        takedownAttempts: 0,
        takedownDefense: 0,
        submissions: 0,
        knockdowns: 0,
        controlTime: 0,
        damage: 0
    };
}

export function setFightStatus(fight, status) {
    if (!fight) {
        throw new Error("Luta inválida.");
    }

    fight.status = status;

    return fight;
}

export function recordFightResult(
    fight,
    {
        winnerId = null,
        loserId = null,
        resultA,
        resultB,
        method,
        round,
        time,
        statistics = null,
        performance = null
    }
) {
    if (!fight) {
        throw new Error("Luta inválida.");
    }

    fight.result = {
        winnerId,
        loserId,
        resultA,
        resultB,
        method,
        round,
        time,
        official: true
    };

    if (statistics) {
        fight.statistics = statistics;
    }

    if (performance) {
        fight.performance = performance;
    }

    fight.status = FIGHT_STATUS.FINISHED;

    const state = getState();

    fight.finishedAt = state.calendar?.currentDate || null;

    return fight;
}

export function isFightFinished(fight) {
    return fight?.status === FIGHT_STATUS.FINISHED;
}

export function isTitleFight(fight) {
    return Boolean(fight?.title);
}

export function getFightWinner(fight) {
    if (!fight?.result?.winnerId) {
        return null;
    }

    return fight.result.winnerId;
}

export function getFightLoser(fight) {
    if (!fight?.result?.loserId) {
        return null;
    }

    return fight.result.loserId;
}

export function getFightParticipantIds(fight) {
    if (!fight) {
        return [];
    }

    return [
        fight.fighterA,
        fight.fighterB
    ].filter(Boolean);
}
