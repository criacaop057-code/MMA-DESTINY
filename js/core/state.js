import { CONFIG } from "./config.js";
import { GAME_PHASES, TABS } from "./constants.js";

export function createInitialState() {
    return {
        meta: {
            version: CONFIG.version,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            gamePhase: GAME_PHASES.MENU,
            activeTab: TABS.HOME,
            isInitialized: false
        },

        calendar: {
            year: CONFIG.calendar.startYear,
            month: CONFIG.calendar.startMonth,
            day: CONFIG.calendar.startDay,
            week: 1,
            totalWeeks: 0,
            totalDays: 0
        },

        player: null,

        world: {
            fighters: [],
            organizations: [],
            events: [],
            rankings: {},
            championships: [],
            history: [],
            news: []
        },

        career: {
            fights: [],
            record: {
                wins: 0,
                losses: 0,
                draws: 0,
                noContests: 0
            },
            currentContract: null,
            rankingPositions: {},
            titles: [],
            bonuses: [],
            careerEarnings: 0
        },

        training: {
            currentPlan: null,
            weeklyLoad: 0,
            camp: null,
            sessions: []
        },

        finance: {
            balances: {
                BRL: 0,
                USD: 0,
                EUR: 0
            },

            patrimony: 0,
            transactions: [],
            contracts: [],
            investments: [],
            businesses: [],
            debts: []
        },

        life: {
            relationships: [],
            family: [],
            children: [],
            houses: [],
            vehicles: [],
            travels: [],
            education: []
        },

        academy: {
            owned: false,
            academies: [],
            staff: [],
            students: [],
            facilities: []
        },

        media: {
            hype: 0,
            fame: 0,
            followers: 0,
            reputation: 0,
            respect: 0,
            antipathy: 0,
            interviews: [],
            socialPosts: [],
            rivalries: []
        },

        dynasty: {
            legacyScore: 0,
            familyTree: [],
            successors: [],
            hallOfFame: [],
            activeGeneration: 1
        },

        engine: {
            isProcessing: false,
            lastProcessedWeek: 0,
            lastProcessedAt: null,
            errors: [],
            warnings: []
        },

        eventQueue: [],

        saves: {
            lastSaveAt: null,
            lastBackupAt: null
        }
    };
}

let gameState = createInitialState();

export function getState() {
    return gameState;
}

export function setState(newState) {
    if (!newState || typeof newState !== "object") {
        throw new Error("Estado inválido.");
    }

    gameState = newState;

    gameState.meta.updatedAt = new Date().toISOString();

    return gameState;
}

export function resetState() {
    gameState = createInitialState();

    return gameState;
}

export function updateState(callback) {
    if (typeof callback !== "function") {
        throw new Error("updateState exige uma função.");
    }

    callback(gameState);

    gameState.meta.updatedAt = new Date().toISOString();

    return gameState;
}

export function replaceStatePart(key, value) {
    if (!(key in gameState)) {
        throw new Error(`Parte do estado não encontrada: ${key}`);
    }

    gameState[key] = value;
    gameState.meta.updatedAt = new Date().toISOString();

    return gameState;
}
