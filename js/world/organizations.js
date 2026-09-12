import { createId } from "../core/ids.js";

export function createOrganization({
    name,
    shortName = "",
    country = "",
    type = "mma",
    founded = null,
    source = "simulated",
    canonical = false
}) {
    return {
        id: createId("org"),

        name,
        shortName,

        country,
        type,
        founded,

        source,
        canonical,

        active: true,

        prestige: 50,
        reputation: 50,

        weightClasses: [],

        fighters: [],

        champions: {},

        events: [],

        rankings: {},

        history: [],

        finances: {
            revenue: 0,
            expenses: 0,
            value: 0
        }
    };
}

export function addFighterToOrganization(
    organization,
    fighterId
) {
    if (
        !organization.fighters
            .includes(fighterId)
    ) {
        organization.fighters.push(
            fighterId
        );
    }

    return organization;
}

export function removeFighterFromOrganization(
    organization,
    fighterId
) {
    organization.fighters =
        organization.fighters.filter(
            id => id !== fighterId
        );

    return organization;
}

export function addWeightClass(
    organization,
    weightClass
) {
    if (
        !organization.weightClasses
            .includes(weightClass)
    ) {
        organization.weightClasses.push(
            weightClass
        );
    }

    return organization;
}

export function setChampion(
    organization,
    weightClass,
    fighterId
) {
    organization.champions[
        weightClass
    ] = fighterId;

    return organization;
}

export function getChampion(
    organization,
    weightClass
) {
    return (
        organization.champions[
            weightClass
        ] || null
    );
}

export function addOrganizationEvent(
    organization,
    eventId
) {
    if (
        !organization.events
            .includes(eventId)
    ) {
        organization.events.push(
            eventId
        );
    }

    return organization;
}

export function updateOrganizationPrestige(
    organization,
    amount
) {
    organization.prestige =
        Math.max(
            0,
            Math.min(
                100,
                organization.prestige +
                amount
            )
        );

    return organization.prestige;
}
