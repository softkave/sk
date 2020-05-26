import { Modal } from "antd";
import path from "path";
import React from "react";
import { useHistory, useRouteMatch } from "react-router";
import { BlockType, IBlock } from "../../models/block/block";
import { getBlockTypeFullName } from "../../models/block/utils";
import deleteBlockOperationFunc from "../../redux/operations/block/deleteBlock";
import loadBlockChildrenOperationFunc from "../../redux/operations/block/loadBlockChildren";
import loadBlockCollaborationRequestsOperationFunc from "../../redux/operations/block/loadBlockCollaborationRequests";
import loadBlockCollaboratorsOperationFunc from "../../redux/operations/block/loadBlockCollaborators";
import {
  getBlockChildrenOperationID,
  getBlockCollaborationRequestsOperationID,
  getBlockCollaboratorsOperationID,
} from "../../redux/operations/operationIDs";
import { pluralize } from "../../utils/utils";
import GeneralErrorList from "../GeneralErrorList";
import useBlockParents from "../hooks/useBlockParents";
import useOperation, { IUseOperationStatus } from "../hooks/useOperation";
import RenderForDevice from "../RenderForDevice";
import LoadingEllipsis from "../utilities/LoadingEllipsis";
import BlockContainer from "./BlockContainer";
import BlockForms, { BlockFormType } from "./BoardForms";
import BoardMain from "./BoardMain";
import BoardBlockChildren from "./LoadBlockChildren";
import { IBlockPathMatch } from "./types";
import { getDefaultBoardViewType } from "./utils";

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

// TODO: should forms have their own routes?
// TODO: should form labels be bold?

const Board: React.FC<IBoardForBlockProps> = (props) => {
  const { block } = props;
  const history = useHistory();
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

  const onClickBlock = (blocks: IBlock[], searchParamKey = "bt") => {
    const clickedBlock = blocks[blocks.length - 1];
    const boardType = getDefaultBoardViewType(clickedBlock);
    const nextPath = path.normalize(
      blockPath +
        "/" +
        blocks.map((b) => getPath(b)).join("") +
        `/tasks?${searchParamKey}=${boardType}`
    );

    pushRoute(nextPath);
  };

  const onDeleteBlock = (blockToDelete: IBlock) => {
    deleteBlockOperationFunc({ block: blockToDelete });

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

    if (childProjectMatch) {
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
          <BlockContainer blockID={childID!} notFoundMessage={message} />
        )}
      />
    );
  };

  const render = () => {
    const showLoading = shouldRenderLoading();
    const loadErrors = getLoadErrors();

    if (showLoading) {
      return <LoadingEllipsis />;
    } else if (loadErrors.length > 0) {
      return <GeneralErrorList fill errors={loadErrors} />;
    }

    if (childProjectMatch) {
      return renderChild();
    }

    const renderBoardForBlock = (isMobile: boolean) => {
      return (
        <BoardMain
          isMobile={isMobile}
          block={block}
          blockPath={blockPath}
          onClickBlock={onClickBlock}
          onClickDeleteBlock={promptConfirmDelete}
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
    };

    return (
      <React.Fragment>
        {renderForms()}
        <RenderForDevice
          renderForDesktop={() => renderBoardForBlock(false)}
          renderForMobile={() => renderBoardForBlock(true)}
        />
      </React.Fragment>
    );
  };

  return render();
};

export default Board;
