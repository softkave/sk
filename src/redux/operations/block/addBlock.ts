import { createAsyncThunk } from "@reduxjs/toolkit";
import { addCustomIdToSubTasks } from "../../../components/block/getNewBlock";
import { BlockType, IBlock } from "../../../models/block/block";
import BlockAPI from "../../../net/block/block";
import { getNewId } from "../../../utils/utils";
import BlockActions from "../../blocks/actions";
import BlockSelectors from "../../blocks/selectors";
import SessionSelectors from "../../session/selectors";
import { IAppAsyncThunkConfig } from "../../types";
import UserActions from "../../users/actions";
import OperationActions from "../actions";
import {
    dispatchOperationCompleted,
    dispatchOperationError,
    dispatchOperationStarted,
    IOperation,
    isOperationStarted,
    OperationStatus,
} from "../operation";
import OperationType from "../OperationType";
import OperationSelectors from "../selectors";
import { GetOperationActionArgs } from "../types";

export interface IAddBlockOperationActionArgs {
    block: IBlock;
}

export const completeAddBlock = createAsyncThunk<
    void,
    IAddBlockOperationActionArgs,
    IAppAsyncThunkConfig
>("blockOperation/completeAddBlock", async (arg, thunkAPI) => {
    await thunkAPI.dispatch(BlockActions.addBlock(arg.block));

    let parent: IBlock | undefined;
    const user = SessionSelectors.assertGetUser(thunkAPI.getState());

    if (arg.block.parent) {
        parent = BlockSelectors.getBlock(thunkAPI.getState(), arg.block.parent);
    }

    if (parent && arg.block.type === BlockType.Board) {
        const pluralType = `${arg.block.type}s`;
        const parentUpdate = { [pluralType]: [arg.block.customId] };

        await thunkAPI.dispatch(
            BlockActions.updateBlock({
                id: parent.customId,
                data: parentUpdate,
                meta: {
                    arrayUpdateStrategy: "concat",
                },
            })
        );
    }

    if (arg.block.type === BlockType.Org) {
        await thunkAPI.dispatch(
            UserActions.updateUser({
                id: user.customId,
                data: { orgs: [{ customId: arg.block.customId }] },
                meta: { arrayUpdateStrategy: "concat" },
            })
        );
    }

    const loadOps: IOperation[] = [];

    if (
        arg.block.type === BlockType.Org ||
        arg.block.type === BlockType.Board
    ) {
        // To avoid loading the block children, cause there isn't any yet, it's a new block
        loadOps.push({
            id: getNewId(),
            operationType: OperationType.LOAD_BLOCK_CHILDREN,
            resourceId: arg.block.customId,
            status: {
                status: OperationStatus.Completed,
                timestamp: Date.now(),
            },
            meta: { typeList: [BlockType.Board, BlockType.Task] },
        });
    }

    if (arg.block.type === BlockType.Org) {
        // To avoid loading the block data, cause there isn't any yet, it's a new block
        loadOps.push({
            id: getNewId(),
            operationType: OperationType.LoadOrgUsersAndRequests,
            resourceId: arg.block.customId,
            status: {
                status: OperationStatus.Completed,
                timestamp: Date.now(),
            },
        });
    }

    if (loadOps.length > 0) {
        thunkAPI.dispatch(OperationActions.bulkAddOperations(loadOps));
    }
});

export const addBlockOperationAction = createAsyncThunk<
    IOperation | undefined,
    GetOperationActionArgs<IAddBlockOperationActionArgs>,
    IAppAsyncThunkConfig
>("blockOperation/addBlock", async (arg, thunkAPI) => {
    const id = arg.opId || getNewId();

    const operation = OperationSelectors.getOperationWithId(
        thunkAPI.getState(),
        id
    );

    if (isOperationStarted(operation)) {
        return;
    }

    await thunkAPI.dispatch(
        dispatchOperationStarted(
            id,
            OperationType.ADD_BLOCK,
            arg.block.customId
        )
    );

    try {
        if (arg.block.type === BlockType.Task) {
            arg.block.subTasks = addCustomIdToSubTasks(arg.block.subTasks);
        }

        const isDemoMode = SessionSelectors.isDemoMode(thunkAPI.getState());

        if (!isDemoMode) {
            const result = await BlockAPI.addBlock(arg.block);

            if (result && result.errors) {
                throw result.errors;
            }
        }

        // TODO: find a fix for the type error occurring here
        // dispatch-type-error
        await thunkAPI.dispatch(completeAddBlock({ block: arg.block }) as any);
        await thunkAPI.dispatch(
            dispatchOperationCompleted(
                id,
                OperationType.ADD_BLOCK,
                arg.block.customId
            )
        );
    } catch (error) {
        await thunkAPI.dispatch(
            dispatchOperationError(
                id,
                OperationType.ADD_BLOCK,
                error,
                arg.block.customId
            )
        );
    }

    return OperationSelectors.getOperationWithId(thunkAPI.getState(), id);
});
