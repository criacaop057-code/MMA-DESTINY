import { createId } from "../core/ids.js";

export const WORLD_MODES = {
    REAL: "real",
    DIVERGENCE: "divergence",
    SIMULATION: "simulation"
};

export function createWorld({
    startDate = "2026-01-01",
    divergenceDate = "2026-01-01"
} = {}) {
    return {
        id: createId("world"),

        mode: WORLD_MODES.REAL,

        startDate,
        divergenceDate,

        currentDate: startDate,

        organizations: {},
        fighters: {},
        events: {},
        rankings: {},
        championships: {},

        news: [],
        history: [],

        activeEvents: [],
        completedEvents: [],

        statistics: {
            totalFighters: 0,
            activeFighters: 0,
            totalOrganizations: 0,
            totalEvents: 0,
            totalFights: 0,
            totalChampionships: 0
        },

        settings: {
            simulateRealWorld: false,
            simulateInactiveFighters: true,
            generateNews: true,
            generateEvents: true,
            updateRankings: true
        }
    };
}

export function setWorldDate(world, date) {
    world.currentDate = date;
    return world.currentDate;
}

export function setWorldMode(world, mode) {
    if (
        !Object.values(WORLD_MODES)
            .includes(mode)
    ) {
        return false;
    }

    world.mode = mode;

    return true;
}

export function checkDivergence(world) {
    if (
        world.currentDate >=
        world.divergenceDate
    ) {
        world.mode =
            WORLD_MODES.SIMULATION;

        return true;
    }

    return false;
}

export function registerOrganization(
    world,
    organization
) {
    if (!organization?.id) {
        return false;
    }

    world.organizations[
        organization.id
    ] = organization;

    world.statistics.totalOrganizations =
        Object.keys(
            world.organizations
        ).length;

    return true;
}

export function registerFighter(
    world,
    fighter
) {
    if (!fighter?.id) {
        return false;
    }

    world.fighters[fighter.id] =
        fighter;

    world.statistics.totalFighters =
        Object.keys(
            world.fighters
        ).length;

    return true;
}

export function registerEvent(
    world,
    event
) {
    if (!event?.id) {
        return false;
    }

    world.events[event.id] =
        event;

    world.statistics.totalEvents =
        Object.keys(
            world.events
        ).length;

    return true;
}

export function recordWorldHistory(
    world,
    entry
) {
    world.history.push({
        id: createId("world_history"),
        date:
            entry.date ||
            world.currentDate,

        type:
            entry.type ||
            "general",

        title:
            entry.title ||
            "",

        description:
            entry.description ||
            "",

        source:
            entry.source ||
            "simulation",

        data:
            entry.data ||
            {}
    });

    return world;
}

export function getWorldFighters(world) {
    return Object.values(
        world.fighters
    );
}

export function getWorldOrganizations(world) {
    return Object.values(
        world.organizations
    );
}

export function getWorldEvents(world) {
    return Object.values(
        world.events
    );
}

export function getWorldStatistics(world) {
    return {
        ...world.statistics,

        activeFighters:
            getWorldFighters(world)
                .filter(
                    fighter =>
                        fighter.active !== false
                ).length,

        totalFighters:
            getWorldFighters(world).length,

        totalOrganizations:
            getWorldOrganizations(world).length,

        totalEvents:
            getWorldEvents(world).length
    };
}
