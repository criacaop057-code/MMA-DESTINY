import { ROUTES } from "./router.js";

class Renderer {
    constructor({ root, state, engine }) {
        this.root = root;
        this.state = state;
        this.engine = engine;

        this.appContainer = null;

        this.injectRuntimeStyles();
    }

    // =========================================================
    // BASE
    // =========================================================

    ensureContainer() {
        let container = document.querySelector("#app-content");

        if (!container) {
            container = document.querySelector("#mma-destiny-app");
        }

        if (!container) {
            container = document.createElement("main");
            container.id = "app-content";
            this.root.appendChild(container);
        }

        this.appContainer = container;
    }

    clear() {
        this.ensureContainer();
        this.appContainer.innerHTML = "";
    }

    el(tag, className = "", text = "") {
        const element = document.createElement(tag);

        if (className) {
            element.className = className;
        }

        if (text !== "") {
            element.textContent = text;
        }

        return element;
    }

    button(text, className = "", action = null) {
        const button = this.el("button", className, text);
        button.type = "button";

        if (action) {
            button.addEventListener("click", action);
        }

        return button;
    }

    // =========================================================
    // RENDER PRINCIPAL
    // =========================================================

    renderRoute(route) {
        this.ensureContainer();

        switch (route) {
            case ROUTES.HOME:
                this.renderHome();
                break;

            case ROUTES.CAREER:
                this.renderCareer();
                break;

            case ROUTES.WORLD:
                this.renderWorld();
                break;

            case ROUTES.LIFE:
                this.renderLife();
                break;

            case ROUTES.DYNASTY:
                this.renderDynasty();
                break;

            default:
                this.renderHome();
        }
    }

    // =========================================================
    // INÍCIO
    // =========================================================

    renderHome() {
        this.clear();

        const player = this.getPlayer();
        const section = this.el("section", "destiny-screen");

        // HEADER
        const header = this.el("div", "destiny-header");

        const brand = this.el(
            "div",
            "destiny-brand"
        );

        brand.innerHTML = `
            <span class="destiny-brand-main">MMA</span>
            <span class="destiny-brand-accent">DESTINY</span>
        `;

        const date = this.el(
            "div",
            "destiny-date",
            this.formatDate(this.getGameDate())
        );

        header.append(brand, date);

        // HERO
        const hero = this.el("div", "destiny-hero");

        const heroTitle = this.el(
            "h1",
            "",
            player?.name || "COMECE SUA HISTÓRIA"
        );

        const heroSubtitle = this.el(
            "p",
            "",
            player
                ? "Sua carreira. Sua vida. Seu legado."
                : "O mundo do MMA está esperando por você."
        );

        hero.append(heroTitle, heroSubtitle);

        // PERFIL
        const profileCard = this.el("div", "destiny-card destiny-profile");

        if (player) {
            profileCard.innerHTML = `
                <div class="destiny-card-label">ATLETA</div>

                <div class="fighter-main">
                    <div class="fighter-avatar">
                        ${this.getInitials(player.name)}
                    </div>

                    <div class="fighter-info">
                        <h2>${this.safe(player.name || "Lutador")}</h2>
                        <p>
                            ${this.safe(player.nickname || "Sem apelido")}
                        </p>
                    </div>
                </div>

                <div class="fighter-grid">
                    <div>
                        <span>IDADE</span>
                        <strong>${this.getPlayerAge(player)}</strong>
                    </div>

                    <div>
                        <span>OVR</span>
                        <strong>${this.getOverall(player)}</strong>
                    </div>

                    <div>
                        <span>RECORD</span>
                        <strong>${this.getRecord(player)}</strong>
                    </div>

                    <div>
                        <span>CATEGORIA</span>
                        <strong>${this.getWeightClass(player)}</strong>
                    </div>
                </div>
            `;
        } else {
            profileCard.innerHTML = `
                <div class="destiny-card-label">NOVA CARREIRA</div>

                <h2>Você ainda não criou seu lutador.</h2>

                <p>
                    Comece aos 15 anos e construa sua trajetória
                    do amador ao topo do mundo.
                </p>
            `;
        }

        // STATUS
        const statusGrid = this.el("div", "destiny-status-grid");

        statusGrid.append(
            this.statCard(
                "SAÚDE",
                this.getHealth(player),
                "%"
            ),

            this.statCard(
                "FADIGA",
                this.getFatigue(player),
                "%"
            ),

            this.statCard(
                "DINHEIRO",
                this.getMoney(),
                ""
            ),

            this.statCard(
                "HYPE",
                this.getHype(player),
                ""
            )
        );

        // PRÓXIMO EVENTO
        const eventCard = this.el(
            "div",
            "destiny-card destiny-next-event"
        );

        eventCard.innerHTML = `
            <div class="destiny-card-label">PRÓXIMO COMPROMISSO</div>

            <h2>${this.getNextEvent()}</h2>

            <p>${this.getNextEventDescription()}</p>
        `;

        // BOTÃO PRINCIPAL
        const advanceButton = this.button(
            "AVANÇAR SEMANA",
            "destiny-primary-button"
        );

        advanceButton.addEventListener(
            "click",
            () => this.advanceWeek(advanceButton)
        );

        // MENU RÁPIDO
        const quickActions = this.el(
            "div",
            "destiny-quick-actions"
        );

        quickActions.append(
            this.quickButton(
                "CARREIRA",
                "carreira"
            ),

            this.quickButton(
                "MUNDO",
                "mundo"
            ),

            this.quickButton(
                "VIDA",
                "vida"
            ),

            this.quickButton(
                "DINASTIA",
                "dinastia"
            )
        );

        section.append(
            header,
            hero,
            profileCard,
            statusGrid,
            eventCard,
            advanceButton,
            quickActions
        );

        this.appContainer.appendChild(section);
    }

