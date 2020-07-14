import { createReducer } from "@reduxjs/toolkit";
import { mergeData } from "../../utils/utils";
import SessionActions from "../session/actions";
import BlockActions from "./actions";
import { IBlocksState } from "./types";

const blocksReducer = createReducer<IBlocksState>({}, (builder) => {
  builder.addCase(BlockActions.addBlock, (state, action) => {
    state[action.payload.customId] = action.payload;
  });

  builder.addCase(BlockActions.updateBlock, (state, action) => {
    state[action.payload.id] = mergeData(
      state[action.payload.id],
      action.payload.data,
      action.payload.meta
    );
  });

  builder.addCase(BlockActions.deleteBlock, (state, action) => {
    delete state[action.payload];
  });

  builder.addCase(BlockActions.bulkAddBlocks, (state, action) => {
    action.payload.forEach((block) => (state[block.customId] = block));
  });

  builder.addCase(BlockActions.bulkUpdateBlocks, (state, action) => {
    action.payload.forEach((param) => {
      state[param.id] = mergeData(state[param.id], param.data, param.meta);
    });
  });

  builder.addCase(BlockActions.bulkDeleteBlocks, (state, action) => {
    action.payload.forEach((id) => delete state[id]);
  });

  builder.addCase(SessionActions.logoutUser, (state) => {
    return {};
  });
});

export default blocksReducer;
