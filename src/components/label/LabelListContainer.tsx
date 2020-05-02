import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { IBlock, IBlockLabel } from "../../models/block/block";
import { getBlock } from "../../redux/blocks/selectors";
import updateBlockOperationFunc from "../../redux/operations/block/updateBlock";
import { updateBlockOperationID } from "../../redux/operations/operationIDs";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import { IReduxState } from "../../redux/store";
import useOperation from "../hooks/useOperation";
import LabelList from "./LabelList";

const scopeID = "LabelListContainer";

export interface ILabelListContainerProps {
  block: IBlock;
}

const LabelListContainer: React.FC<ILabelListContainerProps> = (props) => {
  const { block } = props;
  const dispatch = useDispatch();
  const user = useSelector(getSignedInUserRequired);
  const org = useSelector<IReduxState, IBlock>((state) => {
    if (block.type === "org") {
      return getBlock(state, block.customId)!;
    } else {
      return getBlock(state, block.rootBlockID)!;
    }
  });

  const labelList = org.availableLabels || [];
  const operationStatus = useOperation({
    scopeID,
    operationID: updateBlockOperationID,
    resourceID: org.customId,
  });

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
        scopeID,
        resourceID: org.customId,
      }
    );
  };

  return (
    <LabelList
      user={user}
      labelList={labelList}
      saveChanges={onSaveChanges}
      isSubmitting={operationStatus.isLoading}
      errors={operationStatus.error}
    />
  );
};

export default React.memo(LabelListContainer);
