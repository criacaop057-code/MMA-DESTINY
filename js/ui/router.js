import { getState, updateState } from "../core/state.js";
import { TABS } from "../core/constants.js";

export function navigateTo(tab) {
    const validTabs = Object.values(TABS);

    if (!validTabs.includes(tab)) {
        console.warn(`Aba inválida: ${tab}`);
        return;
    }

    updateState(state => {
        state.meta.activeTab = tab;
    });

    window.dispatchEvent(
        new CustomEvent("game:navigation", {
            detail: { tab }
        })
    );
}

export function getCurrentTab() {
    return getState().meta.activeTab;
}
