// data/organizations.js

/*
 * MMA DESTINY
 * Base de organizações reais de MMA.
 *
 * IMPORTANTE:
 * Este arquivo contém DADOS.
 * A lógica de simulação pertence a:
 * js/world/organizations.js
 *
 * source:
 *   real      = organização real
 *
 * status:
 *   active    = ativa no universo inicial
 *   historical = organização histórica
 *
 * Os dados históricos podem continuar existindo
 * mesmo quando uma organização deixa de operar
 * independentemente.
 */

export const ORGANIZATIONS = [

    // =========================================================
    // GLOBAL
    // =========================================================

    {
        id: "ufc",
        name: "UFC",
        shortName: "UFC",
        country: "USA",
        headquarters: "Las Vegas",
        continent: "North America",

        source: "real",
        status: "active",

        level: "global",
        prestige: 100,
        reputation: 100,

        rankingSystem: true,
        championshipSystem: true,

        weightClasses: [
            "flyweight",
            "bantamweight",
            "featherweight",
            "lightweight",
            "welterweight",
            "middleweight",
            "light_heavyweight",
            "heavyweight",

            "womens_strawweight",
            "womens_flyweight",
            "womens_bantamweight",
            "womens_flyweight"
        ],

        annualEventTarget: 40,

        media: {
            globalReach: 100,
            television: 100,
            streaming: 100,
            socialMedia: 100
        },

        athleteDevelopment: 92,

        description:
            "Principal organização global de MMA profissional."
    },

    {
        id: "one_championship",
        name: "ONE Championship",
        shortName: "ONE",
        country: "SGP",
        headquarters: "Singapore",
        continent: "Asia",

        source: "real",
        status: "active",

        level: "global",
        prestige: 96,
        reputation: 97,

        rankingSystem: true,
        championshipSystem: true,

        weightClasses: [
            "strawweight",
            "flyweight",
            "bantamweight",
            "featherweight",
            "lightweight",
            "welterweight",
            "middleweight",
            "light_heavyweight",
            "heavyweight"
        ],

        disciplines: [
            "mma",
            "muay_thai",
            "kickboxing",
            "submission_grappling"
        ],

        annualEventTarget: 45,

        media: {
            globalReach: 96,
            television: 94,
            streaming: 98,
            socialMedia: 97
        },

        athleteDevelopment: 90,

        description:
            "Grande organização internacional de artes marciais sediada em Singapura."
    },

    {
        id: "pfl",
        name: "Professional Fighters League",
        shortName: "PFL",
        country: "USA",
        headquarters: "New York",
        continent: "North America",

        source: "real",
        status: "active",

        level: "global",
        prestige: 92,
        reputation: 92,

        rankingSystem: true,
        championshipSystem: true,

        weightClasses: [
            "bantamweight",
            "featherweight",
            "lightweight",
            "welterweight",
            "middleweight",
            "light_heavyweight",
            "heavyweight",

            "womens_flyweight",
            "womens_featherweight"
        ],

        competitionFormats: [
            "season",
            "tournament",
            "superfight",
            "championship"
        ],

        annualEventTarget: 30,

        media: {
            globalReach: 91,
            television: 90,
            streaming: 94,
            socialMedia: 93
        },

        athleteDevelopment: 89,

        description:
            "Organização global de MMA com estrutura competitiva baseada em temporadas, torneios e eventos."
    },

    // =========================================================
    // HISTÓRICAS / INTEGRADAS AO UNIVERSO
    // =========================================================

    {
        id: "bellator",
        name: "Bellator MMA",
        shortName: "Bellator",
        country: "USA",
        headquarters: "Los Angeles",
        continent: "North America",

        source: "real",
        status: "historical",

        level: "global",
        prestige: 91,
        reputation: 90,

        rankingSystem: true,
        championshipSystem: true,

        weightClasses: [
            "flyweight",
            "bantamweight",
            "featherweight",
            "lightweight",
            "welterweight",
            "middleweight",
            "light_heavyweight",
            "heavyweight",

            "womens_flyweight",
            "womens_featherweight"
        ],

        media: {
            globalReach: 87,
            television: 86,
            streaming: 90,
            socialMedia: 89
        },

        athleteDevelopment: 88,

        description:
            "Importante promoção norte-americana de MMA integrada historicamente ao universo do esporte."
    },

    {
        id: "strikeforce",
        name: "Strikeforce",
        shortName: "Strikeforce",
        country: "USA",
        headquarters: "San Jose",
        continent: "North America",

        source: "real",
        status: "historical",

        level: "global",
        prestige: 87,
        reputation: 86,

        rankingSystem: true,
        championshipSystem: true,

        weightClasses: [
            "bantamweight",
            "featherweight",
            "lightweight",
            "welterweight",
            "middleweight",
            "light_heavyweight",
            "heavyweight"
        ],

        media: {
            globalReach: 80,
            television: 82,
            streaming: 78,
            socialMedia: 72
        },

        athleteDevelopment: 84,

        description:
            "Promoção histórica norte-americana que teve grande importância na evolução do MMA."
    },

    // =========================================================
    // JAPÃO / ÁSIA
    // =========================================================

    {
        id: "rizin",
        name: "RIZIN Fighting Federation",
        shortName: "RIZIN",
        country: "JPN",
        headquarters: "Tokyo",
        continent: "Asia",

        source: "real",
        status: "active",

        level: "major",
        prestige: 90,
        reputation: 91,

        rankingSystem: true,
        championshipSystem: true,

        weightClasses: [
            "bantamweight",
            "featherweight",
            "lightweight",
            "welterweight",
            "middleweight",
            "light_heavyweight",
            "heavyweight"
        ],

        media: {
            globalReach: 84,
            television: 88,
            streaming: 87,
            socialMedia: 85
        },

        athleteDevelopment: 87,

        description:
            "Grande promoção japonesa de MMA."
    },

    {
        id: "deep",
        name: "DEEP",
        shortName: "DEEP",
        country: "JPN",
        headquarters: "Tokyo",
        continent: "Asia",

        source: "real",
        status: "active",

        level: "regional",
        prestige: 74,
        reputation: 76,

        rankingSystem: true,
        championshipSystem: true,

        weightClasses: [
            "flyweight",
            "bantamweight",
            "featherweight",
            "lightweight",
            "welterweight",
            "middleweight",
            "light_heavyweight",
            "heavyweight"
        ],

        media: {
            globalReach: 62,
            television: 70,
            streaming: 68,
            socialMedia: 64
        },

        athleteDevelopment: 82,

        description:
            "Promoção japonesa tradicional de MMA."
    },

    // =========================================================
    // EUROPA
    // =========================================================

    {
        id: "ksw",
        name: "Konfrontacja Sztuk Walki",
        shortName: "KSW",
        country: "POL",
        headquarters: "Warsaw",
        continent: "Europe",

        source: "real",
        status: "active",

        level: "major",
        prestige: 86,
        reputation: 88,

        rankingSystem: true,
        championshipSystem: true,

        weightClasses: [
            "bantamweight",
            "featherweight",
            "lightweight",
            "welterweight",
            "middleweight",
            "light_heavyweight",
            "heavyweight"
        ],

        media: {
            globalReach: 78,
            television: 84,
            streaming: 84,
            socialMedia: 83
        },

        athleteDevelopment: 86,

        description:
            "Uma das principais organizações de MMA da Europa."
    },

    {
        id: "cage_warriors",
        name: "Cage Warriors",
        shortName: "CW",
        country: "GBR",
        headquarters: "London",
        continent: "Europe",

        source: "real",
        status: "active",

        level: "major",
        prestige: 82,
        reputation: 84,

        rankingSystem: true,
        championshipSystem: true,

        weightClasses: [
            "flyweight",
            "bantamweight",
            "featherweight",
            "lightweight",
            "welterweight",
            "middleweight",
            "light_heavyweight",
            "heavyweight"
        ],

        media: {
            globalReach: 74,
            television: 80,
            streaming: 88,
            socialMedia: 80
        },

        athleteDevelopment: 94,

        description:
            "Importante organização europeia conhecida também pelo desenvolvimento de atletas."
    },

    {
        id: "ares_fc",
        name: "Ares Fighting Championship",
        shortName: "Ares FC",
        country: "FRA",
        headquarters: "Paris",
        continent: "Europe",

        source: "real",
        status: "active",

        level: "major",
        prestige: 76,
        reputation: 79,

        rankingSystem: true,
        championshipSystem: true,

        weightClasses: [
            "bantamweight",
            "featherweight",
            "lightweight",
            "welterweight",
            "middleweight",
            "light_heavyweight",
            "heavyweight"
        ],

        media: {
            globalReach: 65,
            television: 70,
            streaming: 78,
            socialMedia: 76
        },

        athleteDevelopment: 86,

        description:
            "Promoção francesa de MMA com atuação internacional."
    },

    // =========================================================
    // ORIENTE MÉDIO
    // =========================================================

    {
        id: "uae_warriors",
        name: "UAE Warriors",
        shortName: "UAE Warriors",
        country: "ARE",
        headquarters: "Abu Dhabi",
        continent: "Asia",

        source: "real",
        status: "active",

        level: "major",
        prestige: 77,
        reputation: 80,

        rankingSystem: true,
        championshipSystem: true,

        weightClasses: [
            "bantamweight",
            "featherweight",
            "lightweight",
            "welterweight",
            "middleweight",
            "light_heavyweight",
            "heavyweight"
        ],

        media: {
            globalReach: 72,
            television: 76,
            streaming: 82,
            socialMedia: 78
        },

        athleteDevelopment: 84,

        description:
            "Organização internacional sediada em Abu Dhabi."
    },

    // =========================================================
    // ESTADOS UNIDOS / DESENVOLVIMENTO
    // =========================================================

    {
        id: "lfa",
        name: "Legacy Fighting Alliance",
        shortName: "LFA",
        country: "USA",
        headquarters: "USA",
        continent: "North America",

        source: "real",
        status: "active",

        level: "development",
        prestige: 78,
        reputation: 82,

        rankingSystem: true,
        championshipSystem: true,

        weightClasses: [
            "flyweight",
            "bantamweight",
            "featherweight",
            "lightweight",
            "welterweight",
            "middleweight",
            "light_heavyweight",
            "heavyweight",

            "womens_strawweight",
            "womens_flyweight",
            "womens_bantamweight"
        ],

        media: {
            globalReach: 68,
            television: 74,
            streaming: 84,
            socialMedia: 76
        },

        athleteDevelopment: 96,

        description:
            "Organização norte-americana de desenvolvimento de talentos."
    },

    // =========================================================
    // BRASIL
    // =========================================================

    {
        id: "sft",
        name: "SFT MMA",
        shortName: "SFT",
        country: "BRA",
        headquarters: "São Paulo",
        continent: "South America",

        source: "real",
        status: "active",

        level: "major",
        prestige: 70,
        reputation: 76,

        rankingSystem: true,
        championshipSystem: true,

        weightClasses: [
            "flyweight",
            "bantamweight",
            "featherweight",
            "lightweight",
            "welterweight",
            "middleweight",
            "light_heavyweight",
            "heavyweight",

            "womens_strawweight",
            "womens_flyweight",
            "womens_bantamweight"
        ],

        media: {
            globalReach: 58,
            television: 72,
            streaming: 74,
            socialMedia: 78
        },

        athleteDevelopment: 88,

        description:
            "Importante organização brasileira de MMA."
    },

    {
        id: "jungle_fight",
        name: "Jungle Fight",
        shortName: "Jungle Fight",
        country: "BRA",
        headquarters: "São Paulo",
        continent: "South America",

        source: "real",
        status: "active",

        level: "major",
        prestige: 73,
        reputation: 79,

        rankingSystem: true,
        championshipSystem: true,

        weightClasses: [
            "flyweight",
            "bantamweight",
            "featherweight",
            "lightweight",
            "welterweight",
            "middleweight",
            "light_heavyweight",
            "heavyweight",

            "womens_strawweight",
            "womens_flyweight",
            "womens_bantamweight"
        ],

        media: {
            globalReach: 60,
            television: 70,
            streaming: 72,
            socialMedia: 76
        },

        athleteDevelopment: 94,

        description:
            "Tradicional organização brasileira e importante plataforma de desenvolvimento de atletas."
    },

    {
        id: "shooto_brasil",
        name: "Shooto Brasil",
        shortName: "Shooto Brasil",
        country: "BRA",
        headquarters: "Rio de Janeiro",
        continent: "South America",

        source: "real",
        status: "active",

        level: "development",
        prestige: 65,
        reputation: 72,

        rankingSystem: true,
        championshipSystem: true,

        weightClasses: [
            "flyweight",
            "bantamweight",
            "featherweight",
            "lightweight",
            "welterweight",
            "middleweight",
            "light_heavyweight"
        ],

        media: {
            globalReach: 48,
            television: 60,
            streaming: 68,
            socialMedia: 67
        },

        athleteDevelopment: 86,

        description:
            "Organização brasileira ligada à tradição Shooto."
    }
];


// =============================================================
// FUNÇÕES
// =============================================================

export function getOrganizationById(id) {
    return ORGANIZATIONS.find(org => org.id === id) || null;
}

export function getActiveOrganizations() {
    return ORGANIZATIONS.filter(org => org.status === "active");
}

export function getHistoricalOrganizations() {
    return ORGANIZATIONS.filter(org => org.status === "historical");
}

export function getOrganizationsByCountry(countryId) {
    return ORGANIZATIONS.filter(org => org.country === countryId);
}

export function getOrganizationsByLevel(level) {
    return ORGANIZATIONS.filter(org => org.level === level);
}

export function getOrganizationsByWeightClass(weightClassId) {
    return ORGANIZATIONS.filter(org =>
        org.weightClasses.includes(weightClassId)
    );
}

export function getOrganizationRankingLevel(id) {
    const organization = getOrganizationById(id);

    if (!organization) {
        return null;
    }

    return {
        prestige: organization.prestige,
        reputation: organization.reputation,
        athleteDevelopment: organization.athleteDevelopment
    };
}
