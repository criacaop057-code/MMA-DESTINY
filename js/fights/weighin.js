import { getWeightLimit } from "../training/weight.js";

/*
|--------------------------------------------------------------------------
| MMA DESTINY — SISTEMA DE PESAGEM
|--------------------------------------------------------------------------
|
| Responsável por:
| - limite oficial da categoria
| - peso apresentado
| - excesso de peso
| - situação da pesagem
| - segunda tentativa
| - penalidade
| - possibilidade de cancelamento
|
| A pesagem NÃO altera o peso automaticamente.
| O peso é controlado pelo sistema de treinamento.
|--------------------------------------------------------------------------
*/

export const WEIGHIN_STATUS = {
    PENDING: "pending",
    MADE_WEIGHT: "made_weight",
    MISSED_WEIGHT: "missed_weight",
    FAILED_SECOND_ATTEMPT: "failed_second_attempt",
    CANCELLED: "cancelled"
};

export const WEIGHIN_ATTEMPT = {
    FIRST: 1,
    SECOND: 2
};

/*
|--------------------------------------------------------------------------
| CRIAR PESAGEM
|--------------------------------------------------------------------------
*/

export function createWeighIn(
    fight,
    fighter,
    options = {}
) {
    if (!fight) {
        throw new Error(
            "Luta inválida."
        );
    }

    if (!fighter) {
        throw new Error(
            "Lutador inválido."
        );
    }

    const weightClass =
        fight.weightClass ||
        fighter.weightClass;

    const limit =
        getWeightLimit(
            weightClass
        );

    if (!limit) {
        throw new Error(
            `Limite de peso não encontrado para ${weightClass}.`
        );
    }

    const currentWeight =
        getFighterWeight(
            fighter
        );

    return {
        fightId: fight.id,

        fighterId: fighter.id,

        weightClass,

        officialLimit: limit,

        currentWeight,

        allowance: getWeightAllowance(
            fight,
            weightClass,
            options
        ),

        attempts: [],

        status: WEIGHIN_STATUS.PENDING,

        missedBy: 0,

        penalty: {
            percentage: 0,
            amount: 0,
            currency: options.currency || "BRL"
        },

        fightAllowed: false,

        completed: false
    };
}

/*
|--------------------------------------------------------------------------
| REGISTRAR PRIMEIRA PESAGEM
|--------------------------------------------------------------------------
*/

export function performWeighIn(
    weighIn,
    actualWeight
) {
    if (!weighIn) {
        throw new Error(
            "Registro de pesagem inválido."
        );
    }

    if (
        !Number.isFinite(actualWeight) ||
        actualWeight <= 0
    ) {
        throw new Error(
            "Peso inválido."
        );
    }

    if (
        weighIn.completed
    ) {
        throw new Error(
            "A pesagem já foi concluída."
        );
    }

    const limit =
        weighIn.officialLimit +
        weighIn.allowance;

    const attempt = {
        number:
            weighIn.attempts.length + 1,

        weight:
            Number(
                actualWeight.toFixed(2)
            ),

        limit:
            Number(
                limit.toFixed(2)
            ),

        passed:
            actualWeight <= limit,

        missedBy:
            Math.max(
                0,
                Number(
                    (
                        actualWeight -
                        limit
                    ).toFixed(2)
                )
            )
    };

    weighIn.attempts.push(
        attempt
    );

    weighIn.currentWeight =
        attempt.weight;

    weighIn.missedBy =
        attempt.missedBy;

    if (attempt.passed) {
        approveWeight(
            weighIn
        );
    } else {
        handleWeightMiss(
            weighIn
        );
    }

    return weighIn;
}

/*
|--------------------------------------------------------------------------
| SEGUNDA TENTATIVA
|--------------------------------------------------------------------------
*/

export function performSecondWeighIn(
    weighIn,
    actualWeight
) {
    if (!weighIn) {
        throw new Error(
            "Registro de pesagem inválido."
        );
    }

    if (
        weighIn.status !==
        WEIGHIN_STATUS.MISSED_WEIGHT
    ) {
        throw new Error(
            "A segunda tentativa só pode ocorrer após uma falha na primeira."
        );
    }

    if (
        weighIn.attempts.length >= 2
    ) {
        throw new Error(
            "O lutador já utilizou as duas tentativas."
        );
    }

    return performWeighIn(
        weighIn,
        actualWeight
    );
}

/*
|--------------------------------------------------------------------------
| APROVAR PESO
|--------------------------------------------------------------------------
*/

function approveWeight(
    weighIn
) {
    weighIn.status =
        WEIGHIN_STATUS.MADE_WEIGHT;

    weighIn.fightAllowed =
        true;

    weighIn.completed =
        true;

    weighIn.missedBy =
        0;

    return weighIn;
}

/*
|--------------------------------------------------------------------------
| PESO PERDIDO
|--------------------------------------------------------------------------
*/

function handleWeightMiss(
    weighIn
) {
    /*
    Primeira falha:
    ainda existe segunda tentativa.
    */

    if (
        weighIn.attempts.length === 1
    ) {
        weighIn.status =
            WEIGHIN_STATUS.MISSED_WEIGHT;

        weighIn.fightAllowed =
            false;

        weighIn.completed =
            false;

        return weighIn;
    }

    /*
    Segunda falha:
    luta pode continuar ou ser cancelada
    dependendo da gravidade.
    */

    weighIn.status =
        WEIGHIN_STATUS.FAILED_SECOND_ATTEMPT;

    weighIn.completed =
        true;

    weighIn.penalty =
        calculateWeightMissPenalty(
            weighIn.missedBy
        );

    weighIn.fightAllowed =
        weighIn.missedBy <= 2.0;

    if (
        weighIn.missedBy > 5
    ) {
        weighIn.status =
            WEIGHIN_STATUS.CANCELLED;

        weighIn.fightAllowed =
            false;
    }

    return weighIn;
}

