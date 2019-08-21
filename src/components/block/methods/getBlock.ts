import { IBlock } from "../../../models/block/block";
import netInterface from "../../../net";
import { IPipeline, PipelineEntryFunc } from "../../FormPipeline";

export interface IGetBlockPipelineParams {
  blockID: string;
}

interface IGetBlockNetResult {
  block: IBlock;
}

const getBlockPipeline: IPipeline<
  IGetBlockPipelineParams,
  IGetBlockPipelineParams,
  IGetBlockNetResult,
  IGetBlockNetResult
> = {
  async net({ params }) {
    const { blockID } = params;
    return await netInterface("block.getBlock", {
      blockID
    });
  },

  // TODO: think on having a postNet function

  redux({ state, dispatch, params, result }) {
    const { block } = result;
  }
};

export default getBlockPipeline;

export type GetBlockPipelineEntryFunc = PipelineEntryFunc<
  IGetBlockPipelineParams
>;
