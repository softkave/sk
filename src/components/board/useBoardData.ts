import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { BlockType, IBlock } from "../../models/block/block";
import { INetError } from "../../net/types";
import { loadBoardDataOperationAction } from "../../redux/operations/block/loadBoardData";
import { IAppState } from "../../redux/types";
import { newId } from "../../utils/utils";
import useOperation, { IUseOperationStatus } from "../hooks/useOperation";

export interface IUseBoardDataResult {
  loading: boolean;
  errors?: INetError[];
}

export function useBoardData(block: IBlock): IUseBoardDataResult {
  const existingOpId = useSelector<IAppState, string | undefined>((state) => {
    return Object.keys(state.operations).find((id) => {
      const op = state.operations[id];

      return op.resourceId === block.customId;
    });
  });

  const [opId, setOpId] = React.useState(() => existingOpId || newId());
  const [blockId, setBlockId] = React.useState(block.customId);
  const dispatch = useDispatch();
  const loadStatus = useOperation(
    { id: opId },
    (loadProps: IUseOperationStatus) => {
      if (block.type === BlockType.Org && !loadProps.operation) {
        dispatch(loadBoardDataOperationAction({ block, opId: loadProps.opId }));
      }
    }
  );

  React.useEffect(() => {
    if (block.customId !== blockId) {
      setBlockId(block.customId);
      setOpId(newId());
    }
  });

  return {
    loading:
      block.customId !== blockId ||
      (block.type === BlockType.Org
        ? loadStatus.isLoading || !loadStatus.operation
        : false),
    errors: loadStatus.error,
  };
}
