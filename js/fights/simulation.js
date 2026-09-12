import { FIGHT_METHODS, FIGHT_RESULTS, recordFightResult } from "./fight.js";
import { getState } from "../core/state.js";
import { getPlayerOVR } from "../player/attributes.js";

/*
|--------------------------------------------------------------------------
| MMA DESTINY — SIMULADOR DE LUTA
|--------------------------------------------------------------------------
|
| A luta é decidida por:
| - atributos individuais
| - matchup de estilos
| - cardio
| - defesa
| - inteligência de luta
| - mental
| - confiança
| - disciplina
| - experiência
| - aleatoriedade controlada
|
| Não existe vencedor 100% garantido.
|--------------------------------------------------------------------------
*/

const STYLE_MATCHUPS = {
    striker: {
        striker: 1.00,
        wrestler: 0.92,
        grappler: 0.88,
        bjj: 0.87,
        balanced: 1.00
    },

    wrestler: {
        striker: 1.10,
        wrestler: 1.00,
        grappler: 0.96,
        bjj: 0.92,
        balanced: 1.04
    },

    grappler: {
        striker: 1.12,
        wrestler: 1.03,
        grappler: 1.00,
        bjj: 0.97,
        balanced: 1.05
    },

    bjj: {
        striker: 1.14,
        wrestler: 1.08,
        grappler: 1.03,
        bjj: 1.00,
        balanced: 1.06
    },

    balanced: {
        striker: 1.02,
        wrestler: 0.98,
        grappler: 0.97,
        bjj: 0.96,
        balanced: 1.00
    }
};

const METHOD_WEIGHTS = {
    KO: 0,
    TKO: 0,
    SUBMISSION: 0,
    DECISION_UNANIMOUS: 0,
    DECISION_SPLIT: 0,
    DECISION_MAJORITY: 0
};

export function simulateFight(fight, fighterA, fighterB) {
    if (!fight) {
        throw new Error("Luta inválida.");
    }

    if (!fighterA || !fighterB) {
        throw new Error("Os dois lutadores são obrigatórios.");
    }

    const rounds = fight.rounds || 3;

    const profileA = buildFighterProfile(fighterA);
    const profileB = buildFighterProfile(fighterB);

    let scoreA = 0;
    let scoreB = 0;

    const statistics = {
        fighterA: createStatistics(),
        fighterB: createStatistics()
    };

    let finish = null;

    for (let round = 1; round <= rounds; round++) {
        const roundResult = simulateRound(
            profileA,
            profileB,
            round,
            rounds
        );

        scoreA += roundResult.scoreA;
        scoreB += roundResult.scoreB;

        mergeStatistics(
            statistics.fighterA,
            roundResult.statsA
        );

        mergeStatistics(
            statistics.fighterB,
            roundResult.statsB
        );

        if (roundResult.finish) {
            finish = {
                ...roundResult.finish,
                round
            };

            break;
        }
    }

    const result = determineFightResult(
        fighterA,
        fighterB,
        scoreA,
        scoreB,
        finish
    );

    const performance = calculatePerformance(
        scoreA,
        scoreB,
        statistics
    );

    recordFightResult(fight, {
        winnerId: result.winnerId,
        loserId: result.loserId,
        resultA: result.resultA,
        resultB: result.resultB,
        method: result.method,
        round: result.round,
        time: result.time,
        statistics,
        performance
    });

    return {
        fight,
        result,
        statistics,
        performance,
        scores: {
            fighterA: scoreA,
            fighterB: scoreB
        }
    };
}

/*
|--------------------------------------------------------------------------
| PERFIL
|--------------------------------------------------------------------------
*/

function buildFighterProfile(fighter) {
    const attributes = fighter.attributes || {};

    const style = fighter.style || "balanced";

    return {
        fighter,

        style,

        striking: value(attributes.striking),
        wrestling: value(attributes.wrestling),
        grappling: value(attributes.grappling),
        bjj: value(attributes.bjj),

        takedownDefense: value(attributes.takedownDefense),
        strikingDefense: value(attributes.strikingDefense),

        cardio: value(attributes.cardio),
        strength: value(attributes.strength),
        speed: value(attributes.speed),
        durability: value(attributes.durability),

        fightIQ: value(attributes.fightIQ),
        discipline: value(attributes.discipline),
        confidence: value(attributes.confidence),
        mental: value(attributes.mental),

        experience: getExperience(fighter),

        ovr: safeOVR(fighter)
    };
}

/*
|--------------------------------------------------------------------------
| ROUND
|--------------------------------------------------------------------------
*/

