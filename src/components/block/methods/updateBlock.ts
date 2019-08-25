import moment from "moment";
import { IBlock } from "../../../models/block/block";
import netInterface from "../../../net";
import { INetResult } from "../../../net/query";
import { updateBlockRedux } from "../../../redux/blocks/actions";
import { IPipeline, PipelineEntryFunc } from "../../FormPipeline";

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
  process({ params }) {
    const { data } = params;

    if (data.expectedEndAt && typeof data.expectedEndAt !== "number") {
      data.expectedEndAt = moment(data.expectedEndAt).valueOf();
    }

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

  redux({ dispatch, params }) {
    const { block, data } = params;
    dispatch(updateBlockRedux(block.customId, data));
  }
};

export default updateBlockPipeline;

export type UpdateBlockPipelineEntryFunc = PipelineEntryFunc<
  IUpdateBlockPipelineParams
>;