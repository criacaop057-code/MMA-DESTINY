import { generateId } from "../core/ids.js";
import { WEIGHT_CLASSES } from "../core/constants.js";

export const NPC_STYLES = [
    "striker",
    "wrestler",
    "grappler",
    "bjj",
    "balanced",
    "pressure",
    "counter_striker",
    "wrestling_pressure",
    "submission_hunter"
];

export const STANCES = [
    "orthodox",
    "southpaw",
    "switch"
];

const FIRST_NAMES = [
    "Lucas",
    "Miguel",
    "Gabriel",
    "Arthur",
    "Pedro",
    "João",
    "Rafael",
    "Daniel",
    "Carlos",
    "André",
    "Matheus",
    "Bruno",
    "Victor",
    "Diego",
    "Fernando",
    "Thiago",
    "Leonardo",
    "Eduardo",
    "Gustavo",
    "Felipe"
];

const LAST_NAMES = [
    "Silva",
    "Santos",
    "Oliveira",
    "Souza",
    "Costa",
    "Ferreira",
    "Rodrigues",
    "Almeida",
    "Pereira",
    "Carvalho",
    "Gomes",
    "Martins",
    "Ribeiro",
    "Barbosa",
    "Mendes",
    "Lima",
    "Moreira",
    "Teixeira",
    "Correia",
    "Nascimento"
];

const COUNTRIES = [
    "Brasil",
    "Estados Unidos",
    "México",
    "Argentina",
    "Chile",
    "Colômbia",
    "Peru",
    "Espanha",
    "Portugal",
    "França",
    "Inglaterra",
    "Irlanda",
    "Rússia",
    "Geórgia",
    "Cazaquistão",
    "Japão",
    "Coreia do Sul",
    "Austrália",
    "Canadá",
    "Nigéria"
];

export function createNPCFighter(options = {}) {
    const age = options.age ?? randomInt(18, 36);

    const attributes = generateAttributes(
        options.baseRating ?? randomInt(45, 75)
    );

    const fighter = {
        id: generateId("fighter"),

        identity: {
            name:
                options.name ||
                `${randomItem(FIRST_NAMES)} ${randomItem(LAST_NAMES)}`,

            nickname:
                options.nickname ||
                generateNickname(),

            country:
                options.country ||
                randomItem(COUNTRIES),

            age,

            birthYear:
                new Date().getFullYear() - age
        },

        weightClass:
            options.weightClass ||
            randomItem(Object.keys(WEIGHT_CLASSES)),

        style:
            options.style ||
            randomItem(NPC_STYLES),

        stance:
            options.stance ||
            randomItem(STANCES),

        attributes,

        ovr: calculateOVR(attributes),

        potential:
            options.potential ||
            randomInt(
                Math.max(55, calculateOVR(attributes)),
                95
            ),

        personality: generatePersonality(),

        development: {
            growthRate: randomFloat(0.6, 1.4),
            peakAge: randomInt(27, 34),
            regressionRate: randomFloat(0.4, 1)
        },

        health: {
            current: 100,
            maximum: 100,
            fatigue: 0,
            injuries: [],
            suspension: false
        },

        career: {
            amateur: false,

            record: {
                wins: randomInt(0, 8),
                losses: randomInt(0, 4),
                draws: randomInt(0, 1),
                noContests: 0
            },

            streak: 0,
            longestWinStreak: 0,

            experience:
                randomInt(10, 70),

            ranking: null,

            titles: 0,
            titleDefenses: 0,

            earnings: 0,

            fights: [],

            debutYear:
                new Date().getFullYear() -
                randomInt(1, 12)
        },

        team: {
            name:
                options.team ||
                randomItem([
                    "Independent",
                    "Elite MMA",
                    "Warrior Team",
                    "Black House",
                    "Brazilian Top Team",
                    "Evolution MMA",
                    "Combat Academy",
                    "Fighters Lab",
                    "Team Alliance"
                ])
        },

        availability: {
            available: true,
            reason: null,
            weeksOut: 0
        },

        popularity: randomInt(5, 50),

        hype: randomInt(5, 45),

        reputation: randomInt(10, 60),

        social: {
            followers: randomInt(100, 100000),
            activity: randomInt(20, 90)
        },

        statistics: {
            knockouts: 0,
            submissions: 0,
            decisions: 0,
            knockdowns: 0,
            takedowns: 0
        },

        createdAt: Date.now()
    };

    return fighter;
}

