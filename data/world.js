// data/world.js

import { COUNTRIES } from "./countries.js";
import { CITIES } from "./cities.js";
import { WEIGHT_CLASSES } from "./weightClasses.js";
import { FIGHT_STYLES } from "./styles.js";
import { ORGANIZATIONS } from "./organizations.js";
import { ACADEMIES } from "./academies.js";
import { REAL_FIGHTERS } from "./fighters.js";
import { EVENTS } from "./events.js";
import { CURRENCIES } from "./currencies.js";


// =============================================================
// CONFIGURAÇÃO DO MUNDO
// =============================================================

export const WORLD_DATA_CONFIG = {

    version: "1.0.0",

    startDate: "2026-01-01",

    /*
     * Antes da data de divergência:
     * dados históricos/reais.
     *
     * Depois:
     * o Engine assume a simulação.
     */

    divergenceDate: "2026-01-01",

    defaultCurrency: "BRL",

    defaultCountry: "BRA",

    defaultCity: "SAO_PAULO",

    defaultWeightClass: "lightweight",

    defaultGender: "male",

    simulation: {
        enabled: true,

        generateNPCs: true,
        generateEvents: true,
        generateFights: true,
        generateRankings: true,
        generateNews: true,
        generateContracts: true,
        generateRetirements: true,
        generateInjuries: true,

        autonomousWorld: true
    }
};


// =============================================================
// DADOS BASE
// =============================================================

export const WORLD_DATA = {

    countries: COUNTRIES,

    cities: CITIES,

    weightClasses: WEIGHT_CLASSES,

    fightStyles: FIGHT_STYLES,

    organizations: ORGANIZATIONS,

    academies: ACADEMIES,

    fighters: REAL_FIGHTERS,

    events: EVENTS,

    currencies: CURRENCIES
};


// =============================================================
// INDEXADORES
// =============================================================

export function buildWorldIndexes() {

    const indexes = {

        countries: {},
        cities: {},
        organizations: {},
        academies: {},
        fighters: {},
        events: {},
        currencies: {}
    };


    for (const country of WORLD_DATA.countries) {
        indexes.countries[country.id] = country;
    }


    for (const city of WORLD_DATA.cities) {
        indexes.cities[city.id] = city;
    }


    for (const organization of WORLD_DATA.organizations) {
        indexes.organizations[organization.id] = organization;
    }


    for (const academy of WORLD_DATA.academies) {
        indexes.academies[academy.id] = academy;
    }


    for (const fighter of WORLD_DATA.fighters) {
        indexes.fighters[fighter.id] = fighter;
    }


    for (const event of WORLD_DATA.events) {
        indexes.events[event.id] = event;
    }


    for (const currency of WORLD_DATA.currencies) {
        indexes.currencies[currency.id] = currency;
    }


    return indexes;
}


// =============================================================
// ESTATÍSTICAS
// =============================================================

export function getWorldDataStats() {

    return {

        countries: WORLD_DATA.countries.length,

        cities: WORLD_DATA.cities.length,

        weightClasses: WORLD_DATA.weightClasses.length,

        fightStyles: WORLD_DATA.fightStyles.length,

        organizations: WORLD_DATA.organizations.length,

        academies: WORLD_DATA.academies.length,

        realFighters: WORLD_DATA.fighters.length,

        historicalEvents: WORLD_DATA.events.length,

        currencies: WORLD_DATA.currencies.length
    };
}


// =============================================================
// BUSCA GERAL
// =============================================================

export function searchWorldData(query) {

    const term = String(query)
        .toLowerCase()
        .trim();

    if (!term) {
        return [];
    }


    const results = [];


    for (const fighter of WORLD_DATA.fighters) {

        if (
            fighter.name.toLowerCase().includes(term) ||
            fighter.nickname?.toLowerCase().includes(term)
        ) {

            results.push({
                type: "fighter",
                id: fighter.id,
                name: fighter.name
            });
        }
    }


    for (const organization of WORLD_DATA.organizations) {

        if (
            organization.name.toLowerCase().includes(term) ||
            organization.shortName?.toLowerCase().includes(term)
        ) {

            results.push({
                type: "organization",
                id: organization.id,
                name: organization.name
            });
        }
    }


    for (const academy of WORLD_DATA.academies) {

        if (
            academy.name.toLowerCase().includes(term) ||
            academy.shortName?.toLowerCase().includes(term)
        ) {

            results.push({
                type: "academy",
                id: academy.id,
                name: academy.name
            });
        }
    }


    for (const event of WORLD_DATA.events) {

        if (
            event.name.toLowerCase().includes(term)
        ) {

            results.push({
                type: "event",
                id: event.id,
                name: event.name
            });
        }
    }


    return results;
}


// =============================================================
// VALIDAÇÃO
// =============================================================

export function validateWorldData() {

    const errors = [];


    for (const fighter of WORLD_DATA.fighters) {

        if (!fighter.id) {
            errors.push("Lutador sem ID.");
        }

        if (!fighter.name) {
            errors.push(`Lutador ${fighter.id} sem nome.`);
        }

        if (!fighter.organization) {
            errors.push(
                `Lutador ${fighter.id} sem organização.`
            );
        }
    }


    for (const organization of WORLD_DATA.organizations) {

        if (!organization.id) {
            errors.push("Organização sem ID.");
        }

        if (!organization.name) {
            errors.push(
                `Organização ${organization.id} sem nome.`
            );
        }
    }


    for (const event of WORLD_DATA.events) {

        if (!event.id) {
            errors.push("Evento sem ID.");
        }

        if (!event.name) {
            errors.push(
                `Evento ${event.id} sem nome.`
            );
        }

        if (!event.organization) {
            errors.push(
                `Evento ${event.id} sem organização.`
            );
        }
    }


    return {
        valid: errors.length === 0,
        errors
    };
}


// =============================================================
// EXPORTAÇÃO DO PACOTE COMPLETO
// =============================================================

export function getInitialWorldData() {

    return {
        config: WORLD_DATA_CONFIG,

        data: WORLD_DATA,

        indexes: buildWorldIndexes(),

        stats: getWorldDataStats()
    };
}
