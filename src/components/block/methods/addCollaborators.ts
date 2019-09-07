import moment from "moment";

import { IBlock } from "../../../models/block/block";
import netInterface from "../../../net";
import { INetResult } from "../../../net/query";
import { updateBlockRedux } from "../../../redux/blocks/actions";
import { bulkAddNotificationsRedux } from "../../../redux/notifications/actions";
import { newId } from "../../../utils/utils";
import { IACFItemValue } from "../../collaborator/ACFItem";
import { IPipeline, PipelineEntryFunc } from "../../FormPipeline";

// TODO: Define collaborators type
// TODO: Create a package maybe called softkave-bridge that contains resuable bits between front and backend
export interface IAddCollaboratorPipelineParams {
  requests: IACFItemValue[];
  block: IBlock;
  message?: string;
  expiresAt?: number | Date;
}

interface IAddCollaboratorProcessedParams
  extends IAddCollaboratorPipelineParams {
  requests: Array<
    {
      customId: string;
    } & IACFItemValue
  >;
}

const addCollaboratorPipeline: IPipeline<
  IAddCollaboratorPipelineParams,
  IAddCollaboratorProcessedParams,
  INetResult,
  INetResult
> = {
  process({ params }) {
    const { requests: collaborators, message, expiresAt } = params;
    const proccessedCollaborators = collaborators.map(request => {
      return {
        ...request,
        body: request.body || message!,
        expiresAt: moment(request.expiresAt || expiresAt).valueOf(),
        customId: newId()
      };
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

  handleError: {
    replaceBaseNames: [{ from: "collaborators", to: "requests" }]
  },

  redux({ dispatch, params }) {
    const { block, requests } = params;
    const requestIds = requests.map(request => request.customId);

    /**
     * Currently, the only the request IDs are stored, which will trigger a refetch of all the block's notifications
     * including the ones already fetched. The advantage to this, is that out-of-date notifications will be updated.
     *
     * TODO: When real-time data update is eventually implemented,
     * create the notifications from the request and store it here, and not rely on reloading all the data,
     * as updates will be pushed as they occur
     */
    // dispatch(bulkAddNotificationsRedux(requests));
    dispatch(
      updateBlockRedux(
        block.customId,
        {
          collaborationRequests: requestIds
        },
        { arrayUpdateStrategy: "concat" }
      )
    );
  }
};

export default addCollaboratorPipeline;

export type AddCollaboratorPipelineEntryFunc = PipelineEntryFunc<
  IAddCollaboratorPipelineParams
>;
