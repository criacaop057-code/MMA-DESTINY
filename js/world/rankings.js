import { state } from "../core/state.js";
import {
    getOrganizationById,
    setChampion
} from "./organizations.js";

export const RANKING_LIMIT = 15;

export function initializeOrganizationRankings(
    organizationId,
    weightClass
) {
    const organization =
        getOrganizationById(organizationId);

    if (!organization) {
        return false;
    }

    if (!organization.rankings[weightClass]) {
        organization.rankings[weightClass] = {
            champion: null,
            interimChampion: null,
            rankings: []
        };
    }

    return true;
}

export function getRankings(
    organizationId,
    weightClass
) {
    const organization =
        getOrganizationById(organizationId);

    if (!organization) {
        return null;
    }

    initializeOrganizationRankings(
        organizationId,
        weightClass
    );

    return organization.rankings[
        weightClass
    ];
}

export function updateRankings(
    organizationId,
    weightClass,
    fighterIds
) {
    const ranking =
        getRankings(
            organizationId,
            weightClass
        );

    if (!ranking) {
        return false;
    }

    ranking.rankings =
        fighterIds
            .filter(Boolean)
            .slice(0, RANKING_LIMIT);

    return true;
}

export function rankFighters(
    organizationId,
    weightClass,
    fighters
) {
    const organization =
        getOrganizationById(organizationId);

    if (!organization) {
        return [];
    }

    const ranking =
        getRankings(
            organizationId,
            weightClass
        );

    const championId =
        ranking.champion;

    const interimId =
        ranking.interimChampion;

    const ranked = fighters
        .filter(
            fighter =>
                fighter.weightClass ===
                weightClass
        )
        .filter(
            fighter =>
                fighter.id !== championId &&
                fighter.id !== interimId
        )
        .map(fighter => ({
            fighter,
            score:
                calculateRankingScore(
                    fighter
                )
        }))
        .sort(
            (a, b) =>
                b.score - a.score
        );

    ranking.rankings =
        ranked
            .slice(0, RANKING_LIMIT)
            .map(item => item.fighter.id);

    return ranking.rankings;
}

export function calculateRankingScore(
    fighter
) {
    const career =
        fighter.career || {};

    const record =
        career.record || {};

    const wins = record.wins || 0;
    const losses = record.losses || 0;
    const draws = record.draws || 0;

    const ovr =
        fighter.ovr || 0;

    const experience =
        career.experience || 0;

    const streak =
        career.streak || 0;

    const reputation =
        fighter.reputation || 0;

    const hype =
        fighter.hype || 0;

    return (
        ovr * 0.45 +
        experience * 0.10 +
        wins * 2 +
        streak * 5 -
        losses * 2 +
        draws +
        reputation * 0.08 +
        hype * 0.04
    );
}

export function getRankingPosition(
    organizationId,
    weightClass,
    fighterId
) {
    const ranking =
        getRankings(
            organizationId,
            weightClass
        );

    if (!ranking) {
        return null;
    }

    if (
        ranking.champion ===
        fighterId
    ) {
        return 0;
    }

    if (
        ranking.interimChampion ===
        fighterId
    ) {
        return 0;
    }

    const index =
        ranking.rankings.indexOf(
            fighterId
        );

    return index === -1
        ? null
        : index + 1;
}

export function getFighterRanking(
    organizationId,
    weightClass,
    fighterId
) {
    const position =
        getRankingPosition(
            organizationId,
            weightClass,
            fighterId
        );

    if (position === null) {
        return {
            position: null,
            label: "NR"
        };
    }

    if (position === 0) {
        return {
            position: 0,
            label: "C"
        };
    }

    return {
        position,
        label: `#${position}`
    };
}

export function getTopFighters(
    organizationId,
    weightClass,
    limit = 15
) {
    const ranking =
        getRankings(
            organizationId,
            weightClass
        );

    if (!ranking) {
        return [];
    }

    return ranking.rankings
        .slice(0, limit);
}

export function getChampionId(
    organizationId,
    weightClass
) {
    const ranking =
        getRankings(
            organizationId,
            weightClass
        );

    return ranking?.champion || null;
}

export function changeChampion(
    organizationId,
    weightClass,
    fighterId
) {
    return setChampion(
        organizationId,
        weightClass,
        fighterId
    );
}

export function recalculateAllRankings(
    organizations,
    fighters
) {
    organizations.forEach(
        organization => {
            organization.weightClasses.forEach(
                weightClass => {
                    rankFighters(
                        organization.id,
                        weightClass,
                        fighters
                    );
                }
            );
        }
    );
}

export function getRankingTable(
    organizationId,
    weightClass,
    fighters
) {
    const ranking =
        getRankings(
            organizationId,
            weightClass
        );

    if (!ranking) {
        return [];
    }

    const rows = [];

    if (ranking.champion) {
        const champion =
            fighters.find(
                fighter =>
                    fighter.id ===
                    ranking.champion
            );

        if (champion) {
            rows.push({
                position: 0,
                fighterId: champion.id,
                name:
                    champion.identity.name,
                nickname:
                    champion.identity.nickname,
                ovr: champion.ovr,
                champion: true
            });
        }
    }

    ranking.rankings.forEach(
        (fighterId, index) => {
            const fighter =
                fighters.find(
                    fighter =>
                        fighter.id ===
                        fighterId
                );

            if (!fighter) {
                return;
            }

            rows.push({
                position: index + 1,
                fighterId: fighter.id,
                name:
                    fighter.identity.name,
                nickname:
                    fighter.identity.nickname,
                ovr: fighter.ovr,
                champion: false
            });
        }
    );

    return rows;
}
