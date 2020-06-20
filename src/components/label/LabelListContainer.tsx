import React from "react";
import { useSelector } from "react-redux";
import { IBlock, IBlockLabel } from "../../models/block/block";
import { getBlock } from "../../redux/blocks/selectors";
import updateBlockOperationFunc from "../../redux/operations/block/updateBlock";
import { OperationIds.updateBlock } from "../../redux/operations/opc";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import { IAppState } from "../../redux/store";
import {
  flattenErrorListWithDepthInfinite,
  getDateString,
} from "../../utils/utils";
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

  const labelList = org.boardLabels || [];
  const operationStatus = useOperation({
    scopeId,
    operationId: OperationIds.updateBlock,
    resourceId: org.customId,
  });

  const errors = operationStatus.error
    ? flattenErrorListWithDepthInfinite(operationStatus.error)
    : undefined;

  if (errors && errors.data && errors.data.boardLabels) {
    errors.labelList = errors.data.boardLabels;
    delete errors.data;
  }

  const onSaveChanges = async (values: IBlockLabel[]) => {
    updateBlockOperationFunc(
      {
        block: org,
        data: {
          // TODO: find a better way to only update the ones that changed
          boardLabels: values.map((value) => ({
            ...value,
            updatedAt: getDateString(),
            updatedBy: user.customId,
          })),
        },
      },
      {
        scopeId,
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
