import { IBlock } from "../../../models/block/block";
import netInterface from "../../../net";
import { INetResult } from "../../../net/query";
import { updateBlockRedux } from "../../../redux/blocks/actions";
import { IPipeline, PipelineEntryFunc } from "../../FormPipeline";

function convertDateToTimestamp(date) {
  if (date && date.valueOf) {
    return date.valueOf();
  }
}

// TODO: Update this to IUpdateBlock which will include and make required the required fields
export interface IUpdateBlockPipelineParams {
  data: Partial<IBlock>;
  block: IBlock;
}

const updateBlockPipeline: IPipeline<
  IUpdateBlockPipelineParams,
  IUpdateBlockPipelineParams,
  INetResult,
  INetResult
> = {
  process({ params: params }) {
    const { data } = params;
    data.expectedEndAt = convertDateToTimestamp(data.expectedEndAt);
    return { ...params, data };
  },

  async net({ params }) {
    const { block, data } = params;
    return await netInterface("block.updateBlock", { block, data });
  },

  handleError: {
    // filterBaseNames: ["block"],
    stripBaseNames: ["data"]
  },

  redux({ state, dispatch, params }) {
    const { block, data } = params;
    dispatch(updateBlockRedux());
  }
};

export default updateBlockPipeline;

export type UpdateBlockPipelineEntryFunc = PipelineEntryFunc<
  IUpdateBlockPipelineParams
>;
