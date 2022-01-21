import { IBoard } from "../../../models/board/types";
import BoardAPI, {
    IGetOrganizationBoardsEndpointParams,
} from "../../../net/board/endpoints";
import { assertEndpointResult } from "../../../net/utils";
import BoardActions from "../../boards/actions";
import { toActionAddList } from "../../utils";
import OperationType from "../OperationType";
import { makeAsyncOp } from "../utils";

export const getOrganizationBoardsOpAction = makeAsyncOp(
    "op/boards/getOrganizationBoards",
    OperationType.GetOrganizationBoards,
    async (arg: IGetOrganizationBoardsEndpointParams, thunkAPI, extras) => {
        let boards: IBoard[] = [];

        if (extras.isDemoMode) {
        } else {
            const result = await BoardAPI.getOrganizationBoards(arg);
            assertEndpointResult(result);
            boards = result.boards;
        }

        thunkAPI.dispatch(
            BoardActions.bulkAdd(toActionAddList(boards, "customId"))
        );
    }
);
