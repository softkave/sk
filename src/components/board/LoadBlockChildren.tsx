import React from "react";
import { useSelector } from "react-redux";
import { BlockType, IBlock } from "../../models/block/block";
import { getBlockChildren } from "../../redux/blocks/selectors";
import loadBlockChildrenOperationFunc from "../../redux/operations/block/loadBlockChildren";
import { IAppState } from "../../redux/store";
import GeneralErrorList from "../GeneralErrorList";
import useOperation, { IUseOperationStatus } from "../hooks/useOperation";
import LoadingEllipsis from "../utilities/LoadingEllipsis";

export interface ILoadBlockChildrenProps {
  parent: IBlock;
  type: BlockType;
  render: (blocks: IBlock[]) => React.ReactNode;
}

const baseOpId = "load-block-children";

const LoadBlockChildren: React.FC<ILoadBlockChildrenProps> = (props) => {
  const { parent, render, type } = props;
  const blocks = useSelector<IAppState, IBlock[]>((state) =>
    getBlockChildren(state, parent, type)
  );

  const opId = baseOpId + "-" + type;
  const loadChildren = (loadProps: IUseOperationStatus) => {
    if (!loadProps.operation) {
      loadBlockChildrenOperationFunc({
        block: parent,
        typeList: [type],
        operationId: opId,
      });
    }
  };

  const loadStatus = useOperation(
    { operationId: opId, resourceId: parent.customId },
    loadChildren
  );

  if (loadStatus.isCompleted) {
    return <React.Fragment>{render(blocks)}</React.Fragment>;
  }

  if (loadStatus.isLoading || !!!loadStatus.operation) {
    return <LoadingEllipsis />;
  } else if (loadStatus.error) {
    return <GeneralErrorList errors={loadStatus.error} />;
  }

  return <React.Fragment>{render(blocks)}</React.Fragment>;
};

export default React.memo(LoadBlockChildren);
