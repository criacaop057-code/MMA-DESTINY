let counter = 0;

function randomPart() {
    return Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();
}

export function generateId(prefix = "ID") {
    counter++;

    const timestamp = Date.now().toString(36).toUpperCase();

    return `${prefix}-${timestamp}-${counter}-${randomPart()}`;
}

export function resetIdCounter() {
    counter = 0;
}

export const ID = {
    fighter: () => generateId("FTR"),
    event: () => generateId("EVT"),
    fight: () => generateId("FGT"),
    organization: () => generateId("ORG"),
    contract: () => generateId("CTR"),
    news: () => generateId("NWS"),
    relationship: () => generateId("REL"),
    child: () => generateId("CHD"),
    academy: () => generateId("ACD"),
    vehicle: () => generateId("CAR"),
    property: () => generateId("HSE"),
    transaction: () => generateId("TXN"),
    training: () => generateId("TRN"),
    eventQueue: () => generateId("QUE")
};
