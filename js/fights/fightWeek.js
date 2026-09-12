import {
    FIGHT_STATUS,
    setFightStatus
} from "./fight.js";

import {
    simulateFight
} from "./simulation.js";

import {
    createWeighIn,
    performWeighIn,
    performSecondWeighIn,
    evaluateFightWeighIns,
    isFightAllowed
} from "./weighin.js";

import {
    advanceCampWeek,
    finishCamp
} from "../training/camp.js";

import {
    getState
} from "../core/state.js";

/*
|--------------------------------------------------------------------------
| MMA DESTINY — FIGHT WEEK
|--------------------------------------------------------------------------
|
| Fluxo oficial:
|
| CAMP
|   ↓
| FIGHT WEEK
|   ↓
| WEIGHT CUT
|   ↓
| WEIGH-IN
|   ↓
| FACE OFF
|   ↓
| FIGHT
|   ↓
| RESULT
|   ↓
| POST-FIGHT
|
| Este módulo coordena os sistemas.
| Ele não substitui Engine, Clock ou State.
|--------------------------------------------------------------------------
*/

export const FIGHT_WEEK_PHASES = {
    CAMP: "camp",
    WEIGHT_CUT: "weight_cut",
    WEIGH_IN: "weigh_in",
    FACE_OFF: "face_off",
    FIGHT: "fight",
    POST_FIGHT: "post_fight",
    COMPLETE: "complete",
    CANCELLED: "cancelled"
};

/*
|--------------------------------------------------------------------------
| CRIAR SEMANA DA LUTA
|--------------------------------------------------------------------------
*/

export function createFightWeek(
    fight,
    fighterA,
    fighterB,
    options = {}
) {
    if (!fight) {
        throw new Error(
            "Luta inválida."
        );
    }

    if (!fighterA || !fighterB) {
        throw new Error(
            "Os dois lutadores são obrigatórios."
        );
    }

    const state = getState();

    const fightWeek = {
        id: `fightweek_${fight.id}`,

        fightId: fight.id,

        fighterA: fighterA.id,
        fighterB: fighterB.id,

        phase:
            FIGHT_WEEK_PHASES.CAMP,

        week: 0,

        totalWeeks:
            options.totalWeeks || 8,

        weighIn: {
            fighterA: null,
            fighterB: null,
            completed: false,
            result: null
        },

        faceOff: {
            completed: false,
            tension: 0,
            staredown: false
        },

        fight: {
            completed: false,
            result: null
        },

        postFight: {
            completed: false,
            processed: false
        },

        createdAt:
            state.calendar?.currentDate ||
            null,

        completedAt: null
    };

    setFightStatus(
        fight,
        FIGHT_STATUS.CAMP
    );

    return fightWeek;
}

/*
|--------------------------------------------------------------------------
| AVANÇAR SEMANA DO CAMP
|--------------------------------------------------------------------------
*/

export function advanceFightWeek(
    fightWeek,
    fight,
    fighterA,
    fighterB
) {
    if (!fightWeek) {
        throw new Error(
            "Fight week inválida."
        );
    }

    if (
        fightWeek.phase !==
        FIGHT_WEEK_PHASES.CAMP
    ) {
        return fightWeek;
    }

    fightWeek.week++;

    /*
    O sistema de treinamento continua
    sendo responsável pelo desenvolvimento.
    Aqui apenas avançamos o camp.
    */

    if (
        fightWeek.week >=
        fightWeek.totalWeeks
    ) {
        finishCamp();

        fightWeek.phase =
            FIGHT_WEEK_PHASES.WEIGHT_CUT;

        setFightStatus(
            fight,
            FIGHT_STATUS.WEIGH_IN
        );
    }

    return fightWeek;
}

/*
|--------------------------------------------------------------------------
| INICIAR CORTE DE PESO
|--------------------------------------------------------------------------
*/

export function startWeightCut(
    fightWeek,
    fighterA,
    fighterB
) {
    if (
        fightWeek.phase !==
        FIGHT_WEEK_PHASES.WEIGHT_CUT
    ) {
        throw new Error(
            "A luta ainda não está na fase de corte de peso."
        );
    }

    fightWeek.phase =
        FIGHT_WEEK_PHASES.WEIGH_IN;

    fightWeek.weighIn.fighterA =
        createWeighIn(
            {
                ...getFightFromWeek(
                    fightWeek
                )
            },
            fighterA
        );

    fightWeek.weighIn.fighterB =
        createWeighIn(
            {
                ...getFightFromWeek(
                    fightWeek
                )
            },
            fighterB
        );

    return fightWeek;
}

