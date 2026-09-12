import { GameEngine } from "./engine/engine.js";
import { getState } from "./core/state.js";
import { Router } from "./ui/router.js";
import { Renderer } from "./ui/renderer.js";

const engine = new GameEngine();

/*
 * IMPORTANTE:
 * O Engine e a interface precisam trabalhar
 * sobre o MESMO objeto de estado.
 */
const state = getState();

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

async function boot() {
    try {
        /*
         * Inicializa o Engine antes da interface.
         */
        await engine.initialize();

        /*
         * Garante que o Renderer continue usando
         * o estado real do Engine.
         */
        renderer.syncState();

        /*
         * Inicializa a navegação.
         */
        router.init();

        /*
         * Renderização inicial garantida.
         */
        router.handleInitialRoute();

        console.log(
            "[MMA DESTINY] Sistema inicializado."
        );

    } catch (error) {
        console.error(
            "[MMA DESTINY] Erro durante inicialização:",
            error
        );

        const container =
            document.querySelector("#app-content");

        if (container) {
            container.innerHTML = `
                <section
                    style="
                        padding:40px;
                        font-family:Inter,sans-serif;
                        color:#fff;
                    "
                >
                    <h1>ERRO AO INICIAR O JOGO</h1>
                    <p>
                        ${error.message || error}
                    </p>
                </section>
            `;
        }
    }
}

if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        boot,
        { once: true }
    );
} else {
    boot();
}

export {
    engine,
    state,
    router,
    renderer
};
