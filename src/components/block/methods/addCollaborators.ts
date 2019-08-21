import { IBlock } from "../../../models/block/block";
import netInterface from "../../../net";
import { INetResult } from "../../../net/query";
import { updateBlockRedux } from "../../../redux/blocks/actions";
import { bulkAddNotificationsRedux } from "../../../redux/notifications/actions";
import { newId } from "../../../utils/utils";
import { IPipeline, PipelineEntryFunc } from "../../FormPipeline";

function convertDateToTimestamp(date) {
  if (date && date.valueOf) {
    return date.valueOf();
  }
}

// TODO: Define collaborators type
// TODO: Create a package maybe called softkave-bridge that contains resuable bits between front and backend
export interface IAddCollaboratorPipelineParams {
  requests: any[];
  block: IBlock;
  message?: string;
  expiresAt?: number | Date;
}

const addCollaboratorPipeline: IPipeline<
  IAddCollaboratorPipelineParams,
  IAddCollaboratorPipelineParams,
  INetResult,
  INetResult
> = {
  process({ params }) {
    const { requests: collaborators, message, expiresAt } = params;
    const proccessedCollaborators = collaborators.map(request => {
      if (!request.message) {
        request.body = message;
      }

      if (!request.expiresAt) {
        request.expiresAt = expiresAt;
      } else if (request.expiresAt.valueOf) {
        request.expiresAt = convertDateToTimestamp(request.expiresAt);
      }

      request.customId = newId();
      request.statusHistory = [{ status: "pending", date: Date.now() }];
      return request;
    });

    return { ...params, requests: proccessedCollaborators };
  },

  async net({ params }) {
    const { block, requests: collaborators } = params;
    return await netInterface("block.addCollaborators", {
      block,
      collaborators
    });
  },

  redux({ dispatch, params }) {
    const { block, requests } = params;
    const requestIds = requests.map(request => request.customId);

    dispatch(bulkAddNotificationsRedux(requests));
    dispatch(
      updateBlockRedux(block.customId, {
        collaborationRequests: block.collaborationRequests.concat(requestIds)
      })
    );
  }
};

export default addCollaboratorPipeline;

export type AddCollaboratorPipelineEntryFunc = PipelineEntryFunc<
  IAddCollaboratorPipelineParams
>;
