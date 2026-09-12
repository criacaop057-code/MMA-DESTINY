// data/questions.js

export const INTERVIEW_QUESTIONS = [

    {
        id: "q001",
        category: "career",
        text: "Como você avalia sua trajetória até aqui?",
        options: [
            {
                id: "humble",
                text: "Ainda tenho muito a provar.",
                effects: {
                    reputation: 2,
                    respect: 3,
                    hype: 1
                }
            },
            {
                id: "confident",
                text: "Estou exatamente onde deveria estar.",
                effects: {
                    confidence: 2,
                    hype: 3,
                    antipathy: 1
                }
            },
            {
                id: "aggressive",
                text: "Ainda não cheguei nem perto do meu limite.",
                effects: {
                    hype: 5,
                    confidence: 3,
                    antipathy: 2
                }
            }
        ]
    },

    {
        id: "q002",
        category: "opponent",
        text: "O que você acha do seu próximo adversário?",
        options: [
            {
                id: "respect",
                text: "É um grande atleta e merece respeito.",
                effects: {
                    respect: 3,
                    reputation: 2
                }
            },
            {
                id: "neutral",
                text: "Ele é apenas o próximo obstáculo.",
                effects: {
                    confidence: 2,
                    hype: 2
                }
            },
            {
                id: "trash_talk",
                text: "Ele ainda não enfrentou ninguém como eu.",
                effects: {
                    hype: 6,
                    antipathy: 5,
                    rivalry: 3
                }
            }
        ]
    },

    {
        id: "q003",
        category: "championship",
        text: "Você se considera pronto para disputar o cinturão?",
        options: [
            {
                id: "patient",
                text: "Quando a oportunidade aparecer, estarei pronto.",
                effects: {
                    reputation: 3,
                    respect: 2
                }
            },
            {
                id: "demand",
                text: "Eu quero minha oportunidade agora.",
                effects: {
                    hype: 4,
                    confidence: 3
                }
            },
            {
                id: "champion",
                text: "Não estou aqui para disputar. Estou aqui para ser campeão.",
                effects: {
                    hype: 7,
                    antipathy: 3,
                    confidence: 4
                }
            }
        ]
    },

    {
        id: "q004",
        category: "loss",
        text: "Como você reage depois de uma derrota?",
        options: [
            {
                id: "learn",
                text: "Volto para a academia e corrijo meus erros.",
                effects: {
                    discipline: 4,
                    mental: 3,
                    reputation: 2
                }
            },
            {
                id: "anger",
                text: "Isso só aumenta minha vontade de voltar.",
                effects: {
                    confidence: 2,
                    mental: 4,
                    hype: 2
                }
            },
            {
                id: "excuse",
                text: "Nem tudo aconteceu como deveria naquela noite.",
                effects: {
                    reputation: -2,
                    respect: -2,
                    antipathy: 2
                }
            }
        ]
    },

    {
        id: "q005",
        category: "money",
        text: "O dinheiro mudou sua relação com o esporte?",
        options: [
            {
                id: "sport",
                text: "O dinheiro é consequência. Eu luto porque amo competir.",
                effects: {
                    respect: 4,
                    reputation: 3
                }
            },
            {
                id: "business",
                text: "Minha carreira também é um negócio.",
                effects: {
                    reputation: 2,
                    finance: 2
                }
            },
            {
                id: "money",
                text: "Claro. Todo profissional quer ser bem pago.",
                effects: {
                    finance: 4,
                    antipathy: 1
                }
            }
        ]
    },

    {
        id: "q006",
        category: "legacy",
        text: "Como você gostaria de ser lembrado?",
        options: [
            {
                id: "champion",
                text: "Como um campeão.",
                effects: {
                    legacy: 5,
                    confidence: 2
                }
            },
            {
                id: "warrior",
                text: "Como alguém que nunca desistiu.",
                effects: {
                    legacy: 6,
                    respect: 4
                }
            },
            {
                id: "family",
                text: "Como alguém que construiu algo para sua família.",
                effects: {
                    legacy: 8,
                    family: 3
                }
            }
        ]
    },

    {
        id: "q007",
        category: "rivalry",
        text: "Seu rival disse que você não pertence ao topo. O que responde?",
        options: [
            {
                id: "calm",
                text: "Ele pode falar. Eu vou responder no cage.",
                effects: {
                    hype: 4,
                    respect: 2,
                    rivalry: 4
                }
            },
            {
                id: "attack",
                text: "Ele sabe que não consegue me vencer.",
                effects: {
                    hype: 7,
                    antipathy: 5,
                    rivalry: 7
                }
            },
            {
                id: "ignore",
                text: "Não vou dar importância para isso.",
                effects: {
                    reputation: 3,
                    respect: 3
                }
            }
        ]
    },

    {
        id: "q008",
        category: "training",
        text: "Qual é sua maior arma?",
        options: [
            {
                id: "striking",
                text: "Minha trocação.",
                effects: {
                    striking: 1,
                    hype: 2
                }
            },
            {
                id: "grappling",
                text: "Minha luta agarrada.",
                effects: {
                    grappling: 1,
                    respect: 2
                }
            },
            {
                id: "mind",
                text: "Minha cabeça.",
                effects: {
                    fightIQ: 2,
                    mental: 2
                }
            }
        ]
    },

    {
        id: "q009",
        category: "future",
        text: "Onde você se vê daqui a cinco anos?",
        options: [
            {
                id: "champion",
                text: "No topo da minha categoria.",
                effects: {
                    confidence: 3,
                    hype: 3
                }
            },
            {
                id: "legend",
                text: "Construindo meu legado.",
                effects: {
                    legacy: 5,
                    reputation: 3
                }
            },
            {
                id: "academy",
                text: "Também quero formar novos lutadores.",
                effects: {
                    legacy: 6,
                    academy: 4
                }
            }
        ]
    },

    {
        id: "q010",
        category: "personal",
        text: "Quem é a pessoa mais importante na sua carreira?",
        options: [
            {
                id: "coach",
                text: "Meu treinador.",
                effects: {
                    respect: 3,
                    academy: 2
                }
            },
            {
                id: "family",
                text: "Minha família.",
                effects: {
                    family: 4,
                    legacy: 4
                }
            },
            {
                id: "self",
                text: "Eu mesmo. Fui eu quem fez os sacrifícios.",
                effects: {
                    confidence: 4,
                    antipathy: 1
                }
            }
        ]
    }
];

export function getQuestionById(id) {
    return INTERVIEW_QUESTIONS.find(
        question => question.id === id
    ) || null;
}

export function getQuestionsByCategory(category) {
    return INTERVIEW_QUESTIONS.filter(
        question => question.category === category
    );
}

export function getRandomQuestion() {
    const index = Math.floor(
        Math.random() * INTERVIEW_QUESTIONS.length
    );

    return INTERVIEW_QUESTIONS[index];
}
