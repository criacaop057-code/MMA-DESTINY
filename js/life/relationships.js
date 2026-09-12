import { createId } from "../core/ids.js";

const RELATIONSHIP_TYPES = {
    SINGLE: "single",
    DATING: "dating",
    ENGAGED: "engaged",
    MARRIED: "married",
    SEPARATED: "separated",
    DIVORCED: "divorced"
};

const RELATIONSHIP_QUALITIES = {
    TERRIBLE: "terrible",
    BAD: "bad",
    UNSTABLE: "unstable",
    NORMAL: "normal",
    GOOD: "good",
    GREAT: "great",
    EXCELLENT: "excellent"
};

function createRelationship(partner, type = RELATIONSHIP_TYPES.DATING) {
    return {
        id: createId("relationship"),

        partner,

        type,

        quality: 60,

        compatibility: 60,

        trust: 60,

        affection: 60,

        communication: 60,

        conflict: 10,

        happiness: 60,

        loyalty: 70,

        children: [],

        history: [],

        active: true,

        startedAt: new Date().toISOString(),

        endedAt: null
    };
}

function clamp(value) {
    return Math.max(0, Math.min(100, value));
}

function updateRelationshipQuality(relationship) {
    if (!relationship) return null;

    const score =
        (
            relationship.compatibility +
            relationship.trust +
            relationship.affection +
            relationship.communication +
            relationship.happiness -
            relationship.conflict
        ) / 5;

    if (score >= 85) {
        relationship.quality =
            RELATIONSHIP_QUALITIES.EXCELLENT;
    } else if (score >= 75) {
        relationship.quality =
            RELATIONSHIP_QUALITIES.GREAT;
    } else if (score >= 65) {
        relationship.quality =
            RELATIONSHIP_QUALITIES.GOOD;
    } else if (score >= 50) {
        relationship.quality =
            RELATIONSHIP_QUALITIES.NORMAL;
    } else if (score >= 35) {
        relationship.quality =
            RELATIONSHIP_QUALITIES.UNSTABLE;
    } else if (score >= 20) {
        relationship.quality =
            RELATIONSHIP_QUALITIES.BAD;
    } else {
        relationship.quality =
            RELATIONSHIP_QUALITIES.TERRIBLE;
    }

    return relationship;
}

function changeRelationship(
    relationship,
    changes = {}
) {
    if (!relationship) return null;

    const fields = [
        "compatibility",
        "trust",
        "affection",
        "communication",
        "conflict",
        "happiness",
        "loyalty"
    ];

    for (const field of fields) {
        if (changes[field] !== undefined) {
            relationship[field] =
                clamp(
                    relationship[field] +
                    changes[field]
                );
        }
    }

    updateRelationshipQuality(relationship);

    return relationship;
}

function marry(relationship) {
    if (!relationship) return null;

    relationship.type =
        RELATIONSHIP_TYPES.MARRIED;

    relationship.history.push({
        event: "marriage",
        date: new Date().toISOString()
    });

    return relationship;
}

function separate(relationship) {
    if (!relationship) return null;

    relationship.type =
        RELATIONSHIP_TYPES.SEPARATED;

    relationship.history.push({
        event: "separation",
        date: new Date().toISOString()
    });

    return relationship;
}

function endRelationship(
    relationship,
    type = RELATIONSHIP_TYPES.DIVORCED
) {
    if (!relationship) return null;

    relationship.type = type;
    relationship.active = false;
    relationship.endedAt =
        new Date().toISOString();

    relationship.history.push({
        event: type,
        date: relationship.endedAt
    });

    return relationship;
}

function processWeeklyRelationship(relationship) {
    if (!relationship || !relationship.active) {
        return relationship;
    }

    const stress =
        Math.random() < 0.15 ? -1 : 0;

    relationship.happiness =
        clamp(
            relationship.happiness +
            stress
        );

    if (
        relationship.quality ===
        RELATIONSHIP_QUALITIES.EXCELLENT ||
        relationship.quality ===
        RELATIONSHIP_QUALITIES.GREAT
    ) {
        relationship.affection =
            clamp(
                relationship.affection + 0.2
            );
    }

    updateRelationshipQuality(relationship);

    return relationship;
}

export {
    RELATIONSHIP_TYPES,
    RELATIONSHIP_QUALITIES,
    createRelationship,
    updateRelationshipQuality,
    changeRelationship,
    marry,
    separate,
    endRelationship,
    processWeeklyRelationship
};
