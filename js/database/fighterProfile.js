export function createFighterProfile(
    fighter,
    database
) {
    if (!fighter) return null;

    const identity =
        fighter.identity || {};

    const career =
        fighter.career || {};

    const record =
        career.record || {
            wins: 0,
            losses: 0,
            draws: 0,
            noContests: 0,
            fights: 0
        };

    return {
        id: fighter.id,

        name:
            identity.name ||
            fighter.name ||
            "Desconhecido",

        nickname:
            identity.nickname ||
            fighter.nickname ||
            "",

        country:
            identity.country ||
            fighter.country ||
            "",

        age:
            fighter.age || 0,

        weightClass:
            identity.weightClass ||
            fighter.weightClass ||
            "",

        style:
            identity.style ||
            fighter.style ||
            "",

        stance:
            identity.stance ||
            fighter.stance ||
            "",

        team:
            fighter.team || null,

        academy:
            fighter.academy || null,

        record: {
            wins: record.wins || 0,
            losses: record.losses || 0,
            draws: record.draws || 0,
            noContests: record.noContests || 0,
            fights: record.fights || 0
        },

        ovr: fighter.ovr || 0,
        potential: fighter.potential || 0,

        ranking:
            career.ranking || null,

        titles:
            career.titles || [],

        streak:
            career.streak || 0,

        longestStreak:
            career.longestStreak || 0,

        experience:
            career.experience || 0,

        earnings:
            career.earnings || 0,

        reputation:
            career.reputation || 0,

        achievements:
            fighter.achievements || [],

        fights: getFighterFights(
            fighter,
            database
        )
    };
}

export function getFighterFights(
    fighter,
    database
) {
    if (!fighter) return [];

    const fightIds =
        fighter.career?.fights || [];

    return fightIds
        .map(id => database?.events?.[id])
        .filter(Boolean);
}

export function getFighterRecord(fighter) {
    const record =
        fighter?.career?.record || {};

    return {
        wins: record.wins || 0,
        losses: record.losses || 0,
        draws: record.draws || 0,
        noContests: record.noContests || 0,
        total:
            (record.wins || 0) +
            (record.losses || 0) +
            (record.draws || 0) +
            (record.noContests || 0)
    };
}
