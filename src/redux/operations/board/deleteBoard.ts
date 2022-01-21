import BoardAPI, {
    IDeleteBoardEndpointParams,
} from "../../../net/board/endpoints";
import { assertEndpointResult } from "../../../net/utils";
import BoardActions from "../../boards/actions";
import SprintSelectors from "../../sprints/selectors";
import { getBoardTasks } from "../../tasks/selectors";
import { IStoreLikeObject } from "../../types";
import OperationType from "../OperationType";
import { makeAsyncOp } from "../utils";

export const deleteBoardOpAction = makeAsyncOp(
    "op/boards/deleteBoard",
    OperationType.DeleteBoard,
    async (arg: IDeleteBoardEndpointParams, thunkAPI, extras) => {
        if (extras.isDemoMode) {
        } else {
            const result = await BoardAPI.deleteBoard(arg);
            assertEndpointResult(result);
        }

        thunkAPI.dispatch(BoardActions.remove(arg.boardId));
        deleteBoardTasks(thunkAPI, arg.boardId);
        deleteBoardSprints(thunkAPI, arg.boardId);
    }
);

function deleteBoardTasks(thunkAPI: IStoreLikeObject, boardId: string) {
    const tasks = getBoardTasks(thunkAPI.getState(), boardId);
    thunkAPI.dispatch(tasks.map((item) => item.customId));
}

function deleteBoardSprints(thunkAPI: IStoreLikeObject, boardId: string) {
    const sprints = SprintSelectors.getBoardSprints(
        thunkAPI.getState(),
        boardId
    );

    thunkAPI.dispatch(sprints.map((item) => item.customId));
}
