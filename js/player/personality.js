export const PERSONALITY_TRAITS = [
    "aggression",
    "discipline",
    "confidence",
    "humility",
    "ambition",
    "patience",
    "loyalty",
    "charisma",
    "professionalism",
    "riskTaking"
];

export function createPersonality(values = {}) {

    const personality = {};

    PERSONALITY_TRAITS.forEach(trait => {
        personality[trait] =
            Math.max(
                1,
                Math.min(
                    100,
                    Math.round(values[trait] ?? 50)
                )
            );
    });

    return personality;
}

export function getPersonalityProfile(personality) {

    if (!personality) {
        return "neutro";
    }

    if (
        personality.aggression >= 75 &&
        personality.riskTaking >= 70
    ) {
        return "agressivo";
    }

    if (
        personality.discipline >= 75 &&
        personality.professionalism >= 70
    ) {
        return "profissional";
    }

    if (
        personality.charisma >= 75 &&
        personality.confidence >= 70
    ) {
        return "carismático";
    }

    if (
        personality.ambition >= 80
    ) {
        return "ambicioso";
    }

    if (
        personality.humility >= 75
    ) {
        return "humilde";
    }

    return "equilibrado";
}
