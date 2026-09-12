import { generateId } from "../core/ids.js";
import { state } from "../core/state.js";

export const NEWS_TYPES = {
    FIGHT: "fight",
    TITLE: "title",
    RANKING: "ranking",
    TRANSFER: "transfer",
    INJURY: "injury",
    RETIREMENT: "retirement",
    CONTROVERSY: "controversy",
    CONTRACT: "contract",
    LIFE: "life",
    FINANCE: "finance",
    ACADEMY: "academy",
    GENERAL: "general"
};

export const NEWS_IMPORTANCE = {
    LOW: 1,
    NORMAL: 2,
    HIGH: 3,
    BREAKING: 4,
    HISTORIC: 5
};

export function createNews({
    type,
    title,
    body,
    importance = NEWS_IMPORTANCE.NORMAL,
    fighterIds = [],
    organizationId = null,
    eventId = null,
    tags = []
}) {
    const news = {
        id: generateId("news"),

        type,

        title,

        body,

        importance,

        fighterIds,

        organizationId,

        eventId,

        tags,

        publishedAt:
            state.calendar?.date ||
            new Date().toISOString(),

        timestamp: Date.now(),

        read: false
    };

    if (!state.world.news) {
        state.world.news = [];
    }

    state.world.news.unshift(news);

    if (state.world.news.length > 1000) {
        state.world.news =
            state.world.news.slice(0, 1000);
    }

    return news;
}

export function createFightNews(
    fight,
    winner,
    loser
) {
    const method =
        fight.result?.method ||
        "decisão";

    return createNews({
        type: NEWS_TYPES.FIGHT,

        title:
            `${winner.identity.name} vence ${loser.identity.name}`,

        body:
            `${winner.identity.name} derrotou ${loser.identity.name} por ${method}.`,

        importance:
            calculateFightImportance(
                fight,
                winner,
                loser
            ),

        fighterIds: [
            winner.id,
            loser.id
        ],

        organizationId:
            fight.organizationId,

        eventId:
            fight.eventId,

        tags: [
            "MMA",
            "Luta",
            method
        ]
    });
}

export function createTitleNews({
    champion,
    formerChampion,
    organization,
    weightClass
}) {
    return createNews({
        type: NEWS_TYPES.TITLE,

        title:
            `${champion.identity.name} é o novo campeão`,

        body:
            `${champion.identity.name} conquistou o cinturão dos ${weightClass} do ${organization.name}, superando ${formerChampion?.identity?.name || "o antigo campeão"}.`,

        importance:
            NEWS_IMPORTANCE.HISTORIC,

        fighterIds: [
            champion.id,
            formerChampion?.id
        ].filter(Boolean),

        organizationId:
            organization.id,

        tags: [
            "Título",
            "Campeonato"
        ]
    });
}

export function createRankingNews({
    fighter,
    organization,
    weightClass,
    oldPosition,
    newPosition
}) {
    const direction =
        newPosition < oldPosition
            ? "subiu"
            : "caiu";

    return createNews({
        type: NEWS_TYPES.RANKING,

        title:
            `${fighter.identity.name} ${direction} no ranking`,

        body:
            `${fighter.identity.name} agora ocupa a posição #${newPosition} nos ${weightClass} do ${organization.name}.`,

        importance:
            Math.abs(
                newPosition - oldPosition
            ) >= 3
                ? NEWS_IMPORTANCE.HIGH
                : NEWS_IMPORTANCE.NORMAL,

        fighterIds: [
            fighter.id
        ],

        organizationId:
            organization.id,

        tags: [
            "Ranking",
            weightClass
        ]
    });
}

export function createInjuryNews(
    fighter,
    injury
) {
    return createNews({
        type: NEWS_TYPES.INJURY,

        title:
            `${fighter.identity.name} sofre lesão`,

        body:
            `${fighter.identity.name} ficará afastado devido a ${injury.name || "uma lesão"}.`,

        importance:
            injury.severity === "major"
                ? NEWS_IMPORTANCE.HIGH
                : NEWS_IMPORTANCE.NORMAL,

        fighterIds: [
            fighter.id
        ],

        tags: [
            "Lesão",
            injury.severity || "normal"
        ]
    });
}

export function createRetirementNews(
    fighter
) {
    return createNews({
        type: NEWS_TYPES.RETIREMENT,

        title:
            `${fighter.identity.name} anuncia aposentadoria`,

        body:
            `${fighter.identity.name} encerrou oficialmente sua carreira profissional.`,

        importance:
            NEWS_IMPORTANCE.HIGH,

        fighterIds: [
            fighter.id
        ],

        tags: [
            "Aposentadoria"
        ]
    });
}

function calculateFightImportance(
    fight,
    winner,
    loser
) {
    let score = 1;

    if (fight.isTitleFight) {
        score += 3;
    }

    if (
        (winner.career?.ranking || 99) <= 5
    ) {
        score++;
    }

    if (
        (loser.career?.ranking || 99) <= 5
    ) {
        score++;
    }

    if (
        (winner.hype || 0) >= 70
    ) {
        score++;
    }

    return Math.min(
        NEWS_IMPORTANCE.HISTORIC,
        score
    );
}

export function getNews({
    type = null,
    fighterId = null,
    organizationId = null,
    limit = 50
} = {}) {
    let news = [
        ...(state.world.news || [])
    ];

    if (type) {
        news = news.filter(
            item => item.type === type
        );
    }

    if (fighterId) {
        news = news.filter(
            item =>
                item.fighterIds.includes(
                    fighterId
                )
        );
    }

    if (organizationId) {
        news = news.filter(
            item =>
                item.organizationId ===
                organizationId
        );
    }

    return news
        .sort(
            (a, b) =>
                b.timestamp -
                a.timestamp
        )
        .slice(0, limit);
}

export function markNewsAsRead(newsId) {
    const news =
        state.world.news?.find(
            item => item.id === newsId
        );

    if (!news) {
        return false;
    }

    news.read = true;

    return true;
}

export function getUnreadNewsCount() {
    return (
        state.world.news || []
    ).filter(
        news => !news.read
    ).length;
}
