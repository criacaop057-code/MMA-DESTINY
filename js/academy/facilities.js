export const FACILITY_TYPES = {
    TATAME: "tatame",
    CAGE: "cage",
    BOXING_AREA: "boxingArea",
    WRESTLING_AREA: "wrestlingArea",
    STRENGTH_ROOM: "strengthRoom",
    RECOVERY_ROOM: "recoveryRoom",
    LOCKER_ROOMS: "lockerRooms",
    OFFICES: "offices"
};

export const FACILITY_COSTS = {
    tatame: 5000,
    cage: 15000,
    boxingArea: 8000,
    wrestlingArea: 8000,
    strengthRoom: 20000,
    recoveryRoom: 12000,
    lockerRooms: 10000,
    offices: 7000
};

export const FACILITY_MAINTENANCE = {
    tatame: 100,
    cage: 250,
    boxingArea: 150,
    wrestlingArea: 150,
    strengthRoom: 400,
    recoveryRoom: 300,
    lockerRooms: 200,
    offices: 150
};

export function upgradeFacility(academy, facility, amount = 1) {
    if (
        academy.facilities[facility] === undefined ||
        amount <= 0
    ) {
        return false;
    }

    academy.facilities[facility] += amount;

    return true;
}

export function getFacilityCost(facility, amount = 1) {
    const base = FACILITY_COSTS[facility] || 0;

    return base * amount;
}

export function getFacilityMaintenance(facility, amount = 1) {
    const base = FACILITY_MAINTENANCE[facility] || 0;

    return base * amount;
}

export function calculateAcademyMaintenance(academy) {
    let total = 0;

    Object.entries(academy.facilities).forEach(
        ([facility, amount]) => {
            total += getFacilityMaintenance(
                facility,
                amount
            );
        }
    );

    return Math.round(total);
}

export function getFacilityLevel(academy, facility) {
    return academy.facilities[facility] || 0;
}

export function getFacilityCapacityBonus(academy) {
    return (
        academy.facilities.tatame * 15 +
        academy.facilities.cage * 10 +
        academy.facilities.boxingArea * 10 +
        academy.facilities.wrestlingArea * 10
    );
}
