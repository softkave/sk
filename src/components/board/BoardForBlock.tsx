import { message, Modal } from "antd";
import path from "path";
import React from "react";
import {
  DragDropContext,
  DropResult,
  ResponderProvided,
} from "react-beautiful-dnd";
import { useStore } from "react-redux";
import { useHistory, useRouteMatch } from "react-router";
import { BlockGroupContext, BlockType, IBlock } from "../../models/block/block";
import { getBlockTypeFullName } from "../../models/block/utils";
import { getBlock } from "../../redux/blocks/selectors";
import deleteBlockOperationFunc from "../../redux/operations/block/deleteBlock";
import getBlockLandingPageOperationFunc from "../../redux/operations/block/getBlockLandingPage";
import loadBlockChildrenOperationFunc from "../../redux/operations/block/loadBlockChildren";
import loadBlockCollaborationRequestsOperationFunc from "../../redux/operations/block/loadBlockCollaborationRequests";
import loadBlockCollaboratorsOperationFunc from "../../redux/operations/block/loadBlockCollaborators";
import transferBlockOperationFn from "../../redux/operations/block/transferBlock";
import updateBlockOperationFunc from "../../redux/operations/block/updateBlock";
import {
  getBlockChildrenOperationID,
  getBlockCollaborationRequestsOperationID,
  getBlockCollaboratorsOperationID,
  getBlockLandingPageOperationID,
} from "../../redux/operations/operationIDs";
import { IReduxState } from "../../redux/store";
import { pluralize } from "../../utils/utils";
import GeneralErrorList from "../GeneralErrorList";
import useBlockParents from "../hooks/useBlockParent";
import useOperation, { IUseOperationStatus } from "../hooks/useOperation";
import RenderForDevice from "../RenderForDevice";
import LoadingEllipsis from "../utilities/LoadingEllipsis";
import BoardForBlockContainer from "./BoardForBlockContainer";
import BlockForms, { BlockFormType } from "./BoardForms";
import BoardHomeForBlock from "./BoardHomeForBlock";
import BoardBlockChildren from "./LoadBlockChildren";
import { IBlockPathMatch } from "./types";
import { getBlockLandingPage, getDefaultBoardViewType } from "./utils";

interface IBlockFormState {
  formType: BlockFormType;
  orgID: string;
  blockType?: BlockType;
  parentBlock?: IBlock;
  block?: IBlock;
}

export interface IBoardForBlockProps {
  block: IBlock;
}

export type OnClickBlock = (block: IBlock[]) => void;

// TODO: should forms have their own routes?
// TODO: should form labels be bold?

