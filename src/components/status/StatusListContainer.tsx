import React from "react";
import { useSelector } from "react-redux";
import { IBlock, IBlockStatus } from "../../models/block/block";
import updateBlockOperationFunc from "../../redux/operations/block/updateBlock";
import { updateBlockOperationId } from "../../redux/operations/operationIDs";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import {
  flattenErrorListWithDepthInfinite,
  getDateString,
} from "../../utils/utils";
import useOperation from "../hooks/useOperation";
import StatusList from "./StatusList";

const scopeId = "StatusListContainer";

export interface IStatusListContainerProps {
  block: IBlock;
}

const StatusListContainer: React.FC<IStatusListContainerProps> = (props) => {
  const { block } = props;
  const user = useSelector(getSignedInUserRequired);
  const statusList = block.boardStatuses || [];
  const operationStatus = useOperation({
    scopeId,
    operationId: updateBlockOperationId,
    resourceId: block.customId,
  });

  const errors = operationStatus.error
    ? flattenErrorListWithDepthInfinite(operationStatus.error)
    : undefined;

  if (errors && errors.data && errors.data.boardStatuses) {
    errors.statusList = errors.data.boardStatuses;
    delete errors.data;
  }

  const onSaveChanges = async (values: IBlockStatus[]) => {
    updateBlockOperationFunc(
      {
        block,
        data: {
          // TODO: find a better way to only update the ones that changed
          boardStatuses: values.map((value) => ({
            ...value,
            updatedAt: getDateString(),
            updatedBy: user.customId,
          })),
        },
      },
      {
        scopeId,
        resourceId: block.customId,
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
