import React from "react";
import { useSelector } from "react-redux";
import { IBlock, IBlockStatus } from "../../models/block/block";
import { getBlock } from "../../redux/blocks/selectors";
import updateBlockOperationFunc from "../../redux/operations/block/updateBlock";
import { updateBlockOperationId } from "../../redux/operations/operationIds";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import { IAppState } from "../../redux/store";
import { flattenErrorListWithDepthInfinite } from "../../utils/utils";
import useOperation from "../hooks/useOperation";
import StatusList from "./StatusList";

const scopeId = "StatusListContainer";

export interface IStatusListContainerProps {
  block: IBlock;
}

const StatusListContainer: React.FC<IStatusListContainerProps> = (props) => {
  const { block } = props;
  const user = useSelector(getSignedInUserRequired);
  const org = useSelector<IAppState, IBlock>((state) => {
    if (block.type === "org") {
      return getBlock(state, block.customId)!;
    } else {
      return getBlock(state, block.rootBlockId)!;
    }
  });

  const statusList = org.availableStatus || [];
  const operationStatus = useOperation({
    scopeId: scopeId,
    operationId: updateBlockOperationId,
    resourceId: org.customId,
  });

  const errors = operationStatus.error
    ? flattenErrorListWithDepthInfinite(operationStatus.error)
    : undefined;

  if (errors && errors.data && errors.data.availableStatus) {
    errors.statusList = errors.data.availableStatus;
    delete errors.data;
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
        scopeId: scopeId,
        resourceId: org.customId,
      }
    );
  };

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
