import { createId } from "../core/ids.js";

const BUREAUCRACY_TYPES = {
    VISA: "visa",
    LICENSE: "license",
    MEDICAL: "medical",
    ANTIDOPING: "antidoping",
    REGISTRATION: "registration",
    DOCUMENT: "document",
    WORK_PERMIT: "work_permit",
    INSURANCE: "insurance"
};

function createBureaucracyState() {
    return {
        documents: [],
        visas: [],
        licenses: [],
        medicals: [],
        antidoping: [],
        insurance: [],
        pending: []
    };
}

function createRequirement(
    type,
    country,
    description,
    cost = 0
) {
    return {
        id: createId("bureau"),
        type,
        country,
        description,
        cost,
        status: "pending",
        createdAt: new Date().toISOString(),
        completedAt: null
    };
}

function addRequirement(
    state,
    type,
    country,
    description,
    cost = 0
) {
    if (!state) return null;

    const requirement =
        createRequirement(
            type,
            country,
            description,
            cost
        );

    state.pending.push(requirement);

    return requirement;
}

function completeRequirement(
    state,
    requirementId
) {
    if (!state) return false;

    const requirement =
        state.pending.find(
            item => item.id === requirementId
        );

    if (!requirement) {
        return false;
    }

    requirement.status = "completed";
    requirement.completedAt =
        new Date().toISOString();

    state.pending =
        state.pending.filter(
            item => item.id !== requirementId
        );

    return true;
}

function hasPendingRequirements(state) {
    return Boolean(
        state &&
        state.pending &&
        state.pending.length
    );
}

export {
    BUREAUCRACY_TYPES,
    createBureaucracyState,
    createRequirement,
    addRequirement,
    completeRequirement,
    hasPendingRequirements
};
