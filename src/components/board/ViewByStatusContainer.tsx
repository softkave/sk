import React from "react";
import { useSelector } from "react-redux";
import { BlockType, IBlock } from "../../models/block/block";
import { IUser } from "../../models/user/user";
import { getBlock } from "../../redux/blocks/selectors";
import loadBlockChildrenOperationFunc from "../../redux/operations/block/loadBlockChildren";
import { IAppState } from "../../redux/store";
import { getUsersAsArray } from "../../redux/users/selectors";
import GeneralErrorList from "../GeneralErrorList";
import useOperation, { IUseOperationStatus } from "../hooks/useOperation";
import LoadingEllipsis from "../utilities/LoadingEllipsis";
import ViewByStatus from "./ViewByStatus";

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
  const org = useSelector<IAppState, IBlock>((state) => {
    return getBlock(state, block.rootBlockId || block.customId)!;
  });

  const collaboratorIds = org.collaborators || [];
  const collaborators = useSelector<IAppState, IUser[]>((state) =>
    getUsersAsArray(state, collaboratorIds)
  );

  const loadBlockChildren = (loadProps: IUseOperationStatus) => {
    const shouldLoad = !loadProps.operation;

    if (shouldLoad) {
      loadBlockChildrenOperationFunc(
        {
          block,
          typeList: [BlockType.Task],
        },
        { id: loadProps.id }
      );
    }
  };

  const loadChildrenStatus = useOperation(
    {
      id: block.customId,
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
        orgUsers={collaborators}
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