function generateAttributes(base) {
    const attributes = {};

    const names = [
        "striking",
        "wrestling",
        "grappling",
        "bjj",
        "takedownDefense",
        "strikingDefense",
        "cardio",
        "strength",
        "speed",
        "durability",
        "fightIQ",
        "discipline",
        "confidence",
        "mental"
    ];

    names.forEach(attribute => {
        attributes[attribute] = clamp(
            Math.round(
                base + randomInt(-12, 12)
            ),
            25,
            95
        );
    });

    return attributes;
}

function calculateOVR(attributes) {
    const weights = {
        striking: 0.10,
        wrestling: 0.08,
        grappling: 0.08,
        bjj: 0.07,
        takedownDefense: 0.07,
        strikingDefense: 0.07,
        cardio: 0.08,
        strength: 0.07,
        speed: 0.06,
        durability: 0.06,
        fightIQ: 0.09,
        discipline: 0.05,
        confidence: 0.04,
        mental: 0.08
    };

    let total = 0;

    Object.entries(weights).forEach(
        ([attribute, weight]) => {
            total +=
                (attributes[attribute] || 0) *
                weight;
        }
    );

    return Math.round(total);
}

function generatePersonality() {
    return {
        aggression: randomInt(20, 90),
        discipline: randomInt(30, 95),
        confidence: randomInt(25, 95),
        humility: randomInt(20, 90),
        ambition: randomInt(30, 95),
        patience: randomInt(20, 90),
        loyalty: randomInt(20, 95),
        charisma: randomInt(15, 95),
        professionalism: randomInt(30, 95),
        riskTaking: randomInt(15, 90)
    };
}

function generateNickname() {
    return randomItem([
        "The Wolf",
        "The Machine",
        "The Hunter",
        "The Storm",
        "The Warrior",
        "The Dragon",
        "The Hammer",
        "The Phantom",
        "The King",
        "The Prince",
        "The Bull",
        "The Lion",
        "The Assassin",
        "The Pitbull",
        "The Reaper",
        "The Snake",
        "The Eagle"
    ]);
}

export function generateFighters(quantity, options = {}) {
    const fighters = [];

    for (let i = 0; i < quantity; i++) {
        fighters.push(
            createNPCFighter(options)
        );
    }

    return fighters;
}

export function calculateFighterStrength(fighter) {
    const ovr = fighter.ovr || 0;
    const experience =
        fighter.career?.experience || 0;

    const record =
        fighter.career?.record || {};

    const wins = record.wins || 0;
    const losses = record.losses || 0;

    const recordValue =
        wins * 1.2 -
        losses * 0.8;

    return Math.round(
        ovr * 0.7 +
        experience * 0.2 +
        recordValue
    );
}

export function isFighterAvailable(fighter) {
    return (
        fighter?.availability?.available !== false &&
        !fighter?.health?.suspension &&
        !fighter?.health?.injuries?.some(
            injury =>
                injury.severity === "major"
        )
    );
}

export function getFighterRecord(fighter) {
    return {
        wins: fighter.career?.record?.wins || 0,
        losses:
            fighter.career?.record?.losses || 0,
        draws:
            fighter.career?.record?.draws || 0,
        noContests:
            fighter.career?.record?.noContests || 0
    };
}

export function addFightToFighter(
    fighter,
    fightId
) {
    if (!fighter.career.fights) {
        fighter.career.fights = [];
    }

    if (!fighter.career.fights.includes(fightId)) {
        fighter.career.fights.push(fightId);
    }
}

export function applyFighterResult(
    fighter,
    result
) {
    if (!fighter?.career?.record) {
        return;
    }

    if (result === "win") {
        fighter.career.record.wins++;
        fighter.career.streak =
            Math.max(
                0,
                fighter.career.streak
            ) + 1;

        fighter.career.longestWinStreak =
            Math.max(
                fighter.career.longestWinStreak,
                fighter.career.streak
            );
    }

    if (result === "loss") {
        fighter.career.record.losses++;
        fighter.career.streak =
            Math.min(
                0,
                fighter.career.streak
            ) - 1;
    }

    if (result === "draw") {
        fighter.career.record.draws++;
        fighter.career.streak = 0;
    }

    if (result === "no_contest") {
        fighter.career.record.noContests++;
    }
}

function randomItem(array) {
    return array[
        Math.floor(
            Math.random() * array.length
        )
    ];
}

function randomInt(min, max) {
    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;
}

function randomFloat(min, max) {
    return Math.random() *
        (max - min) +
        min;
}

function clamp(value, min, max) {
    return Math.min(
        max,
        Math.max(min, value)
    );
}
