import { createId } from "../core/ids.js";

const INVESTMENT_TYPES = {
    SAVINGS: "savings",
    STOCKS: "stocks",
    REAL_ESTATE: "real_estate",
    BUSINESS: "business",
    HIGH_RISK: "high_risk"
};

function createInvestment(
    type,
    name,
    amount,
    expectedReturn = 0.05
) {
    return {
        id: createId("investment"),

        type,

        name,

        invested: amount,

        currentValue: amount,

        expectedReturn,

        risk:
            type === INVESTMENT_TYPES.HIGH_RISK
                ? "high"
                : type === INVESTMENT_TYPES.SAVINGS
                    ? "low"
                    : "medium",

        active: true,

        createdAt:
            new Date().toISOString()
    };
}

function processInvestmentWeek(
    investment
) {
    if (!investment || !investment.active) {
        return investment;
    }

    const variation =
        (
            Math.random() * 2 - 1
        ) * investment.expectedReturn;

    investment.currentValue *=
        1 + variation;

    investment.currentValue =
        Math.max(
            0,
            investment.currentValue
        );

    return investment;
}

function processAllInvestments(
    investments
) {
    if (!Array.isArray(investments)) {
        return [];
    }

    investments.forEach(
        processInvestmentWeek
    );

    return investments;
}

function sellInvestment(
    investment
) {
    if (!investment) return 0;

    investment.active = false;

    return investment.currentValue;
}

export {
    INVESTMENT_TYPES,
    createInvestment,
    processInvestmentWeek,
    processAllInvestments,
    sellInvestment
};
