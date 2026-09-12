// data/countries.js

export const COUNTRIES = [
    {
        id: "BRA",
        name: "Brasil",
        continent: "South America",
        currency: "BRL"
    },
    {
        id: "USA",
        name: "Estados Unidos",
        continent: "North America",
        currency: "USD"
    },
    {
        id: "CAN",
        name: "Canadá",
        continent: "North America",
        currency: "CAD"
    },
    {
        id: "MEX",
        name: "México",
        continent: "North America",
        currency: "MXN"
    },
    {
        id: "ARG",
        name: "Argentina",
        continent: "South America",
        currency: "ARS"
    },
    {
        id: "CHL",
        name: "Chile",
        continent: "South America",
        currency: "CLP"
    },
    {
        id: "COL",
        name: "Colômbia",
        continent: "South America",
        currency: "COP"
    },
    {
        id: "PER",
        name: "Peru",
        continent: "South America",
        currency: "PEN"
    },
    {
        id: "URY",
        name: "Uruguai",
        continent: "South America",
        currency: "UYU"
    },
    {
        id: "GBR",
        name: "Reino Unido",
        continent: "Europe",
        currency: "GBP"
    },
    {
        id: "IRL",
        name: "Irlanda",
        continent: "Europe",
        currency: "EUR"
    },
    {
        id: "ESP",
        name: "Espanha",
        continent: "Europe",
        currency: "EUR"
    },
    {
        id: "FRA",
        name: "França",
        continent: "Europe",
        currency: "EUR"
    },
    {
        id: "GER",
        name: "Alemanha",
        continent: "Europe",
        currency: "EUR"
    },
    {
        id: "ITA",
        name: "Itália",
        continent: "Europe",
        currency: "EUR"
    },
    {
        id: "POL",
        name: "Polônia",
        continent: "Europe",
        currency: "PLN"
    },
    {
        id: "RUS",
        name: "Rússia",
        continent: "Europe",
        currency: "RUB"
    },
    {
        id: "UKR",
        name: "Ucrânia",
        continent: "Europe",
        currency: "UAH"
    },
    {
        id: "GEO",
        name: "Geórgia",
        continent: "Asia",
        currency: "GEL"
    },
    {
        id: "ARM",
        name: "Armênia",
        continent: "Asia",
        currency: "AMD"
    },
    {
        id: "KAZ",
        name: "Cazaquistão",
        continent: "Asia",
        currency: "KZT"
    },
    {
        id: "UZB",
        name: "Uzbequistão",
        continent: "Asia",
        currency: "UZS"
    },
    {
        id: "JPN",
        name: "Japão",
        continent: "Asia",
        currency: "JPY"
    },
    {
        id: "CHN",
        name: "China",
        continent: "Asia",
        currency: "CNY"
    },
    {
        id: "KOR",
        name: "Coreia do Sul",
        continent: "Asia",
        currency: "KRW"
    },
    {
        id: "THA",
        name: "Tailândia",
        continent: "Asia",
        currency: "THB"
    },
    {
        id: "PHL",
        name: "Filipinas",
        continent: "Asia",
        currency: "PHP"
    },
    {
        id: "IND",
        name: "Índia",
        continent: "Asia",
        currency: "INR"
    },
    {
        id: "AUS",
        name: "Austrália",
        continent: "Oceania",
        currency: "AUD"
    },
    {
        id: "NZL",
        name: "Nova Zelândia",
        continent: "Oceania",
        currency: "NZD"
    ],
    {
        id: "NGA",
        name: "Nigéria",
        continent: "Africa",
        currency: "NGN"
    },
    {
        id: "ZAF",
        name: "África do Sul",
        continent: "Africa",
        currency: "ZAR"
    },
    {
        id: "MAR",
        name: "Marrocos",
        continent: "Africa",
        currency: "MAD"
    }
];

export function getCountryById(id) {
    return COUNTRIES.find(country => country.id === id) || null;
}

export function getCountriesByContinent(continent) {
    return COUNTRIES.filter(country => country.continent === continent);
}
