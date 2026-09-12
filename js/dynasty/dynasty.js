import { createId } from "../core/ids.js";

export const DYNASTY_STATUS = {
    ACTIVE: "active",
    INACTIVE: "inactive",
    LEGENDARY: "legendary"
};

export function createDynasty({
    founderId,
    familyName = ""
}) {
    return {
        id: createId("dynasty"),

        familyName,
        founderId,

        status: DYNASTY_STATUS.ACTIVE,

        members: [],
        generations: [],

        legacyScore: 0,
        prestige: 0,

        championships: 0,
        professionalFighters: 0,
        champions: 0,

        totalWins: 0,
        totalFights: 0,

        wealth: 0,

        achievements: [],
        milestones: [],

        activeSuccessorId: null,

        history: []
    };
}

export function addMember(dynasty, memberId, generation = 1) {
    if (!dynasty.members.includes(memberId)) {
        dynasty.members.push(memberId);
    }

    let generationData = dynasty.generations.find(
        item => item.generation === generation
    );

    if (!generationData) {
        generationData = {
            generation,
            members: []
        };

        dynasty.generations.push(generationData);
    }

    if (!generationData.members.includes(memberId)) {
        generationData.members.push(memberId);
    }

    return dynasty;
}

export function addLegacy(dynasty, amount, reason = "") {
    dynasty.legacyScore = Math.max(
        0,
        dynasty.legacyScore + amount
    );

    dynasty.history.push({
        id: createId("dynasty_history"),
        type: "legacy",
        amount,
        reason,
        date: null
    });

    return dynasty.legacyScore;
}

export function registerAchievement(dynasty, achievement) {
    const entry = {
        id: createId("dynasty_achievement"),
        title: achievement.title,
        description: achievement.description || "",
        memberId: achievement.memberId || null,
        date: achievement.date || null,
        legacyValue: achievement.legacyValue || 1
    };

    dynasty.achievements.push(entry);

    addLegacy(
        dynasty,
        entry.legacyValue,
        entry.title
    );

    return entry;
}

export function updateDynastyStatus(dynasty) {
    if (dynasty.legacyScore >= 1000) {
        dynasty.status = DYNASTY_STATUS.LEGENDARY;
    } else if (dynasty.members.length === 0) {
        dynasty.status = DYNASTY_STATUS.INACTIVE;
    } else {
        dynasty.status = DYNASTY_STATUS.ACTIVE;
    }

    return dynasty.status;
}

export function getDynastyLevel(dynasty) {
    if (dynasty.legacyScore >= 1000) {
        return "lendária";
    }

    if (dynasty.legacyScore >= 600) {
        return "histórica";
    }

    if (dynasty.legacyScore >= 300) {
        return "respeitada";
    }

    if (dynasty.legacyScore >= 100) {
        return "emergente";
    }

    return "iniciante";
}
