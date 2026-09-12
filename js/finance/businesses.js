import { createId } from "../core/ids.js";

const BUSINESS_TYPES = {
    ACADEMY: "academy",
    RESTAURANT: "restaurant",
    CLOTHING: "clothing",
    SUPPLEMENTS: "supplements",
    REAL_ESTATE: "real_estate",
    MEDIA: "media",
    OTHER: "other"
};

function createBusiness(
    type,
    name,
    investment,
    weeklyIncome = 0
) {
    return {
        id: createId("business"),

        type,

        name,

        value: investment,

        initialInvestment: investment,

        weeklyIncome,

        weeklyExpenses:
            weeklyIncome * 0.4,

        employees: 0,

        reputation: 50,

        growth: 0,

        active: true,

        createdAt:
            new Date().toISOString()
    };
}

function processBusinessWeek(
    business
) {
    if (!business || !business.active) {
        return {
            income: 0,
            expenses: 0,
            profit: 0
        };
    }

    const reputationMultiplier =
        0.7 +
        business.reputation / 100;

    const income =
        business.weeklyIncome *
        reputationMultiplier;

    const expenses =
        business.weeklyExpenses;

    const profit =
        income - expenses;

    if (profit > 0) {
        business.value +=
            profit * 0.1;

        business.growth +=
            0.1;
    }

    if (profit < 0) {
        business.value +=
            profit * 0.05;
    }

    business.value =
        Math.max(
            0,
            business.value
        );

    return {
        income,
        expenses,
        profit
    };
}

function processBusinesses(
    businesses
) {
    if (!Array.isArray(businesses)) {
        return [];
    }

    return businesses.map(
        business => ({
            business,
            result:
                processBusinessWeek(
                    business
                )
        })
    );
}

function improveBusiness(
    business,
    amount = 1
) {
    if (!business) return null;

    business.reputation =
        Math.min(
            100,
            business.reputation +
            amount
        );

    business.growth += amount;

    return business;
}

function closeBusiness(
    business
) {
    if (!business) return null;

    business.active = false;

    return business.value;
}

export {
    BUSINESS_TYPES,
    createBusiness,
    processBusinessWeek,
    processBusinesses,
    improveBusiness,
    closeBusiness
};
