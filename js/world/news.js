import { createId } from "../core/ids.js";

export function createNews({
    date,
    title,
    text,
    category = "general",
    source = "simulation",
    fighterIds = [],
    organizationId = null,
    eventId = null
}) {
    return {
        id: createId("news"),

        date,

        title,
        text,

        category,
        source,

        fighterIds,

        organizationId,
        eventId,

        importance: 1,

        read: false
    };
}

export function publishNews(
    world,
    news
) {
    world.news.unshift(news);

    if (world.news.length > 1000) {
        world.news =
            world.news.slice(0, 1000);
    }

    return news;
}

export function generateFightNews(
    fight,
    fighterA,
    fighterB,
    winner
) {
    const winnerName =
        winner?.name ||
        "O vencedor";

    return createNews({
        date: null,

        title:
            `${winnerName} vence combate`,

        text:
            `${fighterA?.name || "Lutador A"} ` +
            `enfrentou ` +
            `${fighterB?.name || "Lutador B"} ` +
            `em um combate que terminou ` +
            `com vitória de ${winnerName}.`,

        category: "fight",

        source: "simulation",

        fighterIds: [
            fighterA?.id,
            fighterB?.id
        ].filter(Boolean),

        eventId:
            fight?.eventId || null
    });
}

export function getNews(
    world,
    filters = {}
) {
    return world.news.filter(news => {
        if (
            filters.category &&
            news.category !==
                filters.category
        ) {
            return false;
        }

        if (
            filters.source &&
            news.source !==
                filters.source
        ) {
            return false;
        }

        if (
            filters.fighterId &&
            !news.fighterIds.includes(
                filters.fighterId
            )
        ) {
            return false;
        }

        return true;
    });
}
