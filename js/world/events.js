import { generateId } from "../core/ids.js";
import { state } from "../core/state.js";
import {
    getOrganizationById,
    addOrganizationEvent
} from "./organizations.js";

export const EVENT_STATUS = {
    SCHEDULED: "scheduled",
    UPCOMING: "upcoming",
    LIVE: "live",
    FINISHED: "finished",
    CANCELLED: "cancelled"
};

export const EVENT_TYPES = {
    REGULAR: "regular",
    TITLE: "title",
    PPV: "ppv",
    TOURNAMENT: "tournament",
    SPECIAL: "special"
};

export function createEvent({
    organizationId,
    name,
    date,
    location = {},
    type = EVENT_TYPES.REGULAR
}) {
    const organization =
        getOrganizationById(organizationId);

    if (!organization) {
        throw new Error(
            "Organização não encontrada."
        );
    }

    const event = {
        id: generateId("event"),

        organizationId,

        name:
            name ||
            `${organization.acronym} ${state.calendar?.year || new Date().getFullYear()}`,

        date,

        location: {
            city: location.city || "São Paulo",
            country: location.country || "Brasil",
            venue: location.venue || "Arena Principal"
        },

        type,

        status: EVENT_STATUS.SCHEDULED,

        card: {
            main: [],
            prelims: [],
            earlyPrelims: []
        },

        attendance: {
            capacity: 0,
            sold: 0,
            gate: 0
        },

        broadcast: {
            ppvBuys: 0,
            revenue: 0
        },

        statistics: {
            totalFights: 0,
            finishedFights: 0,
            knockouts: 0,
            submissions: 0,
            decisions: 0
        },

        createdAt: Date.now()
    };

    if (!state.world.events) {
        state.world.events = [];
    }

    state.world.events.push(event);

    addOrganizationEvent(
        organizationId,
        event.id
    );

    return event;
}

export function getEventById(id) {
    return (
        state.world.events?.find(
            event => event.id === id
        ) || null
    );
}

export function addFightToEvent(
    eventId,
    fightId,
    card = "prelims"
) {
    const event = getEventById(eventId);

    if (!event) {
        return false;
    }

    if (!event.card[card]) {
        event.card[card] = [];
    }

    if (!event.card[card].includes(fightId)) {
        event.card[card].push(fightId);
        event.statistics.totalFights++;
    }

    return true;
}

export function setEventStatus(
    eventId,
    status
) {
    const event = getEventById(eventId);

    if (!event) {
        return false;
    }

    event.status = status;

    return true;
}

export function getUpcomingEvents(limit = 10) {
    return [...(state.world.events || [])]
        .filter(
            event =>
                event.status ===
                    EVENT_STATUS.SCHEDULED ||
                event.status ===
                    EVENT_STATUS.UPCOMING
        )
        .sort(
            (a, b) =>
                new Date(a.date) -
                new Date(b.date)
        )
        .slice(0, limit);
}

export function getPastEvents(limit = 20) {
    return [...(state.world.events || [])]
        .filter(
            event =>
                event.status ===
                EVENT_STATUS.FINISHED
        )
        .sort(
            (a, b) =>
                new Date(b.date) -
                new Date(a.date)
        )
        .slice(0, limit);
}

export function finishEvent(
    eventId,
    statistics = {}
) {
    const event = getEventById(eventId);

    if (!event) {
        return false;
    }

    event.status =
        EVENT_STATUS.FINISHED;

    if (statistics.knockouts) {
        event.statistics.knockouts +=
            statistics.knockouts;
    }

    if (statistics.submissions) {
        event.statistics.submissions +=
            statistics.submissions;
    }

    if (statistics.decisions) {
        event.statistics.decisions +=
            statistics.decisions;
    }

    event.statistics.finishedFights =
        event.statistics.totalFights;

    return true;
}

export function cancelEvent(
    eventId,
    reason = "Cancelado"
) {
    const event = getEventById(eventId);

    if (!event) {
        return false;
    }

    event.status =
        EVENT_STATUS.CANCELLED;

    event.cancelReason = reason;

    return true;
}

export function calculateEventRevenue(
    eventId
) {
    const event = getEventById(eventId);

    if (!event) {
        return 0;
    }

    const gate = event.attendance.gate || 0;
    const ppv = event.broadcast.revenue || 0;

    const revenue = gate + ppv;

    event.attendance.revenue = gate;

    event.broadcast.revenue = ppv;

    return revenue;
}
