import { createId } from "../core/ids.js";

export function createChampionship({
    organizationId,
    weightClass,
    name = "",
    interim = false
}) {
    return {
        id: createId("championship"),

        organizationId,
        weightClass,

        name,

        championId: null,

        interim,

        defenses: 0,

        lineage: [],

        history: []
    };
}

export function crownChampion(
    championship,
    fighterId,
    method = "title_fight"
) {
    if (
        championship.championId
    ) {
        championship.lineage.push({
            fighterId:
                championship.championId,
            defenses:
                championship.defenses
        });
    }

    championship.championId =
        fighterId;

    championship.defenses = 0;

    championship.history.push({
        id: createId("title_history"),
        fighterId,
        method,
        date: null
    });

    return championship;
}

export function recordDefense(
    championship
) {
    if (!championship.championId) {
        return false;
    }

    championship.defenses++;

    return championship.defenses;
}

export function vacateChampionship(
    championship,
    reason = ""
) {
    championship.history.push({
        id: createId("title_vacancy"),
        previousChampion:
            championship.championId,
        reason,
        date: null
    });

    championship.championId = null;
    championship.defenses = 0;

    return championship;
}

export function getCurrentChampion(
    championship
) {
    return championship.championId;
}
