export function escapeHTML(value) {
    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

export function statBox(label, value) {
    return `
        <div class="stat-box">
            <span class="stat-label">
                ${escapeHTML(label)}
            </span>

            <strong class="stat-value">
                ${escapeHTML(value)}
            </strong>
        </div>
    `;
}

export function progressBar(label, value) {

    const safeValue = Math.max(
        0,
        Math.min(100, Number(value) || 0)
    );

    return `
        <div class="progress-container">

            <div class="progress-header">
                <span>${escapeHTML(label)}</span>
                <strong>${safeValue}</strong>
            </div>

            <div class="progress-bar">
                <div
                    class="progress-fill"
                    style="width:${safeValue}%"
                ></div>
            </div>

        </div>
    `;
}

export function badge(text, type = "default") {
    return `
        <span class="badge badge-${escapeHTML(type)}">
            ${escapeHTML(text)}
        </span>
    `;
}
