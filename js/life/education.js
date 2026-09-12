import { createId } from "../core/ids.js";

const EDUCATION_TYPES = {
    SCHOOL: "school",
    HIGH_SCHOOL: "high_school",
    UNIVERSITY: "university",
    COURSE: "course",
    LANGUAGE: "language",
    COACHING: "coaching",
    BUSINESS: "business",
    MEDIA: "media"
};

function createEducationState() {
    return {
        level: 0,

        completed: [],

        active: [],

        skills: {
            academics: 0,
            languages: 0,
            business: 0,
            coaching: 0,
            media: 0,
            management: 0
        },

        certificates: []
    };
}

function createEducationProgram(
    type,
    name,
    duration,
    cost = 0,
    effects = {}
) {
    return {
        id: createId("education"),

        type,

        name,

        duration,

        remainingWeeks: duration,

        cost,

        effects,

        progress: 0,

        active: true,

        startedAt:
            new Date().toISOString(),

        completedAt: null
    };
}

function advanceEducation(
    program
) {
    if (!program || !program.active) {
        return program;
    }

    program.remainingWeeks--;

    program.progress =
        Math.min(
            100,
            (
                1 -
                program.remainingWeeks /
                program.duration
            ) * 100
        );

    if (program.remainingWeeks <= 0) {
        completeEducation(program);
    }

    return program;
}

function completeEducation(program) {
    if (!program) return null;

    program.active = false;
    program.progress = 100;

    program.completedAt =
        new Date().toISOString();

    return program;
}

function applyEducationEffects(
    education,
    program
) {
    if (!education || !program) {
        return education;
    }

    for (
        const [skill, amount]
        of Object.entries(program.effects || {})
    ) {
        if (
            education.skills[skill] !== undefined
        ) {
            education.skills[skill] =
                Math.min(
                    100,
                    education.skills[skill] +
                    amount
                );
        }
    }

    education.completed.push(
        program
    );

    return education;
}

export {
    EDUCATION_TYPES,
    createEducationState,
    createEducationProgram,
    advanceEducation,
    completeEducation,
    applyEducationEffects
};