    // =========================================================
    // CARREIRA
    // =========================================================

    renderCareer() {
        this.clear();

        const player = this.getPlayer();

        const section = this.createScreen(
            "CARREIRA",
            "Construa seu caminho até o topo."
        );

        const overview = this.el(
            "div",
            "destiny-card"
        );

        overview.innerHTML = `
            <div class="destiny-card-label">STATUS PROFISSIONAL</div>

            <h2>${this.safe(player?.name || "Novo lutador")}</h2>

            <div class="fighter-grid">
                <div>
                    <span>OVR</span>
                    <strong>${this.getOverall(player)}</strong>
                </div>

                <div>
                    <span>POTENCIAL</span>
                    <strong>${this.getPotential(player)}</strong>
                </div>

                <div>
                    <span>RECORD</span>
                    <strong>${this.getRecord(player)}</strong>
                </div>

                <div>
                    <span>RANKING</span>
                    <strong>${this.getRanking(player)}</strong>
                </div>
            </div>
        `;

        const attributes = this.el(
            "div",
            "destiny-card"
        );

        attributes.innerHTML = `
            <div class="destiny-card-label">ATRIBUTOS</div>
            ${this.renderAttributeBars(player)}
        `;

        const actions = this.el(
            "div",
            "destiny-action-grid"
        );

        [
            "TREINAMENTO",
            "CAMP",
            "LUTAS",
            "CONTRATOS",
            "RANKINGS",
            "HISTÓRICO"
        ].forEach(label => {
            actions.append(
                this.button(
                    label,
                    "destiny-secondary-button"
                )
            );
        });

        section.append(
            overview,
            attributes,
            actions
        );

        this.appContainer.appendChild(section);
    }

    // =========================================================
    // MUNDO
    // =========================================================

