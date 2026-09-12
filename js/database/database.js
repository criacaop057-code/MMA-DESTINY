export function createDatabase() {

    return {

        fighters: {},

        organizations: {},

        events: {},

        h2h: {},

        indexes: {

            fightersByCountry: {},

            fightersByWeightClass: {},

            fightersByOrganization: {},

            eventsByOrganization: {},

            eventsByDate: {}

        }

    };

}

export function addFighter(database, fighter) {

    if (!fighter?.id) return false;

    database.fighters[fighter.id] = fighter;

    const country =

        fighter.identity?.country ||

        fighter.country ||

        "unknown";

    const weightClass =

        fighter.identity?.weightClass ||

        fighter.weightClass ||

        "unknown";

    addToIndex(

        database.indexes.fightersByCountry,

        country,

        fighter.id

    );

    addToIndex(

        database.indexes.fightersByWeightClass,

        weightClass,

        fighter.id

    );

    return true;

}

export function addOrganization(database, organization) {

    if (!organization?.id) return false;

    database.organizations[organization.id] =

        organization;

    return true;

}

export function addEvent(database, event) {

    if (!event?.id) return false;

    database.events[event.id] = event;

    const organizationId =

        event.organizationId || "unknown";

    const date =

        event.date || "unknown";

    addToIndex(

        database.indexes.eventsByOrganization,

        organizationId,

        event.id

    );

    addToIndex(

        database.indexes.eventsByDate,

        date,

        event.id

    );

    return true;

}

export function getFighter(database, fighterId) {

    return database.fighters[fighterId] || null;

}

export function getOrganization(

    database,

    organizationId

) {

    return (

        database.organizations[organizationId] ||

        null

    );

}

export function getEvent(database, eventId) {

    return database.events[eventId] || null;

}

export function searchFighters(database, query) {

    const normalized =

        String(query || "")

            .trim()

            .toLowerCase();

    if (!normalized) {

        return Object.values(database.fighters);

    }

    return Object.values(database.fighters)

        .filter(fighter => {

            const name =

                fighter.identity?.name ||

                fighter.name ||

                "";

            const nickname =

                fighter.identity?.nickname ||

                fighter.nickname ||

                "";

            return (

                name.toLowerCase()

                    .includes(normalized) ||

                nickname.toLowerCase()

                    .includes(normalized)

            );

        });

}

function addToIndex(index, key, id) {

    if (!index[key]) {

        index[key] = [];

    }

    if (!index[key].includes(id)) {

        index[key].push(id);

    }

}
