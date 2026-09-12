export const HISTORY_SOURCES = {
    REAL: "real",
    SIMULATION: "simulation"
};

export function createHistoryEntry({
    date,
    type,
    title,
    description,
    source = HISTORY_SOURCES.SIMULATION,
    data = {}
}) {
    return {
        date,
        type,
        title,
        description,
        source,
        data
    };
}

export function addHistoryEntry(
    world,
    entry
) {
    world.history.push(
        createHistoryEntry(entry)
    );

    world.history.sort(
        (a, b) =>
            new Date(a.date) -
            new Date(b.date)
    );

    return world.history;
}

export function getHistoryByDate(
    world,
    date
) {
    return world.history.filter(
        entry =>
            entry.date === date
    );
}

export function getHistoryBySource(
    world,
    source
) {
    return world.history.filter(
        entry =>
            entry.source === source
    );
}

export function getRecentHistory(
    world,
    amount = 20
) {
    return [...world.history]
        .slice(-amount)
        .reverse();
}
