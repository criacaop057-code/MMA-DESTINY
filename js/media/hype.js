const HYPE_LIMITS = {
    MIN: 0,
    MAX: 100
};

function createHype() {
    return {
        level: 0,
        momentum: 0,
        peak: 0,
        lastChange: 0,
        sources: {
            wins: 0,
            finishes: 0,
            rivalries: 0,
            interviews: 0,
            social: 0,
            titles: 0,
            media: 0
        }
    };
}

function clamp(value) {
    return Math.max(
        HYPE_LIMITS.MIN,
        Math.min(
            HYPE_LIMITS.MAX,
            value
        )
    );
}

function changeHype(hype, amount, source = null) {
    if (!hype) return null;

    hype.level =
        clamp(hype.level + amount);

    hype.momentum = amount;
    hype.lastChange = amount;

    if (source && hype.sources[source] !== undefined) {
        hype.sources[source] += amount;
    }

    if (hype.level > hype.peak) {
        hype.peak = hype.level;
    }

    return hype;
}

function applyFightHype(hype, result, method) {
    if (!hype) return null;

    if (result === "win") {
        changeHype(hype, 5, "wins");

        if (
            method === "ko" ||
            method === "tko" ||
            method === "submission"
        ) {
            changeHype(hype, 5, "finishes");
        }
    }

    if (result === "loss") {
        changeHype(hype, -4, "wins");
    }

    if (result === "draw") {
        changeHype(hype, 1, "wins");
    }

    return hype;
}

function applyTitleHype(hype, isChampion) {
    if (!hype) return null;

    if (isChampion) {
        changeHype(hype, 15, "titles");
    } else {
        changeHype(hype, 5, "titles");
    }

    return hype;
}

function applyRivalryHype(hype, intensity) {
    if (!hype) return null;

    changeHype(
        hype,
        Math.max(0, intensity),
        "rivalries"
    );

    return hype;
}

function applyInterviewHype(hype, amount) {
    if (!hype) return null;

    changeHype(
        hype,
        amount,
        "interviews"
    );

    return hype;
}

function applySocialHype(hype, engagement) {
    if (!hype) return null;

    const amount =
        Math.floor(
            Math.max(0, engagement) / 100
        );

    if (amount > 0) {
        changeHype(
            hype,
            Math.min(10, amount),
            "social"
        );
    }

    return hype;
}

function processWeeklyHype(hype) {
    if (!hype) return null;

    // O hype tende a cair quando não existe atividade.
    if (hype.momentum === 0) {
        changeHype(hype, -1);
    }

    hype.momentum = 0;

    return hype;
}

export {
    HYPE_LIMITS,
    createHype,
    changeHype,
    applyFightHype,
    applyTitleHype,
    applyRivalryHype,
    applyInterviewHype,
    applySocialHype,
    processWeeklyHype
};
