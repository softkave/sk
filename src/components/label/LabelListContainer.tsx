import React from "react";
import { useSelector } from "react-redux";
import { IBlock, IBlockLabel } from "../../models/block/block";
import { getBlock } from "../../redux/blocks/selectors";
import updateBlockOperationFunc from "../../redux/operations/block/updateBlock";
import { updateBlockOperationId } from "../../redux/operations/operationIds";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import { IAppState } from "../../redux/store";
import { flattenErrorListWithDepthInfinite } from "../../utils/utils";
import useOperation from "../hooks/useOperation";
import LabelList from "./LabelList";

const scopeId = "LabelListContainer";

export interface ILabelListContainerProps {
  block: IBlock;
}

const LabelListContainer: React.FC<ILabelListContainerProps> = (props) => {
  const { block } = props;
  const user = useSelector(getSignedInUserRequired);
  const org = useSelector<IAppState, IBlock>((state) => {
    if (block.type === "org") {
      return getBlock(state, block.customId)!;
    } else {
      return getBlock(state, block.rootBlockId)!;
    }
  });

  const labelList = org.availableLabels || [];
  const operationStatus = useOperation({
    scopeId: scopeId,
    operationId: updateBlockOperationId,
    resourceId: org.customId,
  });

  const errors = operationStatus.error
    ? flattenErrorListWithDepthInfinite(operationStatus.error)
    : undefined;

  if (errors && errors.data && errors.data.availableLabels) {
    errors.labelList = errors.data.availableLabels;
    delete errors.data;
  }

  const onSaveChanges = async (values: IBlockLabel[]) => {
    updateBlockOperationFunc(
      {
        block: org,
        data: {
          availableLabels: values.map((value) => ({
            ...value,
            updatedAt: Date.now(),
            updatedBy: user.customId,
          })),
        },
      },
      {
        scopeId: scopeId,
        resourceId: org.customId,
      }
    );
  };

  return (
    <LabelList
      user={user}
      labelList={labelList}
      saveChanges={onSaveChanges}
      isSubmitting={operationStatus.isLoading}
      errors={errors}
    />
  );
};

export default React.memo(LabelListContainer);
