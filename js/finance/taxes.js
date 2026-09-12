const TAX_RULES = {
    BRL: {
        incomeTax: 0.15,
        highIncomeTax: 0.275
    },

    USD: {
        incomeTax: 0.20,
        highIncomeTax: 0.30
    },

    EUR: {
        incomeTax: 0.20,
        highIncomeTax: 0.30
    }
};

function calculateIncomeTax(
    amount,
    currency = "BRL"
) {
    if (amount <= 0) {
        return 0;
    }

    const rules =
        TAX_RULES[currency];

    if (!rules) {
        return 0;
    }

    if (amount > 500000) {
        return amount *
            rules.highIncomeTax;
    }

    return amount *
        rules.incomeTax;
}

function calculateNetIncome(
    amount,
    currency = "BRL"
) {
    const tax =
        calculateIncomeTax(
            amount,
            currency
        );

    return {
        gross: amount,
        tax,
        net: amount - tax
    };
}

function calculateTaxForTransaction(
    transaction
) {
    if (!transaction) return 0;

    if (transaction.type !== "income") {
        return 0;
    }

    return calculateIncomeTax(
        transaction.amount,
        transaction.currency
    );
}

export {
    TAX_RULES,
    calculateIncomeTax,
    calculateNetIncome,
    calculateTaxForTransaction
};
