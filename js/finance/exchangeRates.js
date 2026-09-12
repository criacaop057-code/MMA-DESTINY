import {
    BASE_RATES
} from "./currencies.js";

function createExchangeRates() {
    return {
        rates: {
            ...BASE_RATES
        },

        history: [],

        volatility: {
            USD: 0.02,
            EUR: 0.018
        },

        lastUpdate: null
    };
}

function randomChange(
    current,
    volatility
) {
    const variation =
        (Math.random() * 2 - 1) *
        volatility;

    return current *
        (1 + variation);
}

function updateExchangeRates(state) {
    if (!state) return null;

    const previous = {
        ...state.rates
    };

    state.rates.USD =
        randomChange(
            state.rates.USD,
            state.volatility.USD
        );

    state.rates.EUR =
        randomChange(
            state.rates.EUR,
            state.volatility.EUR
        );

    state.rates.USD =
        Math.max(
            2.5,
            Math.min(
                10,
                state.rates.USD
            )
        );

    state.rates.EUR =
        Math.max(
            3,
            Math.min(
                11,
                state.rates.EUR
            )
        );

    state.history.push({
        date: new Date().toISOString(),
        previous,
        current: {
            ...state.rates
        }
    });

    if (state.history.length > 200) {
        state.history =
            state.history.slice(-200);
    }

    state.lastUpdate =
        new Date().toISOString();

    return state;
}

function getRate(
    state,
    currency
) {
    if (!state) return null;

    return state.rates[currency] || null;
}

export {
    createExchangeRates,
    updateExchangeRates,
    getRate
};
