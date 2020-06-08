import React from "react";
import { useSelector } from "react-redux";
import { BlockType, IBlock } from "../../models/block/block";
import { IUser } from "../../models/user/user";
import { getBlock } from "../../redux/blocks/selectors";
import addBlockOperationFunc from "../../redux/operations/block/addBlock";
import updateBlockOperationFunc from "../../redux/operations/block/updateBlock";
import {
  addBlockOperationId,
  updateBlockOperationId,
} from "../../redux/operations/operationIDs";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import { IAppState } from "../../redux/store";
import { getUsersAsArray } from "../../redux/users/selectors";
import {
  flattenErrorListWithDepthInfinite,
  getDateString,
} from "../../utils/utils";
import getNewBlock from "../block/getNewBlock";
import useBlockPossibleParents from "../hooks/useBlockPossibleParents";
import useOperation from "../hooks/useOperation";
import TaskForm, { ITaskFormValues } from "./TaskForm";

const scopeId = "TaskFormContainer";

export interface ITaskFormContainerProps {
  orgId: string;
  onClose: () => void;

  parentBlock?: IBlock;
  block?: IBlock;
}

const TaskFormContainer: React.FC<ITaskFormContainerProps> = (props) => {
  const { onClose, orgId, parentBlock } = props;
  const user = useSelector(getSignedInUserRequired);
  const org = useSelector<IAppState, IBlock>((state) => {
    return getBlock(state, orgId)!;
  });

  const statusList = parentBlock?.boardStatuses || [];
  const labelList = parentBlock?.boardLabels || [];

  const collaboratorIds = Array.isArray(org.collaborators)
    ? org.collaborators
    : [];

  const collaborators = useSelector<IAppState, IUser[]>((state) =>
    getUsersAsArray(state, collaboratorIds)
  );

  const [block, setBlock] = React.useState<IBlock>(() => {
    if (props.block) {
      return props.block;
    } else {
      const newBlock = getNewBlock(user, BlockType.Task, parentBlock);

      if (
        parentBlock &&
        parentBlock.boardStatuses &&
        parentBlock.boardStatuses.length > 0
      ) {
        newBlock.status = parentBlock.boardStatuses[0].customId;
        newBlock.statusAssignedAt = getDateString();
        newBlock.statusAssignedBy = user.customId;
      }

      return newBlock;
    }
  });

  const possibleParents = useBlockPossibleParents(block);

  const operationStatus = useOperation({
    scopeId,
    operationId: props.block ? updateBlockOperationId : addBlockOperationId,
    resourceId: block.customId,
  });

  const errors = operationStatus.error
    ? flattenErrorListWithDepthInfinite(operationStatus.error)
    : undefined;

  React.useEffect(() => {
    if (operationStatus.isCompleted && !props.block) {
      onClose();
    }
  });

  const onSubmit = async (values: ITaskFormValues) => {
    const data = { ...block, ...values };
    setBlock(data);

    if (props.block) {
      updateBlockOperationFunc(
        {
          block,
          data,
        },
        {
          scopeId,
          resourceId: block.customId,
        }
      );
    } else {
      addBlockOperationFunc(
        {
          user,
          block: data,
        },
        {
          scopeId,
          resourceId: block.customId,
        }
      );
    }
  };

  return (
    <TaskForm
      value={block as any}
      collaborators={collaborators}
      labelList={labelList}
      statusList={statusList}
      user={user}
      onClose={onClose}
      formOnly={!props.block}
      task={props.block}
      onSubmit={onSubmit}
      isSubmitting={operationStatus.isLoading}
      errors={errors}
      possibleParents={possibleParents}
    />
  );
};

export default React.memo(TaskFormContainer);
