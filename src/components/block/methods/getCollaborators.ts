import { IBlock } from "../../../models/block/block";
import { IUser } from "../../../models/user/user";
import netInterface from "../../../net";
import { updateBlockRedux } from "../../../redux/blocks/actions";
import { bulkAddUsersRedux } from "../../../redux/users/actions";
import { IPipeline, PipelineEntryFunc } from "../../FormPipeline";

export interface IGetCollaboratorsPipelineParams {
  block: IBlock;
}

// TODO: Change collaborators type to appropriate type
interface IGetCollaboratorsNetResult {
  collaborators: IUser[];
}

const getCollaboratorsPipeline: IPipeline<
  IGetCollaboratorsPipelineParams,
  IGetCollaboratorsPipelineParams,
  IGetCollaboratorsNetResult,
  IGetCollaboratorsNetResult
> = {
  async net({ params }) {
    const { block } = params;
    return await netInterface("block.getCollaborators", { block });
  },

  redux({ dispatch, params, result }) {
    const ids = result.collaborators.map(collaborator => collaborator.customId);
    dispatch(bulkAddUsersRedux(result.collaborators));
    dispatch(
      updateBlockRedux(
        params.block.customId,
        {
          collaborators: ids
        },
        { arrayUpdateStrategy: "replace" }
      )
    );
  }
};

export default getCollaboratorsPipeline;

export type GetCollaboratorsPipelineEntryFunc = PipelineEntryFunc<
  IGetCollaboratorsPipelineParams
>;