/*
|--------------------------------------------------------------------------
| PESAGEM
|--------------------------------------------------------------------------
*/

export function weighFighter(
    fightWeek,
    fighterSide,
    actualWeight
) {
    if (
        fightWeek.phase !==
        FIGHT_WEEK_PHASES.WEIGH_IN
    ) {
        throw new Error(
            "Não é dia de pesagem."
        );
    }

    const key =
        normalizeFighterSide(
            fighterSide
        );

    const weighIn =
        fightWeek.weighIn[key];

    if (!weighIn) {
        throw new Error(
            "Pesagem não encontrada."
        );
    }

    performWeighIn(
        weighIn,
        actualWeight
    );

    updateWeighInCompletion(
        fightWeek
    );

    return fightWeek;
}

/*
|--------------------------------------------------------------------------
| SEGUNDA PESAGEM
|--------------------------------------------------------------------------
*/

export function secondWeighFighter(
    fightWeek,
    fighterSide,
    actualWeight
) {
    const key =
        normalizeFighterSide(
            fighterSide
        );

    const weighIn =
        fightWeek.weighIn[key];

    if (!weighIn) {
        throw new Error(
            "Pesagem não encontrada."
        );
    }

    performSecondWeighIn(
        weighIn,
        actualWeight
    );

    updateWeighInCompletion(
        fightWeek
    );

    return fightWeek;
}

/*
|--------------------------------------------------------------------------
| CONCLUIR PESAGEM
|--------------------------------------------------------------------------
*/

function updateWeighInCompletion(
    fightWeek
) {
    const weighInA =
        fightWeek.weighIn.fighterA;

    const weighInB =
        fightWeek.weighIn.fighterB;

    if (
        !weighInA.completed ||
        !weighInB.completed
    ) {
        return;
    }

    const result =
        evaluateFightWeighIns(
            weighInA,
            weighInB
        );

    fightWeek.weighIn.result =
        result;

    fightWeek.weighIn.completed =
        true;

    /*
    Se a luta não puder acontecer,
    ela é cancelada antes do face off.
    */

    if (
        !result.fightAllowed
    ) {
        fightWeek.phase =
            FIGHT_WEEK_PHASES.CANCELLED;

        return;
    }

    fightWeek.phase =
        FIGHT_WEEK_PHASES.FACE_OFF;
}

/*
|--------------------------------------------------------------------------
| FACE OFF
|--------------------------------------------------------------------------
*/

export function completeFaceOff(
    fightWeek,
    tension = null
) {
    if (
        fightWeek.phase !==
        FIGHT_WEEK_PHASES.FACE_OFF
    ) {
        throw new Error(
            "O face off não está disponível."
        );
    }

    fightWeek.faceOff.completed =
        true;

    fightWeek.faceOff.staredown =
        true;

    fightWeek.faceOff.tension =
        tension !== null
            ? clamp(tension, 0, 100)
            : generateFaceOffTension();

    fightWeek.phase =
        FIGHT_WEEK_PHASES.FIGHT;

    return fightWeek;
}

/*
|--------------------------------------------------------------------------
| INICIAR LUTA
|--------------------------------------------------------------------------
*/

export function startFight(
    fightWeek,
    fight
) {
    if (
        fightWeek.phase !==
        FIGHT_WEEK_PHASES.FIGHT
    ) {
        throw new Error(
            "A luta ainda não está liberada."
        );
    }

    if (
        !fightWeek.faceOff.completed
    ) {
        throw new Error(
            "O face off precisa ser concluído antes da luta."
        );
    }

    if (
        !fightWeek.weighIn.completed
    ) {
        throw new Error(
            "A pesagem ainda não foi concluída."
        );
    }

    if (
        !fightWeek.weighIn.result
            ?.fightAllowed
    ) {
        throw new Error(
            "A luta não está autorizada."
        );
    }

    setFightStatus(
        fight,
        FIGHT_STATUS.LIVE
    );

    return fight;
}

