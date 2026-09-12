const CURRENCIES = {
    BRL: {
        code: "BRL",
        name: "Real Brasileiro",
        symbol: "R$"
    },

    USD: {
        code: "USD",
        name: "Dólar Americano",
        symbol: "$"
    },

    EUR: {
        code: "EUR",
        name: "Euro",
        symbol: "€"
    }
};

const BASE_RATES = {
    BRL: 1,
    USD: 5.2,
    EUR: 5.7
};

function getCurrency(code) {
    return CURRENCIES[code] || null;
}

function convertCurrency(
    amount,
    from,
    to,
    rates = BASE_RATES
) {
    if (!CURRENCIES[from] || !CURRENCIES[to]) {
        return 0;
    }

    if (from === to) {
        return amount;
    }

    const valueInBRL =
        amount * rates[from];

    return valueInBRL / rates[to];
}

function formatMoney(
    amount,
    currency = "BRL"
) {
    const currencyData =
        CURRENCIES[currency];

    if (!currencyData) {
        return String(amount);
    }

    return new Intl.NumberFormat(
        "pt-BR",
        {
            style: "currency",
            currency
        }
    ).format(amount);
}

function listCurrencies() {
    return Object.values(CURRENCIES);
}

export {
    CURRENCIES,
    BASE_RATES,
    getCurrency,
    convertCurrency,
    formatMoney,
    listCurrencies
};
