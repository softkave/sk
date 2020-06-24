import { useDispatch } from "react-redux";
import { BlockType, IBlock } from "../../models/block/block";
import { INetError } from "../../net/types";
import { loadBoardDataOperationAction } from "../../redux/operations/block/loadBoardData";
import useOperation, { IUseOperationStatus } from "../hooks/useOperation";

export interface IUseBoardDataResult {
  loading: boolean;
  errors?: INetError[];
}

export function useBoardData(block: IBlock): IUseBoardDataResult {
  const dispatch = useDispatch();
  const loadStatus = useOperation(
    { id: block.customId },
    (loadProps: IUseOperationStatus) => {
      if (block.type === BlockType.Org && !loadProps.operation) {
        dispatch(loadBoardDataOperationAction({ block, opId: loadProps.opId }));
      }
    }
  );

  return {
    loading:
      block.type === BlockType.Org
        ? loadStatus.isLoading || !loadStatus.operation
        : false,
    errors: loadStatus.error,
  };
}
