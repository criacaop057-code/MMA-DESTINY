const GENETIC_ATTRIBUTES = [
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

function randomVariation(value, amount = 8) {
    const variation =
        (Math.random() * 2 - 1) *
        amount;

    return Math.max(
        1,
        Math.min(
            100,
            value + variation
        )
    );
}

function inheritAttribute(
    fatherValue = 50,
    motherValue = 50
) {
    const average =
        (
            fatherValue +
            motherValue
        ) / 2;

    const geneticBias =
        Math.random() < 0.5
            ? fatherValue * 0.15
            : motherValue * 0.15;

    const result =
        average * 0.85 +
        geneticBias * 0.15;

    return Math.round(
        randomVariation(
            result,
            10
        )
    );
}

function generateInheritedAttributes(
    father,
    mother
) {
    const attributes = {};

    for (const attribute of GENETIC_ATTRIBUTES) {
        const fatherValue =
            father?.attributes?.[attribute] ??
            50;

        const motherValue =
            mother?.attributes?.[attribute] ??
            50;

        attributes[attribute] =
            inheritAttribute(
                fatherValue,
                motherValue
            );
    }

    return attributes;
}

function calculateGeneticPotential(
    child
) {
    if (!child?.attributes) {
        return 0;
    }

    const values =
        Object.values(
            child.attributes
        );

    if (!values.length) return 0;

    return Math.round(
        values.reduce(
            (sum, value) =>
                sum + value,
            0
        ) / values.length
    );
}

function applyGeneticMutation(
    child,
    intensity = 5
) {
    if (!child?.attributes) {
        return child;
    }

    for (const attribute of Object.keys(
        child.attributes
    )) {
        if (Math.random() < 0.1) {
            child.attributes[attribute] =
                Math.max(
                    1,
                    Math.min(
                        100,
                        child.attributes[attribute] +
                        (
                            Math.random() * 2 - 1
                        ) * intensity
                    )
                );
        }
    }

    return child;
}

export {
    GENETIC_ATTRIBUTES,
    inheritAttribute,
    generateInheritedAttributes,
    calculateGeneticPotential,
    applyGeneticMutation
};