/*
|--------------------------------------------------------------------------
| SIMULAR LUTA
|--------------------------------------------------------------------------
*/

export function executeFight(
    fightWeek,
    fight,
    fighterA,
    fighterB
) {
    if (
        fightWeek.phase !==
        FIGHT_WEEK_PHASES.FIGHT
    ) {
        throw new Error(
            "A luta não está na fase correta."
        );
    }

    if (
        fight.status !==
        FIGHT_STATUS.LIVE
    ) {
        throw new Error(
            "A luta ainda não foi iniciada."
        );
    }

    const result =
        simulateFight(
            fight,
            fighterA,
            fighterB
        );

    fightWeek.fight.completed =
        true;

    fightWeek.fight.result =
        result;

    fightWeek.phase =
        FIGHT_WEEK_PHASES.POST_FIGHT;

    return result;
}

/*
|--------------------------------------------------------------------------
| PÓS-LUTA
|--------------------------------------------------------------------------
*/

export function processPostFight(
    fightWeek,
    fighterA,
    fighterB
) {
    if (
        fightWeek.phase !==
        FIGHT_WEEK_PHASES.POST_FIGHT
    ) {
        throw new Error(
            "A luta ainda não terminou."
        );
    }

    const result =
        fightWeek.fight.result;

    if (!result) {
        throw new Error(
            "Resultado da luta não encontrado."
        );
    }

    applyCareerResult(
        fighterA,
        fighterB,
        result
    );

    applyFightHealth(
        fighterA,
        fighterB,
        result
    );

    fightWeek.postFight.completed =
        true;

    fightWeek.postFight.processed =
        true;

    fightWeek.phase =
        FIGHT_WEEK_PHASES.COMPLETE;

    fightWeek.completedAt =
        getState().calendar?.currentDate ||
        null;

    return fightWeek;
}

/*
|--------------------------------------------------------------------------
| ATUALIZAR CARREIRA
|--------------------------------------------------------------------------
*/

function applyCareerResult(
    fighterA,
    fighterB,
    result
) {
    if (!fighterA.career) {
        fighterA.career = {};
    }

    if (!fighterB.career) {
        fighterB.career = {};
    }

    if (!Array.isArray(
        fighterA.career.fights
    )) {
        fighterA.career.fights = [];
    }

    if (!Array.isArray(
        fighterB.career.fights
    )) {
        fighterB.career.fights = [];
    }

    const fight =
        result.fight;

    /*
    O resultado oficial já foi registrado
    dentro do objeto fight.
    */

    const winnerId =
        fight?.result?.winnerId ||
        result.result?.winnerId;

    const loserId =
        fight?.result?.loserId ||
        result.result?.loserId;

    /*
    Para o histórico individual,
    registramos apenas informações necessárias.
    */

    fighterA.career.fights.push({
        fightId:
            fight?.id || null,

        opponentId:
            fighterB.id,

        result:
            fight?.result?.resultA ||
            null,

        method:
            fight?.result?.method ||
            null,

        round:
            fight?.result?.round ||
            null,

        time:
            fight?.result?.time ||
            null,

        winnerId,

        loserId
    });

    fighterB.career.fights.push({
        fightId:
            fight?.id || null,

        opponentId:
            fighterA.id,

        result:
            fight?.result?.resultB ||
            null,

        method:
            fight?.result?.method ||
            null,

        round:
            fight?.result?.round ||
            null,

        time:
            fight?.result?.time ||
            null,

        winnerId,

        loserId
    });

    updateRecord(
        fighterA,
        fight?.result?.resultA
    );

    updateRecord(
        fighterB,
        fight?.result?.resultB
    );
}

/*
|--------------------------------------------------------------------------
| CARTEL
|--------------------------------------------------------------------------
*/

