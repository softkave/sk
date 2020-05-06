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
import ProjectForm, { IProjectFormValues } from "./ProjectForm";

const scopeID = "ProjectFormContainer";

export interface IProjectFormContainerProps {
  orgID: string;
  onClose: () => void;

  parentBlock?: IBlock;
  block?: IBlock;
  submitLabel?: React.ReactNode;
}

const ProjectFormContainer: React.FC<IProjectFormContainerProps> = (props) => {
  const { onClose, submitLabel, parentBlock } = props;
  const user = useSelector(getSignedInUserRequired);

  const [block, setBlock] = React.useState<IBlock>(
    props.block || getNewBlock(user, "project", parentBlock)
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

  const onSubmit = async (values: IProjectFormValues) => {
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
    <ProjectForm
      value={block as any}
      onClose={onClose}
      submitLabel={submitLabel}
      onSubmit={onSubmit}
      isSubmitting={operationStatus.isLoading}
      errors={errors}
      possibleParents={possibleParents}
    />
  );
};

export default React.memo(ProjectFormContainer);
