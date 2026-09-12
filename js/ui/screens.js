import {
    getState,
    updateState
} from "../core/state.js";

import { createPlayer, setPlayer } from "../player/player.js";
import { renderGame } from "./renderer.js";

const screens = {
    loading:
        document.getElementById("loading-screen"),

    menu:
        document.getElementById("main-menu"),

    creation:
        document.getElementById("creation-screen"),

    game:
        document.getElementById("game-screen"),

    notifications:
        document.getElementById("notifications-screen"),

    error:
        document.getElementById("error-screen")
};

export function showScreen(name) {

    Object.values(screens).forEach(screen => {

        if (screen) {
            screen.classList.add("hidden");
        }

    });

    const screen =
        screens[name];

    if (screen) {
        screen.classList.remove("hidden");
    }
}

export function showMenu() {

    updateState(state => {
        state.meta.gamePhase = "menu";
    });

    showScreen("menu");
}

export function showCreation() {

    updateState(state => {
        state.meta.gamePhase = "creation";
    });

    showScreen("creation");
}

export function showGame() {

    updateState(state => {
        state.meta.gamePhase = "playing";
    });

    showScreen("game");

    renderGame();
}

export function showNotifications() {
    showScreen("notifications");
}

export function showError(message) {

    const errorText =
        document.getElementById(
            "error-message"
        );

    if (errorText) {
        errorText.textContent =
            message;
    }

    showScreen("error");
}

export function initializeScreenEvents() {

    const newGameButton =
        document.getElementById(
            "new-game-button"
        );

    if (newGameButton) {

        newGameButton.addEventListener(
            "click",
            () => {
                showCreation();
            }
        );

    }

    const backMenuButton =
        document.getElementById(
            "back-menu-button"
        );

    if (backMenuButton) {

        backMenuButton.addEventListener(
            "click",
            () => {
                showMenu();
            }
        );

    }

    const createButton =
        document.getElementById(
            "create-fighter-button"
        );

    if (createButton) {

        createButton.addEventListener(
            "click",
            handleCreateFighter
        );

    }

    const notificationButton =
        document.getElementById(
            "notification-button"
        );

    if (notificationButton) {

        notificationButton.addEventListener(
            "click",
            () => {
                showNotifications();
            }
        );

    }
}

function handleCreateFighter() {

    const name =
        document.getElementById(
            "fighter-name"
        )?.value.trim();

    const nickname =
        document.getElementById(
            "fighter-nickname"
        )?.value.trim();

    const country =
        document.getElementById(
            "fighter-country"
        )?.value;

    const weightClass =
        document.getElementById(
            "fighter-weight-class"
        )?.value;

    const style =
        document.getElementById(
            "fighter-style"
        )?.value;

    if (!name) {

        alert(
            "Digite o nome do lutador."
        );

        return;
    }

    const player =
        createPlayer({

            name,

            nickname,

            country:
                country || "Brasil",

            weightClass:
                weightClass || "Peso Leve",

            fightingStyle:
                style || "MMA",

            age: 15
        });

    setPlayer(player);

    showGame();
}
