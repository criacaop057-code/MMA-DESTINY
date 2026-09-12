import { ROUTES } from "./router.js";

class Renderer {
    constructor({ root, state, engine }) {
        this.root = root;
        this.state = state;
        this.engine = engine;

        this.appContainer = null;
    }

    renderRoute(route) {
        this.ensureContainer();

        switch (route) {
            case ROUTES.HOME:
                this.renderHome();
                break;

            case ROUTES.CAREER:
                this.renderCareer();
                break;

            case ROUTES.WORLD:
                this.renderWorld();
                break;

            case ROUTES.LIFE:
                this.renderLife();
                break;

            case ROUTES.DYNASTY:
                this.renderDynasty();
                break;

            default:
                this.renderHome();
        }
    }

    ensureContainer() {
        let container = document.querySelector(
            "#mma-destiny-app"
        );

        if (!container) {
            container = document.createElement("main");
            container.id = "mma-destiny-app";

            this.root.appendChild(container);
        }

        this.appContainer = container;
    }

    clear() {
        if (!this.appContainer) {
            this.ensureContainer();
        }

        this.appContainer.innerHTML = "";
    }

    createElement(tag, className = "", text = "") {
        const element = document.createElement(tag);

        if (className) {
            element.className = className;
        }

        if (text) {
            element.textContent = text;
        }

        return element;
    }

    renderHome() {
        this.clear();

        const section = this.createElement(
            "section",
            "screen screen-home"
        );

        const title = this.createElement(
            "h1",
            "screen-title",
            "MMA DESTINY"
        );

        const subtitle = this.createElement(
            "p",
            "screen-subtitle",
            "Sua carreira. Sua vida. Seu legado."
        );

        const date = this.getGameDate();

        const dateElement = this.createElement(
            "p",
            "game-date",
            `Data do mundo: ${date}`
        );

        section.append(
            title,
            subtitle,
            dateElement
        );

        this.appContainer.appendChild(section);
    }

    renderCareer() {
        this.clear();

        const section = this.createElement(
            "section",
            "screen screen-career"
        );

        const title = this.createElement(
            "h1",
            "screen-title",
            "CARREIRA"
        );

        const fighter = this.state.player;

        if (fighter) {
            const name = this.createElement(
                "h2",
                "fighter-name",
                fighter.name || "Lutador"
            );

            section.append(title, name);
        } else {
            const message = this.createElement(
                "p",
                "empty-state",
                "Nenhum lutador criado."
            );

            section.append(title, message);
        }

        this.appContainer.appendChild(section);
    }

    renderWorld() {
        this.clear();

        const section = this.createElement(
            "section",
            "screen screen-world"
        );

        const title = this.createElement(
            "h1",
            "screen-title",
            "MUNDO"
        );

        const message = this.createElement(
            "p",
            "screen-subtitle",
            "Organizações, lutadores, eventos, rankings e história."
        );

        section.append(title, message);

        this.appContainer.appendChild(section);
    }

    renderLife() {
        this.clear();

        const section = this.createElement(
            "section",
            "screen screen-life"
        );

        const title = this.createElement(
            "h1",
            "screen-title",
            "VIDA"
        );

        const message = this.createElement(
            "p",
            "screen-subtitle",
            "Relacionamentos, família, patrimônio, viagens e escolhas."
        );

        section.append(title, message);

        this.appContainer.appendChild(section);
    }

    renderDynasty() {
        this.clear();

        const section = this.createElement(
            "section",
            "screen screen-dynasty"
        );

        const title = this.createElement(
            "h1",
            "screen-title",
            "DINASTIA"
        );

        const message = this.createElement(
            "p",
            "screen-subtitle",
            "Família, sucessão, legado e Hall da Fama."
        );

        section.append(title, message);

        this.appContainer.appendChild(section);
    }

    getGameDate() {
        if (
            this.engine &&
            this.engine.calendar &&
            typeof this.engine.calendar.getCurrentDate === "function"
        ) {
            return this.engine.calendar.getCurrentDate();
        }

        if (
            this.state &&
            this.state.calendar &&
            this.state.calendar.currentDate
        ) {
            return this.state.calendar.currentDate;
        }

        return "01/01/2026";
    }

    refresh() {
        if (
            window.MMA_DESTINY &&
            window.MMA_DESTINY.router
        ) {
            window.MMA_DESTINY.router.navigate(
                window.MMA_DESTINY.router.getCurrentRoute(),
                false
            );
        }
    }
}

export {
    Renderer
};
