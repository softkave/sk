import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { BlockType, IBlock } from "../../models/block/block";
import { IUser } from "../../models/user/user";
import BlockSelectors from "../../redux/blocks/selectors";
import { loadBlockChildrenOperationAction } from "../../redux/operations/block/loadBlockChildren";
import OperationType from "../../redux/operations/OperationType";
import { AppDispatch, IAppState } from "../../redux/types";
import UserSelectors from "../../redux/users/selectors";
import { newId } from "../../utils/utils";
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
  const dispatch: AppDispatch = useDispatch();
  const statuses = block.boardStatuses || [];
  const org = useSelector<IAppState, IBlock>((state) => {
    return BlockSelectors.getBlock(state, block.rootBlockId || block.customId)!;
  });

  const collaboratorIds = org.collaborators || [];
  const collaborators = useSelector<IAppState, IUser[]>((state) =>
    UserSelectors.getUsers(state, collaboratorIds)
  );

  const loadBlockChildren = (loadProps: IUseOperationStatus) => {
    const shouldLoad = !loadProps.operation;
    console.log({ loadProps, block });

    if (shouldLoad) {
      dispatch(
        loadBlockChildrenOperationAction({
          block,
          typeList: [BlockType.Task],
          opId: loadProps.opId,
        })
      );
    }
  };

  const opStat = useOperation(
    {
      resourceId: block.customId,
      type: OperationType.LoadBlockChildren,
    },
    loadBlockChildren,
    { deleteManagedOperationOnUnmount: false }
  );

  // TODO: how can we memoize previous filters to make search faster
  const blocks = useSelector<IAppState, IBlock[]>((state) => {
    if (!opStat.isCompleted) {
      return [];
    }

    const blockList: IBlock[] = [];
    Object.keys(state.blocks).forEach((id) => {
      const resource = state.blocks[id];

      if (
        resource.type === BlockType.Task &&
        resource.parent === block.customId
      ) {
        blockList.push(resource);
      }
    });

    return blockList;
  });

  const isLoadingChildren = opStat.isLoading || !!!opStat.operation;

  const shouldRenderLoading = () => {
    return isLoadingChildren;
  };

  const getLoadErrors = () => {
    const loadErrors: any[] = [];

    if (opStat && opStat.error) {
      loadErrors.push(opStat.error);
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
