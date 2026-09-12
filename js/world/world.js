import { state } from "../core/state.js";

import {
    createOrganization,
    addOrganization,
    getActiveOrganizations
} from "./organizations.js";

import {
    createEvent,
    getUpcomingEvents
} from "./events.js";

import {
    generateFighters
} from "./fighters.js";

import {
    rankFighters,
    recalculateAllRankings
} from "./rankings.js";

import {
    createChampionship
} from "./championships.js";

import {
    createNews
} from "./news.js";

import {
    saveWorldRecords
} from "./records.js";

export function initializeWorld() {
    ensureWorldState();

    if (
        state.world.organizations.length ===
        0
    ) {
        createDefaultOrganizations();
    }

    if (
        state.world.fighters.length ===
        0
    ) {
        createDefaultFighters();
    }

    initializeChampionships();

    initializeRankings();

    createInitialEvents();

    saveWorldRecords(
        state.world.fighters
    );

    return getWorldSummary();
}

function ensureWorldState() {
    if (!state.world) {
        state.world = {};
    }

    state.world.organizations ??= [];
    state.world.events ??= [];
    state.world.fighters ??= [];
    state.world.fights ??= [];
    state.world.championships ??= [];
    state.world.history ??= [];
    state.world.news ??= [];
    state.world.records ??= {};
}

function createDefaultOrganizations() {
    const organizations = [
        {
            name: "Global Fighting Championship",
            acronym: "GFC",
            country: "Estados Unidos",
            type: "major",
            reputation: 95
        },

        {
            name: "World Combat League",
            acronym: "WCL",
            country: "Reino Unido",
            type: "major",
            reputation: 88
        },

        {
            name: "UAE Combat Championship",
            acronym: "UCC",
            country: "Emirados Árabes Unidos",
            type: "international",
            reputation: 82
        },

        {
            name: "Brazilian Fighting League",
            acronym: "BFL",
            country: "Brasil",
            type: "international",
            reputation: 78
        },

        {
            name: "South America MMA",
            acronym: "SAM",
            country: "Brasil",
            type: "regional",
            reputation: 60
        },

        {
            name: "European Combat Series",
            acronym: "ECS",
            country: "Espanha",
            type: "international",
            reputation: 70
        },

        {
            name: "Asia Combat League",
            acronym: "ACL",
            country: "Japão",
            type: "international",
            reputation: 72
        }
    ];

    organizations.forEach(data => {
        addOrganization(
            createOrganization(data)
        );
    });
}

function createDefaultFighters() {
    const organizations =
        getActiveOrganizations();

    organizations.forEach(
        organization => {
            const quantity =
                getRosterSize(
                    organization.type
                );

            const fighters =
                generateFighters(
                    quantity
                );

            fighters.forEach(fighter => {
                state.world.fighters.push(
                    fighter
                );

                fighter.organizationId =
                    organization.id;

                if (
                    !organization.roster.includes(
                        fighter.id
                    )
                ) {
                    organization.roster.push(
                        fighter.id
                    );
                }
            });
        }
    );
}

function getRosterSize(type) {
    switch (type) {
        case "major":
            return 90;

        case "international":
            return 65;

        case "regional":
            return 40;

        case "amateur":
            return 25;

        default:
            return 40;
    }
}

function initializeChampionships() {
    const organizations =
        getActiveOrganizations();

    organizations.forEach(
        organization => {
            organization.weightClasses.forEach(
                weightClass => {
                    const alreadyExists =
                        state.world.championships.some(
                            championship =>
                                championship.organizationId ===
                                    organization.id &&
                                championship.weightClass ===
                                    weightClass
                        );

                    if (!alreadyExists) {
                        createChampionship({
                            organizationId:
                                organization.id,

                            weightClass
                        });
                    }
                }
            );
        }
    );
}

function initializeRankings() {
    const organizations =
        getActiveOrganizations();

    organizations.forEach(
        organization => {
            organization.weightClasses.forEach(
                weightClass => {
                    const fighters =
                        state.world.fighters.filter(
                            fighter =>
                                fighter.organizationId ===
                                    organization.id &&
                                fighter.weightClass ===
                                    weightClass
                        );

                    if (!fighters.length) {
                        return;
                    }

                    rankFighters(
                        organization.id,
                        weightClass,
                        fighters
                    );
                }
            );
        }
    );

    recalculateAllRankings(
        organizations,
        state.world.fighters
    );

    assignInitialChampions();
}

function assignInitialChampions() {
    const organizations =
        getActiveOrganizations();

    organizations.forEach(
        organization => {
            organization.weightClasses.forEach(
                weightClass => {
                    const ranking =
                        organization.rankings[
                            weightClass
                        ];

                    if (!ranking) {
                        return;
                    }

                    if (
                        ranking.champion
                    ) {
                        return;
                    }

                    const first =
                        ranking.rankings[0];

                    if (!first) {
                        return;
                    }

                    ranking.champion =
                        first;

                    const championship =
                        state.world.championships.find(
                            title =>
                                title.organizationId ===
                                    organization.id &&
                                title.weightClass ===
                                    weightClass
                        );

                    if (championship) {
                        championship.championId =
                            first;
                    }
                }
            );
        }
    );
}

