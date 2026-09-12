const ROUTES = {
    HOME: "inicio",
    CAREER: "carreira",
    WORLD: "mundo",
    LIFE: "vida",
    DYNASTY: "dinastia"
};

class Router {

    constructor({
        renderer,
        state,
        engine
    }) {
        this.renderer = renderer;
        this.state = state;
        this.engine = engine;

        this.currentRoute = ROUTES.HOME;
        this.initialized = false;
    }

    init() {
        if (this.initialized) {
            return;
        }

        this.initialized = true;

        this.bindNavigation();
        this.bindHistory();

        /*
         * A renderização inicial é feita pelo boot.
         * Aqui apenas garantimos que o Router esteja pronto.
         */
    }

    bindNavigation() {

        document.addEventListener(
            "click",
            (event) => {

                const element =
                    event.target.closest(
                        "[data-route]"
                    );

                if (!element) {
                    return;
                }

                /*
                 * Não interfere em elementos desabilitados.
                 */
                if (element.disabled) {
                    return;
                }

                event.preventDefault();
                event.stopPropagation();

                const route =
                    element.dataset.route;

                if (!this.isValidRoute(route)) {
                    return;
                }

                this.navigate(route);
            }
        );
    }

    bindHistory() {

        window.addEventListener(
            "hashchange",
            () => {

                const hash =
                    this.getHashRoute();

                if (
                    this.isValidRoute(hash) &&
                    hash !== this.currentRoute
                ) {
                    this.navigate(
                        hash,
                        false
                    );
                }
            }
        );

        window.addEventListener(
            "popstate",
            () => {

                const hash =
                    this.getHashRoute();

                if (
                    this.isValidRoute(hash)
                ) {
                    this.navigate(
                        hash,
                        false
                    );
                } else {
                    this.navigate(
                        ROUTES.HOME,
                        false
                    );
                }
            }
        );
    }

    handleInitialRoute() {

        const hash =
            this.getHashRoute();

        if (this.isValidRoute(hash)) {

            this.navigate(
                hash,
                false
            );

            return;
        }

        this.navigate(
            ROUTES.HOME,
            false
        );
    }

    getHashRoute() {

        return window.location.hash
            .replace(/^#/, "")
            .trim()
            .toLowerCase();
    }

    navigate(
        route,
        updateHash = true
    ) {

        if (!this.isValidRoute(route)) {
            route = ROUTES.HOME;
        }

        this.currentRoute = route;

        if (updateHash) {

            const newHash =
                `#${route}`;

            if (
                window.location.hash !==
                newHash
            ) {
                window.history.pushState(
                    {
                        route
                    },
                    "",
                    newHash
                );
            }
        }

        this.updateNavigation();

        if (
            this.renderer &&
            typeof this.renderer.renderRoute ===
                "function"
        ) {
            this.renderer.renderRoute(
                route
            );
        }
    }

    updateNavigation() {

        const elements =
            document.querySelectorAll(
                "[data-route]"
            );

        elements.forEach(
            (element) => {

                const route =
                    element.dataset.route;

                const active =
                    route ===
                    this.currentRoute;

                element.classList.toggle(
                    "active",
                    active
                );

                element.setAttribute(
                    "aria-current",
                    active
                        ? "page"
                        : "false"
                );
            }
        );
    }

    isValidRoute(route) {

        return Object
            .values(ROUTES)
            .includes(route);
    }

    getCurrentRoute() {

        return this.currentRoute;
    }

    goHome() {
        this.navigate(
            ROUTES.HOME
        );
    }

    goCareer() {
        this.navigate(
            ROUTES.CAREER
        );
    }

    goWorld() {
        this.navigate(
            ROUTES.WORLD
        );
    }

    goLife() {
        this.navigate(
            ROUTES.LIFE
        );
    }

    goDynasty() {
        this.navigate(
            ROUTES.DYNASTY
        );
    }
}

export {
    Router,
    ROUTES
};
