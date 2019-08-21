import { IBlock } from "../../../models/block/block";
// import netInterface from "../../../net";
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
  async net() {
    throw new Error("Not implemented yet");
    // const { blockID } = params;
    // return await netInterface("block.getBlock", {
    //   blockID
    // });
  }

  // TODO: think on having a postNet function
};

export default getBlockPipeline;

export type GetBlockPipelineEntryFunc = PipelineEntryFunc<
  IGetBlockPipelineParams
>;
