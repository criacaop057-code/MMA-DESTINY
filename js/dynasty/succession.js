export const SUCCESSION_AGE = 15;

export function canInheritCareer(child) {
    if (!child) {
        return false;
    }

    return (
        child.alive !== false &&
        child.age >= SUCCESSION_AGE
    );
}

export function prepareSuccessor(
    dynasty,
    child
) {
    if (!canInheritCareer(child)) {
        return null;
    }

    child.playable = true;

    dynasty.activeSuccessorId = child.id;

    return {
        childId: child.id,
        ready: true
    };
}

export function selectSuccessor(
    dynasty,
    children = []
) {
    const eligible = children.filter(
        child => canInheritCareer(child)
    );

    if (!eligible.length) {
        dynasty.activeSuccessorId = null;
        return null;
    }

    eligible.sort(
        (a, b) =>
            (b.potential || 0) -
            (a.potential || 0)
    );

    const successor = eligible[0];

    dynasty.activeSuccessorId =
        successor.id;

    successor.playable = true;

    return successor;
}

export function transferLegacy(
    dynasty,
    previousOwner,
    successor
) {
    if (!previousOwner || !successor) {
        return false;
    }

    successor.inheritedLegacy =
        dynasty.legacyScore;

    successor.inheritedAchievements =
        [...(dynasty.achievements || [])];

    return true;
}

export function getSuccessionCandidates(
    children = []
) {
    return children.filter(
        child =>
            child.alive !== false &&
            child.age >= SUCCESSION_AGE
    );
}
