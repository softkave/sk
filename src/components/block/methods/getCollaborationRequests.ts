import { IBlock } from "../../../models/block/block";
import netInterface from "../../../net";
import { updateBlockRedux } from "../../../redux/blocks/actions";
import { bulkAddNotificationsRedux } from "../../../redux/notifications/actions";
import { IPipeline, PipelineEntryFunc } from "../../FormPipeline";

export interface IGetCollaborationRequestsPipelineParams {
  block: IBlock;
}

// TODO: Change requests type from any
interface IGetCollaborationRequestsNetResult {
  requests: any[];
}

const getCollaborationRequestsPipeline: IPipeline<
  IGetCollaborationRequestsPipelineParams,
  IGetCollaborationRequestsPipelineParams,
  IGetCollaborationRequestsNetResult,
  IGetCollaborationRequestsNetResult
> = {
  async net({ params }) {
    const { block } = params;
    return await netInterface("block.getCollabRequests", { block });
  },

  redux({ state, dispatch, params, result }) {
    const ids = result.requests.map(request => request.customId);
    dispatch(bulkAddNotificationsRedux());
    dispatch(updateBlockRedux());
  }
};

export default getCollaborationRequestsPipeline;

export type GetCollaborationRequestsPipelineEntryFunc = PipelineEntryFunc<
  IGetCollaborationRequestsPipelineParams
>;
