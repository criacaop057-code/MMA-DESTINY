import { createId } from "../core/ids.js";

const PROPERTY_TYPES = {
    ROOM: "room",
    APARTMENT: "apartment",
    HOUSE: "house",
    MANSION: "mansion",
    FARM: "farm",
    PENTHOUSE: "penthouse"
};

function createProperty(
    type,
    city,
    country,
    price,
    options = {}
) {
    return {
        id: createId("property"),

        type,

        city,
        country,

        address:
            options.address || null,

        purchasePrice: price,

        currentValue: price,

        mortgage: options.mortgage || 0,

        maintenance:
            options.maintenance ||
            price * 0.001,

        rooms:
            options.rooms || 1,

        bedrooms:
            options.bedrooms || 1,

        luxury:
            options.luxury || 20,

        comfort:
            options.comfort || 50,

        prestige:
            options.prestige || 20,

        owned: true,

        rented: false,

        primaryResidence: false,

        createdAt:
            new Date().toISOString()
    };
}

function setPrimaryResidence(
    properties,
    propertyId
) {
    if (!Array.isArray(properties)) {
        return false;
    }

    for (const property of properties) {
        property.primaryResidence =
            property.id === propertyId;
    }

    return true;
}

function calculatePropertyMaintenance(
    property
) {
    if (!property) return 0;

    return (
        property.currentValue *
        0.001
    );
}

function updatePropertyValue(
    property
) {
    if (!property) return null;

    const variation =
        (
            Math.random() * 2 - 1
        ) * 0.01;

    property.currentValue =
        Math.max(
            0,
            property.currentValue *
            (1 + variation)
        );

    return property;
}

function improveProperty(
    property,
    investment
) {
    if (!property || investment <= 0) {
        return false;
    }

    property.currentValue +=
        investment * 0.8;

    property.comfort =
        Math.min(
            100,
            property.comfort +
            investment / 10000
        );

    property.luxury =
        Math.min(
            100,
            property.luxury +
            investment / 15000
        );

    property.prestige =
        Math.min(
            100,
            property.prestige +
            investment / 20000
        );

    return true;
}

function sellProperty(property) {
    if (!property) return 0;

    property.owned = false;
    property.primaryResidence = false;

    return property.currentValue;
}

export {
    PROPERTY_TYPES,
    createProperty,
    setPrimaryResidence,
    calculatePropertyMaintenance,
    updatePropertyValue,
    improveProperty,
    sellProperty
};
