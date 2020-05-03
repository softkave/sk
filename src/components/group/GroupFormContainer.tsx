import React from "react";
import { useSelector } from "react-redux";
import { IBlock } from "../../models/block/block";
import { getBlock } from "../../redux/blocks/selectors";
import addBlockOperationFunc from "../../redux/operations/block/addBlock";
import updateBlockOperationFunc from "../../redux/operations/block/updateBlock";
import { updateBlockOperationID } from "../../redux/operations/operationIDs";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import { IReduxState } from "../../redux/store";
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
  submitLabel?: React.ReactNode;
}

const GroupFormContainer: React.FC<IGroupFormContainerProps> = (props) => {
  const { onClose, submitLabel, orgID, parentBlock } = props;
  const user = useSelector(getSignedInUserRequired);

  const org = useSelector<IReduxState, IBlock>((state) => {
    return getBlock(state, orgID)!;
  });

  const [block, setBlock] = React.useState<IBlock>(
    props.block || getNewBlock(user, "group", parentBlock)
  );

  const possibleParents = useBlockPossibleParents(block);

  const operationStatus = useOperation({
    scopeID,
    operationID: updateBlockOperationID,
    resourceID: block.customId,
  });

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
      // @ts-ignore
      value={block}
      onClose={onClose}
      submitLabel={submitLabel}
      onSubmit={onSubmit}
      isSubmitting={operationStatus.isLoading}
      errors={operationStatus.error}
      possibleParents={possibleParents}
    />
  );
};

export default React.memo(GroupFormContainer);