const BoardForBlock: React.FC<IBoardForBlockProps> = (props) => {
  const { block } = props;
  const history = useHistory();
  const store = useStore<IReduxState>();
  const [blockForm, setBlockForm] = React.useState<IBlockFormState | null>(
    null
  );

  const getPath = (b: IBlock) => {
    const bTypeFullName = getBlockTypeFullName(b.type);
    return `/${pluralize(bTypeFullName)}/${b.customId}`;
  };

  const parents = useBlockParents(block);
  const parentPath = `/app${parents.map(getPath).join("")}`;

  // TODO: we need to rebuild the path when the user transfers the block
  const blockPath = `${parentPath}${getPath(block)}`;
  const childGroupMatch = useRouteMatch<IBlockPathMatch>(
    `${blockPath}/groups/:blockID`
  );

  const childProjectMatch = useRouteMatch<IBlockPathMatch>(
    `${blockPath}/projects/:blockID`
  );

  const loadOrgCollaborators = (loadProps: IUseOperationStatus) => {
    if (!!!loadProps.operation) {
      loadBlockCollaboratorsOperationFunc({ block });
    }
  };

  const loadOrgCollaborationRequests = (loadProps: IUseOperationStatus) => {
    if (!!!loadProps.operation) {
      loadBlockCollaborationRequestsOperationFunc({ block });
    }
  };

  const hasCollaborators = block.type === "org";
  const loadCollaboratorsStatus = useOperation(
    {
      operationID: getBlockCollaboratorsOperationID,
      resourceID: block.customId,
    },
    hasCollaborators && loadOrgCollaborators
  );

  const isLoadingCollaborators =
    hasCollaborators &&
    (loadCollaboratorsStatus.isLoading || !!!loadCollaboratorsStatus.operation);

  const hasRequests = block.type === "org";
  const loadRequestsStatus = useOperation(
    {
      operationID: getBlockCollaborationRequestsOperationID,
      resourceID: block.customId,
    },
    hasRequests && loadOrgCollaborationRequests
  );

  const isLoadingRequests =
    hasRequests &&
    (loadRequestsStatus.isLoading || !!!loadRequestsStatus.operation);

  const loadBlockChildren = (loadProps: IUseOperationStatus) => {
    if (!!!loadProps.operation) {
      loadBlockChildrenOperationFunc({ block, updateParentInStore: true });
    }
  };

  const loadChildrenStatus = useOperation(
    {
      operationID: getBlockChildrenOperationID,
      resourceID: block.customId,
    },
    loadBlockChildren
  );

  const isLoadingChildren =
    loadChildrenStatus.isLoading || !!!loadChildrenStatus.operation;

  const pushRoute = (route) => {
    const search = new URLSearchParams(window.location.search);
    const routeURL = new URL(
      `${window.location.protocol}${window.location.host}${route}`
    );

    search.forEach((value, key) => {
      routeURL.searchParams.set(key, value);
    });

    const url = `${routeURL.pathname}${routeURL.search}`;
    history.push(url);
  };

  const onClickBlock = (blocks: IBlock[]) => {
    const clickedBlock = blocks[blocks.length - 1];
    const bt = getDefaultBoardViewType(clickedBlock);
    const nextPath = path.normalize(
      blockPath +
        "/" +
        blocks.map((b) => getPath(b)).join("") +
        `/tasks?bt=${bt}`
    );

    pushRoute(nextPath);
  };

  const onNavigate = (route: string) => {
    pushRoute(path.normalize(blockPath + route));
  };

  const onDeleteBlock = (blockToDelete: IBlock) => {
    deleteBlockOperationFunc({ block });

    // TODO: wait for block to complete deleting before pushing
    if (blockToDelete.customId === block.customId) {
      pushRoute(parentPath);
    }
  };

  const resetBlockForm = () => {
    // TODO: prompt the user if she has unsaved changes
    setBlockForm(null);
  };

  const promptConfirmDelete = (blockToDelete: IBlock) => {
    const blockToDeleteFullType = getBlockTypeFullName(blockToDelete.type);
    const onDeletePromptMessage = (
      <div>Are you sure you want to delete this {blockToDeleteFullType}?</div>
    );

    Modal.confirm({
      title: onDeletePromptMessage,
      okText: "Yes",
      cancelText: "No",
      okType: "primary",
      okButtonProps: { danger: true },
      onOk() {
        onDeleteBlock(blockToDelete);
      },
      onCancel() {
        // do nothing
      },
    });
  };

  const renderForms = () => {
    if (blockForm) {
      return (
        <BlockForms
          orgID={block.rootBlockID || block.customId}
          blockType={blockForm.blockType}
          block={blockForm.block}
          formType={blockForm.formType}
          onClose={resetBlockForm}
          parentBlock={blockForm.parentBlock}
        />
      );
    }

    return null;
  };

  const shouldRenderLoading = () => {
    return isLoadingCollaborators || isLoadingRequests || isLoadingChildren;
  };

  const getLoadErrors = () => {
    const loadErrors: any[] = [];

    if (loadCollaboratorsStatus && loadCollaboratorsStatus.error) {
      loadErrors.push(loadCollaboratorsStatus.error);
    }

    if (loadRequestsStatus && loadRequestsStatus.error) {
      loadErrors.push(loadRequestsStatus.error);
    }

    if (loadChildrenStatus && loadChildrenStatus.error) {
      loadErrors.push(loadChildrenStatus.error);
    }

    return loadErrors;
  };

  const renderChild = () => {
    let childID: string | null = null;
    let message: string = "";
    let getChildrenIDsFunc: () => string[] = () => [];

    if (childGroupMatch) {
      childID = childGroupMatch.params.blockID;
      message = "Group not found.";
      getChildrenIDsFunc = () => block.groups || [];
    } else if (childProjectMatch) {
      childID = childProjectMatch.params.blockID;
      message = "Project not found.";
      getChildrenIDsFunc = () => block.projects || [];
    }

    if (childID === null) {
      return null;
    }

    return (
      <BoardBlockChildren
        parent={block}
        getChildrenIDs={getChildrenIDsFunc}
        render={() => (
          <BoardForBlockContainer
            blockID={childID!}
            notFoundMessage={message}
          />
        )}
      />
    );
  };

  const dndColumnWarning = () => {
    message.warn("Drag and drop is not supported within a column");
  };

  const handleGroupRelatedDrag = React.useCallback(
    (result: DropResult, provided: ResponderProvided) => {
      if (!result.destination) {
        return;
      }

      // did not move out of group - can bail early
      if (result.source.droppableId === result.destination.droppableId) {
        if (result.source.index !== result.destination.index) {
          dndColumnWarning();
        }

        return;
      }

      let dropPosition: number = result.destination?.index;
      const sourceBlockID = result.source.droppableId;
      const draggedBlockID = result.draggableId;

      // TODO: volatile, blocks are possibly null OR undefined
      const sourceBlock = getBlock(store.getState(), sourceBlockID)!;
      const draggedBlock = getBlock(store.getState(), draggedBlockID)!;

      if (draggedBlock.type === "org" || draggedBlock.type === "project") {
        return;
      }

      const groupContext =
        draggedBlock.type === "group"
          ? (result.type as BlockGroupContext)
          : undefined;

      if (groupContext) {
        const containerName =
          groupContext === "groupTaskContext" ? "tasks" : "projects";
        const container: string[] = sourceBlock[containerName] || [];

        if (container.length > 0) {
          dropPosition -= 1;
        }
      }

      if (dropPosition < 0) {
        return;
      }

      transferBlockOperationFn({
        data: {
          sourceBlockID,
          draggedBlockID,
          dropPosition,
          groupContext,
          destinationBlockID: result.destination?.droppableId,
        },
      });
    },
    [store]
  );

  const handleStatusRelatedDrag = React.useCallback(
    (result: DropResult, provided: ResponderProvided) => {
      if (!result.destination) {
        return;
      }

      // did not move out of status - can bail early
      if (result.source.droppableId === result.destination.droppableId) {
        if (result.source.index !== result.destination.index) {
          dndColumnWarning();
        }

        return;
      }

      const destinationStatus = result.destination.droppableId;
      const draggedBlockID = result.draggableId;

      // TODO: volatile, blocks are possibly null OR undefined
      const draggedBlock = getBlock(store.getState(), draggedBlockID)!;

      console.log({ destinationStatus, draggedBlockID, draggedBlock });
      return;

      updateBlockOperationFunc({
        block: draggedBlock,
        data: {
          status: destinationStatus,
        },
      });
    },
    [store]
  );

  const onDragEnd = React.useCallback(
    (result: DropResult, provided: ResponderProvided) => {
      console.log({ result });
      if (result.type === "status") {
        handleStatusRelatedDrag(result, provided);
      } else if (
        result.type === "groupTaskContext" ||
        result.type === "groupProjectContext"
      ) {
        handleGroupRelatedDrag(result, provided);
      }
    },
    [store]
  );

  const render = () => {
    const showLoading = shouldRenderLoading();
    const loadErrors = getLoadErrors();

    if (showLoading) {
      return <LoadingEllipsis />;
    } else if (loadErrors.length > 0) {
      return <GeneralErrorList fill errors={loadErrors} />;
    }

    if (childGroupMatch || childProjectMatch) {
      return renderChild();
    }

    const renderBoardForBlock = (isMobile: boolean) => (
      <BoardHomeForBlock
        isMobile={isMobile}
        block={block}
        blockPath={blockPath}
        onClickBlock={onClickBlock}
        onClickDeleteBlock={promptConfirmDelete}
        onNavigate={onNavigate}
        onClickAddBlock={(parentBlock, blockType) => {
          setBlockForm({
            blockType,
            parentBlock,
            formType: "block-form",
            orgID: block.rootBlockID!,
          });
        }}
        onClickUpdateBlock={(blockToUpdate) =>
          setBlockForm({
            block: blockToUpdate,
            formType: "block-form",
            orgID: block.rootBlockID!,
            blockType: blockToUpdate.type,
          })
        }
        onClickAddCollaborator={() =>
          setBlockForm({
            block,
            formType: "collaborator-form",
            orgID: block.rootBlockID!,
          })
        }
        onClickAddOrEditLabel={() =>
          setBlockForm({
            block,
            formType: "label-list-form",
            orgID: block.rootBlockID!,
          })
        }
        onClickAddOrEditStatus={() =>
          setBlockForm({
            block,
            formType: "status-list-form",
            orgID: block.rootBlockID!,
          })
        }
      />
    );

    return (
      <DragDropContext onDragEnd={onDragEnd}>
        {renderForms()}
        <RenderForDevice
          renderForDesktop={() => renderBoardForBlock(false)}
          renderForMobile={() => renderBoardForBlock(true)}
        />
      </DragDropContext>
    );
  };

  return render();
};

export default BoardForBlock;
