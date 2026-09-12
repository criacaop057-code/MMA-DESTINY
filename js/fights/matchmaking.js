import { getState } from "../core/state.js";
import { createFight } from "./fight.js";

/*
|--------------------------------------------------------------------------
| MMA DESTINY — MATCHMAKING
|--------------------------------------------------------------------------
|
| O sistema NÃO sorteia lutas aleatoriamente.
|
| A organização procura confrontos esportivamente plausíveis:
|
| CAMPEÃO
|   ↓
| TOP 3
|   ↓
| TOP 5
|   ↓
| TOP 10
|   ↓
| TOP 15
|   ↓
| NÃO RANQUEADOS
|
| O momento recente também pesa:
| - sequência de vitórias
| - sequência de derrotas
| - posição no ranking
| - OVR
| - experiência
| - tempo desde a última luta
| - rivalidade
| - revanche
|--------------------------------------------------------------------------
*/

export const MATCHMAKING_TYPES = {
    TITLE_DEFENSE: "title_defense",
    TITLE_ELIMINATOR: "title_eliminator",
    RANKED: "ranked",
    CONTENDER: "contender",
    PROSPECT: "prospect",
    RECOVERY: "recovery",
    DEBUT: "debut",
    REMATCH: "rematch"
};

const RANKING_RANGES = {
    CHAMPION: {
        min: 1,
        max: 3
    },

    TOP_3: {
        min: 1,
        max: 5
    },

    TOP_5: {
        min: 1,
        max: 8
    },

    TOP_10: {
        min: 4,
        max: 13
    },

    TOP_15: {
        min: 9,
        max: 15
    },

    UNRANKED: {
        min: 16,
        max: 999
    }
};

/*
|--------------------------------------------------------------------------
| CRIA UMA LUTA A PARTIR DO MATCHMAKING
|--------------------------------------------------------------------------
*/

export function createMatchup({
    fighterA,
    fighterB,
    organizationId = null,
    eventId = null,
    date = null,
    weightClass = null,
    title = false,
    titleName = null,
    rounds = 3
}) {
    if (!fighterA || !fighterB) {
        throw new Error(
            "Matchup precisa de dois lutadores."
        );
    }

    return createFight({
        fighterA,
        fighterB,
        organizationId,
        eventId,
        date,
        weightClass,
        rounds: title ? 5 : rounds,
        title,
        titleName,
        status: "scheduled"
    });
}

/*
|--------------------------------------------------------------------------
| ENCONTRAR ADVERSÁRIO PARA UM LUTADOR
|--------------------------------------------------------------------------
*/

export function findOpponent(
    fighter,
    fighters,
    options = {}
) {
    if (!fighter) {
        return null;
    }

    const candidates = getValidCandidates(
        fighter,
        fighters,
        options
    );

    if (!candidates.length) {
        return null;
    }

    const scored = candidates.map(candidate => ({
        fighter: candidate,
        score: calculateMatchmakingScore(
            fighter,
            candidate,
            options
        )
    }));

    scored.sort(
        (a, b) => b.score - a.score
    );

    return scored[0]?.fighter || null;
}

/*
|--------------------------------------------------------------------------
| GERAR TODOS OS CONFRONTOS POSSÍVEIS
|--------------------------------------------------------------------------
*/

export function rankPotentialOpponents(
    fighter,
    fighters,
    options = {}
) {
    const candidates = getValidCandidates(
        fighter,
        fighters,
        options
    );

    return candidates
        .map(candidate => ({
            fighter: candidate,
            score: calculateMatchmakingScore(
                fighter,
                candidate,
                options
            )
        }))
        .sort(
            (a, b) => b.score - a.score
        );
}

/*
|--------------------------------------------------------------------------
| GERAR UMA LUTA AUTOMÁTICA
|--------------------------------------------------------------------------
*/

