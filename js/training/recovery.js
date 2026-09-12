import { updateState } from "../core/state.js";
import {
    recoverPlayer,
    processInjuries
} from "../player/health.js";

export function processWeeklyRecovery() {

    let result = null;

    updateState(state => {

        const player = state.player;

        if (!player) {
            return;
        }

        const fatigue =
            player.health.fatigue;

        let recoveryAmount = 15;

        /*
         * Quanto maior a fadiga,
         * mais importante a recuperação.
         */

        if (fatigue >= 80) {
            recoveryAmount = 22;
        } else if (fatigue >= 60) {
            recoveryAmount = 18;
        } else if (fatigue <= 20) {
            recoveryAmount = 10;
        }

        const sleep =
            player.health.recovery.sleep;

        const nutrition =
            player.health.recovery.nutrition;

        const hydration =
            player.health.recovery.hydration;

        const recoveryQuality =
            (
                sleep +
                nutrition +
                hydration
            ) / 300;

        recoveryAmount *=
            recoveryQuality;

        recoverPlayer(
            player,
            recoveryAmount
        );

        processInjuries(player);

        result = {
            recoveryAmount,
            fatigue: player.health.fatigue,
            energy: player.health.energy,
            health: player.health.health,
            injuries: player.health.injuries.length
        };
    });

    return result;
}

export function setRecoveryQuality(
    type,
    value
) {

    updateState(state => {

        if (!state.player) return;

        const safeValue =
            Math.max(
                0,
                Math.min(100, value)
            );

        if (
            type === "sleep" ||
            type === "nutrition" ||
            type === "hydration"
        ) {
            state.player.health.recovery[type] =
                safeValue;
        }
    });
}
