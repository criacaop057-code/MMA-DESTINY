import {
    getState,
    updateState
} from "../core/state.js";

import { CONFIG } from "../core/config.js";

import {
    validateState,
    assertValidState
} from "./validator.js";

import {
    advanceCalendarWeek
} from "./calendar.js";

import {
    processEventQueue
} from "./eventQueue.js";

export class GameEngine {

    constructor() {
        this.systems = [];
        this.isProcessing = false;
    }

    registerSystem(name, processor) {
        if (!name) {
            throw new Error("Sistema precisa possuir um nome.");
        }

        if (typeof processor !== "function") {
            throw new Error(
                `Processador inválido para o sistema ${name}.`
            );
        }

        this.systems.push({
            name,
            processor
        });
    }

    getRegisteredSystems() {
        return this.systems.map(system => system.name);
    }

    async initialize() {
        const validation = validateState();

        if (!validation.valid) {
            throw new Error(
                `Não foi possível iniciar: ${validation.errors.join(" | ")}`
            );
        }

        updateState(state => {
            state.meta.isInitialized = true;
            state.engine.isProcessing = false;
        });

        return getState();
    }

    async advanceWeek() {

        if (this.isProcessing) {
            throw new Error(
                "O Engine já está processando uma semana."
            );
        }

        this.isProcessing = true;

        updateState(state => {
            state.engine.isProcessing = true;
        });

        try {

            /*
             * 1. Validar antes do avanço
             */
            assertValidState();

            /*
             * 2. Avançar calendário
             */
            const calendarResult =
                advanceCalendarWeek();

            /*
             * 3. Processar sistemas registrados
             */
            const results = [];

            for (const system of this.systems) {

                try {

                    const result =
                        await system.processor({
                            state: getState(),
                            calendar: calendarResult
                        });

                    results.push({
                        system: system.name,
                        success: true,
                        result
                    });

                } catch (error) {

                    results.push({
                        system: system.name,
                        success: false,
                        error: error.message
                    });

                    updateState(state => {
                        state.engine.errors.push({
                            type: "SYSTEM",
                            system: system.name,
                            message: error.message,
                            week: state.calendar.week,
                            timestamp: new Date().toISOString()
                        });
                    });
                }
            }

            /*
             * 4. Processar eventos pendentes
             */
            const processedEvents =
                await processEventQueue();

            /*
             * 5. Atualizar informações do Engine
             */
            updateState(state => {

                state.engine.lastProcessedWeek =
                    state.calendar.week;

                state.engine.lastProcessedAt =
                    new Date().toISOString();

                state.engine.isProcessing = false;
            });

            /*
             * 6. Validar novamente
             */
            const finalValidation =
                validateState();

            if (!finalValidation.valid) {

                updateState(state => {
                    state.engine.errors.push({
                        type: "POST_PROCESS_VALIDATION",
                        message:
                            finalValidation.errors.join(" | "),
                        week: state.calendar.week,
                        timestamp: new Date().toISOString()
                    });
                });

                throw new Error(
                    "O estado ficou inválido após processar a semana."
                );
            }

            return {
                success: true,
                calendar: calendarResult,
                systems: results,
                processedEvents
            };

        } catch (error) {

            updateState(state => {
                state.engine.isProcessing = false;

                state.engine.errors.push({
                    type: "ENGINE",
                    message: error.message,
                    week: state.calendar.week,
                    timestamp: new Date().toISOString()
                });
            });

            throw error;

        } finally {

            this.isProcessing = false;

            updateState(state => {
                state.engine.isProcessing = false;
            });
        }
    }
}

export const engine = new GameEngine();
