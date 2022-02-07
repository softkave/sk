// import { createAsyncThunk } from "@reduxjs/toolkit";
// import {
//     BlockType,
//     IBlock,
//     IFormBlock,
//     newBlockInputExtractor,
// } from "../../../models/block/block";
// import { seedBlock } from "../../../models/seedDemoData";
// import BlockAPI from "../../../net/block/block";
// import { getNewId, stripEmpty } from "../../../utils/utils";
// import BlockActions from "../../blocks/actions";
// import BlockSelectors from "../../blocks/selectors";
// import SessionSelectors from "../../session/selectors";
// import { IAppAsyncThunkConfig, IStoreLikeObject } from "../../types";
// import UserActions from "../../users/actions";
// import OperationActions from "../actions";
// import {
//     dispatchOperationCompleted,
//     dispatchOperationError,
//     dispatchOperationStarted,
//     IOperation,
//     isOperationStarted,
//     OperationStatus,
//     wrapUpOpAction,
// } from "../operation";
// import OperationType from "../OperationType";
// import OperationSelectors from "../selectors";
// import { GetOperationActionArgs } from "../types";

// export interface IAddBlockOperationActionArgs {
//     block: IFormBlock;
// }

// export const addBlockOpAction = createAsyncThunk<
//     IOperation<IBlock> | undefined,
//     GetOperationActionArgs<IAddBlockOperationActionArgs>,
//     IAppAsyncThunkConfig
// >("op/block/addBlock", async (arg, thunkAPI) => {
//     const opId = arg.opId || getNewId();

//     const operation = OperationSelectors.getOperationWithId(
//         thunkAPI.getState(),
//         opId
//     );

//     if (isOperationStarted(operation)) {
//         return;
//     }

//     thunkAPI.dispatch(dispatchOperationStarted(opId, OperationType.AddBlock));

//     try {
//         const user = SessionSelectors.assertGetUser(thunkAPI.getState());
//         const isDemoMode = SessionSelectors.isDemoMode(thunkAPI.getState());
//         let block: IBlock | null = null;

//         if (!isDemoMode) {
//             const result = await BlockAPI.addBlock({
//                 block: stripEmpty(newBlockInputExtractor(arg.block)),
//             });

//             if (result && result.errors) {
//                 throw result.errors;
//             }

//             block = result.block;
//         } else {
//             block = seedBlock(user, arg.block);
//         }

//         storeNewBlock(thunkAPI, block);
//         thunkAPI.dispatch(
//             dispatchOperationCompleted(
//                 opId,
//                 OperationType.AddBlock,
//                 null,
//                 block
//             )
//         );
//     } catch (error) {
//         thunkAPI.dispatch(
//             dispatchOperationError(opId, OperationType.AddBlock, error)
//         );
//     }

//     return wrapUpOpAction(thunkAPI, opId, arg);
// });

// export const storeNewBlock = (store: IStoreLikeObject, block: IBlock) => {
//     store.dispatch(BlockActions.addBlock(block));

//     let parent: IBlock | undefined;
//     const user = SessionSelectors.assertGetUser(store.getState());

//     if (block.parent) {
//         parent = BlockSelectors.getBlock(store.getState(), block.parent);
//     }

//     if (parent && block.type === BlockType.Board) {
//         const pluralType = `${block.type}s`;
//         const parentUpdate = { [pluralType]: [block.customId] };

//         store.dispatch(
//             BlockActions.updateBlock({
//                 id: parent.customId,
//                 data: parentUpdate,
//                 meta: {
//                     arrayUpdateStrategy: "concat",
//                 },
//             })
//         );
//     }

//     if (block.type === BlockType.Organization) {
//         store.dispatch(
//             UserActions.updateUser({
//                 id: user.customId,
//                 data: { orgs: [{ customId: block.customId }] },
//                 meta: { arrayUpdateStrategy: "concat" },
//             })
//         );
//     }

//     const loadOps: IOperation[] = [];

//     if (
//         block.type === BlockType.Organization ||
//         block.type === BlockType.Board
//     ) {
//         // To avoid loading the block children, cause there isn't any yet, it's a new block
//         loadOps.push({
//             id: getNewId(),
//             operationType: OperationType.LoadBlockChildren,
//             resourceId: block.customId,
//             status: {
//                 status: OperationStatus.Completed,
//                 timestamp: Date.now(),
//             },
//             meta: { typeList: [BlockType.Board, BlockType.Task] },
//         });
//     }

//     if (block.type === BlockType.Organization) {
//         // To avoid loading the block data, cause there isn't any yet, it's a new block
//         loadOps.push({
//             id: getNewId(),
//             operationType: OperationType.LoadOrgUsersAndRequests,
//             resourceId: block.customId,
//             status: {
//                 status: OperationStatus.Completed,
//                 timestamp: Date.now(),
//             },
//         });
//     }

//     if (loadOps.length > 0) {
//         store.dispatch(OperationActions.bulkAddOperations(loadOps));
//     }
// };

export const empty = "empty!";
