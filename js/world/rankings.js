export const RANKING_TYPES = {
    ORGANIZATION: "organization",
    NATIONAL: "national",
    CONTINENTAL: "continental",
    GLOBAL: "global",
    P4P: "p4p"
};

export function createRankingTable(
    organizationId,
    weightClass
) {
    return {
        organizationId,
        weightClass,

        championId: null,

        rankings: [],

        updatedAt: null
    };
}

export function setChampion(
    table,
    fighterId
) {
    table.championId = fighterId;
    return table;
}

export function updateRanking(
    table,
    fighters
) {
    const ranked = [...fighters]
        .filter(
            fighter =>
                fighter.active !== false
        )
        .sort(
            (a, b) =>
                calculateRankingScore(b) -
                calculateRankingScore(a)
        );

    table.rankings =
        ranked.map(
            (fighter, index) => ({
                position: index + 1,
                fighterId: fighter.id,
                score:
                    calculateRankingScore(
                        fighter
                    )
            })
        );

    return table;
}

export function calculateRankingScore(
    fighter
) {
    const record =
        fighter.record || {};

    const wins =
        record.wins || 0;

    const losses =
        record.losses || 0;

    const draws =
        record.draws || 0;

    const ovr =
        fighter.ovr || 0;

    const streak =
        fighter.streak || 0;

    const reputation =
        fighter.reputation || 0;

    return Math.round(
        ovr * 2 +
        wins * 12 -
        losses * 8 +
        draws * 2 +
        streak * 10 +
        reputation * 0.5
    );
}

export function getRankedFighter(
    table,
    position
) {
    return (
        table.rankings.find(
            entry =>
                entry.position === position
        ) || null
    );
}

export function getFighterPosition(
    table,
    fighterId
) {
    const entry =
        table.rankings.find(
            item =>
                item.fighterId === fighterId
        );

    return entry
        ? entry.position
        : null;
}

export function getTopFighters(
    table,
    amount = 15
) {
    return table.rankings
        .slice(0, amount);
}
