import { IBoard } from "../../../models/board/types";
import BoardAPI, { IGetOrganizationBoardsEndpointParams } from "../../../net/board/endpoints";
import { assertEndpointResult } from "../../../net/utils";
import BoardActions from "../../boards/actions";
import OrganizationActions from "../../organizations/actions";
import { toActionAddList } from "../../utils";
import { makeAsyncOp02 } from "../utils";

export const getOrganizationBoardsOpAction = makeAsyncOp02(
  "op/boards/getOrganizationBoards",
  async (arg: IGetOrganizationBoardsEndpointParams, thunkAPI, extras) => {
    let boards: IBoard[] = [];
    if (extras.isDemoMode) {
      // do nothing
    } else {
      const result = await BoardAPI.getOrganizationBoards({
        organizationId: arg.organizationId,
      });

      assertEndpointResult(result);
      boards = result.boards;
    }

    thunkAPI.dispatch(BoardActions.bulkUpdate(toActionAddList(boards, "customId")));
    const boardIds = boards.map((b) => b.customId);
    thunkAPI.dispatch(
      OrganizationActions.update({
        id: arg.organizationId,
        data: { boardIds },
        meta: { arrayUpdateStrategy: "replace" },
      })
    );
  }
);
