import { createAction } from "@reduxjs/toolkit";
import { IBlock } from "../../models/block/block";
import { IMergeDataMeta } from "../../utils/utils";

const addBlock = createAction<IBlock>("blocks/addBlock");

export interface IUpdateBlockActionArgs {
  id: string;
  data: Partial<IBlock>;
  meta?: IMergeDataMeta;
}

const updateBlock = createAction<IUpdateBlockActionArgs>("blocks/updateBlock");

const deleteBlock = createAction<string>("blocks/deleteBlock");

const bulkAddBlocks = createAction<IBlock[]>("blocks/bulkAddBlocks");

const bulkUpdateBlocks = createAction<IUpdateBlockActionArgs[]>(
  "blocks/bulkUpdateBlocks"
);

const bulkDeleteBlocks = createAction<string[]>("blocks/bulkDeleteBlocks");

class BlockActions {
  public static addBlock = addBlock;
  public static updateBlock = updateBlock;
  public static deleteBlock = deleteBlock;
  public static bulkAddBlocks = bulkAddBlocks;
  public static bulkUpdateBlocks = bulkUpdateBlocks;
  public static bulkDeleteBlocks = bulkDeleteBlocks;
}

export default BlockActions;
