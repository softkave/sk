import randomColor from "randomcolor";
import { IBlock } from "../../../models/block/block";
import { getBlockValidChildrenTypes } from "../../../models/block/utils";
import { IUser } from "../../../models/user/user";
import netInterface from "../../../net";
import { INetResult } from "../../../net/query";
import { addBlockRedux, updateBlockRedux } from "../../../redux/blocks/actions";
import { updateUserRedux } from "../../../redux/users/actions";
import { newId } from "../../../utils/utils";
import { IPipeline, PipelineEntryFunc } from "../../FormPipeline";

function convertDateToTimestamp(date) {
  if (date && date.valueOf) {
    return date.valueOf();
  }
}

export interface IAddBlockPipelineParams {
  block: IBlock;
  user: IUser;
  parent: IBlock;
}

const addBlockPipeline: IPipeline<
  IAddBlockPipelineParams,
  IAddBlockPipelineParams,
  INetResult,
  INetResult
> = {
  process({ params }) {
    const { block, parent, user } = params;

    block.createdAt = Date.now();
    block.createdBy = user.customId;
    block.customId = newId();
    block.color = randomColor();
    block.expectedEndAt = convertDateToTimestamp(block.expectedEndAt);
    block.groupTaskContext = [];
    block.groupProjectContext = [];

    const childrenTypes = getBlockValidChildrenTypes(block);

    if (parent) {
      block.parents = [];

      if (parent.parents) {
        block.parents = block.parents.concat(parent.parents);
      }

      const type = `${block.type}s`;
      block.parents.push(parent.customId);
      parent[type].push(block.customId);

      if (block.type === "group") {
        parent.groupTaskContext.push(block.customId);
        parent.groupProjectContext.push(block.customId);
      }
    }

    if (block.type === "org") {
      block.collaborators = [user.customId];
    } else if (block.type === "task") {
      if (!block.taskCollaborators) {
        block.taskCollaborators = [];
      }
    }

    if (childrenTypes.length > 0) {
      childrenTypes.forEach(type => {
        const pluralizedType = `${type}s`;
        block[type] = {};
        block[pluralizedType] = [];
      });
    }

    return { ...params, parent, block };
  },

  async net({ params }) {
    const { block } = params;
    return await netInterface("block.addBlock", { block });
  },

  handleError: { stripBaseNames: ["block"] },

  redux({ dispatch, params }) {
    const { block, parent, user } = params;

    if (parent) {
      const blockTypePropName = `${block.type}s`;
      dispatch(
        updateBlockRedux(parent.customId, {
          [blockTypePropName]: parent[blockTypePropName].concat(block.customId)
        })
      );
    }

    if (block.type === "org") {
      dispatch(updateUserRedux(user.customId, { orgs: [block.customId] }));
    }

    dispatch(addBlockRedux(block));
  }
};

export default addBlockPipeline;

export type AddBlockPipelineEntryFunc = PipelineEntryFunc<
  IAddBlockPipelineParams
>;
