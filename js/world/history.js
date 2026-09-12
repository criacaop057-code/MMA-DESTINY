import { generateId } from "../core/ids.js";
import { state } from "../core/state.js";

export const HISTORY_TYPES = {
    FIGHT: "fight",
    TITLE: "title",
    RANKING: "ranking",
    CONTRACT: "contract",
    RETIREMENT: "retirement",
    DEBUT: "debut",
    INJURY: "injury",
    TRANSFER: "transfer",
    LIFE: "life",
    FINANCE: "finance",
    ACADEMY: "academy",
    RECORD: "record"
};

export function createHistoryEntry({
    type,
    title,
    description,
    fighterId = null,
    organizationId = null,
    eventId = null,
    data = {}
}) {
    const entry = {
        id: generateId("history"),

        type,

        title,

        description,

        fighterId,

        organizationId,

        eventId,

        data,

        date:
            state.calendar?.date ||
            new Date().toISOString(),

        timestamp: Date.now()
    };

    if (!state.world.history) {
        state.world.history = [];
    }

    state.world.history.push(entry);

    return entry;
}

export function recordFightHistory(
    fight,
    fighterA,
    fighterB
) {
    return createHistoryEntry({
        type: HISTORY_TYPES.FIGHT,

        title: `${fighterA.identity.name} vs ${fighterB.identity.name}`,

        description:
            fight.result?.winnerId
                ? `${getFighterName(
                      fight.result.winnerId,
                      fighterA,
                      fighterB
                  )} venceu por ${
                      fight.result.method ||
                      "decisão"
                  }.`
                : "A luta terminou empatada.",

        fighterId:
            fight.result?.winnerId || null,

        organizationId:
            fight.organizationId || null,

        eventId:
            fight.eventId || null,

        data: {
            fightId: fight.id,
            result: fight.result
        }
    });
}

function getFighterName(
    fighterId,
    fighterA,
    fighterB
) {
    if (fighterA.id === fighterId) {
        return fighterA.identity.name;
    }

    if (fighterB.id === fighterId) {
        return fighterB.identity.name;
    }

    return "Lutador";
}

export function getHistory({
    type = null,
    fighterId = null,
    organizationId = null,
    limit = 100
} = {}) {
    let history = [
        ...(state.world.history || [])
    ];

    if (type) {
        history = history.filter(
            item => item.type === type
        );
    }

    if (fighterId) {
        history = history.filter(
            item =>
                item.fighterId === fighterId ||
                item.data?.fighterIds?.includes(
                    fighterId
                )
        );
    }

    if (organizationId) {
        history = history.filter(
            item =>
                item.organizationId ===
                organizationId
        );
    }

    return history
        .sort(
            (a, b) =>
                b.timestamp -
                a.timestamp
        )
        .slice(0, limit);
}

export function getLatestHistory(
    limit = 20
) {
    return getHistory({ limit });
}

export function clearHistory() {
    state.world.history = [];
}
