import forEach from "lodash/forEach";
import { ISprint } from "../../models/sprint/types";
import { IAppState } from "../types";

function countSprints(state: IAppState, boardId: string): number {
    let count = 0;

    forEach(state.sprints, (sprint) => {
        if (sprint.boardId === boardId) {
            count++;
        }
    });

    return count;
}

function getSprint(state: IAppState, id: string): ISprint {
    return state.sprints[id];
}

function getSprintsFromIndex(
    state: IAppState,
    boardId: string,
    index: number
): ISprint[] {
    const sprints: ISprint[] = [];

    forEach(state.sprints, (sprint) => {
        if (sprint.boardId === boardId && sprint.sprintIndex > index) {
            sprints.push(sprint);
        }
    });

    return sprints;
}

function getNextSprintAfterIndex(
    state: IAppState,
    boardId: string,
    index: number
): ISprint | undefined {
    // tslint:disable-next-line: forin
    for (const id in state.sprints) {
        const sprint = state.sprints[id];

        if (sprint.boardId === boardId && sprint.sprintIndex === index + 1) {
            return sprint;
        }
    }
}

export default class SprintSelectors {
    public static countSprints = countSprints;
    public static getSprint = getSprint;
    public static getSprintsFromIndex = getSprintsFromIndex;
    public static getNextSprintAfterIndex = getNextSprintAfterIndex;
}
