import { createId } from "../core/ids.js";

const INTERVIEW_TYPES = {
    PRE_FIGHT: "pre_fight",
    POST_FIGHT: "post_fight",
    PRESS_CONFERENCE: "press_conference",
    MEDIA_DAY: "media_day",
    PERSONAL: "personal",
    CHALLENGE: "challenge",
    TITLE: "title",
    CAREER: "career"
};

const QUESTIONS = [
    {
        id: "q001",
        type: "pre_fight",
        question: "Como você está se sentindo para essa luta?",
        options: [
            {
                id: "confident",
                text: "Estou pronto. Vim aqui para vencer.",
                effects: {
                    confidence: 2,
                    hype: 3,
                    reputation: 1
                }
            },
            {
                id: "respect",
                text: "Respeito meu adversário, mas estou preparado.",
                effects: {
                    reputation: 2,
                    respect: 2,
                    hype: 1
                }
            },
            {
                id: "aggressive",
                text: "Ele vai descobrir que escolheu o adversário errado.",
                effects: {
                    confidence: 2,
                    hype: 5,
                    antipathy: 2,
                    rivalry: 3
                }
            },
            {
                id: "humble",
                text: "Só quero fazer meu trabalho e sair com a vitória.",
                effects: {
                    discipline: 1,
                    reputation: 2,
                    respect: 3
                }
            }
        ]
    },

    {
        id: "q002",
        type: "pre_fight",
        question: "O que você acha do estilo do seu adversário?",
        options: [
            {
                id: "respect_style",
                text: "É um lutador completo e perigoso.",
                effects: {
                    respect: 3,
                    reputation: 1
                }
            },
            {
                id: "weakness",
                text: "Ele tem falhas que pretendo explorar.",
                effects: {
                    hype: 3,
                    confidence: 2
                }
            },
            {
                id: "dismiss",
                text: "Sinceramente, não vejo nada que me preocupe.",
                effects: {
                    hype: 4,
                    antipathy: 2,
                    confidence: 2
                }
            }
        ]
    },

    {
        id: "q003",
        type: "post_fight",
        question: "Qual foi o fator decisivo para sua vitória?",
        options: [
            {
                id: "team",
                text: "Meu time. Trabalhamos muito para chegar aqui.",
                effects: {
                    reputation: 2,
                    loyalty: 2,
                    respect: 2
                }
            },
            {
                id: "training",
                text: "A preparação. Eu sabia exatamente o que precisava fazer.",
                effects: {
                    discipline: 2,
                    reputation: 2
                }
            },
            {
                id: "talent",
                text: "Eu simplesmente fui melhor hoje.",
                effects: {
                    confidence: 3,
                    hype: 2,
                    antipathy: 1
                }
            }
        ]
    },

    {
        id: "q004",
        type: "post_fight",
        question: "Quem você gostaria de enfrentar agora?",
        options: [
            {
                id: "higher_ranked",
                text: "Qualquer um acima de mim no ranking.",
                effects: {
                    ambition: 3,
                    hype: 3
                }
            },
            {
                id: "champion",
                text: "Quero o campeão.",
                effects: {
                    ambition: 4,
                    hype: 6,
                    rivalry: 2
                }
            },
            {
                id: "rematch",
                text: "Quero uma revanche contra quem me venceu.",
                effects: {
                    rivalry: 5,
                    hype: 3
                }
            },
            {
                id: "anyone",
                text: "Quem a organização colocar na minha frente.",
                effects: {
                    professionalism: 2,
                    reputation: 2
                }
            }
        ]
    }
];

function getQuestions(type = null) {
    if (!type) {
        return [...QUESTIONS];
    }

    return QUESTIONS.filter(question => question.type === type);
}

function getQuestionById(id) {
    return QUESTIONS.find(question => question.id === id) || null;
}

function createInterview(type, context = {}) {
    const questions = getQuestions(type);

    if (!questions.length) {
        return null;
    }

    const question =
        questions[Math.floor(Math.random() * questions.length)];

    return {
        id: createId("interview"),
        type,
        questionId: question.id,
        question: question.question,
        context,
        answered: false,
        answerId: null,
        effects: null,
        createdAt: new Date().toISOString()
    };
}

function answerInterview(interview, answerId) {
    if (!interview) return null;

    const question = getQuestionById(interview.questionId);

    if (!question) {
        return interview;
    }

    const option = question.options.find(
        item => item.id === answerId
    );

    if (!option) {
        return interview;
    }

    interview.answered = true;
    interview.answerId = answerId;
    interview.effects = { ...option.effects };

    return interview;
}

function getInterviewTypes() {
    return { ...INTERVIEW_TYPES };
}

export {
    INTERVIEW_TYPES,
    QUESTIONS,
    getQuestions,
    getQuestionById,
    createInterview,
    answerInterview,
    getInterviewTypes
};