export function generateMatchmaking(
    fighter,
    fighters,
    options = {}
) {
    const opponent = findOpponent(
        fighter,
        fighters,
        options
    );

    if (!opponent) {
        return null;
    }

    const matchupType =
        determineMatchupType(
            fighter,
            opponent,
            options
        );

    const title =
        matchupType === MATCHMAKING_TYPES.TITLE_DEFENSE;

    return {
        fighterA: fighter,
        fighterB: opponent,

        type: matchupType,

        title,

        titleName:
            title
                ? options.titleName ||
                  "Campeonato"
                : null,

        score:
            calculateMatchmakingScore(
                fighter,
                opponent,
                options
            )
    };
}

/*
|--------------------------------------------------------------------------
| VALIDAR CANDIDATOS
|--------------------------------------------------------------------------
*/

function getValidCandidates(
    fighter,
    fighters,
    options
) {
    const state = getState();

    const weightClass =
        options.weightClass ||
        fighter.weightClass;

    return fighters.filter(candidate => {
        if (!candidate) {
            return false;
        }

        if (candidate.id === fighter.id) {
            return false;
        }

        if (
            candidate.weightClass !==
            weightClass
        ) {
            return false;
        }

        if (
            isUnavailable(
                candidate
            )
        ) {
            return false;
        }

        if (
            isUnavailable(
                fighter
            )
        ) {
            return false;
        }

        if (
            !options.allowRematch &&
            hasRecentFight(
                fighter,
                candidate
            )
        ) {
            return false;
        }

        /*
        Se a organização tiver uma lista de
        atletas disponíveis, respeitamos.
        */
        if (
            options.availableIds &&
            !options.availableIds.includes(
                candidate.id
            )
        ) {
            return false;
        }

        return true;
    });
}

/*
|--------------------------------------------------------------------------
| MATCHMAKING SCORE
|--------------------------------------------------------------------------
*/