    renderWorld() {
        this.clear();

        const section = this.createScreen(
            "MUNDO",
            "O universo do MMA continua vivendo mesmo quando você não luta."
        );

        const worldStats = this.el(
            "div",
            "destiny-status-grid"
        );

        const world = this.state.world || {};

        worldStats.append(
            this.statCard(
                "LUTADORES",
                this.count(world.fighters),
                ""
            ),

            this.statCard(
                "ORGANIZAÇÕES",
                this.count(world.organizations),
                ""
            ),

            this.statCard(
                "EVENTOS",
                this.count(world.events),
                ""
            ),

            this.statCard(
                "CAMPEÕES",
                this.count(world.championships),
                ""
            )
        );

        const worldMenu = this.el(
            "div",
            "destiny-card"
        );

        worldMenu.innerHTML = `
            <div class="destiny-card-label">DATABASE</div>

            <div class="destiny-database-menu">
                <button type="button">LUTADORES</button>
                <button type="button">ORGANIZAÇÕES</button>
                <button type="button">EVENTOS</button>
                <button type="button">RANKINGS</button>
                <button type="button">CAMPEÕES</button>
                <button type="button">HISTÓRIA</button>
                <button type="button">NOTÍCIAS</button>
                <button type="button">HEAD TO HEAD</button>
            </div>
        `;

        section.append(
            worldStats,
            worldMenu
        );

        this.appContainer.appendChild(section);
    }

    // =========================================================
    // VIDA
    // =========================================================

    renderLife() {
        this.clear();

        const section = this.createScreen(
            "VIDA",
            "Porque a carreira é apenas uma parte da sua história."
        );

        const lifeMenu = this.el(
            "div",
            "destiny-life-grid"
        );

        const items = [
            ["RELACIONAMENTOS", "relationships"],
            ["FAMÍLIA", "family"],
            ["FILHOS", "children"],
            ["CASA", "house"],
            ["VEÍCULOS", "vehicles"],
            ["VIAGENS", "travel"],
            ["EDUCAÇÃO", "education"],
            ["FINANÇAS", "finance"],
            ["ACADEMIA", "academy"]
        ];

        items.forEach(([title, icon]) => {
            const card = this.el(
                "button",
                "destiny-life-card"
            );

            card.type = "button";

            card.innerHTML = `
                <span class="life-icon">${this.getLifeIcon(icon)}</span>
                <strong>${title}</strong>
                <small>ABRIR</small>
            `;

            lifeMenu.appendChild(card);
        });

        section.appendChild(lifeMenu);

        this.appContainer.appendChild(section);
    }

    // =========================================================
    // DINASTIA
    // =========================================================

    renderDynasty() {
        this.clear();

        const section = this.createScreen(
            "DINASTIA",
            "Seu legado pode continuar muito depois da sua carreira."
        );

        const dynasty = this.state.dynasty || {};

        const legacyCard = this.el(
            "div",
            "destiny-card destiny-legacy"
        );

        legacyCard.innerHTML = `
            <div class="destiny-card-label">LEGADO</div>

            <div class="legacy-score">
                ${this.getLegacyScore(dynasty)}
            </div>

            <p>
                Pontuação histórica da sua família.
            </p>
        `;

        const dynastyGrid = this.el(
            "div",
            "destiny-status-grid"
        );

        dynastyGrid.append(
            this.statCard(
                "GERAÇÕES",
                dynasty.generations || 1,
                ""
            ),

            this.statCard(
                "FILHOS",
                this.count(
                    dynasty.children ||
                    this.state.children
                ),
                ""
            ),

            this.statCard(
                "TÍTULOS",
                dynasty.titles || 0,
                ""
            ),

            this.statCard(
                "HALL DA FAMA",
                dynasty.hallOfFame
                    ? "SIM"
                    : "NÃO",
                ""
            )
        );

        const genealogy = this.el(
            "div",
            "destiny-card"
        );

        genealogy.innerHTML = `
            <div class="destiny-card-label">LINHAGEM</div>

            <div class="genealogy-placeholder">
                <div>VOCÊ</div>
                <span>↓</span>
                <div>PRÓXIMA GERAÇÃO</div>
                <span>↓</span>
                <div>LEGADO</div>
            </div>
        `;

        section.append(
            legacyCard,
            dynastyGrid,
            genealogy
        );

        this.appContainer.appendChild(section);
    }

