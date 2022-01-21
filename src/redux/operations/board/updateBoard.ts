import assert from "assert";
import { defaultTo } from "lodash";
import { messages } from "../../../models/messages";
import BoardAPI, {
    IUpdateBoardEndpointParams,
} from "../../../net/board/endpoints";
import { assertEndpointResult } from "../../../net/utils";
import { getDateString, processComplexTypeInput } from "../../../utils/utils";
import BoardActions from "../../boards/actions";
import BoardSelectors from "../../boards/selectors";
import SessionSelectors from "../../session/selectors";
import OperationType from "../OperationType";
import { makeAsyncOp } from "../utils";

export const updateBoardOpAction = makeAsyncOp(
    "op/boards/updateBoard",
    OperationType.UpdateBoard,
    async (arg: IUpdateBoardEndpointParams, thunkAPI, extras) => {
        const user = SessionSelectors.assertGetUser(thunkAPI.getState());
        let board = BoardSelectors.assertGetOne(
            thunkAPI.getState(),
            arg.boardId
        );

        if (extras.isDemoMode) {
            board = {
                ...board,
                updatedBy: user.customId,
                updatedAt: getDateString(),
                name: defaultTo(arg.data.name, board.name),
                description: defaultTo(arg.data.description, board.description),
                color: defaultTo(arg.data.color, board.color),
                boardStatuses: arg.data.boardStatuses
                    ? processComplexTypeInput(
                          board.boardStatuses,
                          arg.data.boardStatuses,
                          "customId",
                          (item) => ({
                              ...item,
                              createdAt: getDateString(),
                              createdBy: user.customId,
                          })
                      )
                    : board.boardStatuses,
                boardLabels: arg.data.boardLabels
                    ? processComplexTypeInput(
                          board.boardLabels,
                          arg.data.boardLabels,
                          "customId",
                          (item) => ({
                              ...item,
                              createdAt: getDateString(),
                              createdBy: user.customId,
                          })
                      )
                    : board.boardLabels,
                boardResolutions: arg.data.boardResolutions
                    ? processComplexTypeInput(
                          board.boardResolutions,
                          arg.data.boardResolutions,
                          "customId",
                          (item) => ({
                              ...item,
                              createdAt: getDateString(),
                              createdBy: user.customId,
                          })
                      )
                    : board.boardResolutions,
            };
        } else {
            const result = await BoardAPI.updateBoard(arg);
            assertEndpointResult(result);
            board = result.board;
        }

        assert(board, messages.internalError);
        thunkAPI.dispatch(
            BoardActions.update({
                id: board.customId,
                data: board,
            })
        );
    }
);
