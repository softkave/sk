import { unwrapResult } from "@reduxjs/toolkit";
import { message } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { BlockType, IBlock } from "../../models/block/block";
import OperationActions from "../../redux/operations/actions";
import { addBlockOperationAction } from "../../redux/operations/block/addBlock";
import { updateBlockOperationAction } from "../../redux/operations/block/updateBlock";
import SessionSelectors from "../../redux/session/selectors";
import { AppDispatch } from "../../redux/types";
import { flattenErrorListWithDepthInfinite } from "../../utils/utils";
import getNewBlock from "../block/getNewBlock";
import useBlockPossibleParents from "../hooks/useBlockPossibleParents";
import useOperation, { getOperationStats } from "../hooks/useOperation";
import BoardForm, { IBoardFormValues } from "./BoardForm";

const scopeId = "BoardFormContainer";

export interface IBoardFormContainerProps {
  orgId: string;
  onClose: () => void;

  parentBlock?: IBlock;
  block?: IBlock;
}

const BoardFormContainer: React.FC<IBoardFormContainerProps> = (props) => {
  const { onClose, parentBlock } = props;
  const dispatch: AppDispatch = useDispatch();
  const history = useHistory();
  const user = useSelector(SessionSelectors.getSignedInUserRequired);

  const [block, setBlock] = React.useState<IBlock>(
    props.block || getNewBlock(user, BlockType.Board, parentBlock)
  );

  const possibleParents = useBlockPossibleParents(block);
  const operationStatus = useOperation();
  const errors = operationStatus.error
    ? flattenErrorListWithDepthInfinite(operationStatus.error)
    : undefined;

  const onSubmit = async (values: IBoardFormValues) => {
    const data = { ...block, ...values };
    setBlock(data);

    const result = props.block
      ? await dispatch(
          updateBlockOperationAction({
            block,
            data,
            opId: operationStatus.opId,
          })
        )
      : await dispatch(
          addBlockOperationAction({ block, opId: operationStatus.opId })
        );
    const op = unwrapResult(result);

    if (!op) {
      return;
    }

    const opStat = getOperationStats(op);

    if (!props.block) {
      if (opStat.isCompleted) {
        message.success("Board created successfully");
        history.push(`/app/organizations/${data.parent}/${data.customId}`);
      } else if (opStat.isError) {
        message.error("Error creating board");
      }
    } else {
      if (opStat.isCompleted) {
        message.success("Board updated successfully");
        onClose();
      } else if (opStat.isError) {
        message.error("Error updating board");
      }
    }
  };

  return (
    <BoardForm
      value={block as any}
      onClose={onClose}
      formOnly={!props.block}
      board={props.block}
      onSubmit={onSubmit}
      isSubmitting={operationStatus.isLoading}
      errors={errors}
      possibleParents={possibleParents}
    />
  );
};

export default React.memo(BoardFormContainer);
