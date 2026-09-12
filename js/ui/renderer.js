import { getState } from "../core/state.js";
import { getFormattedDate } from "../engine/clock.js";
import { getPlayerSummary } from "../player/player.js";

import {
    statBox,
    progressBar,
    badge,
    escapeHTML
} from "./components.js";

const content =
    document.getElementById("game-content");

export function renderGame() {

    const state = getState();

    if (!content) {
        console.error(
            "Elemento #game-content não encontrado."
        );

        return;
    }

    switch (state.meta.activeTab) {

        case "inicio":
            renderHome(state);
            break;

        case "carreira":
            renderCareer(state);
            break;

        case "mundo":
            renderWorld(state);
            break;

        case "vida":
            renderLife(state);
            break;

        case "dinastia":
            renderDynasty(state);
            break;

        default:
            renderHome(state);
    }

    updateTopbar(state);
}

function updateTopbar(state) {

    const dateElement =
        document.getElementById("game-date");

    if (dateElement) {
        dateElement.textContent =
            getFormattedDate();
    }

    const nameElement =
        document.getElementById("topbar-player-name");

    if (nameElement && state.player) {
        nameElement.textContent =
            state.player.name;
    }
}

function renderHome(state) {

    const player =
        state.player;

    if (!player) {
        content.innerHTML = `
            <div class="empty-state">
                <h2>Nenhum lutador criado</h2>
                <p>Comece uma nova carreira.</p>
            </div>
        `;

        return;
    }

    const record =
        player.career.record;

    content.innerHTML = `

        <section class="screen-header">

            <div>
                <span class="section-kicker">
                    CARREIRA
                </span>

                <h1>
                    ${escapeHTML(player.name)}
                </h1>

                <p>
                    ${escapeHTML(player.nickname || "Sem apelido")}
                </p>
            </div>

            ${badge(
                player.weightClass,
                "gold"
            )}

        </section>


        <section class="fighter-card">

            <div class="fighter-avatar">
                ${player.name
                    .charAt(0)
                    .toUpperCase()}
            </div>

            <div class="fighter-info">

                <h2>
                    ${escapeHTML(player.name)}
                </h2>

                <div class="fighter-meta">
                    ${escapeHTML(player.country)}
                    •
                    ${player.age} anos
                </div>

                <div class="fighter-meta">
                    ${escapeHTML(player.fightingStyle)}
                </div>

            </div>

            <div class="fighter-ovr">

                <span>OVR</span>

                <strong>
                    ${player.ovr}
                </strong>

            </div>

        </section>


        <section class="dashboard-grid">

            ${statBox(
                "CARTEL",
                `${record.wins}-${record.losses}-${record.draws}`
            )}

            ${statBox(
                "POTENCIAL",
                player.potential
            )}

            ${statBox(
                "IDADE",
                `${player.age} anos`
            )}

            ${statBox(
                "SEMANA",
                state.calendar.week
            )}

        </section>


        <section class="form-card">

            <h2 class="card-title">
                Estado físico
            </h2>

            ${progressBar(
                "Saúde",
                player.health.health
            )}

            ${progressBar(
                "Energia",
                player.health.energy
            )}

            ${progressBar(
                "Fadiga",
                100 - player.health.fatigue
            )}

        </section>


        <section class="form-card">

            <h2 class="card-title">
                Próximo passo
            </h2>

            <p>
                Sua carreira começa aos
                <strong>15 anos</strong>.
            </p>

            <p>
                Treine, desenvolva seus atributos,
                construa sua reputação e conquiste
                seu espaço no mundo do MMA.
            </p>

        </section>
    `;
}

