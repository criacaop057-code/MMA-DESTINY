export function createOrganizationProfile(
    organization
) {
    if (!organization) return null;

    return {
        id: organization.id,

        name:
            organization.name ||
            "Organização",

        shortName:
            organization.shortName ||
            organization.name ||
            "",

        country:
            organization.country ||
            "",

        founded:
            organization.founded ||
            null,

        type:
            organization.type ||
            "mma",

        prestige:
            organization.prestige || 0,

        reputation:
            organization.reputation || 0,

        status:
            organization.status ||
            "active",

        weightClasses:
            organization.weightClasses || [],

        championships:
            organization.championships || [],

        roster:
            organization.roster || [],

        events:
            organization.events || [],

        history:
            organization.history || []
    };
}

export function getOrganizationChampions(
    organization
) {
    return organization?.championships || [];
}

export function getOrganizationRoster(
    organization,
    database
) {
    const roster =
        organization?.roster || [];

    return roster
        .map(id =>
            database?.fighters?.[id]
        )
        .filter(Boolean);
}

export function getOrganizationEvents(
    organization,
    database
) {
    const events =
        organization?.events || [];

    return events
        .map(id =>
            database?.events?.[id]
        )
        .filter(Boolean);
}
