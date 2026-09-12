// data/styles.js

export const FIGHT_STYLES = [
    {
        id: "striker",
        name: "Striker",
        description: "Especialista em trocação.",
        bonuses: {
            striking: 8,
            strikingDefense: 4,
            speed: 4
        }
    },

    {
        id: "wrestler",
        name: "Wrestler",
        description: "Especialista em quedas e controle.",
        bonuses: {
            wrestling: 8,
            takedownDefense: 5,
            strength: 3
        }
    },

    {
        id: "grappler",
        name: "Grappler",
        description: "Especialista em luta agarrada.",
        bonuses: {
            grappling: 7,
            bjj: 7,
            fightIQ: 2
        }
    },

    {
        id: "balanced",
        name: "MMA Completo",
        description: "Atleta equilibrado em todas as áreas.",
        bonuses: {
            striking: 2,
            wrestling: 2,
            grappling: 2,
            bjj: 2,
            cardio: 2,
            fightIQ: 2
        }
    },

    {
        id: "counter_striker",
        name: "Contra-Golpeador",
        description: "Trabalha distância, leitura e contra-ataques.",
        bonuses: {
            striking: 5,
            strikingDefense: 7,
            speed: 4,
            fightIQ: 4
        }
    },

    {
        id: "pressure_fighter",
        name: "Pressionador",
        description: "Busca ritmo alto e pressão constante.",
        bonuses: {
            striking: 4,
            cardio: 7,
            strength: 4,
            mental: 3
        }
    },

    {
        id: "submission_hunter",
        name: "Caçador de Finalizações",
        description: "Prioriza posições e finalizações.",
        bonuses: {
            bjj: 9,
            grappling: 6,
            fightIQ: 3
        }
    },

    {
        id: "ground_and_pound",
        name: "Ground & Pound",
        description: "Busca quedas, controle e dano por cima.",
        bonuses: {
            wrestling: 6,
            grappling: 5,
            strength: 5,
            striking: 3
        }
    }
];

export function getStyleById(id) {
    return FIGHT_STYLES.find(style => style.id === id) || null;
}
