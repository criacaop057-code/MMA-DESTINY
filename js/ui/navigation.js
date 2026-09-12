import { navigateTo } from "./router.js";

export function initializeNavigation() {

    const navItems =
        document.querySelectorAll(
            ".nav-item"
        );

    navItems.forEach(item => {

        item.addEventListener(
            "click",
            () => {

                const tab =
                    item.dataset.tab;

                if (!tab) return;

                navigateTo(tab);

                updateActiveNavigation(tab);
            }
        );

    });

    window.addEventListener(
        "game:navigation",
        event => {

            updateActiveNavigation(
                event.detail.tab
            );

        }
    );
}

export function updateActiveNavigation(tab) {

    const navItems =
        document.querySelectorAll(
            ".nav-item"
        );

    navItems.forEach(item => {

        item.classList.toggle(
            "active",
            item.dataset.tab === tab
        );

    });
}
