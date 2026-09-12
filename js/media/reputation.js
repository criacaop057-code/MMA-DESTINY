const REPUTATION_LIMITS = {
    MIN: 0,
    MAX: 100
};

function createReputation() {
    return {
        overall: 0,

        categories: {
            professionalism: 50,
            respect: 50,
            popularity: 0,
            sportsmanship: 50,
            reliability: 50,
            controversy: 0,
            marketability: 0
        },

        organization: {},
        public: 0,
        media: 0,
        fighters: 0,
        sponsors: 0
    };
}

function clamp(value) {
    return Math.max(
        REPUTATION_LIMITS.MIN,
        Math.min(
            REPUTATION_LIMITS.MAX,
            value
        )
    );
}

function changeCategory(
    reputation,
    category,
    amount
) {
    if (!reputation) return null;

    if (
        reputation.categories[category] === undefined
    ) {
        return reputation;
    }

    reputation.categories[category] =
        clamp(
            reputation.categories[category] +
            amount
        );

    recalculateOverall(reputation);

    return reputation;
}

function recalculateOverall(reputation) {
    const categories =
        reputation.categories;

    const values = [
        categories.professionalism,
        categories.respect,
        categories.popularity,
        categories.sportsmanship,
        categories.reliability,
        categories.marketability
    ];

    reputation.overall =
        Math.round(
            values.reduce(
                (sum, value) => sum + value,
                0
            ) / values.length
        );

    return reputation;
}

function changeOrganizationReputation(
    reputation,
    organizationId,
    amount
) {
    if (!reputation || !organizationId) {
        return null;
    }

    if (
        reputation.organization[organizationId] === undefined
    ) {
        reputation.organization[organizationId] = 50;
    }

    reputation.organization[organizationId] =
        clamp(
            reputation.organization[organizationId] +
            amount
        );

    return reputation;
}

function applyInterviewReputation(
    reputation,
    effects = {}
) {
    if (!reputation) return null;

    if (effects.reputation) {
        reputation.public =
            clamp(
                reputation.public +
                effects.reputation
            );
    }

    if (effects.respect) {
        changeCategory(
            reputation,
            "respect",
            effects.respect
        );
    }

    if (effects.discipline) {
        changeCategory(
            reputation,
            "professionalism",
            effects.discipline
        );
    }

    if (effects.professionalism) {
        changeCategory(
            reputation,
            "professionalism",
            effects.professionalism
        );
    }

    if (effects.antipathy) {
        changeCategory(
            reputation,
            "controversy",
            effects.antipathy
        );
    }

    recalculateOverall(reputation);

    return reputation;
}

function applyFightReputation(
    reputation,
    result,
    method
) {
    if (!reputation) return null;

    if (result === "win") {
        changeCategory(
            reputation,
            "reliability",
            2
        );

        changeCategory(
            reputation,
            "popularity",
            method === "decision" ? 1 : 4
        );
    }

    if (result === "loss") {
        changeCategory(
            reputation,
            "reliability",
            -1
        );
    }

    return reputation;
}

function getReputationLevel(reputation) {
    if (!reputation) return "unknown";

    const value = reputation.overall;

    if (value >= 90) return "legendary";
    if (value >= 75) return "elite";
    if (value >= 60) return "respected";
    if (value >= 40) return "neutral";
    if (value >= 25) return "questionable";

    return "poor";
}

export {
    REPUTATION_LIMITS,
    createReputation,
    changeCategory,
    recalculateOverall,
    changeOrganizationReputation,
    applyInterviewReputation,
    applyFightReputation,
    getReputationLevel
};
