import { IBlock } from "../../../models/block/block";
import netInterface from "../../../net";
import {
  bulkAddBlocksRedux,
  updateBlockRedux
} from "../../../redux/blocks/actions";
import { IPipeline, PipelineEntryFunc } from "../../FormPipeline";
import { UpdateBlockPipelineEntryFunc } from "./updateBlock";

export interface IGetBlockChildrenPipelineParams {
  block: IBlock;
  types?: string[];
  isBacklog?: boolean;
  updateBlock: UpdateBlockPipelineEntryFunc;
}

/**
 * TODO: Separate IBlock from INetBlock which is block returned from the server
 * because some fields are not present in it
 */
interface IGetBlockChildrenNetResult {
  blocks: IBlock[];
}

const getBlockChildrenPipeline: IPipeline<
  IGetBlockChildrenPipelineParams,
  IGetBlockChildrenPipelineParams,
  IGetBlockChildrenNetResult,
  IGetBlockChildrenNetResult
> = {
  async net({ params }) {
    const { block, types, isBacklog } = params;
    return await netInterface("block.getBlockChildren", {
      block,
      types,
      isBacklog
    });
  },

  // TODO: think on having a postNet function

  redux({ dispatch, params, result }) {
    const { block, updateBlock } = params;
    const { blocks } = result;
    const parentUpdate: Partial<IBlock> = {
      tasks: [],
      groups: [],
      projects: [],
      groupTaskContext: [],
      groupProjectContext: []
    };

    blocks.forEach(nextBlock => {
      const container = parentUpdate[`${nextBlock.type}s`];
      container.push(nextBlock.customId);

      if (nextBlock.type === "group") {
        parentUpdate.groupTaskContext!.push(nextBlock.customId);
        parentUpdate.groupProjectContext!.push(nextBlock.customId);
      }
    });

    dispatch(bulkAddBlocksRedux(blocks));

    // tslint:disable-next-line: forin
    for (const key in parentUpdate) {
      const typeContainer = parentUpdate[key];

      if (
        !Array.isArray(block[key]) ||
        block[key].length !== typeContainer.length
      ) {
        // TODO: Think on: do we need to handle error here
        // const updateBlockResult = await updateBlock(block, block);
        // throwOnError(updateBlockResult);
        updateBlock({ block, data: parentUpdate });
        dispatch(
          updateBlockRedux(block.customId, parentUpdate, {
            arrayUpdateStrategy: "replace"
          })
        );
        break;
      }
    }
  }
};

export default getBlockChildrenPipeline;

export type GetBlockChildrenPipelineEntryFunc = PipelineEntryFunc<
  IGetBlockChildrenPipelineParams
>;
