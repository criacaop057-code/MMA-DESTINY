import { createId } from "../core/ids.js";

function createMoneyAccount(currency) {
    return {
        id: createId("account"),
        currency,
        balance: 0,
        frozen: false
    };
}

function addMoney(account, amount) {
    if (!account || account.frozen) {
        return false;
    }

    if (amount <= 0) {
        return false;
    }

    account.balance += amount;

    return true;
}

function removeMoney(account, amount) {
    if (!account || account.frozen) {
        return false;
    }

    if (amount <= 0) {
        return false;
    }

    if (account.balance < amount) {
        return false;
    }

    account.balance -= amount;

    return true;
}

function createTransaction(
    type,
    amount,
    currency,
    category,
    description = "",
    metadata = {}
) {
    return {
        id: createId("transaction"),
        type,
        amount,
        currency,
        category,
        description,
        metadata,
        date: new Date().toISOString()
    };
}

function freezeAccount(account) {
    if (!account) return false;

    account.frozen = true;

    return true;
}

function unfreezeAccount(account) {
    if (!account) return false;

    account.frozen = false;

    return true;
}

function getTotalMoney(accounts) {
    if (!accounts) return 0;

    return Object.values(accounts)
        .reduce(
            (total, account) =>
                total + account.balance,
            0
        );
}

export {
    createMoneyAccount,
    addMoney,
    removeMoney,
    createTransaction,
    freezeAccount,
    unfreezeAccount,
    getTotalMoney
};
