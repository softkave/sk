import React from "react";
import { useSelector } from "react-redux";
import { BlockType, IBlock } from "../../models/block/block";
import addBlockOperationFunc from "../../redux/operations/block/addBlock";
import updateBlockOperationFunc from "../../redux/operations/block/updateBlock";
import {
  addBlockOperationId,
  updateBlockOperationId,
} from "../../redux/operations/operationIDs";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import { flattenErrorListWithDepthInfinite } from "../../utils/utils";
import getNewBlock from "../block/getNewBlock";
import useBlockPossibleParents from "../hooks/useBlockPossibleParents";
import useOperation from "../hooks/useOperation";
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
  const user = useSelector(getSignedInUserRequired);

  const [block, setBlock] = React.useState<IBlock>(
    props.block || getNewBlock(user, BlockType.Board, parentBlock)
  );

  const possibleParents = useBlockPossibleParents(block);

  const operationStatus = useOperation({
    scopeId,
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

  const onSubmit = async (values: IBoardFormValues) => {
    const data = { ...block, ...values };
    setBlock(data);

    if (props.block) {
      updateBlockOperationFunc(
        {
          block,
          data,
        },
        {
          scopeId,
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
          scopeId,
          resourceId: block.customId,
        }
      );
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
