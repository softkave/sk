import moment from "moment";
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

    if (block.expectedEndAt && typeof block.expectedEndAt !== "number") {
      block.expectedEndAt = moment(block.expectedEndAt).valueOf();
    }

    block.groupTaskContext = [];
    block.groupProjectContext = [];

    const childrenTypes = getBlockValidChildrenTypes(block);

    if (parent) {
      const ancestors = Array.isArray(parent.parents) ? parent.parents : [];
      block.parents = [...ancestors, parent.customId];

      const pluralType = `${block.type}s`;

      if (!parent[pluralType]) {
        parent[pluralType] = [];
      }

      parent[pluralType].push(block.customId);

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
        const pluralType = `${type}s`;
        block[pluralType] = [];
      });
    }

    return { ...params, parent, block };
  },

  async net({ params }) {
    const { block } = params;
    return await netInterface("block.addBlock", { block });
  },

  // TODO: Instead of stripping basenames, let the forms use the same data structure as the sent data in net
  // TODO: Let form containers handle data loading and submission + redux
  handleError: { stripBaseNames: ["block"] },

  redux({ dispatch, params }) {
    const { block, parent, user } = params;

    dispatch(addBlockRedux(block));

    if (parent) {
      dispatch(updateBlockRedux(parent.customId, parent));
    }

    if (block.type === "org") {
      dispatch(updateUserRedux(user.customId, { orgs: [block.customId] }));
    }
  }
};

export default addBlockPipeline;

export type AddBlockPipelineEntryFunc = PipelineEntryFunc<
  IAddBlockPipelineParams
>;
