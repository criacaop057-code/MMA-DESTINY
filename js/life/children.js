import { createId } from "../core/ids.js";
import { generateInheritedAttributes } from "./genetics.js";

function createChild(
    father,
    mother,
    options = {}
) {
    const child = {
        id: createId("child"),

        name:
            options.name ||
            "Filho",

        gender:
            options.gender ||
            (
                Math.random() < 0.5
                    ? "male"
                    : "female"
            ),

        birthDate:
            options.birthDate ||
            new Date().toISOString(),

        age: 0,

        fatherId:
            father?.id || null,

        motherId:
            mother?.id || null,

        health: 100,

        education: 0,

        personality: {},

        attributes: {},

        potential: {},

        interests: [],

        talents: [],

        milestones: [],

        career: null,

        playable: false,

        alive: true
    };

    child.attributes =
        generateInheritedAttributes(
            father,
            mother
        );

    child.potential = {
        overall:
            Math.round(
                (
                    child.attributes.striking +
                    child.attributes.grappling +
                    child.attributes.wrestling +
                    child.attributes.cardio +
                    child.attributes.strength
                ) / 5
            )
    };

    return child;
}

function ageChild(child) {
    if (!child || !child.alive) {
        return child;
    }

    child.age++;

    updateChildDevelopment(child);

    return child;
}

function updateChildDevelopment(child) {
    if (!child) return null;

    if (child.age < 5) {
        child.education += 0.5;
    } else if (child.age < 12) {
        child.education += 1;
    } else {
        child.education += 1.5;
    }

    child.education =
        Math.min(
            100,
            child.education
        );

    return child;
}

function addChildInterest(
    child,
    interest
) {
    if (!child || !interest) return false;

    if (!child.interests.includes(interest)) {
        child.interests.push(interest);
    }

    return true;
}

function addChildTalent(
    child,
    talent
) {
    if (!child || !talent) return false;

    if (!child.talents.includes(talent)) {
        child.talents.push(talent);
    }

    return true;
}

function canBecomePlayable(child) {
    if (!child || !child.alive) {
        return false;
    }

    return child.age >= 15;
}

function prepareChildForSuccession(child) {
    if (!child) return null;

    if (!canBecomePlayable(child)) {
        return null;
    }

    child.playable = true;

    return child;
}

export {
    createChild,
    ageChild,
    updateChildDevelopment,
    addChildInterest,
    addChildTalent,
    canBecomePlayable,
    prepareChildForSuccession
};
