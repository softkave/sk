import { SprintDuration } from "./types";

const workingDaysPerWeek = 5;
export const sprintConstants = {
    workingDaysPerWeek,
    durationOptions: [
        SprintDuration.ONE_WEEK,
        SprintDuration.TWO_WEEKS,
        SprintDuration.ONE_MONTH,
    ],
    maxNameLength: 100,
    durationWorkingDays: {
        [SprintDuration.ONE_WEEK]: workingDaysPerWeek * 1,
        [SprintDuration.TWO_WEEKS]: workingDaysPerWeek * 2,
        [SprintDuration.ONE_MONTH]: workingDaysPerWeek * 4,
    },
};
