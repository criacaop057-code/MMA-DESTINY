export function createEventProfile(

    event,

    database

) {

    if (!event) return null;

    const fights =

        event.fights || [];

    return {

        id: event.id,

        name:

            event.name ||

            "Evento",

        edition:

            event.edition ||

            null,

        date:

            event.date ||

            null,

        city:

            event.city ||

            "",

        country:

            event.country ||

            "",

        arena:

            event.arena ||

            "",

        organizationId:

            event.organizationId ||

            null,

        organization:

            database?.organizations?.[

                event.organizationId

            ] || null,

        status:

            event.status ||

            "completed",

        mainEvent:

            event.mainEvent || null,

        coMainEvent:

            event.coMainEvent || null,

        fights: fights.map(fight =>

            normalizeFight(

                fight,

                database

            )

        ),

        attendance:

            event.attendance || null,

        revenue:

            event.revenue || null,

        historical:

            event.historical || false,

        simulation:

            event.simulation || false

    };

}

function normalizeFight(

    fight,

    database

) {

    return {

        id: fight.id,

        fighterA:

            database?.fighters?.[

                fight.fighterAId

            ] || null,

        fighterB:

            database?.fighters?.[

                fight.fighterBId

            ] || null,

        fighterAId:

            fight.fighterAId || null,

        fighterBId:

            fight.fighterBId || null,

        winnerId:

            fight.winnerId || null,

        loserId:

            fight.loserId || null,

        result:

            fight.result || null,

        method:

            fight.method || null,

        round:

            fight.round || null,

        time:

            fight.time || null,

        weightClass:

            fight.weightClass || null,

        titleFight:

            fight.titleFight || false,

        bonus:

            fight.bonus || null
         };

}
