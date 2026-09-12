import {
    getState
} from "./core/state.js";

import {
    engine
} from "./engine/engine.js";

import {
    initializeCalendar
} from "./engine/calendar.js";

import {
    initializeNavigation
} from "./ui/navigation.js";

import {
    initializeScreenEvents,
    showMenu,
    showError
} from "./ui/screens.js";

import {
    renderGame
} from "./ui/renderer.js";

async function bootGame() {

    try {

        /*
         * Inicialização do calendário
         */
        initializeCalendar();

        /*
         * Inicialização do Engine
         */
        await engine.initialize();

        /*
         * Eventos da interface
         */
        initializeNavigation();

        initializeScreenEvents();

        /*
         * Botão de avançar semana
         */
        initializeAdvanceWeek();

        /*
         * Menu inicial
         */
        showMenu();

        /*
         * Pequena animação de carregamento
         */
        finishLoading();

        console.log(
            "MMA DESTINY iniciado."
        );

        console.log(
            "Sistemas registrados:",
            engine.getRegisteredSystems()
        );

    } catch (error) {

        console.error(
            "Erro ao iniciar MMA DESTINY:",
            error
        );

        showError(
            error.message
        );
    }
}

function initializeAdvanceWeek() {

    const button =
        document.getElementById(
            "advance-week-button"
        );

    if (!button) {
        return;
    }

    button.addEventListener(
        "click",
        async () => {

            button.disabled = true;

            button.textContent =
                "PROCESSANDO...";

            try {

                await engine.advanceWeek();

                renderGame();

            } catch (error) {

                console.error(error);

                alert(
                    "Erro ao processar a semana: " +
                    error.message
                );

            } finally {

                button.disabled = false;

                button.textContent =
                    "AVANÇAR SEMANA";
            }

        }
    );
}

function finishLoading() {

    const progress =
        document.getElementById(
            "loading-progress"
        );

    const loadingText =
        document.querySelector(
            ".loading-text"
        );

    let value = 0;

    const interval =
        setInterval(() => {

            value += 20;

            if (progress) {
                progress.style.width =
                    `${value}%`;
            }

            if (value >= 100) {

                clearInterval(interval);

                setTimeout(() => {

                    const loadingScreen =
                        document.getElementById(
                            "loading-screen"
                        );

                    if (loadingScreen) {
                        loadingScreen.classList.add(
                            "hidden"
                        );
                    }

                }, 300);
            }

        }, 100);
}

document.addEventListener(
    "DOMContentLoaded",
    bootGame
);
