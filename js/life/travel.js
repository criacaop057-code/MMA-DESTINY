import { createId } from "../core/ids.js";

const TRAVEL_TYPES = {
    TRAINING_CAMP: "training_camp",
    FIGHT: "fight",
    VACATION: "vacation",
    BUSINESS: "business",
    FAMILY: "family",
    EDUCATION: "education"
};

function createTravel(
    origin,
    destination,
    country,
    type,
    options = {}
) {
    return {
        id: createId("travel"),

        origin,

        destination,

        country,

        type,

        duration:
            options.duration || 7,

        cost:
            options.cost || 0,

        purpose:
            options.purpose || "",

        active: true,

        startDate:
            options.startDate ||
            new Date().toISOString(),

        endDate: null
    };
}

function calculateTravelCost(
    distance,
    days,
    level = "normal"
) {
    const basePerKm = 0.5;

    const accommodation = {
        budget: 150,
        normal: 350,
        premium: 800,
        luxury: 2000
    };

    const daily =
        accommodation[level] ||
        accommodation.normal;

    return (
        distance * basePerKm +
        days * daily
    );
}

function finishTravel(travel) {
    if (!travel) return null;

    travel.active = false;

    travel.endDate =
        new Date().toISOString();

    return travel;
}

function canTravel(
    player,
    travel
) {
    if (!player || !travel) {
        return false;
    }

    if (
        player.health &&
        player.health.health < 30
    ) {
        return false;
    }

    return true;
}

export {
    TRAVEL_TYPES,
    createTravel,
    calculateTravelCost,
    finishTravel,
    canTravel
};
