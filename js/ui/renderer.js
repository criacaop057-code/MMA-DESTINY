import { ROUTES } from "./router.js";
import { getState } from "../core/state.js";

class Renderer {
    constructor({ root, state, engine }) {
        this.root = root;
        this.state = state || getState();
        this.engine = engine;
        this.appContainer = null;

        this.injectRuntimeStyles();
        this.bindInteractionSystem();
    }

    bindInteractionSystem() {
        if (this._interactionSystemBound) {
            return;
        }

        this._interactionSystemBound = true;

        const handleInteraction = (event) => {
            const path = event.composedPath
                ? event.composedPath()
                : [];

            let button = null;

            for (const element of path) {
                if (
                    element &&
                    element.nodeType === 1 &&
                    element.tagName === "BUTTON"
                ) {
                    button = element;
                    break;
                }
            }

            if (!button && event.target?.closest) {
                button = event.target.closest("button");
            }

            if (!button || button.disabled) {
                return;
            }

            /*
             * ==========================================
             * NAVEGAÇÃO PRINCIPAL
             * ==========================================
             */

            const route = button.dataset.route;

            if (route) {
                event.preventDefault();
                event.stopPropagation();

                const router =
                    window.MMA_DESTINY?.router;

                if (
                    router &&
                    typeof router.navigate === "function"
                ) {
                    router.navigate(route);
                }

                return;
            }

            /*
             * ==========================================
             * AÇÕES INTERNAS
             * ==========================================
             */

            const action = button.dataset.mmaAction;

            if (!action) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();

            const label =
                button.dataset.mmaLabel ||
                button.textContent
                    .trim()
                    .replace(/\s+/g, " ");

            this.handleInternalAction(
                action,
                label,
                button
            );
        };

        /*
         * pointerup:
         * principal mecanismo para toque no iPhone.
         */
        document.addEventListener(
            "pointerup",
            handleInteraction,
            true
        );

        /*
         * click:
         * fallback para navegadores/dispositivos
         * que não utilizarem pointerup.
         */
        document.addEventListener(
            "click",
            handleInteraction,
            true
        );
    }

    handleInternalAction(
        action,
        label,
        button
    ) {
        switch (action) {
            /*
             * ==========================================
             * CARREIRA
             * ==========================================
             */

            case "training":
                this.openInternalScreen(
                    "TREINAMENTO",
                    "training"
                );
                break;

            case "camp":
                this.openInternalScreen(
                    "CAMP",
                    "camp"
                );
                break;

            case "fights":
                this.openInternalScreen(
                    "LUTAS",
                    "fights"
                );
                break;

            case "contracts":
                this.openInternalScreen(
                    "CONTRATOS",
                    "contracts"
                );
                break;

            case "rankings":
                this.openInternalScreen(
                    "RANKINGS",
                    "rankings"
                );
                break;

            case "history":
                this.openInternalScreen(
                    "HISTÓRICO",
                    "history"
                );
                break;

            /*
             * ==========================================
             * MUNDO
             * ==========================================
             */

            case "world-fighters":
                this.openInternalScreen(
                    "LUTADORES",
                    "world-fighters"
                );
                break;

            case "world-organizations":
                this.openInternalScreen(
                    "ORGANIZAÇÕES",
                    "world-organizations"
                );
                break;

            case "world-events":
                this.openInternalScreen(
                    "EVENTOS",
                    "world-events"
                );
                break;

            case "world-rankings":
                this.openInternalScreen(
                    "RANKINGS MUNDIAIS",
                    "world-rankings"
                );
                break;

            case "world-champions":
                this.openInternalScreen(
                    "CAMPEÕES",
                    "world-champions"
                );
                break;

            case "world-history":
                this.openInternalScreen(
                    "HISTÓRIA",
                    "world-history"
                );
                break;

            case "world-news":
                this.openInternalScreen(
                    "NOTÍCIAS",
                    "world-news"
                );
                break;

            case "world-h2h":
                this.openInternalScreen(
                    "HEAD TO HEAD",
                    "world-h2h"
                );
                break;

            /*
             * ==========================================
             * VIDA
             * ==========================================
             */

            case "life-relationships":
                this.openInternalScreen(
                    "RELACIONAMENTOS",
                    "life-relationships"
                );
                break;

            case "life-family":
                this.openInternalScreen(
                    "FAMÍLIA",
                    "life-family"
                );
                break;

            case "life-children":
                this.openInternalScreen(
                    "FILHOS",
                    "life-children"
                );
                break;

            case "life-house":
                this.openInternalScreen(
                    "CASA",
                    "life-house"
                );
                break;

            case "life-vehicles":
                this.openInternalScreen(
                    "VEÍCULOS",
                    "life-vehicles"
                );
                break;

            case "life-travel":
                this.openInternalScreen(
                    "VIAGENS",
                    "life-travel"
                );
                break;

            case "life-education":
                this.openInternalScreen(
                    "EDUCAÇÃO",
                    "life-education"
                );
                break;

            case "life-finance":
                this.openInternalScreen(
                    "FINANÇAS",
                    "life-finance"
                );
                break;

            case "life-academy":
                this.openInternalScreen(
                    "ACADEMIA",
                    "life-academy"
                );
                break;

            default:
                console.warn(
                    "[MMA DESTINY] Ação não reconhecida:",
                    action
                );

                this.showActionFeedback(
                    label || action
                );
        }
    }