/*
|--------------------------------------------------------------------------
| PENALIDADE
|--------------------------------------------------------------------------
|
| Quanto maior o excesso,
| maior a penalidade.
|--------------------------------------------------------------------------
*/

function calculateWeightMissPenalty(
    missedBy
) {
    let percentage = 0;

    if (missedBy <= 0.5) {
        percentage = 10;
    } else if (missedBy <= 1.0) {
        percentage = 15;
    } else if (missedBy <= 2.0) {
        percentage = 20;
    } else if (missedBy <= 3.0) {
        percentage = 30;
    } else if (missedBy <= 5.0) {
        percentage = 40;
    } else {
        percentage = 100;
    }

    return {
        percentage,
        amount: 0,
        currency: "BRL"
    };
}

/*
|--------------------------------------------------------------------------
| CALCULAR VALOR DA PENALIDADE
|--------------------------------------------------------------------------
|
| O valor real depende da bolsa da luta.
|--------------------------------------------------------------------------
*/

export function calculatePenaltyAmount(
    weighIn,
    purse
) {
    if (
        !weighIn?.penalty
    ) {
        return 0;
    }

    if (
        !Number.isFinite(purse) ||
        purse <= 0
    ) {
        return 0;
    }

    const amount =
        purse *
        (
            weighIn.penalty.percentage /
            100
        );

    weighIn.penalty.amount =
        Number(
            amount.toFixed(2)
        );

    return weighIn.penalty.amount;
}

/*
|--------------------------------------------------------------------------
| LIMITE REAL DA PESAGEM
|--------------------------------------------------------------------------
*/

export function getOfficialWeighInLimit(
    weighIn
) {
    if (!weighIn) {
        return 0;
    }

    return Number(
        (
            weighIn.officialLimit +
            weighIn.allowance
        ).toFixed(2)
    );
}

/*
|--------------------------------------------------------------------------
| VERIFICAR SE FEZ O PESO
|--------------------------------------------------------------------------
*/

export function madeWeight(
    weighIn
) {
    return (
        weighIn?.status ===
        WEIGHIN_STATUS.MADE_WEIGHT
    );
}

/*
|--------------------------------------------------------------------------
| VERIFICAR SE PODE LUTAR
|--------------------------------------------------------------------------
*/

export function isFightAllowed(
    weighIn
) {
    return Boolean(
        weighIn?.fightAllowed
    );
}

/*
|--------------------------------------------------------------------------
| TOLERÂNCIA
|--------------------------------------------------------------------------
|
| Em algumas situações especiais pode existir
| tolerância contratual.
|
| Exemplo:
| - luta sem cinturão
| - acordo entre equipes
| - categoria catchweight
|--------------------------------------------------------------------------
*/

function getWeightAllowance(
    fight,
    weightClass,
    options
) {
    if (
        Number.isFinite(
            options.allowance
        )
    ) {
        return Math.max(
            0,
            options.allowance
        );
    }

    /*
    Luta pelo cinturão:
    sem tolerância automática.
    */

    if (
        fight.title
    ) {
        return 0;
    }

    /*
    Valor padrão:
    nenhuma tolerância.
    */

    return 0;
}

/*
|--------------------------------------------------------------------------
| PESO DO LUTADOR
|--------------------------------------------------------------------------
*/

function getFighterWeight(
    fighter
) {
    if (
        Number.isFinite(
            fighter.weight
        )
    ) {
        return fighter.weight;
    }

    if (
        Number.isFinite(
            fighter.currentWeight
        )
    ) {
        return fighter.currentWeight;
    }

    if (
        Number.isFinite(
            fighter.bodyWeight
        )
    ) {
        return fighter.bodyWeight;
    }

    /*
    Caso ainda não exista peso registrado,
    utiliza o limite da categoria como
    referência inicial.
    */

    return (
        getWeightLimit(
            fighter.weightClass
        ) || 0
    );
}

/*
|--------------------------------------------------------------------------
| RESULTADO DA PESAGEM DOS DOIS LUTADORES
|--------------------------------------------------------------------------
*/

export function evaluateFightWeighIns(
    weighInA,
    weighInB
) {
    if (
        !weighInA ||
        !weighInB
    ) {
        throw new Error(
            "As duas pesagens são obrigatórias."
        );
    }

    const fighterAPassed =
        madeWeight(
            weighInA
        );

    const fighterBPassed =
        madeWeight(
            weighInB
        );

    return {
        fighterA: {
            passed:
                fighterAPassed,

            weight:
                weighInA.currentWeight,

            limit:
                getOfficialWeighInLimit(
                    weighInA
                ),

            missedBy:
                weighInA.missedBy,

            penalty:
                weighInA.penalty
        },

        fighterB: {
            passed:
                fighterBPassed,

            weight:
                weighInB.currentWeight,

            limit:
                getOfficialWeighInLimit(
                    weighInB
                ),

            missedBy:
                weighInB.missedBy,

            penalty:
                weighInB.penalty
        },

        fightAllowed:
            weighInA.fightAllowed &&
            weighInB.fightAllowed
    };
}

/*
|--------------------------------------------------------------------------
| CATCHWEIGHT
|--------------------------------------------------------------------------
|
| Permite criar uma luta específica fora
| do limite normal da categoria.
|--------------------------------------------------------------------------
*/

export function createCatchweightLimit(
    weight
) {
    if (
        !Number.isFinite(weight) ||
        weight <= 0
    ) {
        throw new Error(
            "Peso de catchweight inválido."
        );
    }

    return Number(
        weight.toFixed(2)
    );
}