    // =========================================================
    // COMPONENTES
    // =========================================================

    createScreen(title, subtitle) {
        const section = this.el(
            "section",
            "destiny-screen"
        );

        const header = this.el(
            "div",
            "destiny-screen-header"
        );

        const titleElement = this.el(
            "h1",
            "",
            title
        );

        const subtitleElement = this.el(
            "p",
            "",
            subtitle
        );

        header.append(
            titleElement,
            subtitleElement
        );

        section.appendChild(header);

        return section;
    }

    statCard(label, value, suffix = "") {
        const card = this.el(
            "div",
            "destiny-stat-card"
        );

        card.innerHTML = `
            <span>${label}</span>
            <strong>${this.safe(value)}${suffix}</strong>
        `;

        return card;
    }

    quickButton(label, route) {
        const button = this.button(
            label,
            "destiny-secondary-button"
        );

        button.addEventListener(
            "click",
            () => {
                if (
                    window.MMA_DESTINY?.router
                ) {
                    window.MMA_DESTINY.router.navigate(
                        route
                    );
                }
            }
        );

        return button;
    }

    renderAttributeBars(player) {
        const attributes =
            player?.attributes || {};

        const list = [
            ["STRIKING", "striking"],
            ["WRESTLING", "wrestling"],
            ["GRAPPLING", "grappling"],
            ["BJJ", "bjj"],
            ["DEFESA DE QUEDAS", "takedownDefense"],
            ["DEFESA DE STRIKING", "strikingDefense"],
            ["CARDIO", "cardio"],
            ["FORÇA", "strength"],
            ["VELOCIDADE", "speed"],
            ["DURABILIDADE", "durability"],
            ["FIGHT IQ", "fightIQ"],
            ["DISCIPLINA", "discipline"]
        ];

        return list.map(
            ([label, key]) => {
                const value =
                    Number(attributes[key]) || 0;

                return `
                    <div class="attribute-row">
                        <div class="attribute-header">
                            <span>${label}</span>
                            <strong>${value}</strong>
                        </div>

                        <div class="attribute-track">
                            <div
                                class="attribute-fill"
                                style="width:${Math.min(
                                    100,
                                    value
                                )}%"
                            ></div>
                        </div>
                    </div>
                `;
            }
        ).join("");
    }

    // =========================================================
    // ENGINE
    // =========================================================

    async advanceWeek(button) {
        if (!this.engine) return;

        if (button.disabled) return;

        button.disabled = true;
        button.textContent = "SIMULANDO...";

        try {
            await this.engine.advanceWeek();

            this.syncState();

            this.renderRoute(
                window.MMA_DESTINY?.router?.getCurrentRoute()
                || ROUTES.HOME
            );
        } catch (error) {
            console.error(
                "Erro ao avançar semana:",
                error
            );

            alert(
                "Não foi possível avançar a semana. Verifique o estado do jogo."
            );

            button.disabled = false;
            button.textContent = "AVANÇAR SEMANA";
        }
    }

    syncState() {
        if (
            this.engine?.state &&
            this.engine.state !== this.state
        ) {
            this.state = this.engine.state;
        }
    }

    // =========================================================
    // DADOS
    // =========================================================

    getPlayer() {
        return (
            this.state?.player ||
            this.state?.currentPlayer ||
            null
        );
    }

    getGameDate() {
        const calendar =
            this.engine?.calendar ||
            this.state?.calendar;

        if (
            calendar &&
            typeof calendar.getCurrentDate ===
                "function"
        ) {
            return calendar.getCurrentDate();
        }

        return (
            calendar?.currentDate ||
            this.state?.date ||
            "2026-01-01"
        );
    }

