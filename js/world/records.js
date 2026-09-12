export function calculateRecord(
    fighter
) {
    const record =
        fighter?.record || {};

    return {
        wins: record.wins || 0,
        losses: record.losses || 0,
        draws: record.draws || 0,
        noContests:
            record.noContests || 0,

        fights:
            (record.wins || 0) +
            (record.losses || 0) +
            (record.draws || 0) +
            (record.noContests || 0)
    };
}

export function getWinPercentage(
    fighter
) {
    const record =
        calculateRecord(fighter);

    if (!record.fights) {
        return 0;
    }

    return Math.round(
        (
            record.wins /
            record.fights
        ) * 100
    );
}

export function getFinishRate(
    fighter
) {
    const finishes =
        fighter?.statistics
            ?.finishes || 0;

    const wins =
        fighter?.record?.wins || 0;

    if (!wins) {
        return 0;
    }

    return Math.round(
        finishes / wins * 100
    );
}

export function getCareerSummary(
    fighter
) {
    const record =
        calculateRecord(fighter);

    return {
        record,

        winPercentage:
            getWinPercentage(
                fighter
            ),

        finishRate:
            getFinishRate(
                fighter
            ),

        streak:
            fighter?.streak || 0,

        longestStreak:
            fighter?.longestStreak || 0,

        titles:
            fighter?.titles?.length || 0,

        earnings:
            fighter?.earnings || 0
    };
}
