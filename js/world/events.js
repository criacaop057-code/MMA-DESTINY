import { createId } from "../core/ids.js";

export function createWorldEvent({
    name,
    edition = null,
    organizationId = null,
    date = null,
    city = "",
    country = "",
    arena = "",

    source = "simulated",
    historical = false,
    simulation = true
}) {
    return {
        id: createId("world_event"),

        name,
        edition,

        organizationId,

        date,
        city,
        country,
        arena,

        source,
        historical,
        simulation,

        status: "scheduled",

        fights: [],

        mainEvent: null,
        coMainEvent: null,

        attendance: null,
        revenue: null,

        titleFights: [],

        bonuses: [],

        results: [],

        news: [],

        createdAt: null,
        completedAt: null
    };
}

export function addFightToEvent(
    event,
    fight
) {
    event.fights.push(fight);

    if (!event.mainEvent) {
        event.mainEvent = fight.id;
    } else if (!event.coMainEvent) {
        event.coMainEvent = fight.id;
    }

    if (fight.titleFight) {
        event.titleFights.push(
            fight.id
        );
    }

    return event;
}

export function scheduleEvent(event) {
    event.status = "scheduled";
    return event;
}

export function startEvent(event) {
    event.status = "live";
    return event;
}

export function completeEvent(
    event,
    results = []
) {
    event.status = "completed";
    event.results = results;

    return event;
}

export function cancelEvent(event, reason = "") {
    event.status = "cancelled";
    event.cancelReason = reason;

    return event;
}
