import React from "react";
import { useSelector } from "react-redux";
import { IBlock } from "../../models/block/block";
import loadBlockChildrenOperationFunc from "../../redux/operations/block/loadBlockChildren";
import { operationHasStatusWithScopeID } from "../../redux/operations/operation";
import { getBlockChildrenOperationID } from "../../redux/operations/operationIDs";
import { IReduxState } from "../../redux/store";
import GeneralErrorList from "../GeneralErrorList";
import useOperation, { IUseOperationStatus } from "../hooks/useOperation";
import LoadingEllipsis from "../utilities/LoadingEllipsis";
import ViewByStatus from "./ViewByStatus";

const scopeID = "status-container";

export interface IViewByStatusContainerProps {
  block: IBlock;
  onClickUpdateBlock: (block: IBlock) => void;

  style?: React.CSSProperties;
}

export type OnClickBlock = (block: IBlock[]) => void;

const ViewByStatusContainer: React.FC<IViewByStatusContainerProps> = (
  props
) => {
  const { block, onClickUpdateBlock, style } = props;

  const loadBlockChildren = (loadProps: IUseOperationStatus) => {
    const operation = loadProps.operation;
    const shouldLoad = !operationHasStatusWithScopeID(operation, scopeID);

    if (shouldLoad) {
      loadBlockChildrenOperationFunc(
        {
          block,
          useBoardId: true,
          typeList: ["task"],
        },
        { scopeID, resourceID: block.customId }
      );
    }
  };

  const loadChildrenStatus = useOperation(
    {
      scopeID,
      operationID: getBlockChildrenOperationID,
      resourceID: block.customId,
    },
    loadBlockChildren
  );

  // TODO: how can we memoize previous filters to make search faster
  const blocks = useSelector<IReduxState, IBlock[]>((state) => {
    if (!loadChildrenStatus.isCompleted) {
      return [];
    }

    const blockList: IBlock[] = [];
    Object.keys(state.blocks).forEach((id) => {
      const resource = state.blocks[id];

      if (
        resource.resource.type === "task" &&
        resource.resource.boardId === block.customId
      ) {
        blockList.push(resource.resource);
      }
    });

    return blockList;
  });

  const isLoadingChildren =
    loadChildrenStatus.isLoading || !!!loadChildrenStatus.operation;

  const shouldRenderLoading = () => {
    return isLoadingChildren;
  };

  const getLoadErrors = () => {
    const loadErrors: any[] = [];

    if (loadChildrenStatus && loadChildrenStatus.error) {
      loadErrors.push(loadChildrenStatus.error);
    }

    return loadErrors;
  };

  const render = () => {
    const showLoading = shouldRenderLoading();
    const loadErrors = getLoadErrors();

    if (showLoading) {
      return <LoadingEllipsis />;
    } else if (loadErrors.length > 0) {
      return <GeneralErrorList fill errors={loadErrors} />;
    }

    return (
      <ViewByStatus
        block={block}
        onClickUpdateBlock={onClickUpdateBlock}
        blocks={blocks}
        style={style}
      />
    );
  };

  return render();
};

export default React.memo(ViewByStatusContainer);
