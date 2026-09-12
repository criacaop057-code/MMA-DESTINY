const BACKUP_KEY =
    "mma_destiny_backups";

const MAX_BACKUPS = 5;

export function createBackup(state) {
    if (!state) {
        return false;
    }

    const backups =
        getBackups();

    backups.unshift({
        id: createBackupId(),
        createdAt:
            new Date().toISOString(),
        state:
            structuredClone(state)
    });

    while (backups.length > MAX_BACKUPS) {
        backups.pop();
    }

    localStorage.setItem(
        BACKUP_KEY,
        JSON.stringify(backups)
    );

    return true;
}

export function getBackups() {
    try {
        const raw =
            localStorage.getItem(BACKUP_KEY);

        if (!raw) {
            return [];
        }

        return JSON.parse(raw);
    } catch {
        return [];
    }
}

export function getBackup(backupId) {
    return getBackups().find(
        backup =>
            backup.id === backupId
    ) || null;
}

export function restoreBackup(backupId) {
    const backup =
        getBackup(backupId);

    if (!backup) {
        return null;
    }

    return structuredClone(
        backup.state
    );
}

export function deleteBackup(backupId) {
    const backups =
        getBackups().filter(
            backup =>
                backup.id !== backupId
        );

    localStorage.setItem(
        BACKUP_KEY,
        JSON.stringify(backups)
    );

    return true;
}

export function clearBackups() {
    localStorage.removeItem(
        BACKUP_KEY
    );

    return true;
}

function createBackupId() {
    return (
        "backup_" +
        Date.now() +
        "_" +
        Math.random()
            .toString(36)
            .slice(2, 8)
    );
}
