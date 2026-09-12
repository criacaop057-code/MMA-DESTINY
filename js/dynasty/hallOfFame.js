import { createId } from "../core/ids.js";

export const HALL_OF_FAME_REQUIREMENTS = {
    MIN_LEGACY: 500,
    MIN_WINS: 20,
    MIN_TITLES: 1
};

export function createHallOfFame() {
    return {
        members: [],
        candidates: [],
        history: []
    };
}

export function calculateHallScore(fighter) {
    if (!fighter) {
        return 0;
    }

    const career = fighter.career || {};

    const wins =
        career.record?.wins || 0;

    const titles =
        career.titles?.length || 0;

    const reputation =
        career.reputation || 0;

    return (
        wins * 10 +
        titles * 100 +
        reputation * 2
    );
}

export function isHallOfFameCandidate(
    fighter
) {
    if (!fighter) {
        return false;
    }

    const career = fighter.career || {};

    const wins =
        career.record?.wins || 0;

    const titles =
        career.titles?.length || 0;

    const legacy =
        calculateHallScore(fighter);

    return (
        (
            legacy >=
            HALL_OF_FAME_REQUIREMENTS.MIN_LEGACY
        ) &&
        (
            wins >=
            HALL_OF_FAME_REQUIREMENTS.MIN_WINS
        ) &&
        (
            titles >=
            HALL_OF_FAME_REQUIREMENTS.MIN_TITLES
        )
    );
}

export function addCandidate(
    hallOfFame,
    fighter
) {
    if (!fighter?.id) {
        return false;
    }

    if (
        hallOfFame.candidates.some(
            candidate =>
                candidate.fighterId === fighter.id
        )
    ) {
        return false;
    }

    hallOfFame.candidates.push({
        id: createId("hof_candidate"),
        fighterId: fighter.id,
        name: fighter.identity?.name ||
            fighter.name ||
            "Desconhecido",
        score: calculateHallScore(fighter),
        date: null
    });

    return true;
}

export function induct(
    hallOfFame,
    fighter,
    reason = ""
) {
    if (!fighter?.id) {
        return false;
    }

    if (
        hallOfFame.members.some(
            member =>
                member.fighterId === fighter.id
        )
    ) {
        return false;
    }

    hallOfFame.members.push({
        id: createId("hall_of_fame"),
        fighterId: fighter.id,
        name: fighter.identity?.name ||
            fighter.name ||
            "Desconhecido",
        score: calculateHallScore(fighter),
        reason,
        date: null
    });

    hallOfFame.history.push({
        fighterId: fighter.id,
        type: "induction",
        reason,
        date: null
    });

    return true;
}

export function getHallOfFameRanking(
    hallOfFame
) {
    return [...hallOfFame.members].sort(
        (a, b) => b.score - a.score
    );
}
