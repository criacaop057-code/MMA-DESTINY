export const LEGACY_SOURCES = {
    CHAMPIONSHIP: 100,
    TITLE_DEFENSE: 50,
    MAJOR_WIN: 30,
    RECORD: 25,
    HALL_OF_FAME: 200,
    ACADEMY: 40,
    COACHING: 30,
    FAMILY_SUCCESS: 50,
    RETIREMENT: 20
};

export function calculateFighterLegacy(fighter) {
    if (!fighter) {
        return 0;
    }

    const career = fighter.career || {};

    const wins = career.record?.wins || 0;
    const fights = career.record?.fights || 0;
    const titles = career.titles?.length || 0;

    const winValue = wins * 5;
    const fightValue = fights * 2;
    const titleValue = titles * LEGACY_SOURCES.CHAMPIONSHIP;

    return Math.round(
        winValue +
        fightValue +
        titleValue
    );
}

export function calculateFamilyLegacy(members = []) {
    return members.reduce(
        (total, member) =>
            total + calculateFighterLegacy(member),
        0
    );
}

export function addLegacyMilestone(
    dynasty,
    title,
    value,
    memberId = null
) {
    dynasty.milestones.push({
        title,
        value,
        memberId,
        date: null
    });

    dynasty.legacyScore += value;

    return dynasty.legacyScore;
}

export function getLegacyRank(score) {
    if (score >= 1500) return "Ícone";
    if (score >= 1000) return "Lenda";
    if (score >= 700) return "Histórica";
    if (score >= 400) return "Grande";
    if (score >= 200) return "Respeitada";

    return "Emergente";
}
