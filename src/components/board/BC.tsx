import React from "react";
import { useSelector } from "react-redux";
import { IBlock } from "../../models/block/block";
import { getBlocksAsArray } from "../../redux/blocks/selectors";
import loadBlockChildrenOperationFunc from "../../redux/operations/block/loadBlockChildren";
import { getBlockChildrenOperationID } from "../../redux/operations/operationIDs";
import { IReduxState } from "../../redux/store";
import B, { IBBasket } from "../board/B";
import ColumnWithTitleAndCount from "../board/ColumnWithTitleAndCount";
import GeneralError from "../GeneralError";
import useOperation, { IUseOperationStatus } from "../hooks/useOperation";
import Loading from "../Loading";

export interface IBlockChildrenProps {
  parent: IBlock;
  getChildrenIDs: () => string[];
  renderChildren: (blocks: IBlock[]) => React.ReactNode;
}

const BlockChildren: React.FC<IBlockChildrenProps> = props => {
  const { parent, renderChildren, getChildrenIDs } = props;
  const blockIDs = getChildrenIDs();
  const blocks = useSelector<IReduxState, IBlock[]>(state =>
    getBlocksAsArray(state, blockIDs)
  );

  const loadParentChildren = (loadProps: IUseOperationStatus) => {
    if (!!!loadProps.operation) {
      loadBlockChildrenOperationFunc({ block: parent });
    }
  };

  const renderBasket = (basket: IBBasket) => {
    return (
      <ColumnWithTitleAndCount
        title={parent.name}
        count={blocks.length}
        body={renderChildren(basket.blocks)}
      />
    );
  };

  const loadParentChildrenStatus = useOperation(
    { operationID: getBlockChildrenOperationID, resourceID: parent.customId },
    loadParentChildren
  );

  if (
    loadParentChildrenStatus.isLoading ||
    !!!loadParentChildrenStatus.operation
  ) {
    return <Loading />;
  } else if (loadParentChildrenStatus.error) {
    return <GeneralError error={loadParentChildrenStatus.error} />;
  }

  return (
    <B
      blocks={blocks}
      getBaskets={() => [{ key: "tasks", blocks }]}
      renderBasket={renderBasket}
    />
  );
};

export default BlockChildren;
