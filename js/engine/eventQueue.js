import { getState, updateState } from "../core/state.js";
import { ID } from "../core/ids.js";
import { sortEvents } from "./priority.js";
import { GAME_LIMITS, EVENT_PRIORITY } from "../core/constants.js";

export function queueEvent({
    type,
    payload = {},
    priority = EVENT_PRIORITY.NORMAL,
    execute = null
}) {
    if (!type) {
        throw new Error("Evento precisa possuir um tipo.");
    }

    const event = {
        id: ID.eventQueue(),
        type,
        payload,
        priority,
        execute,
        createdAt: new Date().toISOString()
    };

    updateState(state => {
        state.eventQueue.push(event);

        state.eventQueue = sortEvents(state.eventQueue);

        if (state.eventQueue.length > GAME_LIMITS.MAX_EVENT_QUEUE) {
            state.eventQueue =
                state.eventQueue.slice(
                    0,
                    GAME_LIMITS.MAX_EVENT_QUEUE
                );
        }
    });

    return event;
}

export function getQueuedEvents() {
    return [...getState().eventQueue];
}

export function clearEventQueue() {
    updateState(state => {
        state.eventQueue = [];
    });
}

export async function processEventQueue() {
    const events = getQueuedEvents();

    for (const event of events) {
        try {
            if (typeof event.execute === "function") {
                await event.execute(event.payload);
            }
        } catch (error) {
            updateState(state => {
                state.engine.errors.push({
                    type: "EVENT_EXECUTION",
                    eventId: event.id,
                    message: error.message,
                    timestamp: new Date().toISOString()
                });
            });
        }
    }

    clearEventQueue();

    return events.length;
}
