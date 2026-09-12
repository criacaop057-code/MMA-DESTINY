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
        if (this.initialized) {
            return;
        }

        this.initialized = true;

        this.bindNavigation();
        this.bindHistory();

        console.log("[MMA DESTINY] Router ativo.");
    }

    bindNavigation() {

        const handleNavigation = (event) => {

            const path = event.composedPath
                ? event.composedPath()
                : [];

            let element = null;

            for (const item of path) {
                if (
                    item &&
                    item.nodeType === 1 &&
                    item.matches &&
                    item.matches("[data-route]")
                ) {
                    element = item;
                    break;
                }
            }

            if (!element) {
                return;
            }

            if (element.disabled) {
                return;
            }

            const route = element.getAttribute("data-route");

            if (!this.isValidRoute(route)) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();

            this.navigate(route);
        };

        /*
         * Pointer Events funcionam melhor no iPhone,
         * Android e desktop do que depender somente
         * do click.
         */
        document.addEventListener(
            "pointerup",
            handleNavigation,
            true
        );

        /*
         * Fallback para navegadores que não entreguem
         * PointerEvent corretamente.
         */
        document.addEventListener(
            "click",
            handleNavigation,
            true
        );
    }

    bindHistory() {

        window.addEventListener(
            "hashchange",
            () => {

                const hash = this.getHashRoute();

                if (
                    this.isValidRoute(hash) &&
                    hash !== this.currentRoute
                ) {
                    this.navigate(hash, false);
                }
            }
        );

        window.addEventListener(
            "popstate",
            () => {

                const hash = this.getHashRoute();

                if (this.isValidRoute(hash)) {
                    this.navigate(hash, false);
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

        const hash = this.getHashRoute();

        if (this.isValidRoute(hash)) {
            this.navigate(hash, false);
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

    navigate(route, updateHash = true) {

        if (!this.isValidRoute(route)) {
            route = ROUTES.HOME;
        }

        console.log(
            "[MMA DESTINY] Navegando para:",
            route
        );

        this.currentRoute = route;

        if (updateHash) {

            const newHash = `#${route}`;

            if (
                window.location.hash !==
                newHash
            ) {
                window.history.pushState(
                    { route },
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
            this.renderer.renderRoute(route);
        }
    }

    updateNavigation() {

        const elements =
            document.querySelectorAll(
                "[data-route]"
            );

        elements.forEach(
            (element) => {

                const active =
                    element.getAttribute(
                        "data-route"
                    ) === this.currentRoute;

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

        return Object.values(ROUTES)
            .includes(route);
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