export function calculateMatchmakingScore(
    fighterA,
    fighterB,
    options = {}
) {
    let score = 0;

    const rankA =
        getRankingPosition(
            fighterA,
            options.organizationId
        );

    const rankB =
        getRankingPosition(
            fighterB,
            options.organizationId
        );

    /*
    |--------------------------------------------------------------------------
    | CAMPEÃO
    |--------------------------------------------------------------------------
    */

    if (isChampion(fighterA, options)) {
        if (rankB >= 1 && rankB <= 3) {
            score += 80;
        } else if (rankB <= 5) {
            score += 40;
        } else {
            score -= 80;
        }
    }

    if (isChampion(fighterB, options)) {
        if (rankA >= 1 && rankA <= 3) {
            score += 80;
        } else if (rankA <= 5) {
            score += 40;
        } else {
            score -= 80;
        }
    }

    /*
    |--------------------------------------------------------------------------
    | PROXIMIDADE DE RANKING
    |--------------------------------------------------------------------------
    */

    if (
        rankA !== null &&
        rankB !== null
    ) {
        const distance =
            Math.abs(
                rankA - rankB
            );

        if (distance === 0) {
            score += 35;
        } else if (distance <= 2) {
            score += 40;
        } else if (distance <= 4) {
            score += 28;
        } else if (distance <= 7) {
            score += 12;
        } else if (distance <= 12) {
            score -= 20;
        } else {
            score -= 60;
        }
    }

    /*
    |--------------------------------------------------------------------------
    | MOMENTO
    |--------------------------------------------------------------------------
    */

    const streakA =
        getWinStreak(fighterA);

    const streakB =
        getWinStreak(fighterB);

    const losingA =
        getLosingStreak(fighterA);

    const losingB =
        getLosingStreak(fighterB);

    /*
    Dois vencedores em boa fase.
    */
    if (
        streakA >= 2 &&
        streakB >= 2
    ) {
        score += 25;
    }

    /*
    Dois atletas vindo de derrotas.
    */
    if (
        losingA >= 1 &&
        losingB >= 1
    ) {
        score += 30;
    }

    /*
    Um atleta em ascensão contra alguém
    acima dele.
    */
    if (
        streakA >= 3 &&
        rankB !== null &&
        rankB < rankA
    ) {
        score += 20;
    }

    if (
        streakB >= 3 &&
        rankA !== null &&
        rankA < rankB
    ) {
        score += 20;
    }

    /*
    |--------------------------------------------------------------------------
    | OVR
    |--------------------------------------------------------------------------
    */

    const ovrA =
        getOVR(fighterA);

    const ovrB =
        getOVR(fighterB);

    const ovrDifference =
        Math.abs(
            ovrA - ovrB
        );

    if (ovrDifference <= 3) {
        score += 20;
    } else if (ovrDifference <= 7) {
        score += 15;
    } else if (ovrDifference <= 12) {
        score += 8;
    } else if (ovrDifference <= 18) {
        score -= 10;
    } else {
        score -= 30;
    }

    /*
    |--------------------------------------------------------------------------
    | EXPERIÊNCIA
    |--------------------------------------------------------------------------
    */

    const experienceA =
        getExperience(fighterA);

    const experienceB =
        getExperience(fighterB);

    const experienceDifference =
        Math.abs(
            experienceA -
            experienceB
        );

    if (experienceDifference <= 10) {
        score += 10;
    } else if (experienceDifference <= 20) {
        score += 5;
    } else {
        score -= 10;
    }

    /*
    |--------------------------------------------------------------------------
    | TEMPO DESDE ÚLTIMA LUTA
    |--------------------------------------------------------------------------
    */

    const inactivityA =
        getInactivityWeeks(
            fighterA
        );

    const inactivityB =
        getInactivityWeeks(
            fighterB
        );

    if (
        inactivityA >= 8 &&
        inactivityB >= 8
    ) {
        score += 15;
    }

    /*
    |--------------------------------------------------------------------------
    | REVANCHE
    |--------------------------------------------------------------------------
    */

    if (
        hasPreviousFight(
            fighterA,
            fighterB
        )
    ) {
        if (
            options.allowRematch
        ) {
            score += 20;
        } else {
            score -= 50;
        }
    }

    /*
    |--------------------------------------------------------------------------
    | RIVALIDADE
    |--------------------------------------------------------------------------
    */

    if (
        hasRivalry(
            fighterA,
            fighterB
        )
    ) {
        score += 25;
    }

    /*
    |--------------------------------------------------------------------------
    | DESAFIO
    |--------------------------------------------------------------------------
    */

    if (
        hasChallenge(
            fighterA,
            fighterB
        )
    ) {
        score += 20;
    }

    /*
    |--------------------------------------------------------------------------
    | PROFISSIONALISMO / DISPONIBILIDADE
    |--------------------------------------------------------------------------
    */

    if (
        fighterA.personality?.professionalism >= 70 &&
        fighterB.personality?.professionalism >= 70
    ) {
        score += 5;
    }

    /*
    Pequena variação para evitar que o mundo
    fique completamente determinístico.
    */
    score += randomRange(
        -3,
        3
    );

    return Math.round(score);
}

/*
|--------------------------------------------------------------------------
| TIPO DA LUTA
|--------------------------------------------------------------------------
*/

export function determineMatchupType(
    fighterA,
    fighterB,
    options = {}
) {
    const championA =
        isChampion(
            fighterA,
            options
        );

    const championB =
        isChampion(
            fighterB,
            options
        );

    if (
        championA ||
        championB
    ) {
        return MATCHMAKING_TYPES.TITLE_DEFENSE;
    }

    if (
        hasPreviousFight(
            fighterA,
            fighterB
        ) &&
        options.allowRematch
    ) {
        return MATCHMAKING_TYPES.REMATCH;
    }

    const rankA =
        getRankingPosition(
            fighterA,
            options.organizationId
        );

    const rankB =
        getRankingPosition(
            fighterB,
            options.organizationId
        );

    if (
        rankA !== null &&
        rankB !== null
    ) {
        if (
            rankA <= 5 &&
            rankB <= 5
        ) {
            return MATCHMAKING_TYPES.CONTENDER;
        }

        return MATCHMAKING_TYPES.RANKED;
    }

    if (
        getWinStreak(fighterA) >= 3 ||
        getWinStreak(fighterB) >= 3
    ) {
        return MATCHMAKING_TYPES.PROSPECT;
    }

    if (
        getLosingStreak(fighterA) >= 2 &&
        getLosingStreak(fighterB) >= 2
    ) {
        return MATCHMAKING_TYPES.RECOVERY;
    }

    return MATCHMAKING_TYPES.DEBUT;
}

