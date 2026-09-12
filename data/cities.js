// data/cities.js

export const CITIES = [
    { id: "SAO_PAULO", name: "São Paulo", country: "BRA" },
    { id: "RIO", name: "Rio de Janeiro", country: "BRA" },
    { id: "CURITIBA", name: "Curitiba", country: "BRA" },
    { id: "BELO_HORIZONTE", name: "Belo Horizonte", country: "BRA" },
    { id: "BRASILIA", name: "Brasília", country: "BRA" },
    { id: "MACAPA", name: "Macapá", country: "BRA" },
    { id: "MANAUS", name: "Manaus", country: "BRA" },
    { id: "FORTALEZA", name: "Fortaleza", country: "BRA" },
    { id: "RECIFE", name: "Recife", country: "BRA" },
    { id: "PORTO_ALEGRE", name: "Porto Alegre", country: "BRA" },
    { id: "SALVADOR", name: "Salvador", country: "BRA" },
    { id: "CAMPINAS", name: "Campinas", country: "BRA" },

    { id: "NEW_YORK", name: "New York", country: "USA" },
    { id: "LOS_ANGELES", name: "Los Angeles", country: "USA" },
    { id: "LAS_VEGAS", name: "Las Vegas", country: "USA" },
    { id: "MIAMI", name: "Miami", country: "USA" },
    { id: "CHICAGO", name: "Chicago", country: "USA" },
    { id: "HOUSTON", name: "Houston", country: "USA" },

    { id: "LONDON", name: "London", country: "GBR" },
    { id: "MANCHESTER", name: "Manchester", country: "GBR" },
    { id: "DUBLIN", name: "Dublin", country: "IRL" },
    { id: "MADRID", name: "Madrid", country: "ESP" },
    { id: "BARCELONA", name: "Barcelona", country: "ESP" },
    { id: "PARIS", name: "Paris", country: "FRA" },
    { id: "BERLIN", name: "Berlin", country: "GER" },
    { id: "WARSAW", name: "Warsaw", country: "POL" },

    { id: "MOSCOW", name: "Moscow", country: "RUS" },
    { id: "TBILISI", name: "Tbilisi", country: "GEO" },
    { id: "TOKYO", name: "Tokyo", country: "JPN" },
    { id: "BANGKOK", name: "Bangkok", country: "THA" },
    { id: "MANILA", name: "Manila", country: "PHL" },
    { id: "SEOUL", name: "Seoul", country: "KOR" },

    { id: "SYDNEY", name: "Sydney", country: "AUS" },
    { id: "MELBOURNE", name: "Melbourne", country: "AUS" }
];

export function getCityById(id) {
    return CITIES.find(city => city.id === id) || null;
}

export function getCitiesByCountry(countryId) {
    return CITIES.filter(city => city.country === countryId);
}
