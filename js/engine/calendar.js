import { getState, updateState } from "../core/state.js";
import { advanceWeek, getFormattedDate } from "./clock.js";

export function initializeCalendar() {
    updateState(state => {
        state.calendar.week = 1;
        state.calendar.totalWeeks = 0;
        state.calendar.totalDays = 0;
    });
}

export function advanceCalendarWeek() {
    const before = getState().calendar.week;

    advanceWeek();

    updateState(state => {
        state.calendar.week += 1;
    });

    const after = getState().calendar.week;

    return {
        previousWeek: before,
        currentWeek: after,
        date: getFormattedDate()
    };
}

export function getCalendarSnapshot() {
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
