import React from "react";
import { useSelector } from "react-redux";
import { BlockType, IBlock } from "../../models/block/block";
import { getBlock } from "../../redux/blocks/selectors";
import loadBlockChildrenOperationFunc from "../../redux/operations/block/loadBlockChildren";
import { operationHasStatusWithScopeId } from "../../redux/operations/operation";
import { IAppState } from "../../redux/store";
import GeneralErrorList from "../GeneralErrorList";
import useOperation, { IUseOperationStatus } from "../hooks/useOperation";
import LoadingEllipsis from "../utilities/LoadingEllipsis";
import ViewByStatus from "./ViewByStatus";

const scopeId = "status-container";
const opId = "view-by-status";

export interface IViewByStatusContainerProps {
  block: IBlock;
  onClickUpdateBlock: (block: IBlock) => void;

  style?: React.CSSProperties;
}

const ViewByStatusContainer: React.FC<IViewByStatusContainerProps> = (
  props
) => {
  const { block, onClickUpdateBlock, style } = props;
  const statuses = block.boardStatuses || [];

  const loadBlockChildren = (loadProps: IUseOperationStatus) => {
    const operation = loadProps.operation;
    const shouldLoad = !operationHasStatusWithScopeId(operation, scopeId);

    if (shouldLoad) {
      loadBlockChildrenOperationFunc(
        {
          block,
          typeList: [BlockType.Task],
          operationId: opId,
        },
        { scopeId, resourceId: block.customId }
      );
    }
  };

  const loadChildrenStatus = useOperation(
    {
      scopeId,
      operationId: opId,
      resourceId: block.customId,
    },
    loadBlockChildren
  );

  // TODO: how can we memoize previous filters to make search faster
  const blocks = useSelector<IAppState, IBlock[]>((state) => {
    if (!loadChildrenStatus.isCompleted) {
      return [];
    }

    const blockList: IBlock[] = [];
    Object.keys(state.blocks).forEach((id) => {
      const resource = state.blocks[id];

      if (
        resource.resource.type === "task" &&
        resource.resource.parent === block.customId
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
        statuses={statuses}
        onClickUpdateBlock={onClickUpdateBlock}
        blocks={blocks}
        style={style}
      />
    );
  };

  return render();
};

export default React.memo(ViewByStatusContainer);
