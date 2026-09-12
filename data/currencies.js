// data/currencies.js

/*
 * MMA DESTINY
 * Moedas utilizadas pelo universo.
 *
 * BRL / USD / EUR são as moedas principais.
 * As demais permitem que atletas e organizações
 * tenham origem internacional.
 */

export const CURRENCIES = [

    {
        id: "BRL",
        code: "BRL",
        name: "Real Brasileiro",
        symbol: "R$",
        country: "BRA",
        major: true
    },

    {
        id: "USD",
        code: "USD",
        name: "Dólar Americano",
        symbol: "$",
        country: "USA",
        major: true
    },

    {
        id: "EUR",
        code: "EUR",
        name: "Euro",
        symbol: "€",
        country: "EUR",
        major: true
    },

    {
        id: "GBP",
        code: "GBP",
        name: "Libra Esterlina",
        symbol: "£",
        country: "GBR",
        major: false
    },

    {
        id: "JPY",
        code: "JPY",
        name: "Iene Japonês",
        symbol: "¥",
        country: "JPN",
        major: false
    },

    {
        id: "CAD",
        code: "CAD",
        name: "Dólar Canadense",
        symbol: "C$",
        country: "CAN",
        major: false
    },

    {
        id: "AUD",
        code: "AUD",
        name: "Dólar Australiano",
        symbol: "A$",
        country: "AUS",
        major: false
    },

    {
        id: "PLN",
        code: "PLN",
        name: "Zloty Polonês",
        symbol: "zł",
        country: "POL",
        major: false
    },

    {
        id: "RUB",
        code: "RUB",
        name: "Rublo Russo",
        symbol: "₽",
        country: "RUS",
        major: false
    },

    {
        id: "CNY",
        code: "CNY",
        name: "Yuan Chinês",
        symbol: "¥",
        country: "CHN",
        major: false
    },

    {
        id: "KRW",
        code: "KRW",
        name: "Won Sul-Coreano",
        symbol: "₩",
        country: "KOR",
        major: false
    },

    {
        id: "THB",
        code: "THB",
        name: "Baht Tailandês",
        symbol: "฿",
        country: "THA",
        major: false
    },

    {
        id: "AED",
        code: "AED",
        name: "Dirham dos Emirados",
        symbol: "د.إ",
        country: "ARE",
        major: false
    },

    {
        id: "ZAR",
        code: "ZAR",
        name: "Rand Sul-Africano",
        symbol: "R",
        country: "ZAF",
        major: false
    },

    {
        id: "MXN",
        code: "MXN",
        name: "Peso Mexicano",
        symbol: "Mex$",
        country: "MEX",
        major: false
    },

    {
        id: "ARS",
        code: "ARS",
        name: "Peso Argentino",
        symbol: "$",
        country: "ARG",
        major: false
    },

    {
        id: "CLP",
        code: "CLP",
        name: "Peso Chileno",
        symbol: "$",
        country: "CHL",
        major: false
    },

    {
        id: "COP",
        code: "COP",
        name: "Peso Colombiano",
        symbol: "$",
        country: "COL",
        major: false
    }
];


// =============================================================
// FUNÇÕES
// =============================================================

export function getCurrencyById(id) {
    return CURRENCIES.find(currency => currency.id === id) || null;
}

export function getMajorCurrencies() {
    return CURRENCIES.filter(currency => currency.major);
}

export function getCurrencySymbol(id) {
    const currency = getCurrencyById(id);

    return currency
        ? currency.symbol
        : id;
}
