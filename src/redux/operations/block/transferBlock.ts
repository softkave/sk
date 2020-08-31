import { createAsyncThunk } from "@reduxjs/toolkit";
import { IBlock } from "../../../models/block/block";
import { getDateString } from "../../../utils/utils";
import BlockActions from "../../blocks/actions";
import BlockSelectors from "../../blocks/selectors";
import { IAppAsyncThunkConfig } from "../../types";
import { GetOperationActionArgs } from "../types";

export interface ITransferBlockProps {
    data: {
        draggedBlockId: string;
        destinationBlockId: string;
    };
}

export function hasBlockParentChanged(block: IBlock, update: IBlock) {
    return block.parent !== update.parent;
}

export const transferBlockHelperAction = createAsyncThunk<
    void,
    GetOperationActionArgs<ITransferBlockProps>,
    IAppAsyncThunkConfig
>("session/transferBlockHelperAction", async (arg, thunkAPI) => {
    const draggedBlock = BlockSelectors.getBlock(
        thunkAPI.getState(),
        arg.data.draggedBlockId
    )!;
    const destinationBlock = BlockSelectors.getBlock(
        thunkAPI.getState(),
        arg.data.destinationBlockId
    )!;

    const draggedBlockUpdates: Partial<IBlock> = {
        updatedAt: getDateString(),
        parent: destinationBlock.customId,
    };

    // Already done in task form, will conflict
    // if (draggedBlock.type === BlockType.Task) {
    //   const statuses = destinationBlock.boardStatuses || [];

    //   if (statuses.length > 0) {
    //     const user = SessionSelectors.getSignedInUserRequired(
    //       thunkAPI.getState()
    //     );
    //     draggedBlockUpdates.status = statuses[0]?.customId;
    //     draggedBlockUpdates.statusAssignedAt = getDateString();
    //     draggedBlockUpdates.statusAssignedBy = user.customId;
    //   }
    // }

    await thunkAPI.dispatch(
        BlockActions.updateBlock({
            id: draggedBlock.customId,
            data: draggedBlockUpdates,
            meta: {
                arrayUpdateStrategy: "replace",
            },
        })
    );
});
