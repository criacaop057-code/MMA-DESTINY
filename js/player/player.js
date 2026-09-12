import { ID } from "../core/ids.js";
import { updateState } from "../core/state.js";

import {
    createAttributes,
    calculateOVR
} from "./attributes.js";

import {
    createPersonality
} from "./personality.js";

import {
    createDevelopment
} from "./development.js";

import {
    createHealthState
} from "./health.js";

import {
    createCareer
} from "./career.js";

export function createPlayer(data = {}) {

    const attributes =
        createAttributes(
            data.attributes
        );

    const player = {

        id: ID.fighter(),

        name:
            data.name ||
            "Novo Lutador",

        nickname:
            data.nickname ||
            "",

        country:
            data.country ||
            "Brasil",

        city:
            data.city ||
            "",

        birthDate:
            data.birthDate ||
            new Date(
                2011,
                0,
                1
            ).toISOString(),

        age:
            data.age ??
            15,

        gender:
            data.gender ||
            "male",

        weightClass:
            data.weightClass ||
            "Peso Leve",

        currentWeight:
            data.currentWeight ??
            70,

        fightingStyle:
            data.fightingStyle ||
            "MMA",

        stance:
            data.stance ||
            "orthodox",

        appearance: {

            skin:
                data.appearance?.skin ||
                "medium",

            hair:
                data.appearance?.hair ||
                "short",

            hairColor:
                data.appearance?.hairColor ||
                "black",

            beard:
                data.appearance?.beard ||
                "none",

            face:
                data.appearance?.face ||
                "default"
        },

        attributes,

        ovr:
            calculateOVR(attributes),

        potential: 0,

        personality:
            createPersonality(
                data.personality
            ),

        development:
            createDevelopment(
                attributes
            ),

        health:
            createHealthState(),

        career:
            createCareer(),

        team:
            data.team ||
            null,

        coach:
            data.coach ||
            null,

        academy:
            data.academy ||
            null,

        sponsors: [],

        contracts: [],

        achievements: [],

        education: [],

        createdAt:
            new Date().toISOString(),

        updatedAt:
            new Date().toISOString()
    };

    player.potential =
        calculatePotential(player);

    return player;
}

export function calculatePotential(player) {

    if (!player?.development) {
        return 0;
    }

    const potentialValues =
        Object.values(
            player.development.potential
        );

    if (!potentialValues.length) {
        return player.ovr;
    }

    return Math.round(
        potentialValues.reduce(
            (sum, value) => sum + value,
            0
        ) /
        potentialValues.length
    );
}

export function recalculatePlayer(player) {

    if (!player) return null;

    player.ovr =
        calculateOVR(
            player.attributes
        );

    player.potential =
        calculatePotential(player);

    player.updatedAt =
        new Date().toISOString();

    return player;
}

export function setPlayer(player) {

    if (!player) {
        throw new Error(
            "Não é possível definir um jogador vazio."
        );
    }

    updateState(state => {

        state.player =
            player;

        state.meta.gamePhase =
            "playing";

        state.meta.activeTab =
            "inicio";

    });

    return player;
}

export function getPlayerSummary(player) {

    if (!player) {
        return null;
    }

    return {

        id: player.id,

        name: player.name,

        nickname:
            player.nickname,

        age:
            player.age,

        country:
            player.country,

        weightClass:
            player.weightClass,

        style:
            player.fightingStyle,

        ovr:
            player.ovr,

        potential:
            player.potential,

        record:
            `${player.career.record.wins}-${player.career.record.losses}-${player.career.record.draws}`
    };
}
