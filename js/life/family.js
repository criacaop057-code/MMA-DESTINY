import { createId } from "../core/ids.js";

const FAMILY_ROLES = {
    FATHER: "father",
    MOTHER: "mother",
    BROTHER: "brother",
    SISTER: "sister",
    SPOUSE: "spouse",
    CHILD: "child",
    GRANDPARENT: "grandparent",
    GRANDCHILD: "grandchild",
    OTHER: "other"
};

function createFamilyState() {
    return {
        members: [],

        parents: [],
        siblings: [],
        spouse: null,
        children: [],

        familyEvents: [],

        familyRelationship: 70
    };
}

function addFamilyMember(
    family,
    member,
    role
) {
    if (!family || !member) return null;

    const relation = {
        id: createId("family"),
        memberId: member.id || member,
        role,
        closeness: 60,
        relationship: 60,
        active: true,
        addedAt: new Date().toISOString()
    };

    family.members.push(relation);

    switch (role) {
        case FAMILY_ROLES.FATHER:
        case FAMILY_ROLES.MOTHER:
            family.parents.push(relation);
            break;

        case FAMILY_ROLES.BROTHER:
        case FAMILY_ROLES.SISTER:
            family.siblings.push(relation);
            break;

        case FAMILY_ROLES.CHILD:
            family.children.push(relation);
            break;

        case FAMILY_ROLES.SPOUSE:
            family.spouse = relation;
            break;
    }

    return relation;
}

function removeFamilyMember(
    family,
    memberId
) {
    if (!family) return false;

    family.members =
        family.members.filter(
            item => item.memberId !== memberId
        );

    family.children =
        family.children.filter(
            item => item.memberId !== memberId
        );

    family.siblings =
        family.siblings.filter(
            item => item.memberId !== memberId
        );

    family.parents =
        family.parents.filter(
            item => item.memberId !== memberId
        );

    if (
        family.spouse &&
        family.spouse.memberId === memberId
    ) {
        family.spouse = null;
    }

    return true;
}

function addFamilyEvent(
    family,
    type,
    description,
    data = {}
) {
    if (!family) return null;

    const event = {
        id: createId("familyevent"),
        type,
        description,
        data,
        date: new Date().toISOString()
    };

    family.familyEvents.push(event);

    return event;
}

function changeFamilyRelationship(
    family,
    amount
) {
    if (!family) return null;

    family.familyRelationship =
        Math.max(
            0,
            Math.min(
                100,
                family.familyRelationship + amount
            )
        );

    return family;
}

export {
    FAMILY_ROLES,
    createFamilyState,
    addFamilyMember,
    removeFamilyMember,
    addFamilyEvent,
    changeFamilyRelationship
};
