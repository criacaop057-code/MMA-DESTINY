export function createCareer() {

    return {
        status: "amateur",

        record: {
            wins: 0,
            losses: 0,
            draws: 0,
            noContests: 0
        },

        streak: 0,

        longestWinStreak: 0,

        professionalDebut: null,

        lastFight: null,

        nextFight: null,

        ranking: {
            global: null,
            national: null,
            continental: null,
            organization: null,
            poundForPound: null
        },

        titles: [],

        bonuses: [],

        earnings: 0,

        careerFights: [],

        reputation: 0,

        experience: 0
    };
}

export function registerFight(
    player,
    result
) {

    if (!player.career) {
        player.career =
            createCareer();
    }

    const career =
        player.career;

    const normalizedResult =
        result.result;

    if (normalizedResult === "win") {

        career.record.wins++;

        career.streak =
            career.streak >= 0
                ? career.streak + 1
                : 1;

        career.longestWinStreak =
            Math.max(
                career.longestWinStreak,
                career.streak
            );

    } else if (normalizedResult === "loss") {

        career.record.losses++;

        career.streak =
            career.streak <= 0
                ? career.streak - 1
                : -1;

    } else if (normalizedResult === "draw") {

        career.record.draws++;

    } else if (normalizedResult === "no_contest") {

        career.record.noContests++;
    }

    career.experience +=
        result.experience ?? 10;

    career.reputation +=
        result.reputation ?? 0;

    career.earnings +=
        result.purse ?? 0;

    career.lastFight = result;

    career.careerFights.push(result);

    return career;
}

export function getRecordString(player) {

    const record =
        player?.career?.record;

    if (!record) {
        return "0-0-0";
    }

    return `${record.wins}-${record.losses}-${record.draws}`;
}
