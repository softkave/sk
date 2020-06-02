import React from "react";
import { useSelector } from "react-redux";
import { IBlock } from "../../models/block/block";
import addBlockOperationFunc from "../../redux/operations/block/addBlock";
import updateBlockOperationFunc from "../../redux/operations/block/updateBlock";
import {
  addBlockOperationId,
  updateBlockOperationId,
} from "../../redux/operations/operationIds";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import { flattenErrorListWithDepthInfinite } from "../../utils/utils";
import getNewBlock from "../block/getNewBlock";
import useOperation from "../hooks/useOperation";
import EditOrgForm, { IEditOrgFormValues } from "./EditOrgForm";

const scopeId = "EditOrgFormContainer";

export interface IEditOrgFormContainerProps {
  onClose: () => void;

  block?: IBlock;
}

const EditOrgFormContainer: React.FC<IEditOrgFormContainerProps> = (props) => {
  const { onClose } = props;
  const user = useSelector(getSignedInUserRequired);
  const [block, setBlock] = React.useState<IBlock>(
    props.block || getNewBlock(user, "org")
  );

  const operationStatus = useOperation({
    scopeId: scopeId,
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
          scopeId: scopeId,
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
          scopeId: scopeId,
          resourceId: block.customId,
        }
      );
    }
  };

  return (
    <EditOrgForm
      formOnly={!props.block}
      org={props.block} // props.block not block, because it's used to determine if it's a new block or not
      value={block as any}
      onClose={onClose}
      onSubmit={onSubmit}
      isSubmitting={operationStatus.isLoading}
      errors={errors}
    />
  );
};

export default React.memo(EditOrgFormContainer);