function updateRecord(
    fighter,
    result
) {
    if (!fighter.career.record) {
        fighter.career.record = {
            wins: 0,
            losses: 0,
            draws: 0,
            noContests: 0
        };
    }

    const record =
        fighter.career.record;

    if (result === "win") {
        record.wins++;
    } else if (result === "loss") {
        record.losses++;
    } else if (result === "draw") {
        record.draws++;
    } else if (
        result === "no_contest"
    ) {
        record.noContests++;
    }

    /*
    Total de lutas.
    */

    fighter.career.totalFights =
        record.wins +
        record.losses +
        record.draws +
        record.noContests;

    /*
    Sequência.
    */

    if (result === "win") {
        fighter.career.winStreak =
            (fighter.career.winStreak || 0) + 1;

        fighter.career.losingStreak = 0;
    } else if (result === "loss") {
        fighter.career.losingStreak =
            (fighter.career.losingStreak || 0) + 1;

        fighter.career.winStreak = 0;
    } else {
        fighter.career.winStreak = 0;
        fighter.career.losingStreak = 0;
    }
}

/*
|--------------------------------------------------------------------------
| SAÚDE PÓS-LUTA
|--------------------------------------------------------------------------
*/

function applyFightHealth(
    fighterA,
    fighterB,
    result
) {
    applyDamage(
        fighterA,
        result.statistics?.fighterA
    );

    applyDamage(
        fighterB,
        result.statistics?.fighterB
    );
}

function applyDamage(
    fighter,
    statistics
) {
    if (!fighter.health) {
        fighter.health = {};
    }

    const damage =
        statistics?.damage || 0;

    const knockdowns =
        statistics?.knockdowns || 0;

    const healthLoss =
        damage * 0.35 +
        knockdowns * 8;

    fighter.health.current =
        clamp(
            (
                fighter.health.current ??
                100
            ) - healthLoss,
            1,
            100
        );

    fighter.health.fatigue =
        clamp(
            (
                fighter.health.fatigue ??
                0
            ) + 20 + damage * 0.20,
            0,
            100
        );

    /*
    O jogo poderá gerar lesões específicas
    futuramente com base no tipo de dano.
    */
}

/*
|--------------------------------------------------------------------------
| CANCELAMENTO
|--------------------------------------------------------------------------
*/

export function cancelFightWeek(
    fightWeek,
    fight,
    reason = "unknown"
) {
    fightWeek.phase =
        FIGHT_WEEK_PHASES.CANCELLED;

    fightWeek.cancellationReason =
        reason;

    setFightStatus(
        fight,
        FIGHT_STATUS.CANCELLED
    );

    return fightWeek;
}

/*
|--------------------------------------------------------------------------
| STATUS
|--------------------------------------------------------------------------
*/

export function getFightWeekStatus(
    fightWeek
) {
    return {
        phase:
            fightWeek.phase,

        week:
            fightWeek.week,

        totalWeeks:
            fightWeek.totalWeeks,

        weighInCompleted:
            fightWeek.weighIn.completed,

        faceOffCompleted:
            fightWeek.faceOff.completed,

        fightCompleted:
            fightWeek.fight.completed,

        postFightCompleted:
            fightWeek.postFight.completed
    };
}

/*
|--------------------------------------------------------------------------
| RECUPERAR LUTA
|--------------------------------------------------------------------------
*/

function getFightFromWeek(
    fightWeek
) {
    const state = getState();

    const fights =
        state.world?.fights ||
        state.career?.fights ||
        [];

    return (
        fights.find(
            fight =>
                fight.id ===
                fightWeek.fightId
        ) || {
            id:
                fightWeek.fightId,

            weightClass:
                null,

            title:
                false
        }
    );
}

/*
|--------------------------------------------------------------------------
| NORMALIZAR LADO
|--------------------------------------------------------------------------
*/

function normalizeFighterSide(
    side
) {
    if (
        side === "A" ||
        side === "a" ||
        side === "fighterA"
    ) {
        return "fighterA";
    }

    if (
        side === "B" ||
        side === "b" ||
        side === "fighterB"
    ) {
        return "fighterB";
    }

    throw new Error(
        "Lado do lutador inválido."
    );
}

/*
|--------------------------------------------------------------------------
| TENSÃO DO FACE OFF
|--------------------------------------------------------------------------
*/

function generateFaceOffTension() {
    return Math.round(
        Math.random() * 100
    );
}

/*
|--------------------------------------------------------------------------
| UTILITÁRIO
|--------------------------------------------------------------------------
*/

function clamp(
    value,
    min,
    max
) {
    return Math.min(
        max,
        Math.max(min, value)
    );
}
