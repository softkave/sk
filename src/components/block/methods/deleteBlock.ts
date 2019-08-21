import { IBlock } from "../../../models/block/block";
import netInterface from "../../../net";
import { INetResult } from "../../../net/query";
import { deleteBlockRedux } from "../../../redux/blocks/actions";
import { IPipeline, PipelineEntryFunc } from "../../FormPipeline";

export interface IDeleteBlockPipelineParams {
  block: IBlock;
}

const deleteBlockPipeline: IPipeline<
  IDeleteBlockPipelineParams,
  IDeleteBlockPipelineParams,
  INetResult,
  INetResult
> = {
  async net({ params }) {
    const { block } = params;
    return await netInterface("block.deleteBlock", { block });
  },

  redux({ state, dispatch, params }) {
    const { block } = params;
    dispatch(deleteBlockRedux());
  }
};

export default deleteBlockPipeline;

export type DeleteBlockPipelineEntryFunc = PipelineEntryFunc<
  IDeleteBlockPipelineParams
>;
