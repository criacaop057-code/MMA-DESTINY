import { generateId } from "../core/ids.js";
import { state } from "../core/state.js";
import { WEIGHT_CLASSES } from "../core/constants.js";

export const ORGANIZATION_TYPES = {
    MAJOR: "major",
    INTERNATIONAL: "international",
    REGIONAL: "regional",
    AMATEUR: "amateur"
};

export const ORGANIZATION_STATUS = {
    ACTIVE: "active",
    INACTIVE: "inactive"
};

function createRankingStructure() {
    const rankings = {};

    Object.keys(WEIGHT_CLASSES).forEach(weightClass => {
        rankings[weightClass] = {
            champion: null,
            interimChampion: null,
            rankings: []
        };
    });

    return rankings;
}

export function createOrganization({
    name,
    acronym,
    country = "Brasil",
    type = ORGANIZATION_TYPES.REGIONAL,
    reputation = 50,
    rules = {}
}) {
    return {
        id: generateId("org"),

        name,
        acronym,
        country,
        type,

        status: ORGANIZATION_STATUS.ACTIVE,

        reputation,
        prestige: calculatePrestige(type, reputation),

        finances: {
            balance: 0,
            revenue: 0,
            expenses: 0
        },

        roster: [],

        weightClasses: Object.keys(WEIGHT_CLASSES),

        rankings: createRankingStructure(),

        championships: {},

        events: [],

        rules: {
            rounds: rules.rounds || 3,
            titleRounds: rules.titleRounds || 5,
            judging: rules.judging || "10-point-must",
            weighInAllowance:
                typeof rules.weighInAllowance === "number"
                    ? rules.weighInAllowance
                    : 0,
            catchweightAllowed: rules.catchweightAllowed !== false,
            interimTitles: rules.interimTitles !== false
        },

        statistics: {
            totalEvents: 0,
            totalFights: 0,
            totalTitleFights: 0,
            totalKnockouts: 0,
            totalSubmissions: 0,
            totalDecisions: 0
        },

        createdAt: Date.now()
    };
}

function calculatePrestige(type, reputation) {
    const multipliers = {
        [ORGANIZATION_TYPES.MAJOR]: 1.5,
        [ORGANIZATION_TYPES.INTERNATIONAL]: 1.25,
        [ORGANIZATION_TYPES.REGIONAL]: 1,
        [ORGANIZATION_TYPES.AMATEUR]: 0.6
    };

    return Math.round(reputation * (multipliers[type] || 1));
}

export function addOrganization(organization) {
    if (!state.world.organizations) {
        state.world.organizations = [];
    }

    state.world.organizations.push(organization);

    return organization;
}

export function getOrganizationById(id) {
    return (
        state.world.organizations?.find(
            organization => organization.id === id
        ) || null
    );
}

export function getOrganizationByAcronym(acronym) {
    return (
        state.world.organizations?.find(
            organization =>
                organization.acronym?.toLowerCase() ===
                acronym?.toLowerCase()
        ) || null
    );
}

export function getActiveOrganizations() {
    return (state.world.organizations || []).filter(
        organization =>
            organization.status === ORGANIZATION_STATUS.ACTIVE
    );
}

export function getOrganizationsByCountry(country) {
    return (state.world.organizations || []).filter(
        organization => organization.country === country
    );
}

export function addFighterToOrganization(
    organizationId,
    fighterId
) {
    const organization = getOrganizationById(organizationId);

    if (!organization) {
        return false;
    }

    if (!organization.roster.includes(fighterId)) {
        organization.roster.push(fighterId);
    }

    return true;
}

export function removeFighterFromOrganization(
    organizationId,
    fighterId
) {
    const organization = getOrganizationById(organizationId);

    if (!organization) {
        return false;
    }

    organization.roster = organization.roster.filter(
        id => id !== fighterId
    );

    return true;
}

export function setChampion(
    organizationId,
    weightClass,
    fighterId
) {
    const organization = getOrganizationById(organizationId);

    if (!organization) {
        return false;
    }

    ensureWeightClass(organization, weightClass);

    organization.rankings[weightClass].champion = fighterId;

    return true;
}

export function setInterimChampion(
    organizationId,
    weightClass,
    fighterId
) {
    const organization = getOrganizationById(organizationId);

    if (!organization) {
        return false;
    }

    ensureWeightClass(organization, weightClass);

    organization.rankings[weightClass].interimChampion = fighterId;

    return true;
}

function ensureWeightClass(organization, weightClass) {
    if (!organization.rankings[weightClass]) {
        organization.rankings[weightClass] = {
            champion: null,
            interimChampion: null,
            rankings: []
        };
    }
}

export function getChampion(
    organizationId,
    weightClass
) {
    const organization = getOrganizationById(organizationId);

    if (!organization) {
        return null;
    }

    return organization.rankings[weightClass]?.champion || null;
}

export function getInterimChampion(
    organizationId,
    weightClass
) {
    const organization = getOrganizationById(organizationId);

    if (!organization) {
        return null;
    }

    return (
        organization.rankings[weightClass]?.interimChampion ||
        null
    );
}

export function addOrganizationEvent(
    organizationId,
    eventId
) {
    const organization = getOrganizationById(organizationId);

    if (!organization) {
        return false;
    }

    if (!organization.events.includes(eventId)) {
        organization.events.push(eventId);
        organization.statistics.totalEvents++;
    }

    return true;
}

export function registerOrganizationFight(
    organizationId,
    {
        titleFight = false,
        method = null
    } = {}
) {
    const organization = getOrganizationById(organizationId);

    if (!organization) {
        return false;
    }

    organization.statistics.totalFights++;

    if (titleFight) {
        organization.statistics.totalTitleFights++;
    }

    if (method === "KO" || method === "TKO") {
        organization.statistics.totalKnockouts++;
    }

    if (method === "SUBMISSION") {
        organization.statistics.totalSubmissions++;
    }

    if (
        [
            "UNANIMOUS_DECISION",
            "SPLIT_DECISION",
            "MAJORITY_DECISION",
            "TECHNICAL_DECISION"
        ].includes(method)
    ) {
        organization.statistics.totalDecisions++;
    }

    return true;
}

export function getOrganizationRoster(organizationId) {
    const organization = getOrganizationById(organizationId);

    return organization
        ? [...organization.roster]
        : [];
}

export function getOrganizationSummary(organizationId) {
    const organization = getOrganizationById(organizationId);

    if (!organization) {
        return null;
    }

    return {
        id: organization.id,
        name: organization.name,
        acronym: organization.acronym,
        country: organization.country,
        type: organization.type,
        reputation: organization.reputation,
        prestige: organization.prestige,
        rosterSize: organization.roster.length,
        events: organization.statistics.totalEvents,
        fights: organization.statistics.totalFights,
        titleFights:
            organization.statistics.totalTitleFights
    };
}
