import { EVENT_PRIORITY } from "../core/constants.js";

export function getPriorityValue(priority) {
    if (typeof priority === "number") {
        return priority;
    }

    return EVENT_PRIORITY[priority] ?? EVENT_PRIORITY.NORMAL;
}

export function comparePriority(a, b) {
    return getPriorityValue(b.priority) - getPriorityValue(a.priority);
}

export function sortEvents(events) {
    return [...events].sort(comparePriority);
}