    formatDate(date) {
        if (!date) return "01/01/2026";

        const parsed = new Date(date);

        if (Number.isNaN(parsed.getTime())) {
            return String(date);
        }

        return parsed.toLocaleDateString(
            "pt-BR"
        );
    }

    getPlayerAge(player) {
        if (!player) return 15;

        if (
            typeof player.age === "number"
        ) {
            return player.age;
        }

        if (
            player.birthDate &&
            this.getGameDate()
        ) {
            const birth =
                new Date(player.birthDate);

            const current =
                new Date(this.getGameDate());

            let age =
                current.getFullYear() -
                birth.getFullYear();

            const month =
                current.getMonth() -
                birth.getMonth();

            if (
                month < 0 ||
                (
                    month === 0 &&
                    current.getDate() <
                    birth.getDate()
                )
            ) {
                age--;
            }

            return Math.max(0, age);
        }

        return 15;
    }

    getOverall(player) {
        if (!player) return 0;

        if (
            typeof player.overall === "number"
        ) {
            return Math.round(
                player.overall
            );
        }

        if (
            typeof player.ovr === "number"
        ) {
            return Math.round(
                player.ovr
            );
        }

        const attributes =
            player.attributes || {};

        const values =
            Object.values(attributes)
                .filter(
                    value =>
                        typeof value ===
                        "number"
                );

        if (!values.length) return 0;

        return Math.round(
            values.reduce(
                (sum, value) =>
                    sum + value,
                0
            ) / values.length
        );
    }

    getPotential(player) {
        if (!player) return 0;

        return Math.round(
            player.potential ??
            player.ceiling ??
            this.getOverall(player)
        );
    }

    getRecord(player) {
        if (!player) return "0-0-0";

        const record =
            player.record || {};

        const wins =
            record.wins ??
            player.wins ??
            0;

        const losses =
            record.losses ??
            player.losses ??
            0;

        const draws =
            record.draws ??
            player.draws ??
            0;

        return `${wins}-${losses}-${draws}`;
    }

    getRanking(player) {
        if (!player) return "—";

        return (
            player.ranking ??
            player.rank ??
            "NR"
        );
    }

    getWeightClass(player) {
        if (!player) return "—";

        return (
            player.weightClassName ||
            player.weightClass ||
            "—"
        );
    }

    getHealth(player) {
        if (!player) return 100;

        return Math.round(
            player.health?.current ??
            player.health ??
            100
        );
    }

    getFatigue(player) {
        if (!player) return 0;

        return Math.round(
            player.fatigue ??
            player.health?.fatigue ??
            0
        );
    }

    getHype(player) {
        if (!player) return 0;

        return Math.round(
            player.hype ??
            player.media?.hype ??
            0
        );
    }

    getMoney() {
        const finance =
            this.state?.finance;

        if (!finance) {
            return "R$ 0";
        }

        const amount =
            finance.accounts?.BRL ??
            finance.money?.BRL ??
            finance.cash?.BRL ??
            finance.cash ??
            0;

        if (
            typeof amount === "object"
        ) {
            return "R$ 0";
        }

        return `R$ ${Number(amount).toLocaleString(
            "pt-BR"
        )}`;
    }

    getNextEvent() {
        const events =
            this.state?.world?.events;

        if (
            Array.isArray(events) &&
            events.length
        ) {
            const next =
                events.find(
                    event =>
                        !event.completed &&
                        !event.finished
                );

            if (next?.name) {
                return next.name;
            }
        }

        return "Nenhum evento marcado";
    }

    getNextEventDescription() {
        const player =
            this.getPlayer();

        if (!player) {
            return "Crie seu lutador para iniciar sua carreira.";
        }

        if (
            player.nextFight
        ) {
            return "Sua próxima luta está marcada.";
        }

        return "Treine, desenvolva seus atributos e construa sua reputação.";
    }

