import { createId } from "../core/ids.js";

export const STAFF_ROLES = {
    HEAD_COACH: "head_coach",
    ASSISTANT_COACH: "assistant_coach",
    STRIKING_COACH: "striking_coach",
    WRESTLING_COACH: "wrestling_coach",
    BJJ_COACH: "bjj_coach",
    STRENGTH_COACH: "strength_coach",
    PHYSIO: "physio",
    NUTRITIONIST: "nutritionist",
    MANAGER: "manager",
    ADMIN: "admin"
};

export function createStaffMember({
    name,
    role,
    salary = 0,
    skill = 50,
    experience = 1,
    reputation = 20
}) {
    return {
        id: createId("staff"),

        name,
        role,

        salary,
        skill,
        experience,
        reputation,

        morale: 80,
        loyalty: 50,
        workload: 0,

        active: true,

        hiredDate: null,
        history: []
    };
}

export function hireStaff(academy, staffMember) {
    academy.staff.push(staffMember.id);

    return academy;
}

export function fireStaff(academy, staffMemberId) {
    academy.staff = academy.staff.filter(
        id => id !== staffMemberId
    );

    return academy;
}

export function updateStaffMorale(staffMember, amount) {
    staffMember.morale = Math.max(
        0,
        Math.min(100, staffMember.morale + amount)
    );

    return staffMember.morale;
}

export function updateStaffLoyalty(staffMember, amount) {
    staffMember.loyalty = Math.max(
        0,
        Math.min(100, staffMember.loyalty + amount)
    );

    return staffMember.loyalty;
}

export function getStaffEffectiveness(staffMember) {
    const result =
        staffMember.skill * 0.45 +
        Math.min(100, staffMember.experience * 5) * 0.20 +
        staffMember.reputation * 0.15 +
        staffMember.morale * 0.10 +
        staffMember.loyalty * 0.10;

    return Math.round(result);
}

export function processStaffWeek(staffMember) {
    if (!staffMember.active) {
        return null;
    }

    if (staffMember.workload > 80) {
        updateStaffMorale(staffMember, -3);
    } else {
        updateStaffMorale(staffMember, 1);
    }

    staffMember.workload = Math.max(
        0,
        staffMember.workload - 20
    );

    return {
        id: staffMember.id,
        effectiveness: getStaffEffectiveness(staffMember),
        morale: staffMember.morale,
        loyalty: staffMember.loyalty
    };
}
