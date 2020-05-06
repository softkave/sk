import React from "react";
import { useSelector } from "react-redux";
import { IBlock, IBlockStatus } from "../../models/block/block";
import { getBlock } from "../../redux/blocks/selectors";
import updateBlockOperationFunc from "../../redux/operations/block/updateBlock";
import { updateBlockOperationID } from "../../redux/operations/operationIDs";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import { IReduxState } from "../../redux/store";
import { flattenErrorListWithDepthInfinite } from "../../utils/utils";
import useOperation from "../hooks/useOperation";
import StatusList from "./StatusList";

const scopeID = "StatusListContainer";

export interface IStatusListContainerProps {
  block: IBlock;
}

const StatusListContainer: React.FC<IStatusListContainerProps> = (props) => {
  const { block } = props;
  const user = useSelector(getSignedInUserRequired);
  const org = useSelector<IReduxState, IBlock>((state) => {
    if (block.type === "org") {
      return getBlock(state, block.customId)!;
    } else {
      return getBlock(state, block.rootBlockID)!;
    }
  });

  const statusList = org.availableStatus || [];
  const operationStatus = useOperation({
    scopeID,
    operationID: updateBlockOperationID,
    resourceID: org.customId,
  });

  const errors = operationStatus.error
    ? flattenErrorListWithDepthInfinite(operationStatus.error).block
    : undefined;

  if (errors && errors.block && errors.block.availableStatus) {
    errors.availableStatus = errors.block.availableStatus;
  }

  const onSaveChanges = async (values: IBlockStatus[]) => {
    updateBlockOperationFunc(
      {
        block: org,
        data: {
          // TODO: find a better way to only update the ones that changed
          availableStatus: values.map((value) => ({
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

  console.log({ operationStatus });

  return (
    <StatusList
      // isSubmitting
      user={user}
      statusList={statusList}
      saveChanges={onSaveChanges}
      isSubmitting={operationStatus.isLoading}
      errors={errors}
    />
  );
};

export default React.memo(StatusListContainer);
