import { clampAttribute } from "./attributes.js";

export function createDevelopment(attributes) {

    const potential = {};
    const growthRate = {};
    const peakAge = {};

    for (const [attribute, value] of Object.entries(attributes)) {

        const potentialBonus =
            Math.floor(Math.random() * 31) + 10;

        potential[attribute] =
            clampAttribute(value + potentialBonus);

        growthRate[attribute] =
            Number(
                (0.3 + Math.random() * 1.2)
                .toFixed(2)
            );

        peakAge[attribute] =
            24 + Math.floor(Math.random() * 10);
    }

    return {
        potential,
        growthRate,
        peakAge,
        developmentPoints: 0
    };
}

export function developAttribute(
    player,
    attribute,
    trainingEffect = 1
) {

    if (!player.attributes?.[attribute]) {
        return false;
    }

    const current =
        player.attributes[attribute];

    const potential =
        player.development.potential[attribute];

    if (current >= potential) {
        return false;
    }

    const rate =
        player.development.growthRate[attribute];

    const age =
        player.age;

    let ageModifier = 1;

    if (age <= 20) {
        ageModifier = 1.25;
    } else if (age <= 25) {
        ageModifier = 1.10;
    } else if (age <= 30) {
        ageModifier = 1.0;
    } else if (age <= 35) {
        ageModifier = 0.75;
    } else {
        ageModifier = 0.45;
    }

    const gain =
        rate *
        trainingEffect *
        ageModifier;

    player.attributes[attribute] =
        clampAttribute(
            Math.min(
                potential,
                current + gain
            )
        );

    return true;
}

export function getDevelopmentStatus(player) {

    if (!player?.development) {
        return null;
    }

    const attributes =
        Object.keys(player.attributes);

    let currentTotal = 0;
    let potentialTotal = 0;

    attributes.forEach(attribute => {

        currentTotal +=
            player.attributes[attribute];

        potentialTotal +=
            player.development.potential[attribute];
    });

    const percentage =
        potentialTotal > 0
            ? Math.round(
                (currentTotal / potentialTotal) * 100
            )
            : 0;

    return {
        current: currentTotal,
        potential: potentialTotal,
        percentage
    };
}
