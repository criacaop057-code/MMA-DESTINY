import { engine } from "../engine/engine.js";

import {
    processWeeklyRecovery
} from "./recovery.js";

import {
    advanceCampWeek
} from "./camp.js";

import {
    clearWeeklyTraining
} from "./training.js";

export function registerTrainingSystem() {

    engine.registerSystem(
        "training",
        async () => {

            const recovery =
                processWeeklyRecovery();

            const camp =
                advanceCampWeek();

            clearWeeklyTraining();

            return {
                recovery,
                camp
            };
        }
    );
}
