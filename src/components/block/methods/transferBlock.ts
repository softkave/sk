import { IBlock } from "../../../models/block/block";
import { getBlockValidChildrenTypes } from "../../../models/block/utils";
import netInterface from "../../../net";
import { INetResult } from "../../../net/query";
import { updateBlockRedux } from "../../../redux/blocks/actions";
import { IPipeline, PipelineEntryFunc } from "../../FormPipeline";

function move(list, id, dropPosition) {
  const idIndex = list.indexOf(id);
  list = [...list];
  list.splice(idIndex, 1);
  list.splice(dropPosition, 0, id);
  return list;
}

function remove(list, id) {
  const idIndex = list.indexOf(id);
  list = [...list];
  list.splice(idIndex, 1);
  return list;
}

function add(list, id, dropPosition) {
  list = [...list];
  list.splice(dropPosition, 0, id);
  return list;
}

function getIndex(list, id) {
  const idIndex = list.indexOf(id);
  return idIndex;
}

// TODO: Define dragInformation data type
export interface ITransferBlockPipelineParams {
  draggedBlock: IBlock;
  sourceBlock: IBlock;
  destinationBlock: IBlock;
  groupContext?: string;
  dragInformation: any;
}

interface ITransferBlockProcessedParams extends ITransferBlockPipelineParams {
  draggedBlockPosition: number;
  dropPosition: number;
}

const transferBlockPipeline: IPipeline<
  ITransferBlockPipelineParams,
  ITransferBlockProcessedParams,
  INetResult,
  INetResult
> = {
  process({ params }) {
    const {
      draggedBlock,
      sourceBlock,
      destinationBlock,
      dragInformation,
      groupContext
    } = params;
    const pluralizedType = `${draggedBlock.type}s`;
    return {
      draggedBlock,
      sourceBlock,
      destinationBlock,
      dragInformation,
      groupContext,
      draggedBlockPosition: getIndex(
        sourceBlock[pluralizedType],
        draggedBlock.customId
      ),
      dropPosition: dragInformation.destination.index
    };
  },

  async net({ params }) {
    const {
      draggedBlock,
      sourceBlock,
      destinationBlock,
      groupContext,
      dropPosition,
      draggedBlockPosition
    } = params;
    return await netInterface(
      "block.transferBlock",
      sourceBlock,
      draggedBlock,
      destinationBlock,
      dropPosition,
      draggedBlockPosition,
      draggedBlock.type,
      groupContext
    );
  },

  redux({ state, dispatch, params }) {
    const {
      draggedBlock,
      sourceBlock,
      destinationBlock,
      groupContext,
      dropPosition,
      draggedBlockPosition
    } = params;
    const pluralizedType = `${draggedBlock.type}s`;

    if (draggedBlock.type === "group") {
      if (groupContext) {
        const groupChildren = move(
          sourceBlock[groupContext],
          draggedBlock.customId,
          dropPosition
        );

        sourceBlock[groupContext] = groupChildren;
      } else {
        const groupTaskContext = `groupTaskContext`;
        const groupProjectContext = `groupProjectContext`;
        const groupTaskContextChildren = move(
          sourceBlock[groupTaskContext],
          draggedBlock.customId,
          dropPosition
        );

        const groupProjectContextChildren = move(
          sourceBlock[groupProjectContext],
          draggedBlock.customId,
          dropPosition
        );

        sourceBlock[groupTaskContext] = groupTaskContextChildren;
        sourceBlock[groupProjectContext] = groupProjectContextChildren;
      }

      const children = move(
        sourceBlock[pluralizedType],
        draggedBlock.customId,
        dropPosition
      );

      sourceBlock[pluralizedType] = children;
      dispatch(updateBlockRedux());
    } else if (sourceBlock.customId === destinationBlock.customId) {
      const children = move(
        sourceBlock[pluralizedType],
        draggedBlock.customId,
        dropPosition
      );

      sourceBlock[pluralizedType] = children;
      dispatch(updateBlockRedux());
    } else {
      sourceBlock[pluralizedType] = remove(
        sourceBlock[pluralizedType],
        draggedBlock.customId
      );

      destinationBlock[pluralizedType] = add(
        destinationBlock[pluralizedType],
        draggedBlock.customId,
        dropPosition
      );

      const draggedBlockParentUpdate = [...(destinationBlock.parents || [])];
      draggedBlockParentUpdate.push(destinationBlock.customId);
      draggedBlock.parents = draggedBlockParentUpdate;

      // clear children data so that they can be loaded with updated parents
      const draggedBlockChildrenTypes = getBlockValidChildrenTypes(
        draggedBlock
      );

      draggedBlockChildrenTypes.forEach(type => {
        draggedBlock[`${type}s`] = undefined;
      });

      dispatch(updateBlockRedux());
      dispatch(updateBlockRedux());
      dispatch(updateBlockRedux());
    }

    if (
      sourceBlock.customId === destinationBlock.customId &&
      dropPosition === draggedBlockPosition
    ) {
      return;
    }
  }
};

export default transferBlockPipeline;

export type TransferBlockPipelineEntryFunc = PipelineEntryFunc<
  ITransferBlockPipelineParams
>;
