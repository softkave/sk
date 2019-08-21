import dotProp from "dot-prop-immutable";
import { IBlock } from "../../../models/block/block";
import { IUser } from "../../../models/user/user";
import netInterface from "../../../net";
import { INetResult } from "../../../net/query";
import { updateBlockRedux } from "../../../redux/blocks/actions";
import { IPipeline, PipelineEntryFunc } from "../../FormPipeline";

export interface IToggleTaskPipelineParams {
  block: IBlock;
  user: IUser;
}

const toggleTaskPipeline: IPipeline<
  IToggleTaskPipelineParams,
  IToggleTaskPipelineParams,
  INetResult,
  INetResult
> = {
  async net({ params }) {
    const { block } = params;
    return await netInterface("block.toggleTask", { block, data: true });
  },

  redux({ dispatch, params }) {
    const { block, user } = params;
    const collaboratorIndex = block.taskCollaborators.findIndex(
      c => c.userId === user.customId
    );

    const collaborator = block.taskCollaborators[collaboratorIndex];
    const updatedBlock = dotProp.set(
      block,
      `taskCollaborators.${collaboratorIndex}.completedAt`,
      collaborator.completedAt ? null : Date.now()
    );

    dispatch(updateBlockRedux(block.customId, updatedBlock));
  }
};

export default toggleTaskPipeline;

export type ToggleTaskPipelineEntryFunc = PipelineEntryFunc<
  IToggleTaskPipelineParams
>;
