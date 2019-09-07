import { IBlock, ITaskCollaborator } from "../../../models/block/block";
import { assignTask } from "../../../models/block/utils";
import { IUser } from "../../../models/user/user";
import netInterface from "../../../net";
import { INetResult } from "../../../net/query";
import { updateBlockRedux } from "../../../redux/blocks/actions";
import { IPipeline, PipelineEntryFunc } from "../../FormPipeline";

function findTaskCollaborator(
  taskCollaborators: ITaskCollaborator[],
  userId: string
) {
  const collaboratorIndex = taskCollaborators.findIndex(
    c => c.userId === userId
  );

  return taskCollaborators[collaboratorIndex];
}

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
    const { block, user } = params;
    const taskCol = findTaskCollaborator(
      block.taskCollaborators,
      user.customId
    );
    return await netInterface("block.toggleTask", {
      block,
      data: taskCol.completedAt ? false : true
    });
  },

  redux({ dispatch, params }) {
    const { block, user } = params;

    const taskCollaborators = [...block.taskCollaborators];
    const collaboratorIndex = taskCollaborators.findIndex(
      c => c.userId === user.customId
    );

    let collaborator: ITaskCollaborator;

    if (collaboratorIndex !== -1) {
      collaborator = { ...taskCollaborators[collaboratorIndex] };
      collaborator.completedAt = collaborator.completedAt
        ? undefined
        : Date.now();
      taskCollaborators[collaboratorIndex] = collaborator;
    } else {
      collaborator = assignTask(user);
      collaborator.completedAt = Date.now();
      taskCollaborators.push(collaborator);
    }

    dispatch(
      updateBlockRedux(
        block.customId,
        { taskCollaborators },
        { arrayUpdateStrategy: "replace" }
      )
    );
  }
};

export default toggleTaskPipeline;

export type ToggleTaskPipelineEntryFunc = PipelineEntryFunc<
  IToggleTaskPipelineParams
>;
