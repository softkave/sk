import BoardAPI, {
    IBoardExistsEndpointParams,
} from "../../../net/board/endpoints";
import BoardSelectors from "../../boards/selectors";
import OperationType from "../OperationType";
import { makeAsyncOpWithoutDispatch } from "../utils";

export const boardExistsOpAction = makeAsyncOpWithoutDispatch(
    "op/boards/boardExists",
    OperationType.BoardExists,
    async (arg: IBoardExistsEndpointParams, thunkAPI, extras) => {
        if (extras.isDemoMode) {
            const name = arg.name.toLowerCase();
            const exists = BoardSelectors.filter(
                thunkAPI.getState(),
                (item) => item.name.toLowerCase() === name
            );
            return { exists };
        } else {
            return await BoardAPI.boardExists(arg);
        }
    }
);
