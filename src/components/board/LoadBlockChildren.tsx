import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { BlockType, IBlock } from "../../models/block/block";
import BlockSelectors from "../../redux/blocks/selectors";
import { loadBlockChildrenOperationAction } from "../../redux/operations/block/loadBlockChildren";
import { AppDispatch, IAppState } from "../../redux/types";
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
  const dispatch: AppDispatch = useDispatch();
  const blocks = useSelector<IAppState, IBlock[]>((state) =>
    BlockSelectors.getBlockChildren(state, parent, type)
  );

  const loadChildren = (loadProps: IUseOperationStatus) => {
    if (!loadProps.operation) {
      dispatch(
        loadBlockChildrenOperationAction({
          block: parent,
          typeList: [type],
          opId: parent.customId,
        })
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
