import { generateId } from "../core/ids.js";
import { state } from "../core/state.js";
import {
    getOrganizationById,
    setChampion,
    setInterimChampion
} from "./organizations.js";

export function createChampionship({
    organizationId,
    weightClass,
    name = null
}) {
    const organization =
        getOrganizationById(organizationId);

    if (!organization) {
        throw new Error(
            "Organização não encontrada."
        );
    }

    const championship = {
        id: generateId("title"),

        organizationId,

        weightClass,

        name:
            name ||
            `${organization.acronym} ${weightClass} Championship`,

        championId: null,

        interimChampionId: null,

        defenses: 0,

        totalFights: 0,

        history: [],

        status: "active",

        createdAt: Date.now()
    };

    if (!state.world.championships) {
        state.world.championships = [];
    }

    state.world.championships.push(
        championship
    );

    organization.championships[
        weightClass
    ] = championship.id;

    return championship;
}

export function getChampionshipById(id) {
    return (
        state.world.championships?.find(
            championship =>
                championship.id === id
        ) || null
    );
}

export function getChampionship(
    organizationId,
    weightClass
) {
    return (
        state.world.championships?.find(
            championship =>
                championship.organizationId ===
                    organizationId &&
                championship.weightClass ===
                    weightClass
        ) || null
    );
}

export function setChampionshipChampion(
    championshipId,
    fighterId
) {
    const championship =
        getChampionshipById(
            championshipId
        );

    if (!championship) {
        return false;
    }

    const organization =
        getOrganizationById(
            championship.organizationId
        );

    championship.championId =
        fighterId;

    championship.interimChampionId =
        null;

    setChampion(
        organization.id,
        championship.weightClass,
        fighterId
    );

    championship.history.push({
        type: "new_champion",
        fighterId,
        date: Date.now()
    });

    return true;
}

export function setInterimChampionForTitle(
    championshipId,
    fighterId
) {
    const championship =
        getChampionshipById(
            championshipId
        );

    if (!championship) {
        return false;
    }

    championship.interimChampionId =
        fighterId;

    setInterimChampion(
        championship.organizationId,
        championship.weightClass,
        fighterId
    );

    championship.history.push({
        type: "interim_champion",
        fighterId,
        date: Date.now()
    });

    return true;
}

export function recordTitleFight(
    championshipId,
    {
        winnerId,
        loserId,
        method,
        successfulDefense = false
    }
) {
    const championship =
        getChampionshipById(
            championshipId
        );

    if (!championship) {
        return false;
    }

    championship.totalFights++;

    if (successfulDefense) {
        championship.defenses++;
    }

    championship.history.push({
        type: successfulDefense
            ? "title_defense"
            : "title_change",
        winnerId,
        loserId,
        method,
        date: Date.now()
    });

    return true;
}

export function vacateTitle(
    championshipId,
    reason = "Campeão indisponível"
) {
    const championship =
        getChampionshipById(
            championshipId
        );

    if (!championship) {
        return false;
    }

    championship.history.push({
        type: "vacated",
        reason,
        formerChampion:
            championship.championId,
        date: Date.now()
    });

    championship.championId = null;
    championship.interimChampionId = null;

    const organization =
        getOrganizationById(
            championship.organizationId
        );

    if (organization) {
        organization.rankings[
            championship.weightClass
        ].champion = null;

        organization.rankings[
            championship.weightClass
        ].interimChampion = null;
    }

    return true;
}

export function getTitleHistory(
    championshipId
) {
    const championship =
        getChampionshipById(
            championshipId
        );

    return championship
        ? [...championship.history]
        : [];
}

export function getAllChampionships() {
    return [
        ...(state.world.championships || [])
    ];
}
