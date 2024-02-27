import { SprintDuration } from "./types";

const workingDaysPerWeek = 5;
export const sprintConstants = {
  workingDaysPerWeek,
  durationOptions: [SprintDuration.OneWeek, SprintDuration.TwoWeeks, SprintDuration.OneMonth],
  maxNameLength: 100,
  durationWorkingDays: {
    [SprintDuration.OneWeek]: workingDaysPerWeek * 1,
    [SprintDuration.TwoWeeks]: workingDaysPerWeek * 2,
    [SprintDuration.OneMonth]: workingDaysPerWeek * 4,
  },
};
