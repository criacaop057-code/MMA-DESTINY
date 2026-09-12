// data/academies.js

export const ACADEMIES = [

    {
        id: "american_top_team",
        name: "American Top Team",
        shortName: "ATT",
        country: "USA",
        city: "Coconut Creek",
        source: "real",
        status: "active",
        prestige: 96,
        reputation: 97,
        mmaLevel: 98,
        strikingLevel: 94,
        wrestlingLevel: 96,
        grapplingLevel: 96,
        bjjLevel: 95,
        development: 96,
        facilities: 97
    },

    {
        id: "american_kickboxing_academy",
        name: "American Kickboxing Academy",
        shortName: "AKA",
        country: "USA",
        city: "San Jose",
        source: "real",
        status: "active",
        prestige: 95,
        reputation: 96,
        mmaLevel: 97,
        strikingLevel: 94,
        wrestlingLevel: 98,
        grapplingLevel: 96,
        bjjLevel: 94,
        development: 96,
        facilities: 95
    },

    {
        id: "evolve_mma",
        name: "Evolve MMA",
        shortName: "Evolve",
        country: "SGP",
        city: "Singapore",
        source: "real",
        status: "active",
        prestige: 94,
        reputation: 96,
        mmaLevel: 93,
        strikingLevel: 99,
        wrestlingLevel: 88,
        grapplingLevel: 92,
        bjjLevel: 91,
        development: 94,
        facilities: 98
    },

    {
        id: "kill_cliff_fc",
        name: "Kill Cliff FC",
        shortName: "Kill Cliff FC",
        country: "USA",
        city: "Deerfield Beach",
        source: "real",
        status: "active",
        prestige: 94,
        reputation: 95,
        mmaLevel: 97,
        strikingLevel: 94,
        wrestlingLevel: 96,
        grapplingLevel: 94,
        bjjLevel: 92,
        development: 96,
        facilities: 98
    },

    {
        id: "x_gym",
        name: "X-Gym",
        shortName: "X-Gym",
        country: "BRA",
        city: "Rio de Janeiro",
        source: "real",
        status: "active",
        prestige: 90,
        reputation: 92,
        mmaLevel: 93,
        strikingLevel: 94,
        wrestlingLevel: 88,
        grapplingLevel: 95,
        bjjLevel: 97,
        development: 93,
        facilities: 91
    },

    {
        id: "nova_uniao",
        name: "Nova União",
        shortName: "Nova União",
        country: "BRA",
        city: "Rio de Janeiro",
        source: "real",
        status: "active",
        prestige: 97,
        reputation: 98,
        mmaLevel: 96,
        strikingLevel: 91,
        wrestlingLevel: 93,
        grapplingLevel: 99,
        bjjLevel: 99,
        development: 97,
        facilities: 90
    },

    {
        id: "fighting_n  erds",
        name: "Fighting Nerds",
        shortName: "Fighting Nerds",
        country: "BRA",
        city: "São Paulo",
        source: "real",
        status: "active",
        prestige: 91,
        reputation: 94,
        mmaLevel: 97,
        strikingLevel: 98,
        wrestlingLevel: 94,
        grapplingLevel: 94,
        bjjLevel: 93,
        development: 97,
        facilities: 94
    },

    {
        id: "chute_boxe",
        name: "Chute Boxe",
        shortName: "Chute Boxe",
        country: "BRA",
        city: "Curitiba",
        source: "real",
        status: "active",
        prestige: 96,
        reputation: 97,
        mmaLevel: 96,
        strikingLevel: 99,
        wrestlingLevel: 90,
        grapplingLevel: 93,
        bjjLevel: 91,
        development: 95,
        facilities: 91
    },

    {
        id: "team_nogueira",
        name: "Team Nogueira",
        shortName: "Team Nogueira",
        country: "BRA",
        city: "Rio de Janeiro",
        source: "real",
        status: "active",
        prestige: 94,
        reputation: 95,
        mmaLevel: 95,
        strikingLevel: 92,
        wrestlingLevel: 91,
        grapplingLevel: 97,
        bjjLevel: 98,
        development: 94,
        facilities: 93
    },

    {
        id: "team_renzo_gracie",
        name: "Renzo Gracie Academy",
        shortName: "Renzo Gracie",
        country: "USA",
        city: "New York",
        source: "real",
        status: "active",
        prestige: 98,
        reputation: 99,
        mmaLevel: 91,
        strikingLevel: 84,
        wrestlingLevel: 91,
        grapplingLevel: 99,
        bjjLevel: 100,
        development: 96,
        facilities: 94
    }
];

export function getAcademyById(id) {
    return ACADEMIES.find(academy => academy.id === id) || null;
}

export function getAcademiesByCountry(countryId) {
    return ACADEMIES.filter(academy => academy.country === countryId);
}

export function getAcademiesByCity(city) {
    return ACADEMIES.filter(academy => academy.city === city);
}

export function getTopAcademies(limit = 10) {
    return [...ACADEMIES]
        .sort((a, b) => b.prestige - a.prestige)
        .slice(0, limit);
}
