import React from "react";
import { useSelector } from "react-redux";
import { IBlock } from "../../models/block/block";
import { IUser } from "../../models/user/user";
import { getBlock } from "../../redux/blocks/selectors";
import addBlockOperationFunc from "../../redux/operations/block/addBlock";
import updateBlockOperationFunc from "../../redux/operations/block/updateBlock";
import {
  addBlockOperationID,
  updateBlockOperationID,
} from "../../redux/operations/operationIDs";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import { IReduxState } from "../../redux/store";
import { getUsersAsArray } from "../../redux/users/selectors";
import { flattenErrorListWithDepthInfinite } from "../../utils/utils";
import getNewBlock from "../block/getNewBlock";
import useBlockPossibleParents from "../hooks/useBlockPossibleParents";
import useOperation from "../hooks/useOperation";
import TaskForm, { ITaskFormValues } from "./TaskForm";

const scopeID = "TaskFormContainer";

export interface ITaskFormContainerProps {
  orgID: string;
  onClose: () => void;

  parentBlock?: IBlock;
  block?: IBlock;
}

const TaskFormContainer: React.FC<ITaskFormContainerProps> = (props) => {
  const { onClose, orgID, parentBlock } = props;
  const user = useSelector(getSignedInUserRequired);
  const org = useSelector<IReduxState, IBlock>((state) => {
    return getBlock(state, orgID)!;
  });

  const collaboratorIDs = Array.isArray(org.collaborators)
    ? org.collaborators
    : [];

  const collaborators = useSelector<IReduxState, IUser[]>((state) =>
    getUsersAsArray(state, collaboratorIDs)
  );

  const [block, setBlock] = React.useState<IBlock>(() => {
    if (props.block) {
      return props.block;
    } else {
      const newBlock = getNewBlock(user, "task", parentBlock);

      if (org.availableStatus && org.availableStatus.length > 0) {
        newBlock.status = org.availableStatus[0].customId;
      }

      return newBlock;
    }
  });

  const possibleParents = useBlockPossibleParents(block);

  const operationStatus = useOperation({
    scopeID,
    operationID: props.block ? updateBlockOperationID : addBlockOperationID,
    resourceID: block.customId,
  });

  const errors = operationStatus.error
    ? flattenErrorListWithDepthInfinite(operationStatus.error)
    : undefined;

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
          scopeID,
          resourceID: block.customId,
        }
      );
    } else {
      addBlockOperationFunc(
        {
          user,
          block: data,
        },
        {
          scopeID,
          resourceID: block.customId,
        }
      );
    }
  };

  console.log({ operationStatus, props, errors });

  return (
    <TaskForm
      // isSubmitting
      value={block as any}
      collaborators={collaborators}
      orgID={orgID}
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
