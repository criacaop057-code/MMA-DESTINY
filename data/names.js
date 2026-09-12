// data/names.js

export const NAMES = {
    firstNames: [
        "João",
        "Pedro",
        "Lucas",
        "Gabriel",
        "Matheus",
        "Rafael",
        "Bruno",
        "Carlos",
        "André",
        "Felipe",
        "Diego",
        "Thiago",
        "Victor",
        "Leonardo",
        "Gustavo",
        "Daniel",
        "Eduardo",
        "Henrique",
        "Marcelo",
        "Rodrigo",
        "Caio",
        "Vinicius",
        "Arthur",
        "Miguel",
        "Davi",
        "Enzo",
        "Nicolas",
        "Samuel",
        "Murilo",
        "Igor"
    ],

    surnames: [
        "Silva",
        "Santos",
        "Oliveira",
        "Souza",
        "Rodrigues",
        "Ferreira",
        "Alves",
        "Pereira",
        "Lima",
        "Gomes",
        "Costa",
        "Ribeiro",
        "Martins",
        "Carvalho",
        "Almeida",
        "Lopes",
        "Soares",
        "Fernandes",
        "Vieira",
        "Barbosa",
        "Moura",
        "Dias",
        "Teixeira",
        "Correia",
        "Mendes",
        "Moreira",
        "Nunes",
        "Monteiro",
        "Cardoso",
        "Rocha"
    ],

    nicknames: [
        "The Wolf",
        "The Machine",
        "The Hunter",
        "The Hammer",
        "The Warrior",
        "The Beast",
        "The Assassin",
        "The Dragon",
        "The Bull",
        "The Predator",
        "The Storm",
        "The King",
        "The Lion",
        "The Phantom",
        "The Tank",
        "The Snake",
        "The Eagle",
        "The Reaper",
        "The Soldier",
        "The Destroyer"
    ]
};

export function randomFrom(array) {
    return array[Math.floor(Math.random() * array.length)];
}

export function generateRandomName() {
    return `${randomFrom(NAMES.firstNames)} ${randomFrom(NAMES.surnames)}`;
}

export function generateNickname() {
    return randomFrom(NAMES.nicknames);
}