function simulateRound(a, b, round, totalRounds) {
    const fatigueA = calculateRoundFatigue(a, round);
    const fatigueB = calculateRoundFatigue(b, round);

    const effectiveA = applyFatigue(a, fatigueA);
    const effectiveB = applyFatigue(b, fatigueB);

    const matchupA = getMatchupMultiplier(
        effectiveA.style,
        effectiveB.style
    );

    const matchupB = getMatchupMultiplier(
        effectiveB.style,
        effectiveA.style
    );

    const strikingA = calculateStrikingScore(
        effectiveA,
        effectiveB
    ) * matchupA;

    const strikingB = calculateStrikingScore(
        effectiveB,
        effectiveA
    ) * matchupB;

    const grapplingA = calculateGrapplingScore(
        effectiveA,
        effectiveB
    ) * matchupA;

    const grapplingB = calculateGrapplingScore(
        effectiveB,
        effectiveA
    ) * matchupB;

    const controlA = calculateControl(
        effectiveA,
        effectiveB
    );

    const controlB = calculateControl(
        effectiveB,
        effectiveA
    );

    const damageA = calculateDamage(
        effectiveA,
        effectiveB,
        strikingA
    );

    const damageB = calculateDamage(
        effectiveB,
        effectiveA,
        strikingB
    );

    const scoreA =
        strikingA +
        grapplingA +
        controlA +
        damageA;

    const scoreB =
        strikingB +
        grapplingB +
        controlB +
        damageB;

    const statsA = createRoundStatistics(
        effectiveA,
        effectiveB,
        strikingA,
        grapplingA,
        controlA,
        damageA
    );

    const statsB = createRoundStatistics(
        effectiveB,
        effectiveA,
        strikingB,
        grapplingB,
        controlB,
        damageB
    );

    const finish = determineFinish(
        effectiveA,
        effectiveB,
        damageA,
        damageB,
        round,
        totalRounds
    );

    return {
        scoreA,
        scoreB,
        statsA,
        statsB,
        finish
    };
}

/*
|--------------------------------------------------------------------------
| STRIKING
|--------------------------------------------------------------------------
*/

function calculateStrikingScore(attacker, defender) {
    const attack =
        attacker.striking * 0.35 +
        attacker.speed * 0.15 +
        attacker.strength * 0.10 +
        attacker.fightIQ * 0.15 +
        attacker.confidence * 0.10 +
        attacker.mental * 0.10 +
        attacker.experience * 0.05;

    const defense =
        defender.strikingDefense * 0.45 +
        defender.speed * 0.15 +
        defender.fightIQ * 0.20 +
        defender.mental * 0.10 +
        defender.durability * 0.10;

    const advantage = attack - defense * 0.45;

    return Math.max(
        0,
        advantage + randomRange(5, 18)
    );
}

/*
|--------------------------------------------------------------------------
| GRAPPLING
|--------------------------------------------------------------------------
*/

function calculateGrapplingScore(attacker, defender) {
    const wrestling =
        attacker.wrestling * 0.30 +
        attacker.grappling * 0.20 +
        attacker.bjj * 0.20 +
        attacker.strength * 0.10 +
        attacker.fightIQ * 0.10 +
        attacker.cardio * 0.05 +
        attacker.experience * 0.05;

    const defense =
        defender.takedownDefense * 0.45 +
        defender.grappling * 0.15 +
        defender.bjj * 0.10 +
        defender.strength * 0.10 +
        defender.fightIQ * 0.15 +
        defender.mental * 0.05;

    return Math.max(
        0,
        wrestling - defense * 0.40 + randomRange(4, 16)
    );
}

/*
|--------------------------------------------------------------------------
| CONTROLE
|--------------------------------------------------------------------------
*/

function calculateControl(attacker, defender) {
    const control =
        attacker.wrestling * 0.25 +
        attacker.grappling * 0.25 +
        attacker.bjj * 0.15 +
        attacker.strength * 0.10 +
        attacker.cardio * 0.10 +
        attacker.fightIQ * 0.10 +
        attacker.mental * 0.05;

    const resistance =
        defender.wrestling * 0.20 +
        defender.grappling * 0.20 +
        defender.takedownDefense * 0.25 +
        defender.strength * 0.10 +
        defender.cardio * 0.10 +
        defender.fightIQ * 0.10 +
        defender.mental * 0.05;

    return Math.max(
        0,
        control - resistance * 0.35 + randomRange(2, 10)
    );
}

/*
|--------------------------------------------------------------------------
| DANO
|--------------------------------------------------------------------------
*/

