import moment from "moment";
import { sprintConstants } from "./constants";
import { ISprint } from "./types";

export function getSprintRemainingWorkingDays(sprint: ISprint) {
    if (!sprint.startDate) {
        return sprintConstants.durationWorkingDays[sprint.duration];
    }

    if (sprint.endDate) {
        return 0;
    }

    const now = moment();
    const endDate = moment(sprint.startDate).add(
        sprintConstants.durationWorkingDays[sprint.duration],
        "days"
    );

    const remainingDays = Math.floor(endDate.diff(now, "days"));

    return remainingDays;
}
