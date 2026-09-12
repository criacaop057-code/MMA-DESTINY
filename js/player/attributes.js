import { CONFIG } from "../core/config.js";

export const ATTRIBUTE_NAMES = [
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

export function clampAttribute(value) {
    return Math.max(
        CONFIG.development.minimumAttribute,
        Math.min(
            CONFIG.development.maximumAttribute,
            Math.round(value)
        )
    );
}

export function createAttributes(values = {}) {
    const attributes = {};

    ATTRIBUTE_NAMES.forEach(name => {
        attributes[name] = clampAttribute(
            values[name] ?? 40
        );
    });

    return attributes;
}

export function calculateOVR(attributes) {

    if (!attributes) {
        return 0;
    }

    const weights = {
        striking: 1.0,
        wrestling: 1.0,
        grappling: 1.0,
        bjj: 0.9,
        takedownDefense: 0.9,
        strikingDefense: 0.9,
        cardio: 0.8,
        strength: 0.7,
        speed: 0.8,
        durability: 0.7,
        fightIQ: 1.0,
        discipline: 0.5,
        confidence: 0.4,
        mental: 0.6
    };

    let total = 0;
    let weightTotal = 0;

    for (const name of ATTRIBUTE_NAMES) {
        const value = attributes[name] ?? 0;
        const weight = weights[name] ?? 1;

        total += value * weight;
        weightTotal += weight;
    }

    return Math.round(total / weightTotal);
}

export function getAttributeAverage(attributes) {
    if (!attributes) return 0;

    const values = Object.values(attributes);

    if (!values.length) return 0;

    return Math.round(
        values.reduce((sum, value) => sum + value, 0) /
        values.length
    );
}

export function improveAttribute(attributes, name, amount) {

    if (!attributes[name]) {
        return attributes;
    }

    attributes[name] = clampAttribute(
        attributes[name] + amount
    );

    return attributes;
}