function calculateDamage(attacker, defender, strikingScore) {
    const offensivePower =
        attacker.striking * 0.30 +
        attacker.strength * 0.25 +
        attacker.speed * 0.15 +
        attacker.fightIQ * 0.10 +
        attacker.confidence * 0.10 +
        strikingScore * 0.10;

    const resistance =
        defender.durability * 0.45 +
        defender.strikingDefense * 0.20 +
        defender.mental * 0.15 +
        defender.cardio * 0.10 +
        defender.fightIQ * 0.10;

    return Math.max(
        0,
        offensivePower - resistance * 0.45 + randomRange(0, 12)
    );
}

/*
|--------------------------------------------------------------------------
| FINALIZAÇÃO
|--------------------------------------------------------------------------
*/

function determineFinish(
    a,
    b,
    damageA,
    damageB,
    round,
    totalRounds
) {
    const koChanceA = calculateKOChance(
        a,
        b,
        damageA
    );

    const koChanceB = calculateKOChance(
        b,
        a,
        damageB
    );

    const subChanceA = calculateSubmissionChance(
        a,
        b
    );

    const subChanceB = calculateSubmissionChance(
        b,
        a
    );

    if (randomPercent() < koChanceA) {
        return {
            winnerId: a.fighter.id,
            method: randomChance(0.55)
                ? FIGHT_METHODS.KO
                : FIGHT_METHODS.TKO,
            time: generateFinishTime()
        };
    }

    if (randomPercent() < koChanceB) {
        return {
            winnerId: b.fighter.id,
            method: randomChance(0.55)
                ? FIGHT_METHODS.KO
                : FIGHT_METHODS.TKO,
            time: generateFinishTime()
        };
    }

    if (randomPercent() < subChanceA) {
        return {
            winnerId: a.fighter.id,
            method: FIGHT_METHODS.SUBMISSION,
            time: generateFinishTime()
        };
    }

    if (randomPercent() < subChanceB) {
        return {
            winnerId: b.fighter.id,
            method: FIGHT_METHODS.SUBMISSION,
            time: generateFinishTime()
        };
    }

    return null;
}

function calculateKOChance(attacker, defender, damage) {
    let chance =
        damage * 0.10 +
        attacker.strength * 0.025 +
        attacker.striking * 0.015 +
        attacker.speed * 0.01 -
        defender.durability * 0.015;

    /*
    Evita que nocaut aconteça com frequência absurda.
    */
    chance *= 0.18;

    return clamp(chance, 0.05, 8);
}

function calculateSubmissionChance(attacker, defender) {
    let chance =
        attacker.bjj * 0.025 +
        attacker.grappling * 0.020 +
        attacker.wrestling * 0.010 +
        attacker.fightIQ * 0.010 -
        defender.bjj * 0.012 -
        defender.grappling * 0.010;

    chance *= 0.35;

    return clamp(chance, 0.03, 7);
}

/*
|--------------------------------------------------------------------------
| DECISÃO
|--------------------------------------------------------------------------
*/

function determineFightResult(
    fighterA,
    fighterB,
    scoreA,
    scoreB,
    finish
) {
    if (finish) {
        const winnerId = finish.winnerId;

        const winnerIsA =
            winnerId === fighterA.id;

        return {
            winnerId,
            loserId: winnerIsA
                ? fighterB.id
                : fighterA.id,

            resultA: winnerIsA
                ? FIGHT_RESULTS.WIN
                : FIGHT_RESULTS.LOSS,

            resultB: winnerIsA
                ? FIGHT_RESULTS.LOSS
                : FIGHT_RESULTS.WIN,

            method: finish.method,
            round: finish.round || 1,
            time: finish.time
        };
    }

    const difference = Math.abs(scoreA - scoreB);

    /*
    Lutas muito equilibradas podem terminar empatadas.
    */
    if (difference < 8) {
        return {
            winnerId: null,
            loserId: null,

            resultA: FIGHT_RESULTS.DRAW,
            resultB: FIGHT_RESULTS.DRAW,

            method: FIGHT_METHODS.DRAW,
            round: null,
            time: null
        };
    }

    const winnerIsA = scoreA > scoreB;

    let method = FIGHT_METHODS.DECISION_UNANIMOUS;

    if (difference < 18) {
        method = FIGHT_METHODS.DECISION_SPLIT;
    } else if (difference < 28) {
        method = FIGHT_METHODS.DECISION_MAJORITY;
    }

    return {
        winnerId: winnerIsA
            ? fighterA.id
            : fighterB.id,

        loserId: winnerIsA
            ? fighterB.id
            : fighterA.id,

        resultA: winnerIsA
            ? FIGHT_RESULTS.WIN
            : FIGHT_RESULTS.LOSS,

        resultB: winnerIsA
            ? FIGHT_RESULTS.LOSS
            : FIGHT_RESULTS.WIN,

        method,

        round: null,
        time: null
    };
}