function renderCareer(state) {

    const player =
        state.player;

    const record =
        player?.career?.record ?? {
            wins: 0,
            losses: 0,
            draws: 0
        };

    content.innerHTML = `

        <section class="screen-header">

            <div>
                <span class="section-kicker">
                    CARREIRA
                </span>

                <h1>
                    Minha Carreira
                </h1>

                <p>
                    Evolução, lutas e conquistas.
                </p>
            </div>

        </section>


        <section class="dashboard-grid">

            ${statBox(
                "VITÓRIAS",
                record.wins
            )}

            ${statBox(
                "DERROTAS",
                record.losses
            )}

            ${statBox(
                "EMPATES",
                record.draws
            )}

            ${statBox(
                "OVR",
                player?.ovr ?? 0
            )}

        </section>


        <section class="form-card">

            <h2 class="card-title">
                Desenvolvimento
            </h2>

            ${
                player
                    ? Object.entries(
                        player.attributes
                    )
                    .slice(0, 8)
                    .map(
                        ([key, value]) =>
                            progressBar(
                                translateAttribute(key),
                                value
                            )
                    )
                    .join("")
                    : ""
            }

        </section>

    `;
}

function renderWorld(state) {

    content.innerHTML = `

        <section class="screen-header">

            <div>
                <span class="section-kicker">
                    MUNDO
                </span>

                <h1>
                    Mundo do MMA
                </h1>

                <p>
                    Organizações, eventos, rankings
                    e lutadores.
                </p>
            </div>

        </section>


        <section class="dashboard-grid">

            ${statBox(
                "LUTADORES",
                state.world.fighters.length
            )}

            ${statBox(
                "ORGANIZAÇÕES",
                state.world.organizations.length
            )}

            ${statBox(
                "EVENTOS",
                state.world.events.length
            )}

            ${statBox(
                "NOTÍCIAS",
                state.world.news.length
            )}

        </section>


        <section class="form-card">

            <h2 class="card-title">
                Banco de dados
            </h2>

            <p>
                O mundo será preenchido
                progressivamente com lutadores,
                organizações, eventos,
                rankings e histórico.
            </p>

        </section>

    `;
}

function renderLife(state) {

    const life =
        state.life;

    content.innerHTML = `

        <section class="screen-header">

            <div>
                <span class="section-kicker">
                    VIDA
                </span>

                <h1>
                    Vida
                </h1>

                <p>
                    Sua vida fora do cage.
                </p>
            </div>

        </section>


        <section class="dashboard-grid">

            ${statBox(
                "RELACIONAMENTOS",
                life.relationships.length
            )}

            ${statBox(
                "FILHOS",
                life.children.length
            )}

            ${statBox(
                "CASAS",
                life.houses.length
            )}

            ${statBox(
                "VEÍCULOS",
                life.vehicles.length
            )}

        </section>


        <section class="form-card">

            <h2 class="card-title">
                Vida pessoal
            </h2>

            <p>
                Relacionamentos, família,
                viagens, patrimônio e escolhas
                pessoais serão desenvolvidos aqui.
            </p>

        </section>

    `;
}

function renderDynasty(state) {

    const dynasty =
        state.dynasty;

    content.innerHTML = `

        <section class="screen-header">

            <div>
                <span class="section-kicker">
                    DINASTIA
                </span>

                <h1>
                    Dinastia
                </h1>

                <p>
                    O legado que continuará depois de você.
                </p>
            </div>

        </section>


        <section class="dashboard-grid">

            ${statBox(
                "GERAÇÃO",
                dynasty.activeGeneration
            )}

            ${statBox(
                "LEGADO",
                dynasty.legacyScore
            )}

            ${statBox(
                "SUCESSORES",
                dynasty.successors.length
            )}

            ${statBox(
                "HALL DA FAMA",
                dynasty.hallOfFame.length
            )}

        </section>


        <section class="form-card">

            <h2 class="card-title">
                Linhagem
            </h2>

            <p>
                Seus filhos poderão herdar características,
                patrimônio, reputação e parte do potencial
                genético da família.
            </p>

        </section>

    `;
}

function translateAttribute(attribute) {

    const names = {
        striking: "Striking",
        wrestling: "Wrestling",
        grappling: "Grappling",
        bjj: "Jiu-Jitsu",
        takedownDefense: "Defesa de Quedas",
        strikingDefense: "Defesa de Striking",
        cardio: "Cardio",
        strength: "Força",
        speed: "Velocidade",
        durability: "Durabilidade",
        fightIQ: "Fight IQ",
        discipline: "Disciplina",
        confidence: "Confiança",
        mental: "Mental"
    };

    return names[attribute] || attribute;
}
