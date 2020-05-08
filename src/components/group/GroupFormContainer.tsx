import React from "react";
import { useSelector } from "react-redux";
import { IBlock } from "../../models/block/block";
import addBlockOperationFunc from "../../redux/operations/block/addBlock";
import updateBlockOperationFunc from "../../redux/operations/block/updateBlock";
import {
  addBlockOperationID,
  updateBlockOperationID,
} from "../../redux/operations/operationIDs";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import { flattenErrorListWithDepthInfinite } from "../../utils/utils";
import getNewBlock from "../block/getNewBlock";
import useBlockPossibleParents from "../hooks/useBlockPossibleParents";
import useOperation from "../hooks/useOperation";
import GroupForm, { IGroupFormValues } from "./GroupForm";

const scopeID = "GroupFormContainer";

export interface IGroupFormContainerProps {
  orgID: string;
  onClose: () => void;

  parentBlock?: IBlock;
  block?: IBlock;
}

const GroupFormContainer: React.FC<IGroupFormContainerProps> = (props) => {
  const { onClose, parentBlock } = props;
  const user = useSelector(getSignedInUserRequired);

  const [block, setBlock] = React.useState<IBlock>(
    props.block || getNewBlock(user, "group", parentBlock)
  );

  const possibleParents = useBlockPossibleParents(block);

  const operationStatus = useOperation({
    scopeID,
    operationID: props.block ? updateBlockOperationID : addBlockOperationID,
    resourceID: block.customId,
  });

  const errors = operationStatus.error
    ? flattenErrorListWithDepthInfinite(operationStatus.error)
    : undefined;

  const onSubmit = async (values: IGroupFormValues) => {
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
    <GroupForm
      value={block}
      onClose={onClose}
      formOnly={!props.block}
      group={props.block}
      onSubmit={onSubmit}
      isSubmitting={operationStatus.isLoading}
      errors={errors}
      possibleParents={possibleParents}
    />
  );
};

export default React.memo(GroupFormContainer);
