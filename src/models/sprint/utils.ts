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

export function sortSprintByIndex(sprints: ISprint[]) {
    return sprints.sort((sprint1, sprint2) => {
        return sprint1.sprintIndex - sprint2.sprintIndex;
    });
}

export function getCurrentAndUpcomingSprints(totalSprints: ISprint[]) {
    const currentAndUpcomingSprints = totalSprints.filter((sprint) => {
        if (sprint.endDate) {
            return false;
        } else {
            return true;
        }
    });

    return sortSprintByIndex(currentAndUpcomingSprints);
}
