import { createId } from "../core/ids.js";

export const RELATIONSHIP_TYPES = {
    FATHER: "father",
    MOTHER: "mother",
    SON: "son",
    DAUGHTER: "daughter",
    BROTHER: "brother",
    SISTER: "sister",
    GRANDPARENT: "grandparent",
    GRANDCHILD: "grandchild",
    SPOUSE: "spouse",
    OTHER: "other"
};

export function createGenealogy() {
    return {
        members: {},
        relationships: [],
        generations: []
    };
}

export function addGenealogyMember(
    genealogy,
    member
) {
    if (!member?.id) {
        return false;
    }

    genealogy.members[member.id] = {
        id: member.id,
        name: member.name || "Desconhecido",
        gender: member.gender || null,
        birthDate: member.birthDate || null,
        deathDate: member.deathDate || null,
        generation: member.generation || 1,
        playable: member.playable || false
    };

    return true;
}

export function addRelationship(
    genealogy,
    personA,
    personB,
    type
) {
    const relationship = {
        id: createId("relationship"),
        personA,
        personB,
        type
    };

    genealogy.relationships.push(
        relationship
    );

    return relationship;
}

export function getChildren(
    genealogy,
    parentId
) {
    return genealogy.relationships
        .filter(
            relationship =>
                relationship.personA === parentId &&
                (
                    relationship.type ===
                        RELATIONSHIP_TYPES.SON ||
                    relationship.type ===
                        RELATIONSHIP_TYPES.DAUGHTER
                )
        )
        .map(
            relationship =>
                genealogy.members[
                    relationship.personB
                ]
        )
        .filter(Boolean);
}

export function getParents(
    genealogy,
    childId
) {
    return genealogy.relationships
        .filter(
            relationship =>
                relationship.personB === childId &&
                (
                    relationship.type ===
                        RELATIONSHIP_TYPES.FATHER ||
                    relationship.type ===
                        RELATIONSHIP_TYPES.MOTHER
                )
        )
        .map(
            relationship =>
                genealogy.members[
                    relationship.personA
                ]
        )
        .filter(Boolean);
}

export function getFamilyTree(
    genealogy,
    memberId
) {
    return {
        member:
            genealogy.members[memberId] || null,

        parents: getParents(
            genealogy,
            memberId
        ),

        children: getChildren(
            genealogy,
            memberId
        )
    };
}
