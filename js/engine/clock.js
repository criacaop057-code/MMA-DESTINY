import { updateState, getState } from "../core/state.js";
import { MONTHS, DAYS } from "../core/constants.js";

export function getCurrentDate() {
    const state = getState();

    return {
        year: state.calendar.year,
        month: state.calendar.month,
        day: state.calendar.day,
        week: state.calendar.week,
        totalWeeks: state.calendar.totalWeeks,
        totalDays: state.calendar.totalDays
    };
}

export function getFormattedDate() {
    const state = getState();

    const date = new Date(
        state.calendar.year,
        state.calendar.month,
        state.calendar.day
    );

    return `${date.getDate()} de ${MONTHS[date.getMonth()]} de ${date.getFullYear()}`;
}

export function getDayOfWeek() {
    const state = getState();

    const date = new Date(
        state.calendar.year,
        state.calendar.month,
        state.calendar.day
    );

    return DAYS[date.getDay()];
}

export function advanceDays(days = 1) {
    if (!Number.isInteger(days) || days < 1) {
        throw new Error("Número de dias inválido.");
    }

    updateState(state => {
        const date = new Date(
            state.calendar.year,
            state.calendar.month,
            state.calendar.day
        );

        date.setDate(date.getDate() + days);

        state.calendar.year = date.getFullYear();
        state.calendar.month = date.getMonth();
        state.calendar.day = date.getDate();

        state.calendar.totalDays += days;
    });

    return getCurrentDate();
}

export function advanceWeek() {
    return advanceDays(7);
}

export function getAge(birthDate) {
    const state = getState();

    if (!birthDate) {
        return null;
    }

    const birth = new Date(birthDate);

    let age =
        state.calendar.year -
        birth.getFullYear();

    const currentMonth = state.calendar.month;
    const currentDay = state.calendar.day;

    if (
        currentMonth < birth.getMonth() ||
        (
            currentMonth === birth.getMonth() &&
            currentDay < birth.getDate()
        )
    ) {
        age--;
    }

    return age;
}
