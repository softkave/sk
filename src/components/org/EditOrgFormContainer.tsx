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
import useOperation from "../hooks/useOperation";
import EditOrgForm, { IEditOrgFormValues } from "./EditOrgForm";

const scopeID = "EditOrgFormContainer";

export interface IEditOrgFormContainerProps {
  onClose: () => void;

  block?: IBlock;
  submitLabel?: React.ReactNode;
}

const EditOrgFormContainer: React.FC<IEditOrgFormContainerProps> = (props) => {
  const { onClose, submitLabel } = props;
  const user = useSelector(getSignedInUserRequired);
  const [block, setBlock] = React.useState<IBlock>(
    props.block || getNewBlock(user, "org")
  );

  const operationStatus = useOperation({
    scopeID,
    operationID: props.block ? updateBlockOperationID : addBlockOperationID,
    resourceID: block.customId,
  });

  const errors = operationStatus.error
    ? flattenErrorListWithDepthInfinite(operationStatus.error)
    : undefined;

  const onSubmit = async (values: IEditOrgFormValues) => {
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
    <EditOrgForm
      // @ts-ignore
      value={block}
      onClose={onClose}
      submitLabel={submitLabel}
      onSubmit={onSubmit}
      isSubmitting={operationStatus.isLoading}
      errors={errors}
    />
  );
};

export default React.memo(EditOrgFormContainer);
