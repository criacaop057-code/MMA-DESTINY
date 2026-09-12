import { createId } from "../core/ids.js";

const ACADEMY_TYPES = {
    SMALL: "small",
    STANDARD: "standard",
    PROFESSIONAL: "professional",
    ELITE: "elite",
    WORLD_CLASS: "world_class"
};

const ACADEMY_STATUS = {
    ACTIVE: "active",
    CLOSED: "closed",
    SUSPENDED: "suspended"
};

export function createAcademy({
    name,
    ownerId = null,
    city = "",
    country = "Brazil",
    type = ACADEMY_TYPES.SMALL
}) {
    return {
        id: createId("academy"),
        name,
        ownerId,

        location: {
            city,
            country
        },

        type,
        status: ACADEMY_STATUS.ACTIVE,

        foundedDate: null,

        reputation: 20,
        prestige: 10,
        legacy: 0,

        level: 1,
        experience: 0,
        nextLevelExperience: 100,

        students: [],
        staff: [],

        facilities: {
            tatame: 1,
            cage: 0,
            boxingArea: 0,
            wrestlingArea: 0,
            strengthRoom: 0,
            recoveryRoom: 0,
            lockerRooms: 1,
            offices: 0
        },

        capacity: 20,

        finance: {
            balance: 0,
            monthlyRevenue: 0,
            monthlyExpenses: 0,
            monthlyProfit: 0
        },

        services: {
            bjj: true,
            mma: true,
            boxing: false,
            muayThai: false,
            wrestling: false,
            strengthConditioning: false,
            privateLessons: false,
            camps: false
        },

        achievements: [],
        championships: 0,
        professionalFighters: 0,

        history: [],

        createdAt: null,
        updatedAt: null
    };
}

export function addStudent(academy, studentId) {
    if (!academy.students.includes(studentId)) {
        academy.students.push(studentId);
    }

    updateCapacity(academy);

    return academy;
}

export function removeStudent(academy, studentId) {
    academy.students = academy.students.filter(id => id !== studentId);

    updateCapacity(academy);

    return academy;
}

export function addStaff(academy, staffId) {
    if (!academy.staff.includes(staffId)) {
        academy.staff.push(staffId);
    }

    return academy;
}

export function removeStaff(academy, staffId) {
    academy.staff = academy.staff.filter(id => id !== staffId);

    return academy;
}

export function updateCapacity(academy) {
    const facilityBonus =
        academy.facilities.tatame * 15 +
        academy.facilities.cage * 10 +
        academy.facilities.boxingArea * 10 +
        academy.facilities.wrestlingArea * 10;

    academy.capacity = 20 + facilityBonus;

    return academy.capacity;
}

export function addAcademyExperience(academy, amount) {
    academy.experience += Math.max(0, amount);

    while (academy.experience >= academy.nextLevelExperience) {
        academy.experience -= academy.nextLevelExperience;
        academy.level++;

        academy.nextLevelExperience = Math.round(
            academy.nextLevelExperience * 1.35
        );

        academy.prestige = Math.min(
            100,
            academy.prestige + 2
        );

        academy.reputation = Math.min(
            100,
            academy.reputation + 1
        );
    }

    return academy;
}

export function updateAcademyReputation(academy, amount) {
    academy.reputation = Math.max(
        0,
        Math.min(100, academy.reputation + amount)
    );

    return academy.reputation;
}

export function updateAcademyPrestige(academy, amount) {
    academy.prestige = Math.max(
        0,
        Math.min(100, academy.prestige + amount)
    );

    return academy.prestige;
}

export function addAchievement(academy, achievement) {
    academy.achievements.push({
        id: createId("achievement"),
        title: achievement.title,
        description: achievement.description || "",
        date: achievement.date || null,
        fighterId: achievement.fighterId || null
    });

    academy.legacy += achievement.legacy || 1;

    return academy;
}

export function recordAcademyHistory(academy, event) {
    academy.history.push({
        id: createId("academy_event"),
        type: event.type || "general",
        description: event.description || "",
        date: event.date || null,
        data: event.data || {}
    });

    return academy;
}

export function enableService(academy, service) {
    if (Object.prototype.hasOwnProperty.call(academy.services, service)) {
        academy.services[service] = true;
    }

    return academy;
}

export function disableService(academy, service) {
    if (Object.prototype.hasOwnProperty.call(academy.services, service)) {
        academy.services[service] = false;
    }

    return academy;
}

export function getAcademyStrength(academy) {
    const reputation = academy.reputation * 0.35;
    const prestige = academy.prestige * 0.25;
    const level = Math.min(100, academy.level * 5) * 0.20;
    const legacy = Math.min(100, academy.legacy) * 0.20;

    return Math.round(
        reputation +
        prestige +
        level +
        legacy
    );
}

export function getAcademyStatus(academy) {
    if (academy.status === ACADEMY_STATUS.CLOSED) {
        return "Fechada";
    }

    if (academy.status === ACADEMY_STATUS.SUSPENDED) {
        return "Suspensa";
    }

    if (academy.reputation >= 85) {
        return "Academia de elite";
    }

    if (academy.reputation >= 65) {
        return "Academia respeitada";
    }

    if (academy.reputation >= 40) {
        return "Academia em crescimento";
    }

    return "Academia iniciante";
}

export function processAcademyWeek(academy) {
    if (!academy || academy.status !== ACADEMY_STATUS.ACTIVE) {
        return null;
    }

    const students = academy.students.length;

    const experienceGain =
        students +
        academy.staff.length * 2 +
        Math.floor(academy.prestige / 20);

    addAcademyExperience(academy, experienceGain);

    academy.updatedAt = null;

    return {
        students,
        staff: academy.staff.length,
        experienceGain,
        level: academy.level,
        reputation: academy.reputation,
        prestige: academy.prestige
    };
}

export {
    ACADEMY_TYPES,
    ACADEMY_STATUS
};
