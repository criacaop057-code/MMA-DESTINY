import { GameEngine } from "./engine/engine.js";
import { createInitialState } from "./core/state.js";
import { Router } from "./ui/router.js";
import { Renderer } from "./ui/renderer.js";

const engine = new GameEngine();
const state = createInitialState();

const renderer = new Renderer({
    root: document.body,
    state,
    engine
});

const router = new Router({
    renderer,
    state,
    engine
});

window.MMA_DESTINY = {
    engine,
    state,
    router,
    renderer
};

window.addEventListener("DOMContentLoaded", () => {
    router.init();
});

export {
    engine,
    state,
    router,
    renderer
};