/*
|--------------------------------------------------------------------------
| REGRAS DE RANKING
|--------------------------------------------------------------------------
*/

export function getRankingPosition(
    fighter,
    organizationId = null
) {
    if (!fighter) {
        return null;
    }

    /*
    Estrutura preparada para rankings
    específicos por organização.
    */

    if (
        organizationId &&
        fighter.rankings?.organizations?.[
            organizationId
        ] !== undefined
    ) {
        return fighter.rankings.organizations[
            organizationId
        ];
    }

    if (
        fighter.rankings?.current !== undefined
    ) {
        return fighter.rankings.current;
    }

    if (
        fighter.career?.ranking !== undefined
    ) {
        return fighter.career.ranking;
    }

    return null;
}

function isChampion(
    fighter,
    options
) {
    if (!fighter) {
        return false;
    }

    if (
        options.championId &&
        fighter.id === options.championId
    ) {
        return true;
    }

    if (
        fighter.career?.champion
    ) {
        return true;
    }

    if (
        fighter.champion === true
    ) {
        return true;
    }

    return false;
}

/*
|--------------------------------------------------------------------------
| MOMENTO
|--------------------------------------------------------------------------
*/

function getWinStreak(fighter) {
    return fighter.career?.winStreak ||
        fighter.career?.streak ||
        0;
}

function getLosingStreak(fighter) {
    return fighter.career?.losingStreak ||
        0;
}

/*
|--------------------------------------------------------------------------
| EXPERIÊNCIA
|--------------------------------------------------------------------------
*/

function getExperience(fighter) {
    return fighter.career?.fights?.length ||
        fighter.career?.totalFights ||
        0;
}

function getOVR(fighter) {
    if (
        Number.isFinite(
            fighter.ovr
        )
    ) {
        return fighter.ovr;
    }

    const attributes =
        fighter.attributes || {};

    const values = [
        attributes.striking,
        attributes.wrestling,
        attributes.grappling,
        attributes.bjj,
        attributes.cardio,
        attributes.strength,
        attributes.speed,
        attributes.durability,
        attributes.fightIQ,
        attributes.mental
    ].filter(
        value => Number.isFinite(value)
    );

    if (!values.length) {
        return 50;
    }

    return Math.round(
        values.reduce(
            (sum, value) =>
                sum + value,
            0
        ) / values.length
    );
}

/*
|--------------------------------------------------------------------------
| DISPONIBILIDADE
|--------------------------------------------------------------------------
*/

function isUnavailable(fighter) {
    if (
        fighter.health?.suspended
    ) {
        return true;
    }

    if (
        fighter.health?.injuries?.some(
            injury =>
                injury.active &&
                injury.preventsFighting
        )
    ) {
        return true;
    }

    if (
        fighter.career?.retired
    ) {
        return true;
    }

    if (
        fighter.available === false
    ) {
        return true;
    }

    return false;
}

function getInactivityWeeks(fighter) {
    return fighter.career?.weeksSinceLastFight ||
        0;
}

/*
|--------------------------------------------------------------------------
| HISTÓRICO
|--------------------------------------------------------------------------
*/

function hasPreviousFight(
    fighterA,
    fighterB
) {
    const fights =
        fighterA.career?.fights ||
        [];

    return fights.some(
        fight =>
            fight.opponentId ===
                fighterB.id ||
            fight.fighterB ===
                fighterB.id ||
            fight.fighterA ===
                fighterB.id
    );
}

function hasRecentFight(
    fighterA,
    fighterB
) {
    const fights =
        fighterA.career?.fights ||
        [];

    const recent =
        fights.slice(-3);

    return recent.some(
        fight =>
            fight.opponentId ===
                fighterB.id ||
            fight.fighterB ===
                fighterB.id ||
            fight.fighterA ===
                fighterB.id
    );
}

/*
|--------------------------------------------------------------------------
| RIVALIDADE / DESAFIO
|--------------------------------------------------------------------------
*/

