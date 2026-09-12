const ROUTES = {
    HOME: "inicio",
    CAREER: "carreira",
    WORLD: "mundo",
    LIFE: "vida",
    DYNASTY: "dinastia"
};

class Router {
    constructor({ renderer, state, engine }) {
        this.renderer = renderer;
        this.state = state;
        this.engine = engine;

        this.currentRoute = ROUTES.HOME;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;

        this.initialized = true;

        this.bindNavigation();
        this.handleInitialRoute();
    }

    bindNavigation() {
        document.addEventListener("click", (event) => {
            const element = event.target.closest("[data-route]");

            if (!element) return;

            event.preventDefault();

            const route = element.dataset.route;

            if (this.isValidRoute(route)) {
                this.navigate(route);
            }
        });
    }

    handleInitialRoute() {
        const hash = window.location.hash.replace("#", "").trim();

        if (this.isValidRoute(hash)) {
            this.navigate(hash, false);
            return;
        }

        this.navigate(ROUTES.HOME, false);
    }

    navigate(route, updateHash = true) {
        if (!this.isValidRoute(route)) {
            route = ROUTES.HOME;
        }

        this.currentRoute = route;

        if (updateHash) {
            window.history.replaceState(
                null,
                "",
                `#${route}`
            );
        }

        this.updateNavigation();
        this.renderer.renderRoute(route);
    }

    updateNavigation() {
        const elements = document.querySelectorAll("[data-route]");

        elements.forEach((element) => {
            const route = element.dataset.route;

            element.classList.toggle(
                "active",
                route === this.currentRoute
            );

            element.setAttribute(
                "aria-current",
                route === this.currentRoute ? "page" : "false"
            );
        });
    }

    isValidRoute(route) {
        return Object.values(ROUTES).includes(route);
    }

    getCurrentRoute() {
        return this.currentRoute;
    }

    goHome() {
        this.navigate(ROUTES.HOME);
    }

    goCareer() {
        this.navigate(ROUTES.CAREER);
    }

    goWorld() {
        this.navigate(ROUTES.WORLD);
    }

    goLife() {
        this.navigate(ROUTES.LIFE);
    }

    goDynasty() {
        this.navigate(ROUTES.DYNASTY);
    }
}

export {
    Router,
    ROUTES
};
