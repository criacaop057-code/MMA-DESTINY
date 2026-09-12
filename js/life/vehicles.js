import { createId } from "../core/ids.js";

const VEHICLE_TYPES = {
    MOTORCYCLE: "motorcycle",
    CAR: "car",
    SUV: "suv",
    SPORTS: "sports",
    LUXURY: "luxury",
    TRUCK: "truck"
};

function createVehicle(
    type,
    brand,
    model,
    price,
    options = {}
) {
    return {
        id: createId("vehicle"),

        type,

        brand,
        model,

        purchasePrice: price,

        currentValue: price,

        year:
            options.year ||
            new Date().getFullYear(),

        mileage:
            options.mileage || 0,

        condition:
            options.condition || 100,

        prestige:
            options.prestige || 20,

        maintenance:
            options.maintenance ||
            price * 0.002,

        financed:
            options.financed || false,

        debt:
            options.debt || 0,

        owned: true,

        createdAt:
            new Date().toISOString()
    };
}

function driveVehicle(
    vehicle,
    distance
) {
    if (!vehicle || distance <= 0) {
        return false;
    }

    vehicle.mileage += distance;

    vehicle.condition =
        Math.max(
            0,
            vehicle.condition -
            distance / 10000
        );

    return true;
}

function maintainVehicle(
    vehicle,
    amount
) {
    if (!vehicle || amount <= 0) {
        return false;
    }

    vehicle.condition =
        Math.min(
            100,
            vehicle.condition +
            amount / 1000
        );

    return true;
}

function updateVehicleValue(
    vehicle
) {
    if (!vehicle) return null;

    const depreciation =
        vehicle.currentValue *
        0.002;

    vehicle.currentValue =
        Math.max(
            0,
            vehicle.currentValue -
            depreciation
        );

    if (vehicle.condition < 50) {
        vehicle.currentValue *= 0.99;
    }

    return vehicle;
}

function sellVehicle(vehicle) {
    if (!vehicle) return 0;

    vehicle.owned = false;

    return vehicle.currentValue;
}

export {
    VEHICLE_TYPES,
    createVehicle,
    driveVehicle,
    maintainVehicle,
    updateVehicleValue,
    sellVehicle
};