function createInitialEvents() {
    if (
        state.world.events.length > 0
    ) {
        return;
    }

    const organizations =
        getActiveOrganizations();

    const baseDate =
        new Date();

    organizations.forEach(
        (organization, index) => {
            const date =
                new Date(baseDate);

            date.setDate(
                date.getDate() +
                    7 +
                    index * 10
            );

            createEvent({
                organizationId:
                    organization.id,

                name:
                    `${organization.acronym} ${baseDate.getFullYear()} - ${index + 1}`,

                date:
                    date.toISOString(),

                location: {
                    city:
                        organization.country ===
                        "Brasil"
                            ? "São Paulo"
                            : organization.country ===
                              "Estados Unidos"
                            ? "Las Vegas"
                            : "Arena Internacional",

                    country:
                        organization.country,

                    venue:
                        "MMA Destiny Arena"
                },

                type:
                    index % 3 === 0
                        ? "ppv"
                        : "regular"
            });
        }
    );
}

export function advanceWorldWeek() {
    ensureWorldState();

    processFighterAvailability();

    processNPCDevelopment();

    processRankings();

    processUpcomingEvents();

    processWorldNews();

    saveWorldRecords(
        state.world.fighters
    );

    return getWorldSummary();
}

function processFighterAvailability() {
    state.world.fighters.forEach(
        fighter => {
            if (
                fighter.availability
                    ?.weeksOut > 0
            ) {
                fighter.availability.weeksOut--;

                if (
                    fighter.availability
                        .weeksOut <= 0
                ) {
                    fighter.availability.weeksOut =
                        0;

                    fighter.availability.available =
                        true;

                    fighter.availability.reason =
                        null;
                }
            }
        }
    );
}

function processNPCDevelopment() {
    state.world.fighters.forEach(
        fighter => {
            const development =
                fighter.development;

            if (!development) {
                return;
            }

            const age =
                fighter.identity.age;

            const attributes =
                fighter.attributes;

            const peak =
                development.peakAge;

            let multiplier =
                development.growthRate;

            if (age > peak) {
                multiplier =
                    -development.regressionRate;
            }

            if (age < 20) {
                multiplier *= 1.5;
            }

            Object.keys(attributes).forEach(
                attribute => {
                    if (
                        Math.random() >
                        0.15
                    ) {
                        return;
                    }

                    const change =
                        (
                            Math.random() *
                            0.08
                        ) *
                        multiplier;

                    attributes[attribute] =
                        Math.max(
                            20,
                            Math.min(
                                99,
                                attributes[
                                    attribute
                                ] + change
                            )
                        );
                }
            );

            fighter.ovr =
                calculateSimpleOVR(
                    attributes
                );

            fighter.identity.age =
                calculateAge(
                    fighter
                );
        }
    );
}

function processRankings() {
    const organizations =
        getActiveOrganizations();

    organizations.forEach(
        organization => {
            organization.weightClasses.forEach(
                weightClass => {
                    const fighters =
                        state.world.fighters.filter(
                            fighter =>
                                fighter.organizationId ===
                                    organization.id &&
                                fighter.weightClass ===
                                    weightClass
                        );

                    rankFighters(
                        organization.id,
                        weightClass,
                        fighters
                    );
                }
            );
        }
    );
}

function processUpcomingEvents() {
    const events =
        getUpcomingEvents(100);

    events.forEach(event => {
        const eventDate =
            new Date(event.date);

        const currentDate =
            new Date(
                state.calendar?.date ||
                    new Date()
            );

        if (
            eventDate <= currentDate
        ) {
            event.status =
                "upcoming";
        }
    });
}

function processWorldNews() {
    if (
        Math.random() > 0.08
    ) {
        return;
    }

    createNews({
        type: "general",

        title:
            "Semana movimentada no mundo do MMA",

        body:
            "O cenário mundial continua se movimentando, com lutadores buscando novas oportunidades e organizações preparando seus próximos eventos.",

        importance: 1,

        tags: [
            "Mundo",
            "MMA"
        ]
    });
}

function calculateSimpleOVR(
    attributes
) {
    const values =
        Object.values(attributes);

    if (!values.length) {
        return 0;
    }

    return Math.round(
        values.reduce(
            (sum, value) =>
                sum + value,
            0
        ) / values.length
    );
}

function calculateAge(
    fighter
) {
    const birthYear =
        fighter.identity.birthYear;

    const currentYear =
        Number(
            String(
                state.calendar?.date ||
                    new Date().getFullYear()
            ).slice(0, 4)
        );

    return Math.max(
        15,
        currentYear - birthYear
    );
}

export function getWorldSummary() {
    return {
        organizations:
            state.world.organizations
                ?.length || 0,

        fighters:
            state.world.fighters
                ?.length || 0,

        events:
            state.world.events
                ?.length || 0,

        fights:
            state.world.fights
                ?.length || 0,

        championships:
            state.world.championships
                ?.length || 0,

        history:
            state.world.history
                ?.length || 0,

        news:
            state.world.news
                ?.length || 0
    };
}

export function getWorldState() {
    return state.world;
}