    getLegacyScore(dynasty) {
        if (!dynasty) return 0;

        return Math.round(
            dynasty.legacyScore ??
            dynasty.score ??
            0
        );
    }

    count(value) {
        if (Array.isArray(value)) {
            return value.length;
        }

        if (
            value &&
            typeof value === "object"
        ) {
            return Object.keys(value).length;
        }

        if (
            typeof value === "number"
        ) {
            return value;
        }

        return 0;
    }

    getInitials(name) {
        if (!name) return "MD";

        return name
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map(
                word =>
                    word[0]
            )
            .join("")
            .toUpperCase();
    }

    getLifeIcon(type) {
        const icons = {
            relationships: "♡",
            family: "♧",
            children: "♢",
            house: "⌂",
            vehicles: "▣",
            travel: "✈",
            education: "▤",
            finance: "$",
            academy: "♜"
        };

        return icons[type] || "◇";
    }

    safe(value) {
        return String(
            value ?? ""
        )
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    // =========================================================
    // ESTILO DE EXECUÇÃO
    // =========================================================

    injectRuntimeStyles() {
        if (
            document.getElementById(
                "mma-destiny-renderer-styles"
            )
        ) {
            return;
        }

        const style =
            document.createElement("style");

        style.id =
            "mma-destiny-renderer-styles";

        style.textContent = `
            .destiny-screen {
                width: 100%;
                max-width: 1100px;
                margin: 0 auto;
                padding: 24px 18px 120px;
            }

            .destiny-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 30px;
            }

            .destiny-brand {
                display: flex;
                gap: 6px;
                font-family: Rajdhani, sans-serif;
                font-size: 25px;
                font-weight: 800;
                letter-spacing: 2px;
            }

            .destiny-brand-accent {
                opacity: .75;
            }

            .destiny-date {
                font-size: 12px;
                opacity: .65;
            }

            .destiny-hero {
                margin-bottom: 22px;
            }

            .destiny-hero h1,
            .destiny-screen-header h1 {
                margin: 0;
                font-family: Rajdhani, sans-serif;
                font-size: clamp(32px, 8vw, 58px);
                font-weight: 800;
                letter-spacing: 1px;
            }

            .destiny-hero p,
            .destiny-screen-header p {
                margin-top: 6px;
                opacity: .65;
            }

            .destiny-card {
                border: 1px solid rgba(255,255,255,.09);
                background: rgba(255,255,255,.025);
                border-radius: 14px;
                padding: 20px;
                margin-bottom: 14px;
            }

            .destiny-card-label {
                font-size: 10px;
                font-weight: 800;
                letter-spacing: 2px;
                opacity: .5;
                margin-bottom: 14px;
            }

            .fighter-main {
                display: flex;
                align-items: center;
                gap: 14px;
            }

            .fighter-avatar {
                width: 58px;
                height: 58px;
                display: grid;
                place-items: center;
                border: 1px solid rgba(255,255,255,.2);
                border-radius: 50%;
                font-family: Rajdhani, sans-serif;
                font-size: 22px;
                font-weight: 800;
            }

            .fighter-info h2 {
                margin: 0;
                font-family: Rajdhani, sans-serif;
                font-size: 25px;
            }

            .fighter-info p {
                margin: 3px 0 0;
                opacity: .55;
            }

            .fighter-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 10px;
                margin-top: 20px;
            }

            .fighter-grid div,
            .destiny-stat-card {
                padding: 13px;
                border-radius: 10px;
                background: rgba(255,255,255,.035);
            }

            .fighter-grid span,
            .destiny-stat-card span {
                display: block;
                font-size: 9px;
                letter-spacing: 1.5px;
                opacity: .5;
                margin-bottom: 5px;
            }

            .fighter-grid strong,
            .destiny-stat-card strong {
                font-family: Rajdhani, sans-serif;
                font-size: 20px;
            }

            .destiny-status-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 10px;
                margin-bottom: 14px;
            }

            .destiny-stat-card {
                text-align: center;
            }

            .destiny-primary-button {
                width: 100%;
                min-height: 58px;
                margin: 8px 0 18px;
                border: 0;
                border-radius: 10px;
                background: #fff;
                color: #000;
                font-family: Rajdhani, sans-serif;
                font-size: 18px;
                font-weight: 800;
                letter-spacing: 1px;
                cursor: pointer;
            }

            .destiny-primary-button:disabled {
                opacity: .5;
                cursor: wait;
            }

            .destiny-quick-actions,
            .destiny-action-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 10px;
            }

            .destiny-secondary-button {
                min-height: 48px;
                border: 1px solid rgba(255,255,255,.12);
                border-radius: 9px;
                background: rgba(255,255,255,.025);
                color: inherit;
                font-family: Rajdhani, sans-serif;
                font-weight: 700;
                letter-spacing: 1px;
                cursor: pointer;
            }

            .destiny-screen-header {
                margin-bottom: 22px;
            }

            .attribute-row {
                margin-bottom: 13px;
            }

            .attribute-header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 5px;
                font-size: 11px;
            }

            .attribute-header strong {
                font-family: Rajdhani, sans-serif;
            }

            .attribute-track {
                height: 5px;
                border-radius: 10px;
                background: rgba(255,255,255,.08);
                overflow: hidden;
            }

            .attribute-fill {
                height: 100%;
                background: currentColor;
                border-radius: inherit;
            }

            .destiny-database-menu {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 8px;
            }

            .destiny-database-menu button {
                min-height: 50px;
                border: 1px solid rgba(255,255,255,.1);
                background: rgba(255,255,255,.025);
                color: inherit;
                border-radius: 9px;
                font-family: Rajdhani, sans-serif;
                font-weight: 700;
                cursor: pointer;
            }

            .destiny-life-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 10px;
            }

            .destiny-life-card {
                min-height: 110px;
                padding: 15px;
                text-align: left;
                border: 1px solid rgba(255,255,255,.09);
                border-radius: 12px;
                background: rgba(255,255,255,.025);
                color: inherit;
                cursor: pointer;
            }

            .destiny-life-card .life-icon {
                display: block;
                font-size: 24px;
                margin-bottom: 10px;
            }

            .destiny-life-card strong {
                display: block;
                font-family: Rajdhani, sans-serif;
            }

            .destiny-life-card small {
                display: block;
                margin-top: 5px;
                opacity: .4;
                font-size: 9px;
            }

            .legacy-score {
                font-family: Rajdhani, sans-serif;
                font-size: 70px;
                font-weight: 800;
            }

            .genealogy-placeholder {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 15px;
                flex-wrap: wrap;
                text-align: center;
                font-family: Rajdhani, sans-serif;
                font-weight: 700;
            }

            @media (max-width: 700px) {
                .destiny-screen {
                    padding: 18px 14px 110px;
                }

                .fighter-grid,
                .destiny-status-grid {
                    grid-template-columns: repeat(2, 1fr);
                }

                .destiny-quick-actions,
                .destiny-action-grid {
                    grid-template-columns: repeat(2, 1fr);
                }

                .destiny-life-grid {
                    grid-template-columns: repeat(2, 1fr);
                }
            }

            @media (max-width: 420px) {
                .destiny-brand {
                    font-size: 21px;
                }

                .destiny-date {
                    font-size: 10px;
                }

                .destiny-hero h1,
                .destiny-screen-header h1 {
                    font-size: 34px;
                }

                .destiny-card {
                    padding: 16px;
                }

                .fighter-grid {
                    gap: 7px;
                }

                .destiny-life-card {
                    min-height: 100px;
                }
            }
        `;

        document.head.appendChild(style);
    }

    refresh() {
        const route =
            window.MMA_DESTINY?.router
                ?.getCurrentRoute() ||
            ROUTES.HOME;

        this.renderRoute(route);
    }
}

export {
    Renderer
};
