import { createId } from "../core/ids.js";

const CONTRACT_TYPES = {
    FIGHT: "fight",
    ORGANIZATION: "organization",
    SPONSORSHIP: "sponsorship",
    TEAM: "team"
};

function createContract(
    type,
    party,
    terms = {}
) {
    return {
        id: createId("contract"),

        type,

        party,

        status: "active",

        startDate:
            terms.startDate ||
            new Date().toISOString(),

        endDate:
            terms.endDate || null,

        currency:
            terms.currency || "BRL",

        signingBonus:
            terms.signingBonus || 0,

        basePay:
            terms.basePay || 0,

        winBonus:
            terms.winBonus || 0,

        finishBonus:
            terms.finishBonus || 0,

        titleBonus:
            terms.titleBonus || 0,

        commission:
            terms.commission || 0,

        fights:
            terms.fights || 1,

        completedFights: 0,

        clauses:
            terms.clauses || [],

        terminationFee:
            terms.terminationFee || 0
    };
}

function completeContractFight(
    contract
) {
    if (!contract) return null;

    contract.completedFights++;

    if (
        contract.completedFights >=
        contract.fights
    ) {
        contract.status = "completed";
    }

    return contract;
}

function terminateContract(
    contract,
    reason = "terminated"
) {
    if (!contract) return null;

    contract.status = "terminated";
    contract.terminationReason =
        reason;

    return contract;
}

function getActiveContracts(
    contracts
) {
    if (!Array.isArray(contracts)) {
        return [];
    }

    return contracts.filter(
        contract =>
            contract.status === "active"
    );
}

export {
    CONTRACT_TYPES,
    createContract,
    completeContractFight,
    terminateContract,
    getActiveContracts
};
