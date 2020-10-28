import forEach from "lodash/forEach";
import { ISprint } from "../../models/sprint/types";
import { IAppState } from "../types";

function countBoardSprints(state: IAppState, boardId: string): number {
    let count = 0;

    forEach(state.sprints, (sprint) => {
        if (sprint.boardId === boardId) {
            count++;
        }
    });

    return count;
}

function getBoardSprints(state: IAppState, boardId: string): ISprint[] {
    const sprints: ISprint[] = [];

    forEach(state.sprints, (sprint) => {
        if (sprint.boardId === boardId) {
            sprints.push(sprint);
        }
    });

    return sprints;
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

        if (
            sprint.boardId === boardId &&
            sprint.sprintIndex === index &&
            sprint.nextSprintId
        ) {
            return state.sprints[sprint.nextSprintId];
        }
    }
}

export default class SprintSelectors {
    public static countBoardSprints = countBoardSprints;
    public static getBoardSprints = getBoardSprints;
    public static getSprint = getSprint;
    public static getSprintsFromIndex = getSprintsFromIndex;
    public static getNextSprintAfterIndex = getNextSprintAfterIndex;
}
