import React from "react";
import { useSelector } from "react-redux";
import { IBlock } from "../../models/block/block";
import { getBlocksAsArray } from "../../redux/blocks/selectors";
import loadBlockChildrenOperationFunc from "../../redux/operations/block/loadBlockChildren";
import { getBlockChildrenOperationID } from "../../redux/operations/operationIDs";
import { IReduxState } from "../../redux/store";
import GeneralErrorList from "../GeneralErrorList";
import useOperation, { IUseOperationStatus } from "../hooks/useOperation";
import LoadingEllipsis from "../utilities/LoadingEllipsis";

export interface IBoardBlockChildrenProps {
  parent: IBlock;
  getChildrenIDs: () => string[];
  render: (blocks: IBlock[]) => React.ReactNode;
}

const BoardBlockChildren: React.FC<IBoardBlockChildrenProps> = props => {
  const { parent, render, getChildrenIDs } = props;
  const blockIDs = getChildrenIDs();
  const blocks = useSelector<IReduxState, IBlock[]>(state =>
    getBlocksAsArray(state, blockIDs)
  );

  const loadParentChildren = (loadProps: IUseOperationStatus) => {
    if (!!!loadProps.operation) {
      loadBlockChildrenOperationFunc({ block: parent });
    }
  };

  const loadParentChildrenStatus = useOperation(
    { operationID: getBlockChildrenOperationID, resourceID: parent.customId },
    loadParentChildren
  );

  if (
    loadParentChildrenStatus.isLoading ||
    !!!loadParentChildrenStatus.operation
  ) {
    return <LoadingEllipsis />;
  } else if (loadParentChildrenStatus.error) {
    return <GeneralErrorList errors={loadParentChildrenStatus.error} />;
  }

  return <React.Fragment>{render(blocks)}</React.Fragment>;
};

export default BoardBlockChildren;
