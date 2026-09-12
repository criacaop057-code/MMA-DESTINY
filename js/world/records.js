import { state } from "../core/state.js";

export function calculateCareerRecord(
    fighter
) {
    const record =
        fighter.career?.record || {};

    const total =
        (record.wins || 0) +
        (record.losses || 0) +
        (record.draws || 0) +
        (record.noContests || 0);

    return {
        wins: record.wins || 0,
        losses: record.losses || 0,
        draws: record.draws || 0,
        noContests:
            record.noContests || 0,
        total
    };
}

export function getWinPercentage(
    fighter
) {
    const record =
        calculateCareerRecord(
            fighter
        );

    if (!record.total) {
        return 0;
    }

    return Math.round(
        (record.wins /
            record.total) *
            100
    );
}

export function getFinishRate(
    fighter
) {
    const record =
        fighter.statistics || {};

    const wins =
        fighter.career?.record?.wins || 0;

    if (!wins) {
        return 0;
    }

    const finishes =
        (record.knockouts || 0) +
        (record.submissions || 0);

    return Math.round(
        (finishes / wins) * 100
    );
}

export function getFighterRecordByMethod(
    fighter
) {
    const statistics =
        fighter.statistics || {};

    return {
        totalWins:
            fighter.career?.record?.wins || 0,

        knockouts:
            statistics.knockouts || 0,

        submissions:
            statistics.submissions || 0,

        decisions:
            statistics.decisions || 0
    };
}

export function calculateWorldRecords(
    fighters
) {
    if (!fighters?.length) {
        return {};
    }

    const validFighters =
        fighters.filter(Boolean);

    const mostWins =
        [...validFighters].sort(
            (a, b) =>
                (b.career?.record?.wins || 0) -
                (a.career?.record?.wins || 0)
        )[0];

    const mostKnockouts =
        [...validFighters].sort(
            (a, b) =>
                (b.statistics?.knockouts || 0) -
                (a.statistics?.knockouts || 0)
        )[0];

    const mostSubmissions =
        [...validFighters].sort(
            (a, b) =>
                (b.statistics?.submissions || 0) -
                (a.statistics?.submissions || 0)
        )[0];

    const highestOVR =
        [...validFighters].sort(
            (a, b) =>
                (b.ovr || 0) -
                (a.ovr || 0)
        )[0];

    const longestWinStreak =
        [...validFighters].sort(
            (a, b) =>
                (b.career?.longestWinStreak || 0) -
                (a.career?.longestWinStreak || 0)
        )[0];

    return {
        mostWins: createRecord(
            "Mais vitórias",
            mostWins,
            mostWins?.career?.record?.wins
        ),

        mostKnockouts: createRecord(
            "Mais nocautes",
            mostKnockouts,
            mostKnockouts?.statistics?.knockouts
        ),

        mostSubmissions: createRecord(
            "Mais finalizações",
            mostSubmissions,
            mostSubmissions?.statistics?.submissions
        ),

        highestOVR: createRecord(
            "Maior OVR",
            highestOVR,
            highestOVR?.ovr
        ),

        longestWinStreak: createRecord(
            "Maior sequência de vitórias",
            longestWinStreak,
            longestWinStreak?.career?.longestWinStreak
        )
    };
}

function createRecord(
    category,
    fighter,
    value
) {
    if (!fighter) {
        return null;
    }

    return {
        category,
        fighterId: fighter.id,
        fighterName:
            fighter.identity.name,
        value: value || 0
    };
}

export function saveWorldRecords(
    fighters
) {
    state.world.records =
        calculateWorldRecords(
            fighters
        );

    return state.world.records;
}

export function getWorldRecords() {
    return state.world.records || {};
}

export function getHistoricalFighterRanking(
    fighters,
    limit = 50
) {
    return [...fighters]
        .sort(
            (a, b) =>
                calculateLegacyScore(b) -
                calculateLegacyScore(a)
        )
        .slice(0, limit);
}

export function calculateLegacyScore(
    fighter
) {
    const career =
        fighter.career || {};

    const record =
        career.record || {};

    return (
        (record.wins || 0) * 5 +
        (career.titles || 0) * 50 +
        (career.titleDefenses || 0) * 25 +
        (career.longestWinStreak || 0) * 8 +
        (fighter.reputation || 0) +
        (fighter.hype || 0) * 0.3
    );
}
