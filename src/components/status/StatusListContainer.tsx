import React from "react";
import { useSelector } from "react-redux";
import { IBlock, IBlockStatus } from "../../models/block/block";
import { getBlock } from "../../redux/blocks/selectors";
import updateBlockOperationFunc from "../../redux/operations/block/updateBlock";
import { updateBlockOperationId } from "../../redux/operations/operationIDs";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import { IAppState } from "../../redux/store";
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
  const org = useSelector<IAppState, IBlock>((state) => {
    if (block.type === "org") {
      return getBlock(state, block.customId)!;
    } else {
      return getBlock(state, block.rootBlockId)!;
    }
  });

  const statusList = org.boardStatuses || [];
  const operationStatus = useOperation({
    scopeId,
    operationId: updateBlockOperationId,
    resourceId: org.customId,
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
        block: org,
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