function hasRivalry(
    fighterA,
    fighterB
) {
    const rivalries =
        fighterA.rivalries ||
        fighterA.media?.rivalries ||
        [];

    return rivalries.some(
        rivalry =>
            rivalry.fighterId ===
            fighterB.id ||
            rivalry.opponentId ===
            fighterB.id
    );
}

function hasChallenge(
    fighterA,
    fighterB
) {
    const challenges =
        fighterA.challenges ||
        fighterA.media?.challenges ||
        [];

    return challenges.some(
        challenge =>
            challenge.targetId ===
            fighterB.id
    );
}

/*
|--------------------------------------------------------------------------
| UTILITÁRIOS
|--------------------------------------------------------------------------
*/

function randomRange(
    min,
    max
) {
    return Math.random() *
        (max - min) +
        min;
}

/*
|--------------------------------------------------------------------------
| PRÓXIMO ADVERSÁRIO IDEAL
|--------------------------------------------------------------------------
|
| Essa função será útil para o jogador:
| "Quem provavelmente a organização vai
| me oferecer?"
|--------------------------------------------------------------------------
*/

export function getLikelyOpponents(
    fighter,
    fighters,
    options = {},
    limit = 5
) {
    return rankPotentialOpponents(
        fighter,
        fighters,
        options
    ).slice(0, limit);
}

/*
|--------------------------------------------------------------------------
| DECISÃO ESPECIAL PARA CAMPEÃO
|--------------------------------------------------------------------------
*/

export function findTitleChallenger(
    champion,
    fighters,
    options = {}
) {
    const candidates =
        getValidCandidates(
            champion,
            fighters,
            {
                ...options,
                allowRematch: false
            }
        );

    const ranked =
        candidates.filter(
            fighter => {
                const rank =
                    getRankingPosition(
                        fighter,
                        options.organizationId
                    );

                return (
                    rank !== null &&
                    rank >= 1 &&
                    rank <= 3
                );
            }
        );

    /*
    Se houver Top 3 disponível,
    o campeão luta com ele.
    */

    if (ranked.length) {
        return ranked
            .sort(
                (a, b) =>
                    getRankingPosition(
                        a,
                        options.organizationId
                    ) -
                    getRankingPosition(
                        b,
                        options.organizationId
                    )
            )[0];
    }

    /*
    Se não houver Top 3 disponível,
    procura Top 5.
    */

    const topFive =
        candidates.filter(
            fighter => {
                const rank =
                    getRankingPosition(
                        fighter,
                        options.organizationId
                    );

                return (
                    rank !== null &&
                    rank >= 1 &&
                    rank <= 5
                );
            }
        );

    if (topFive.length) {
        return topFive
            .sort(
                (a, b) =>
                    getRankingPosition(
                        a,
                        options.organizationId
                    ) -
                    getRankingPosition(
                        b,
                        options.organizationId
                    )
            )[0];
    }

    return null;
}

/*
|--------------------------------------------------------------------------
| ELIMINATÓRIA PELO TÍTULO
|--------------------------------------------------------------------------
|
| Se o campeão estiver indisponível,
| Top 1 x Top 2 pode disputar o título
| interino ou uma eliminatória.
|--------------------------------------------------------------------------
*/

export function findTitleEliminator(
    fighters,
    options = {}
) {
    const ranked =
        fighters
            .filter(
                fighter =>
                    !isUnavailable(fighter)
            )
            .filter(
                fighter => {
                    const rank =
                        getRankingPosition(
                            fighter,
                            options.organizationId
                        );

                    return (
                        rank !== null &&
                        rank >= 1 &&
                        rank <= 3
                    );
                }
            )
            .sort(
                (a, b) =>
                    getRankingPosition(
                        a,
                        options.organizationId
                    ) -
                    getRankingPosition(
                        b,
                        options.organizationId
                    )
            );

    if (ranked.length < 2) {
        return null;
    }

    return {
        fighterA: ranked[0],
        fighterB: ranked[1],
        type: MATCHMAKING_TYPES.TITLE_ELIMINATOR,
        title: true
    };
}
