import {
    createMoneyAccount,
    addMoney,
    removeMoney,
    createTransaction
} from "./money.js";

import {
    convertCurrency
} from "./currencies.js";

function createFinanceState() {
    return {
        accounts: {
            BRL: createMoneyAccount("BRL"),
            USD: createMoneyAccount("USD"),
            EUR: createMoneyAccount("EUR")
        },

        primaryCurrency: "BRL",

        transactions: [],

        income: {
            career: 0,
            sponsorships: 0,
            bonuses: 0,
            investments: 0,
            businesses: 0,
            other: 0
        },

        expenses: {
            training: 0,
            team: 0,
            travel: 0,
            medical: 0,
            taxes: 0,
            commissions: 0,
            lifestyle: 0,
            bureaucracy: 0,
            other: 0
        },

        assets: {
            cash: 0,
            investments: 0,
            businesses: 0,
            vehicles: 0,
            properties: 0
        },

        debts: [],

        contracts: [],
        investments: [],
        businesses: [],

        credit: {
            score: 500,
            debtLevel: 0
        }
    };
}

function recordTransaction(
    finance,
    type,
    amount,
    currency,
    category,
    description = "",
    metadata = {}
) {
    const transaction = createTransaction(
        type,
        amount,
        currency,
        category,
        description,
        metadata
    );

    finance.transactions.push(transaction);

    if (type === "income") {
        if (
            finance.income[category] !== undefined
        ) {
            finance.income[category] += amount;
        }
    }

    if (type === "expense") {
        if (
            finance.expenses[category] !== undefined
        ) {
            finance.expenses[category] += amount;
        }
    }

    return transaction;
}

function receiveMoney(
    finance,
    amount,
    currency = "BRL",
    category = "other",
    description = "",
    metadata = {}
) {
    if (!finance || amount <= 0) {
        return false;
    }

    const account =
        finance.accounts[currency];

    if (!account) {
        return false;
    }

    addMoney(account, amount);

    recordTransaction(
        finance,
        "income",
        amount,
        currency,
        category,
        description,
        metadata
    );

    return true;
}

function spendMoney(
    finance,
    amount,
    currency = "BRL",
    category = "other",
    description = "",
    metadata = {}
) {
    if (!finance || amount <= 0) {
        return false;
    }

    const account =
        finance.accounts[currency];

    if (!account) {
        return false;
    }

    if (account.balance < amount) {
        return false;
    }

    removeMoney(account, amount);

    recordTransaction(
        finance,
        "expense",
        amount,
        currency,
        category,
        description,
        metadata
    );

    return true;
}

function getCashBalance(
    finance,
    currency = null
) {
    if (!finance) return 0;

    if (currency) {
        return finance.accounts[currency]?.balance || 0;
    }

    return Object.entries(finance.accounts)
        .reduce(
            (total, [code, account]) => {
                return total +
                    convertCurrency(
                        account.balance,
                        code,
                        finance.primaryCurrency
                    );
            },
            0
        );
}

function calculateNetWorth(finance) {
    if (!finance) return 0;

    const cash =
        getCashBalance(finance);

    const investments =
        finance.assets.investments || 0;

    const businesses =
        finance.assets.businesses || 0;

    const vehicles =
        finance.assets.vehicles || 0;

    const properties =
        finance.assets.properties || 0;

    const debts =
        finance.debts.reduce(
            (total, debt) =>
                total + (debt.remaining || 0),
            0
        );

    return (
        cash +
        investments +
        businesses +
        vehicles +
        properties -
        debts
    );
}

function processWeeklyFinance(finance) {
    if (!finance) return null;

    finance.assets.cash =
        getCashBalance(finance);

    finance.assets.investments =
        finance.investments.reduce(
            (total, item) =>
                total + (item.currentValue || 0),
            0
        );

    finance.assets.businesses =
        finance.businesses.reduce(
            (total, item) =>
                total + (item.value || 0),
            0
        );

    finance.credit.debtLevel =
        finance.debts.reduce(
            (total, debt) =>
                total + (debt.remaining || 0),
            0
        );

    return finance;
}

export {
    createFinanceState,
    recordTransaction,
    receiveMoney,
    spendMoney,
    getCashBalance,
    calculateNetWorth,
    processWeeklyFinance
};