/*
|--------------------------------------------------------------------------
| ESTATÍSTICAS
|--------------------------------------------------------------------------
*/

function createStatistics() {
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

function createRoundStatistics(
    attacker,
    defender,
    striking,
    grappling,
    control,
    damage
) {
    const stats = createStatistics();

    stats.totalStrikes = Math.round(
        8 + striking * 0.55 + randomRange(0, 12)
    );

    stats.significantStrikes = Math.round(
        stats.totalStrikes * randomRange(0.45, 0.75)
    );

    stats.takedownAttempts = Math.round(
        1 + grappling * 0.12
    );

    stats.takedowns = Math.min(
        stats.takedownAttempts,
        Math.round(grappling * 0.07)
    );

    stats.takedownDefense = Math.round(
        defender.takedownDefense * 0.05
    );

    stats.submissions =
        attacker.bjj >= 70 && grappling > 20
            ? Math.round(randomRange(0, 2))
            : 0;

    stats.knockdowns =
        damage > 28
            ? Math.random() < 0.30
                ? 1
                : 0
            : 0;

    stats.controlTime = Math.round(
        Math.max(0, control * 2.2)
    );

    stats.damage = Math.round(damage);

    return stats;
}

function mergeStatistics(target, source) {
    for (const key of Object.keys(target)) {
        target[key] += source[key] || 0;
    }
}

/*
|--------------------------------------------------------------------------
| PERFORMANCE
|--------------------------------------------------------------------------
*/

function calculatePerformance(
    scoreA,
    scoreB,
    statistics
) {
    const total = Math.max(
        1,
        scoreA + scoreB
    );

    return {
        fighterA: Math.round(
            (scoreA / total) * 100
        ),

        fighterB: Math.round(
            (scoreB / total) * 100
        )
    };
}

/*
|--------------------------------------------------------------------------
| FADIGA
|--------------------------------------------------------------------------
*/

function calculateRoundFatigue(fighter, round) {
    const base =
        round * 4;

    const cardioReduction =
        fighter.cardio * 0.025;

    return Math.max(
        0,
        base - cardioReduction + randomRange(0, 4)
    );
}

function applyFatigue(fighter, fatigue) {
    const multiplier = clamp(
        1 - fatigue / 180,
        0.65,
        1
    );

    const result = {
        ...fighter
    };

    const attributes = [
        "striking",
        "wrestling",
        "grappling",
        "bjj",
        "takedownDefense",
        "strikingDefense",
        "cardio",
        "strength",
        "speed",
        "fightIQ",
        "mental",
        "confidence"
    ];

    for (const attribute of attributes) {
        result[attribute] *= multiplier;
    }

    return result;
}

/*
|--------------------------------------------------------------------------
| MATCHUP
|--------------------------------------------------------------------------
*/

function getMatchupMultiplier(
    attackerStyle,
    defenderStyle
) {
    const table =
        STYLE_MATCHUPS[attackerStyle] ||
        STYLE_MATCHUPS.balanced;

    return table[defenderStyle] ||
        table.balanced ||
        1;
}

/*
|--------------------------------------------------------------------------
| EXPERIÊNCIA / OVR
|--------------------------------------------------------------------------
*/

function getExperience(fighter) {
    const fights =
        fighter.career?.fights?.length ||
        fighter.career?.totalFights ||
        0;

    return clamp(
        fights * 2.5,
        0,
        100
    );
}

function safeOVR(fighter) {
    try {
        return getPlayerOVR(fighter);
    } catch {
        return fighter.ovr || 50;
    }
}

/*
|--------------------------------------------------------------------------
| UTILITÁRIOS
|--------------------------------------------------------------------------
*/

function value(number) {
    return Number.isFinite(number)
        ? number
        : 0;
}

function randomRange(min, max) {
    return Math.random() * (
        max - min
    ) + min;
}

function randomPercent() {
    return Math.random() * 100;
}

function randomChance(probability) {
    return Math.random() < probability;
}

function generateFinishTime() {
    const minute = Math.floor(
        randomRange(1, 5)
    );

    const second = Math.floor(
        randomRange(0, 60)
    );

    return `${minute}:${String(second).padStart(2, "0")}`;
}

function clamp(value, min, max) {
    return Math.min(
        max,
        Math.max(min, value)
    );
}
