export function getHeadToHead(
    fighterAId,
    fighterBId,
    fights = []
) {
    const relevantFights = fights.filter(
        fight =>
            (
                fight.fighterAId === fighterAId &&
                fight.fighterBId === fighterBId
            ) ||
            (
                fight.fighterAId === fighterBId &&
                fight.fighterBId === fighterAId
            )
    );

    let fighterAWins = 0;
    let fighterBWins = 0;
    let draws = 0;
    let noContests = 0;

    relevantFights.forEach(fight => {
        if (fight.result === "draw") {
            draws++;
            return;
        }

        if (
            fight.result === "no_contest"
        ) {
            noContests++;
            return;
        }

        if (fight.winnerId === fighterAId) {
            fighterAWins++;
        }

        if (fight.winnerId === fighterBId) {
            fighterBWins++;
        }
    });

    return {
        fighterAId,
        fighterBId,

        fights: relevantFights.length,

        fighterAWins,
        fighterBWins,

        draws,
        noContests,

        history: relevantFights
    };
}

export function getAllFightsBetween(
    fighterAId,
    fighterBId,
    fights = []
) {
    return fights.filter(
        fight =>
            (
                fight.fighterAId === fighterAId &&
                fight.fighterBId === fighterBId
            ) ||
            (
                fight.fighterAId === fighterBId &&
                fight.fighterBId === fighterAId
            )
    );
}

export function hasHeadToHead(
    fighterAId,
    fighterBId,
    fights = []
) {
    return getAllFightsBetween(
        fighterAId,
        fighterBId,
        fights
    ).length > 0;
}

export function getRivalryScore(
    fighterAId,
    fighterBId,
    fights = []
) {
    const h2h = getHeadToHead(
        fighterAId,
        fighterBId,
        fights
    );

    if (h2h.fights === 0) {
        return 0;
    }

    return Math.min(
        100,
        h2h.fights * 25
    );
}
