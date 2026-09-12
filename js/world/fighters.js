import { createId } from "../core/ids.js";

export function createWorldFighter({
    name,
    nickname = "",
    country = "",
    city = "",
    gender = "male",
    birthDate = null,
    weightClass = "",
    style = "",
    stance = "orthodox",

    isReal = false,
    sourceId = null,
    activeAtStart = true
}) {
    return {
        id: createId("world_fighter"),

        name,
        nickname,

        country,
        city,
        gender,

        birthDate,

        weightClass,
        style,
        stance,

        isReal,
        source:
            isReal
                ? "real"
                : "simulated",

        sourceId,

        canonical: isReal,

        active:
            activeAtStart,

        activeAtStart,

        attributes: {
            striking: 50,
            wrestling: 50,
            grappling: 50,
            bjj: 50,
            takedownDefense: 50,
            strikingDefense: 50,
            cardio: 50,
            strength: 50,
            speed: 50,
            durability: 50,
            fightIQ: 50,
            discipline: 50,
            confidence: 50,
            mental: 50
        },

        ovr: 50,
        potential: 50,

        record: {
            wins: 0,
            losses: 0,
            draws: 0,
            noContests: 0,
            fights: 0
        },

        rankings: {},

        organizationId: null,

        titles: [],

        streak: 0,
        longestStreak: 0,

        reputation: 20,
        hype: 0,

        earnings: 0,

        history: [],
        fights: [],

        careerStartDate: null,
        retirementDate: null
    };
}

export function addFightToFighter(
    fighter,
    fightId
) {
    if (!fighter.fights.includes(fightId)) {
        fighter.fights.push(fightId);
    }

    return fighter;
}

export function applyFightResult(
    fighter,
    result
) {
    if (!fighter || !result) {
        return fighter;
    }

    fighter.record.fights++;

    if (result === "win") {
        fighter.record.wins++;
        fighter.streak++;
    }

    if (result === "loss") {
        fighter.record.losses++;
        fighter.streak = 0;
    }

    if (result === "draw") {
        fighter.record.draws++;
    }

    if (result === "no_contest") {
        fighter.record.noContests++;
    }

    fighter.longestStreak =
        Math.max(
            fighter.longestStreak,
            fighter.streak
        );

    return fighter;
}

export function setFighterRanking(
    fighter,
    organizationId,
    weightClass,
    position
) {
    if (
        !fighter.rankings[
            organizationId
        ]
    ) {
        fighter.rankings[
            organizationId
        ] = {};
    }

    fighter.rankings[
        organizationId
    ][weightClass] = position;

    return fighter;
}

export function retireFighter(
    fighter,
    date
) {
    fighter.active = false;
    fighter.retirementDate = date;

    return fighter;
}
