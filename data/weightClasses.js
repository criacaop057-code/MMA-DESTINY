// data/weightClasses.js

export const WEIGHT_CLASSES = [
    {
        id: "strawweight",
        name: "Peso Palha",
        gender: "male",
        limitKg: 52.2,
        limitLb: 115
    },
    {
        id: "flyweight",
        name: "Peso Mosca",
        gender: "male",
        limitKg: 56.7,
        limitLb: 125
    },
    {
        id: "bantamweight",
        name: "Peso Galo",
        gender: "male",
        limitKg: 61.2,
        limitLb: 135
    },
    {
        id: "featherweight",
        name: "Peso Pena",
        gender: "male",
        limitKg: 65.8,
        limitLb: 145
    },
    {
        id: "lightweight",
        name: "Peso Leve",
        gender: "male",
        limitKg: 70.3,
        limitLb: 155
    },
    {
        id: "welterweight",
        name: "Peso Meio-Médio",
        gender: "male",
        limitKg: 77.1,
        limitLb: 170
    },
    {
        id: "middleweight",
        name: "Peso Médio",
        gender: "male",
        limitKg: 83.9,
        limitLb: 185
    },
    {
        id: "light_heavyweight",
        name: "Peso Meio-Pesado",
        gender: "male",
        limitKg: 93.0,
        limitLb: 205
    },
    {
        id: "heavyweight",
        name: "Peso Pesado",
        gender: "male",
        limitKg: 120.2,
        limitLb: 265
    },

    {
        id: "womens_strawweight",
        name: "Peso Palha Feminino",
        gender: "female",
        limitKg: 52.2,
        limitLb: 115
    },
    {
        id: "womens_flyweight",
        name: "Peso Mosca Feminino",
        gender: "female",
        limitKg: 56.7,
        limitLb: 125
    },
    {
        id: "womens_bantamweight",
        name: "Peso Galo Feminino",
        gender: "female",
        limitKg: 61.2,
        limitLb: 135
    },
    {
        id: "womens_featherweight",
        name: "Peso Pena Feminino",
        gender: "female",
        limitKg: 65.8,
        limitLb: 145
    }
];

export function getWeightClass(id) {
    return WEIGHT_CLASSES.find(weightClass => weightClass.id === id) || null;
}
