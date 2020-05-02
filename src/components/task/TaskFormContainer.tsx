import React from "react";
import { useSelector } from "react-redux";
import { IBlock } from "../../models/block/block";
import { IUser } from "../../models/user/user";
import { getBlock } from "../../redux/blocks/selectors";
import addBlockOperationFunc from "../../redux/operations/block/addBlock";
import updateBlockOperationFunc from "../../redux/operations/block/updateBlock";
import { updateBlockOperationID } from "../../redux/operations/operationIDs";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import { IReduxState } from "../../redux/store";
import { getUsersAsArray } from "../../redux/users/selectors";
import getNewBlock from "../block/getNewBlock";
import useBlockPossibleParents from "../hooks/useBlockPossibleParents";
import useOperation from "../hooks/useOperation";
import TaskForm, { ITaskFormValues } from "./TaskForm";

const scopeID = "TaskFormContainer";

export interface ITaskFormContainerProps {
  orgID: string;
  onClose: () => void;

  block?: IBlock;
  submitLabel?: React.ReactNode;
}

const TaskFormContainer: React.FC<ITaskFormContainerProps> = (props) => {
  const { onClose, submitLabel, orgID } = props;
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

  const [block, setBlock] = React.useState<IBlock>(
    props.block || getNewBlock(user, "task", org)
  );

  const possibleParents = useBlockPossibleParents(block);

  const operationStatus = useOperation({
    scopeID,
    operationID: updateBlockOperationID,
    resourceID: block.customId,
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

  console.log({ operationStatus });

  return (
    <TaskForm
      value={block as any}
      collaborators={collaborators}
      orgID={orgID}
      user={user}
      onClose={onClose}
      submitLabel={submitLabel}
      onSubmit={onSubmit}
      isSubmitting={operationStatus.isLoading}
      errors={operationStatus.error}
      possibleParents={possibleParents}
    />
  );
};

export default React.memo(TaskFormContainer);
