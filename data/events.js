// data/events.js

/*
 * MMA DESTINY
 * Base de eventos de MMA.
 *
 * Este arquivo guarda dados.
 * A simulação dos eventos pertence ao World Engine.
 */

export const EVENTS = [

    // =========================================================
    // UFC
    // =========================================================

    {
        id: "ufc_1",
        name: "UFC 1",
        organization: "ufc",
        date: "1993-11-12",
        city: "Denver",
        country: "USA",
        venue: "McNichols Sports Arena",

        source: "real",
        historical: true,
        simulation: false,

        type: "numbered",
        titleFights: 0,

        card: []
    },

    {
        id: "ufc_100",
        name: "UFC 100",
        organization: "ufc",
        date: "2009-07-11",
        city: "Las Vegas",
        country: "USA",
        venue: "Mandalay Bay Events Center",

        source: "real",
        historical: true,
        simulation: false,

        type: "numbered",
        titleFights: 2,

        card: []
    },

    {
        id: "ufc_200",
        name: "UFC 200",
        organization: "ufc",
        date: "2016-07-09",
        city: "Las Vegas",
        country: "USA",
        venue: "T-Mobile Arena",

        source: "real",
        historical: true,
        simulation: false,

        type: "numbered",
        titleFights: 3,

        card: []
    },

    {
        id: "ufc_300",
        name: "UFC 300",
        organization: "ufc",
        date: "2024-04-13",
        city: "Las Vegas",
        country: "USA",
        venue: "T-Mobile Arena",

        source: "real",
        historical: true,
        simulation: false,

        type: "numbered",
        titleFights: 3,

        card: []
    },

    // =========================================================
    // PRIDE
    // =========================================================

    {
        id: "pride_gp_2000",
        name: "PRIDE Grand Prix 2000",
        organization: "pride",
        date: "2000-05-01",
        city: "Tokyo",
        country: "JPN",
        venue: "Tokyo",

        source: "real",
        historical: true,
        simulation: false,

        type: "grand_prix",
        titleFights: 0,

        card: []
    },

    {
        id: "pride_final_conflict_2005",
        name: "PRIDE Final Conflict 2005",
        organization: "pride",
        date: "2005-11-26",
        city: "Tokyo",
        country: "JPN",
        venue: "Saitama Super Arena",

        source: "real",
        historical: true,
        simulation: false,

        type: "grand_prix",
        titleFights: 0,

        card: []
    },

    // =========================================================
    // BELLATOR
    // =========================================================

    {
        id: "bellator_1",
        name: "Bellator 1",
        organization: "bellator",
        date: "2009-04-03",
        city: "Hollywood",
        country: "USA",
        venue: "Seminole Hard Rock Hotel & Casino",

        source: "real",
        historical: true,
        simulation: false,

        type: "numbered",
        titleFights: 0,

        card: []
    },

    // =========================================================
    // ONE
    // =========================================================

    {
        id: "one_championship_1",
        name: "ONE Championship 1",
        organization: "one_championship",
        date: "2011-07-14",
        city: "Singapore",
        country: "SGP",
        venue: "Singapore Indoor Stadium",

        source: "real",
        historical: true,
        simulation: false,

        type: "numbered",
        titleFights: 0,

        card: []
    },

    // =========================================================
    // RIZIN
    // =========================================================

    {
        id: "rizin_1",
        name: "RIZIN 1",
        organization: "rizin",
        date: "2016-04-17",
        city: "Nagoya",
        country: "JPN",
        venue: "Nippon Gaishi Hall",

        source: "real",
        historical: true,
        simulation: false,

        type: "numbered",
        titleFights: 0,

        card: []
    },

    // =========================================================
    // KSW
    // =========================================================

    {
        id: "ksw_1",
        name: "KSW 1",
        organization: "ksw",
        date: "2004-02-27",
        city: "Warsaw",
        country: "POL",
        venue: "Warsaw",

        source: "real",
        historical: true,
        simulation: false,

        type: "numbered",
        titleFights: 0,

        card: []
    },

    // =========================================================
    // CAGE WARRIORS
    // =========================================================

    {
        id: "cw_1",
        name: "Cage Warriors 1",
        organization: "cage_warriors",
        date: "2002-07-27",
        city: "London",
        country: "GBR",
        venue: "London",

        source: "real",
        historical: true,
        simulation: false,

        type: "numbered",
        titleFights: 0,

        card: []
    },

    // =========================================================
    // UAE WARRIORS
    // =========================================================

    {
        id: "uae_warriors_1",
        name: "UAE Warriors 1",
        organization: "uae_warriors",
        date: "2012-10-18",
        city: "Abu Dhabi",
        country: "ARE",
        venue: "Abu Dhabi",

        source: "real",
        historical: true,
        simulation: false,

        type: "numbered",
        titleFights: 0,

        card: []
    },

    // =========================================================
    // LFA
    // =========================================================

    {
        id: "lfa_1",
        name: "LFA 1",
        organization: "lfa",
        date: "2017-01-13",
        city: "Dallas",
        country: "USA",
        venue: "The Bomb Factory",

        source: "real",
        historical: true,
        simulation: false,

        type: "numbered",
        titleFights: 0,

        card: []
    },

    // =========================================================
    // JUNGLE FIGHT
    // =========================================================

    {
        id: "jungle_fight_1",
        name: "Jungle Fight 1",
        organization: "jungle_fight",
        date: "2003-09-13",
        city: "São Paulo",
        country: "BRA",
        venue: "São Paulo",

        source: "real",
        historical: true,
        simulation: false,

        type: "numbered",
        titleFights: 0,

        card: []
    },

    // =========================================================
    // SFT
    // =========================================================

    {
        id: "sft_1",
        name: "SFT 1",
        organization: "sft",
        date: "2018-01-01",
        city: "São Paulo",
        country: "BRA",
        venue: "São Paulo",

        source: "real",
        historical: true,
        simulation: false,

        type: "numbered",
        titleFights: 0,

        card: []
    },

    // =========================================================
    // SHOOTO BRASIL
    // =========================================================

    {
        id: "shooto_brasil_1",
        name: "Shooto Brasil 1",
        organization: "shooto_brasil",
        date: "2005-01-01",
        city: "Rio de Janeiro",
        country: "BRA",
        venue: "Rio de Janeiro",

        source: "real",
        historical: true,
        simulation: false,

        type: "numbered",
        titleFights: 0,

        card: []
    }
];


// =============================================================
// FUNÇÕES
// =============================================================

export function getEventById(id) {
    return EVENTS.find(event => event.id === id) || null;
}

export function getEventsByOrganization(organizationId) {
    return EVENTS.filter(
        event => event.organization === organizationId
    );
}

export function getEventsByYear(year) {
    return EVENTS.filter(event =>
        event.date.startsWith(String(year))
    );
}

export function getEventsByCountry(countryId) {
    return EVENTS.filter(
        event => event.country === countryId
    );
}

export function getHistoricalEvents() {
    return EVENTS.filter(event => event.historical === true);
}

export function getEventsBetween(startDate, endDate) {
    return EVENTS.filter(event =>
        event.date >= startDate &&
        event.date <= endDate
    );
}
