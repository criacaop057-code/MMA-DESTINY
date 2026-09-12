import { GAME_VERSION, DEFAULT_CURRENCY } from "./constants.js";

export const CONFIG = {
    version: GAME_VERSION,

    game: {
        title: "MMA DESTINY",
        startingAge: 15,
        autosave: true,
        autosaveEveryWeeks: 1
    },

    calendar: {
        startYear: 2026,
        startMonth: 0,
        startDay: 1
    },

    economy: {
        baseCurrency: DEFAULT_CURRENCY,
        startingCash: 0,
        startingPatrimony: 0
    },

    player: {
        startingHealth: 100,
        startingEnergy: 100,
        startingFatigue: 0,
        startingWeight: 70
    },

    development: {
        minimumAttribute: 1,
        maximumAttribute: 100
    },

    engine: {
        processWorldEveryWeek: true,
        processNewsEveryWeek: true,
        processRankingsEveryWeek: true,
        processFinanceEveryWeek: true,
        processLifeEveryWeek: true
    }
};
