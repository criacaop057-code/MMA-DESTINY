import { CONFIG } from "../core/config.js";

export function createHealthState() {

    return {
        health: CONFIG.player.startingHealth,
        energy: CONFIG.player.startingEnergy,
        fatigue: CONFIG.player.startingFatigue,

        injuries: [],

        recovery: {
            sleep: 100,
            nutrition: 100,
            hydration: 100
        },

        suspension: {
            active: false,
            weeksRemaining: 0,
            reason: null
        }
    };
}

export function applyFatigue(player, amount) {

    if (!player.health) return;

    player.health.fatigue = Math.max(
        0,
        Math.min(
            100,
            player.health.fatigue + amount
        )
    );

    player.health.energy =
        Math.max(
            0,
            player.health.energy - amount
        );
}

export function recoverPlayer(player, amount = 10) {

    if (!player.health) return;

    player.health.fatigue =
        Math.max(
            0,
            player.health.fatigue - amount
        );

    player.health.energy =
        Math.min(
            100,
            player.health.energy + amount
        );

    player.health.health =
        Math.min(
            100,
            player.health.health + amount * 0.5
        );
}

export function addInjury(
    player,
    injury
) {

    if (!player.health) return;

    player.health.injuries.push({
        id: injury.id ?? crypto.randomUUID(),
        type: injury.type ?? "Lesão",
        severity: injury.severity ?? "leve",
        weeksRemaining:
            injury.weeksRemaining ?? 1,
        createdAt:
            new Date().toISOString()
    });
}

export function processInjuries(player) {

    if (!player.health) return;

    player.health.injuries.forEach(injury => {
        injury.weeksRemaining--;
    });

    player.health.injuries =
        player.health.injuries.filter(
            injury => injury.weeksRemaining > 0
        );
}