    openInternalScreen(
        title,
        screen
    ) {
        console.log(
            "[MMA DESTINY] Abrindo tela:",
            screen
        );

        /*
         * A tela interna será renderizada na própria
         * estrutura do jogo.
         *
         * Nesta primeira etapa mantemos o estado atual
         * e criamos uma camada interna segura.
         */
        this.currentInternalScreen = screen;

        this.renderInternalScreen(
            title,
            screen
        );
    }

    showActionFeedback(label) {
        const existing =
            document.querySelector(
                ".mma-action-feedback"
            );

        if (existing) {
            existing.remove();
        }

        const feedback =
            document.createElement("div");

        feedback.className =
            "mma-action-feedback";

        feedback.textContent =
            `${label} selecionado`;

        Object.assign(
            feedback.style,
            {
                position: "fixed",
                left: "50%",
                bottom: "90px",
                transform: "translateX(-50%)",
                zIndex: "10000",
                padding: "12px 18px",
                borderRadius: "10px",
                background: "#111",
                color: "#fff",
                fontSize: "14px",
                fontWeight: "600",
                pointerEvents: "none"
            }
        );

        document.body.appendChild(feedback);

        window.setTimeout(() => {
            feedback.remove();
        }, 1800);
    }
        renderInternalScreen(title, screen) {
        const container = this.ensureContainer();

        if (!container) {
            return;
        }

        container.innerHTML = "";

        const section =
            document.createElement("section");

        section.className =
            "destiny-internal-screen";

        const header =
            document.createElement("div");

        header.className =
            "destiny-internal-header";

        const backButton =
            document.createElement("button");

        backButton.type = "button";
        backButton.className =
            "destiny-secondary-button";

        backButton.textContent =
            "← VOLTAR";

        backButton.addEventListener(
            "click",
            () => {
                this.currentInternalScreen = null;

                const route =
                    window.MMA_DESTINY
                        ?.router
                        ?.getCurrentRoute?.()
                    || ROUTES.HOME;

                this.renderRoute(route);
            }
        );

        const heading =
            document.createElement("h1");

        heading.className =
            "destiny-section-title";

        heading.textContent = title;

        header.appendChild(backButton);
        header.appendChild(heading);

        const content =
            document.createElement("div");

        content.className =
            "destiny-internal-content";

        /*
         * Por enquanto, algumas telas ainda não possuem
         * um módulo de jogo próprio. Esta estrutura garante
         * que a ação abra uma tela real em vez de apenas
         * mostrar um toast.
         */

        const message =
            document.createElement("div");

        message.className =
            "destiny-empty-state";

        message.innerHTML = `
            <h2>${title}</h2>
            <p>
                Módulo <strong>${screen}</strong>
                carregado.
            </p>
        `;

        content.appendChild(message);

        section.appendChild(header);
        section.appendChild(content);

        container.appendChild(section);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    ensureContainer() {
        if (this.appContainer) {
            return this.appContainer;
        }

        let container =
            document.querySelector(
                "#app-content"
            );

        if (!container) {
            container =
                document.querySelector(
                    "#mma-destiny-app"
                );
        }

        if (!container) {
            container =
                document.createElement("main");

            container.id =
                "app-content";

            document.body.appendChild(
                container
            );
        }

        this.appContainer = container;

        return container;
    }

    syncState() {
        if (!this.state) {
            this.state = getState();
        }

        return this.state;
    }

    async advanceWeek(button) {
        if (!this.engine) {
            console.error(
                "[MMA DESTINY] Engine não encontrada."
            );

            return;
        }

        if (
            button &&
            button.disabled
        ) {
            return;
        }

        const originalText =
            button?.textContent ||
            "AVANÇAR SEMANA";

        try {
            if (button) {
                button.disabled = true;
                button.textContent =
                    "SIMULANDO...";
            }

            console.log(
                "[MMA DESTINY] Avançando semana..."
            );

            await this.engine.advanceWeek();

            this.syncState();

            console.log(
                "[MMA DESTINY] Semana avançada."
            );

            const router =
                window.MMA_DESTINY?.router;

            const route =
                router?.getCurrentRoute?.()
                || ROUTES.HOME;

            this.renderRoute(route);

        } catch (error) {
            console.error(
                "[MMA DESTINY] Erro ao avançar semana:",
                error
            );

            if (button) {
                button.disabled = false;
                button.textContent =
                    originalText;
            }

            this.showActionFeedback(
                "Erro ao avançar a semana"
            );

            return;

        } finally {
            /*
             * Se renderRoute() já recriou o botão,
             * este elemento pode não estar mais no DOM.
             */
            if (
                button &&
                document.body.contains(button)
            ) {
                button.disabled = false;
                button.textContent =
                    originalText;
            }
        }
    }

    button(
        label,
        className = "destiny-secondary-button",
        action = null
    ) {
        const button =
            document.createElement("button");

        button.type = "button";
        button.className = className;
        button.textContent = label;

        if (action) {
            button.dataset.mmaAction =
                action;

            button.dataset.mmaLabel =
                label;
        }

        return button;
    }

    quickButton(label, route) {
        const button =
            this.button(
                label,
                "destiny-secondary-button"
            );

        /*
         * O router agora recebe a rota através
         * do sistema central de interação.
         */
        button.dataset.route = route;

        return button;
    }

    renderRoute(route) {
        this.currentInternalScreen = null;

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
                break;
        }

        /*
         * Mantém a navegação inferior sincronizada
         * com a tela atual.
         */
        if (
            window.MMA_DESTINY?.router
                ?.updateNavigation
        ) {
            window.MMA_DESTINY.router
                .updateNavigation();
        }
    }
        renderHome() {
        const container =
            this.ensureContainer();

        container.innerHTML = "";

        const wrapper =
            document.createElement("div");

        wrapper.className =
            "destiny-home";

        /*
         * ==========================================
         * CABEÇALHO
         * ==========================================
         */

        const header =
            document.createElement("header");

        header.className =
            "destiny-header";

        const title =
            document.createElement("h1");

        title.textContent =
            "MMA DESTINY";

        const subtitle =
            document.createElement("p");

        subtitle.textContent =
            "Viva sua carreira. Construa sua vida. Deixe seu legado.";

        header.appendChild(title);
        header.appendChild(subtitle);

        /*
         * ==========================================
         * CRIAÇÃO DO LUTADOR
         * ==========================================
         */

        if (!this.state.player) {
            const createButton =
                this.button(
                    "CRIAR LUTADOR",
                    "destiny-primary-button"
                );

            createButton.addEventListener(
                "click",
                () => {
                    this.openFighterCreation();
                }
            );

            wrapper.appendChild(header);
            wrapper.appendChild(createButton);

            container.appendChild(wrapper);

            return;
        }

        /*
         * ==========================================
         * PERFIL DO LUTADOR
         * ==========================================
         */

        const player =
            this.state.player;

        const profile =
            document.createElement("section");

        profile.className =
            "destiny-profile-card";

        const playerName =
            document.createElement("h2");

        playerName.textContent =
            player.name ||
            "Lutador";

        const playerInfo =
            document.createElement("p");

        playerInfo.textContent =
            `${player.age || 15} anos • ` +
            `${player.country || "Brasil"} • ` +
            `${player.weightClass || "Peso médio"}`;

        profile.appendChild(playerName);
        profile.appendChild(playerInfo);

        /*
         * ==========================================
         * STATUS
         * ==========================================
         */

        const statusGrid =
            document.createElement("div");

        statusGrid.className =
            "destiny-status-grid";

        const statusItems = [
            [
                "VITÓRIAS",
                player.record?.wins ?? 0
            ],
            [
                "DERROTAS",
                player.record?.losses ?? 0
            ],
            [
                "EMPATES",
                player.record?.draws ?? 0
            ],
            [
                "SAÚDE",
                player.health ?? 100
            ],
            [
                "FADIGA",
                player.fatigue ?? 0
            ]
        ];

        statusItems.forEach(
            ([label, value]) => {
                const item =
                    document.createElement("div");

                item.className =
                    "destiny-status-item";

                const itemLabel =
                    document.createElement("span");

                itemLabel.textContent =
                    label;

                const itemValue =
                    document.createElement("strong");

                itemValue.textContent =
                    value;

                item.appendChild(itemLabel);
                item.appendChild(itemValue);

                statusGrid.appendChild(item);
            }
        );

        /*
         * ==========================================
         * PRÓXIMO EVENTO
         * ==========================================
         */

        const nextEvent =
            document.createElement("section");

        nextEvent.className =
            "destiny-next-event";

        const eventTitle =
            document.createElement("h3");

        eventTitle.textContent =
            "PRÓXIMO EVENTO";

        const eventText =
            document.createElement("p");

        const event =
            this.state.nextEvent ||
            this.state.currentEvent;

        if (event) {
            eventText.textContent =
                event.name ||
                event.title ||
                "Nenhum evento definido";
        } else {
            eventText.textContent =
                "Nenhum evento agendado";
        }

        nextEvent.appendChild(eventTitle);
        nextEvent.appendChild(eventText);

        /*
         * ==========================================
         * AVANÇAR SEMANA
         * ==========================================
         */

        const nextWeekButton =
            this.button(
                "AVANÇAR SEMANA",
                "destiny-primary-button"
            );

        nextWeekButton.dataset.mmaAction =
            "advance-week";

        nextWeekButton.dataset.mmaLabel =
            "AVANÇAR SEMANA";

        /*
         * Listener direto para garantir que
         * esta ação nunca dependa apenas do
         * sistema de ações internas.
         */
        nextWeekButton.addEventListener(
            "click",
            async (event) => {
                event.preventDefault();
                event.stopPropagation();

                await this.advanceWeek(
                    nextWeekButton
                );
            }
        );

        /*
         * ==========================================
         * ACESSO RÁPIDO
         * ==========================================
         */

        const quickSection =
            document.createElement("section");

        quickSection.className =
            "destiny-quick-section";

        const quickTitle =
            document.createElement("h3");

        quickTitle.textContent =
            "ACESSO RÁPIDO";

        const quickActions =
            document.createElement("div");

        quickActions.className =
            "destiny-quick-actions";

        const quickButtons = [
            [
                "CARREIRA",
                ROUTES.CAREER
            ],
            [
                "MUNDO",
                ROUTES.WORLD
            ],
            [
                "VIDA",
                ROUTES.LIFE
            ],
            [
                "DINASTIA",
                ROUTES.DYNASTY
            ]
        ];

        quickButtons.forEach(
            ([label, route]) => {
                quickActions.appendChild(
                    this.quickButton(
                        label,
                        route
                    )
                );
            }
        );

        quickSection.appendChild(
            quickTitle
        );

        quickSection.appendChild(
            quickActions
        );

        /*
         * ==========================================
         * MONTAGEM FINAL
         * ==========================================
         */

        wrapper.appendChild(header);
        wrapper.appendChild(profile);
        wrapper.appendChild(statusGrid);
        wrapper.appendChild(nextEvent);
        wrapper.appendChild(nextWeekButton);
        wrapper.appendChild(quickSection);

        container.appendChild(wrapper);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    openFighterCreation() {
        const overlay =
            document.createElement("div");

        overlay.className =
            "fighter-creation-overlay";

        const modal =
            document.createElement("div");

        modal.className =
            "fighter-creation-modal";

        const title =
            document.createElement("h2");

        title.textContent =
            "CRIAR LUTADOR";

        const form =
            document.createElement("form");

        form.className =
            "fighter-creation-form";

        /*
         * NOME
         */

        const nameLabel =
            document.createElement("label");

        nameLabel.textContent =
            "Nome do atleta";

        const nameInput =
            document.createElement("input");

        nameInput.type = "text";
        nameInput.name = "name";
        nameInput.required = true;
        nameInput.placeholder =
            "Digite o nome";

        nameLabel.appendChild(
            nameInput
        );

        /*
         * PAÍS
         */

        const countryLabel =
            document.createElement("label");

        countryLabel.textContent =
            "País";

        const countryInput =
            document.createElement("input");

        countryInput.type = "text";
        countryInput.name = "country";
        countryInput.value =
            "Brasil";

        countryLabel.appendChild(
            countryInput
        );

        /*
         * CATEGORIA
         */

        const weightLabel =
            document.createElement("label");

        weightLabel.textContent =
            "Categoria de peso";

        const weightSelect =
            document.createElement("select");

        weightSelect.name =
            "weightClass";

        [
            "Peso mosca",
            "Peso galo",
            "Peso pena",
            "Peso leve",
            "Peso meio-médio",
            "Peso médio",
            "Peso meio-pesado",
            "Peso pesado"
        ].forEach(
            (weight) => {
                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    weight;

                option.textContent =
                    weight;

                weightSelect.appendChild(
                    option
                );
            }
        );

        weightLabel.appendChild(
            weightSelect
        );

        /*
         * ESTILO
         */

        const styleLabel =
            document.createElement("label");

        styleLabel.textContent =
            "Estilo de luta";

        const styleSelect =
            document.createElement("select");

        styleSelect.name =
            "style";

        [
            "Striker",
            "Wrestler",
            "Grappler",
            "MMA Completo"
        ].forEach(
            (style) => {
                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    style;

                option.textContent =
                    style;

                styleSelect.appendChild(
                    option
                );
            }
        );

        styleLabel.appendChild(
            styleSelect
        );

        /*
         * BOTÕES
         */

        const actions =
            document.createElement("div");

        actions.className =
            "fighter-creation-actions";

        const cancelButton =
            this.button(
                "CANCELAR",
                "destiny-secondary-button"
            );

        cancelButton.addEventListener(
            "click",
            () => {
                overlay.remove();
            }
        );

        const confirmButton =
            this.button(
                "CRIAR LUTADOR",
                "destiny-primary-button"
            );

        confirmButton.type =
            "submit";

        actions.appendChild(
            cancelButton
        );

        actions.appendChild(
            confirmButton
        );

        /*
         * SUBMIT
         */

        form.addEventListener(
            "submit",
            (event) => {
                event.preventDefault();

                const formData =
                    new FormData(form);

                this.createPlayerFromForm(
                    formData
                );

                overlay.remove();

                this.syncState();
                this.renderHome();
            }
        );

        form.appendChild(nameLabel);
        form.appendChild(countryLabel);
        form.appendChild(weightLabel);
        form.appendChild(styleLabel);
        form.appendChild(actions);

        modal.appendChild(title);
        modal.appendChild(form);

        overlay.appendChild(modal);

        document.body.appendChild(
            overlay
        );
    }

    createPlayerFromForm(formData) {
        const name =
            formData.get("name") ||
            "Novo Lutador";

        const country =
            formData.get("country") ||
            "Brasil";

        const weightClass =
            formData.get("weightClass") ||
            "Peso médio";

        const style =
            formData.get("style") ||
            "MMA Completo";

        const attributes = {
            strength: 50,
            striking: 50,
            wrestling: 50,
            grappling: 50,
            technique: 50,
            cardio: 50,
            defense: 50,
            fightIQ: 50,
            mental: 50,
            discipline: 50,
            confidence: 50
        };

        this.state.player = {
            name,
            country,
            weightClass,
            style,
            age: 15,
            attributes,
            potential: 85,
            record: {
                wins: 0,
                losses: 0,
                draws: 0
            },
            health: 100,
            fatigue: 0
        };

        console.log(
            "[MMA DESTINY] Lutador criado:",
            this.state.player
        );

        /*
         * Se o State Manager possuir uma função
         * própria para atualizar o jogador,
         * utilizamos quando disponível.
         */
        if (
            typeof this.state.setPlayer ===
            "function"
        ) {
            this.state.setPlayer(
                this.state.player
            );
        }

        return this.state.player;
    }
        renderCareer() {
        const container =
            this.ensureContainer();

        container.innerHTML = "";

        const wrapper =
            document.createElement("div");

        wrapper.className =
            "destiny-career";

        const header =
            document.createElement("header");

        header.className =
            "destiny-section-header";

        const title =
            document.createElement("h1");

        title.textContent =
            "CARREIRA";

        const subtitle =
            document.createElement("p");

        subtitle.textContent =
            "Construa sua carreira dentro do MMA.";

        header.appendChild(title);
        header.appendChild(subtitle);

        const actions =
            document.createElement("div");

        actions.className =
            "destiny-database-menu";

        const careerActions = [
            ["TREINAMENTO", "training"],
            ["CAMP", "camp"],
            ["LUTAS", "fights"],
            ["CONTRATOS", "contracts"],
            ["RANKINGS", "rankings"],
            ["HISTÓRICO", "history"]
        ];

        careerActions.forEach(
            ([label, action]) => {
                const button =
                    this.button(
                        label,
                        "destiny-secondary-button"
                    );

                button.dataset.mmaAction =
                    action;

                button.dataset.mmaLabel =
                    label;

                actions.appendChild(
                    button
                );
            }
        );

        const backButton =
            this.button(
                "← INÍCIO",
                "destiny-secondary-button"
            );

        backButton.dataset.route =
            ROUTES.HOME;

        wrapper.appendChild(header);
        wrapper.appendChild(actions);
        wrapper.appendChild(backButton);

        container.appendChild(wrapper);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    renderWorld() {
        const container =
            this.ensureContainer();

        container.innerHTML = "";

        const wrapper =
            document.createElement("div");

        wrapper.className =
            "destiny-world";

        const header =
            document.createElement("header");

        header.className =
            "destiny-section-header";

        const title =
            document.createElement("h1");

        title.textContent =
            "MUNDO";

        const subtitle =
            document.createElement("p");

        subtitle.textContent =
            "Explore o universo do MMA DESTINY.";

        header.appendChild(title);
        header.appendChild(subtitle);

        const database =
            document.createElement("div");

        database.className =
            "destiny-database-menu";

        const worldActions = [
            [
                "LUTADORES",
                "world-fighters"
            ],
            [
                "ORGANIZAÇÕES",
                "world-organizations"
            ],
            [
                "EVENTOS",
                "world-events"
            ],
            [
                "RANKINGS MUNDIAIS",
                "world-rankings"
            ],
            [
                "CAMPEÕES",
                "world-champions"
            ],
            [
                "HISTÓRIA",
                "world-history"
            ],
            [
                "NOTÍCIAS",
                "world-news"
            ],
            [
                "HEAD TO HEAD",
                "world-h2h"
            ]
        ];

        worldActions.forEach(
            ([label, action]) => {
                const button =
                    this.button(
                        label,
                        "destiny-secondary-button"
                    );

                button.dataset.mmaAction =
                    action;

                button.dataset.mmaLabel =
                    label;

                database.appendChild(
                    button
                );
            }
        );

        const backButton =
            this.button(
                "← INÍCIO",
                "destiny-secondary-button"
            );

        backButton.dataset.route =
            ROUTES.HOME;

        wrapper.appendChild(header);
        wrapper.appendChild(database);
        wrapper.appendChild(backButton);

        container.appendChild(wrapper);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    renderLife() {
        const container =
            this.ensureContainer();

        container.innerHTML = "";

        const wrapper =
            document.createElement("div");

        wrapper.className =
            "destiny-life";

        const header =
            document.createElement("header");

        header.className =
            "destiny-section-header";

        const title =
            document.createElement("h1");

        title.textContent =
            "VIDA";

        const subtitle =
            document.createElement("p");

        subtitle.textContent =
            "Sua vida também faz parte da carreira.";

        header.appendChild(title);
        header.appendChild(subtitle);

        const grid =
            document.createElement("div");

        grid.className =
            "destiny-life-grid";

        const lifeActions = [
            [
                "RELACIONAMENTOS",
                "life-relationships"
            ],
            [
                "FAMÍLIA",
                "life-family"
            ],
            [
                "FILHOS",
                "life-children"
            ],
            [
                "CASA",
                "life-house"
            ],
            [
                "VEÍCULOS",
                "life-vehicles"
            ],
            [
                "VIAGENS",
                "life-travel"
            ],
            [
                "EDUCAÇÃO",
                "life-education"
            ],
            [
                "FINANÇAS",
                "life-finance"
            ],
            [
                "ACADEMIA",
                "life-academy"
            ]
        ];

        lifeActions.forEach(
            ([label, action]) => {
                const button =
                    this.button(
                        label,
                        "destiny-life-card"
                    );

                button.dataset.mmaAction =
                    action;

                button.dataset.mmaLabel =
                    label;

                grid.appendChild(
                    button
                );
            }
        );

        const backButton =
            this.button(
                "← INÍCIO",
                "destiny-secondary-button"
            );

        backButton.dataset.route =
            ROUTES.HOME;

        wrapper.appendChild(header);
        wrapper.appendChild(grid);
        wrapper.appendChild(backButton);

        container.appendChild(wrapper);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
        renderDynasty() {
        const container =
            this.ensureContainer();

        container.innerHTML = "";

        const wrapper =
            document.createElement("div");

        wrapper.className =
            "destiny-dynasty";

        const header =
            document.createElement("header");

        header.className =
            "destiny-section-header";

        const title =
            document.createElement("h1");

        title.textContent =
            "DINASTIA";

        const subtitle =
            document.createElement("p");

        subtitle.textContent =
            "Seu legado continua além da sua própria carreira.";

        header.appendChild(title);
        header.appendChild(subtitle);

        const content =
            document.createElement("section");

        content.className =
            "destiny-dynasty-content";

        content.innerHTML = `
            <div class="destiny-empty-state">
                <h2>SEU LEGADO</h2>
                <p>
                    Construa sua história, forme sua família
                    e deixe uma geração capaz de continuar
                    sua trajetória.
                </p>
            </div>
        `;

        const backButton =
            this.button(
                "← INÍCIO",
                "destiny-secondary-button"
            );

        backButton.dataset.route =
            ROUTES.HOME;

        wrapper.appendChild(header);
        wrapper.appendChild(content);
        wrapper.appendChild(backButton);

        container.appendChild(wrapper);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    injectRuntimeStyles() {
        if (
            document.getElementById(
                "mma-destiny-runtime-styles"
            )
        ) {
            return;
        }

        const style =
            document.createElement("style");

        style.id =
            "mma-destiny-runtime-styles";

        style.textContent = `
            #mma-destiny-app {
                width: 100%;
                min-height: 100vh;
            }

            #app-content {
                width: 100%;
                min-height: 100vh;
            }

            /*
             * ==========================================
             * BOTÕES
             * ==========================================
             */

            .destiny-primary-button,
            .destiny-secondary-button,
            .destiny-database-menu button,
            .destiny-life-card {
                position: relative;
                z-index: 2;
                pointer-events: auto;
                touch-action: manipulation;
                -webkit-tap-highlight-color: transparent;
                cursor: pointer;
            }

            .destiny-primary-button:disabled,
            .destiny-secondary-button:disabled {
                cursor: default;
                opacity: 0.65;
            }

            /*
             * ==========================================
             * TELAS INTERNAS
             * ==========================================
             */

            .destiny-internal-screen {
                width: 100%;
                min-height: 100vh;
                box-sizing: border-box;
                padding: 24px;
            }

            .destiny-internal-header {
                display: flex;
                align-items: center;
                gap: 16px;
                margin-bottom: 24px;
            }

            .destiny-internal-header h1 {
                margin: 0;
            }

            .destiny-internal-content {
                width: 100%;
            }

            .destiny-empty-state {
                padding: 28px;
                border-radius: 16px;
                text-align: center;
            }

            .destiny-empty-state h2 {
                margin-top: 0;
            }

            /*
             * ==========================================
             * CRIAÇÃO DO LUTADOR
             * ==========================================
             */

            .fighter-creation-overlay {
                position: fixed;
                inset: 0;
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
                box-sizing: border-box;
                overflow-y: auto;
                background: rgba(0, 0, 0, 0.82);
            }

            .fighter-creation-modal {
                width: min(100%, 560px);
                max-height: calc(100vh - 40px);
                overflow-y: auto;
                box-sizing: border-box;
                padding: 24px;
                border-radius: 18px;
            }

            .fighter-creation-form {
                display: flex;
                flex-direction: column;
                gap: 16px;
            }

            .fighter-creation-form label {
                display: flex;
                flex-direction: column;
                gap: 7px;
            }

            .fighter-creation-form input,
            .fighter-creation-form select {
                width: 100%;
                box-sizing: border-box;
                min-height: 44px;
            }

            .fighter-creation-actions {
                display: flex;
                gap: 12px;
                margin-top: 8px;
            }

            .fighter-creation-actions button {
                flex: 1;
            }

            /*
             * ==========================================
             * MOBILE
             * ==========================================
             */

            @media (max-width: 600px) {
                .destiny-internal-screen {
                    padding: 16px;
                }

                .destiny-internal-header {
                    align-items: flex-start;
                    flex-direction: column;
                }

                .fighter-creation-overlay {
                    align-items: flex-start;
                    padding: 12px;
                }

                .fighter-creation-modal {
                    max-height: calc(100vh - 24px);
                    padding: 18px;
                }

                .fighter-creation-actions {
                    flex-direction: column;
                }
            }
        `;

        document.head.appendChild(style);
    }
}

export { Renderer };
