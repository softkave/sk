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

const LoadBlockChildren: React.FC<ILoadBlockChildrenProps> = (props) => {
  const { parent, render, type } = props;
  const blocks = useSelector<IAppState, IBlock[]>((state) =>
    getBlockChildren(state, parent, type)
  );

  const loadChildren = (loadProps: IUseOperationStatus) => {
    if (!loadProps.operation) {
      loadBlockChildrenOperationFunc(
        {
          block: parent,
          typeList: [type],
        },
        { id: loadProps.id }
      );
    }
  };

  const op = useOperation({ id: parent.customId }, loadChildren);

  if (op.isCompleted) {
    return <React.Fragment>{render(blocks)}</React.Fragment>;
  }

  if (op.isLoading || !!!op.operation) {
    return <LoadingEllipsis />;
  } else if (op.error) {
    return <GeneralErrorList errors={op.error} />;
  }

  return <React.Fragment>{render(blocks)}</React.Fragment>;
};

export default React.memo(LoadBlockChildren);
