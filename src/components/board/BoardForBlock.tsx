import { Modal } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { useHistory, useRouteMatch } from "react-router";
import { IBlock } from "../../models/block/block";
import { getBlockTypeFullName } from "../../models/block/utils";
import deleteBlockOperationFunc from "../../redux/operations/block/deleteBlock";
import getBlockLandingPageOperationFunc from "../../redux/operations/block/getBlockLandingPage";
import loadBlockChildrenOperationFunc from "../../redux/operations/block/loadBlockChildren";
import loadBlockCollaborationRequestsOperationFunc from "../../redux/operations/block/loadBlockCollaborationRequests";
import loadBlockCollaboratorsOperationFunc from "../../redux/operations/block/loadBlockCollaborators";
import {
  getBlockChildrenOperationID,
  getBlockCollaborationRequestsOperationID,
  getBlockCollaboratorsOperationID,
  getBlockLandingPageOperationID
} from "../../redux/operations/operationIDs";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import { pluralize } from "../../utils/utils";
import getNewBlock from "../block/getNewBlock";
import GeneralErrorList from "../GeneralErrorList";
import useBlockParents from "../hooks/useBlockParent";
import useOperation, { IUseOperationStatus } from "../hooks/useOperation";
import { concatPaths } from "../layout/path";
import RenderForDevice from "../RenderForDevice";
import StyledContainer from "../styled/Container";
import LoadingEllipsis from "../utilities/LoadingEllipsis";
import BoardForBlockContainer from "./BoardForBlockContainer";
import BlockForms, { BlockFormType } from "./BoardForms";
import BoardHomeForBlock from "./BoardHomeForBlock";
import BoardBlockChildren from "./LoadBlockChildren";
import { IBlockPathMatch } from "./types";
import { getBlockLandingPage } from "./utils";

interface IBlockFormState {
  block: IBlock;
  formType: BlockFormType;
}

export interface IBoardForBlockProps {
  block: IBlock;
}

export type OnClickBlock = (block: IBlock[]) => void;

// TODO: should forms have their own routes?
// TODO: should form labels be bold?

const BoardForBlock: React.FC<IBoardForBlockProps> = props => {
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
  const childGroupMatch = useRouteMatch<IBlockPathMatch>(
    `${blockPath}/groups/:blockID`
  );

  const childProjectMatch = useRouteMatch<IBlockPathMatch>(
    `${blockPath}/projects/:blockID`
  );

  const user = useSelector(getSignedInUserRequired);
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
      resourceID: block.customId
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
      resourceID: block.customId
    },
    hasRequests && loadOrgCollaborationRequests
  );

  const isLoadingRequests =
    hasRequests &&
    (loadRequestsStatus.isLoading || !!!loadRequestsStatus.operation);

  const loadBlockChildren = (loadProps: IUseOperationStatus) => {
    if (!!!loadProps.operation) {
      loadBlockChildrenOperationFunc({ block });
    }
  };

  const loadChildrenStatus = useOperation(
    {
      operationID: getBlockChildrenOperationID,
      resourceID: block.customId
    },
    loadBlockChildren
  );

  const isLoadingChildren =
    loadChildrenStatus.isLoading || !!!loadChildrenStatus.operation;

  const blockLandingPage = getBlockLandingPage(block);
  const loadBlockLandingPage = (loadProps: IUseOperationStatus) => {
    if (!!!loadProps.operation) {
      if (!blockLandingPage) {
        getBlockLandingPageOperationFunc({ block });
      }
    }
  };

  const loadBlockLandingPageStatus = useOperation(
    {
      operationID: getBlockLandingPageOperationID,
      resourceID: block.customId
    },
    loadBlockLandingPage
  );

  const isLoadingBlockLandingPage =
    !blockLandingPage &&
    (loadBlockLandingPageStatus.isLoading ||
      !!!loadBlockLandingPageStatus.operation);

  const pushRoute = route => {
    const search = window.location.search;
    const url = `${route}${search}`;
    history.push(url);
  };

  const onClickBlock = (blocks: IBlock[]) => {
    const path = concatPaths(blockPath, blocks.map(b => getPath(b)).join("/"));
    // return;
    pushRoute(path);
  };

  const onNavigate = (route: string) => {
    pushRoute(concatPaths(blockPath, route));
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
      okType: "danger",
      onOk() {
        onDeleteBlock(blockToDelete);
      },
      onCancel() {
        // do nothing
      }
    });
  };

  const renderForms = () => {
    if (blockForm) {
      return (
        <StyledContainer
          s={{ width: "100%", maxWidth: "400px", margin: "0 auto" }}
        >
          <BlockForms
            block={blockForm!.block}
            formType={blockForm!.formType}
            onClose={resetBlockForm}
          />
        </StyledContainer>
      );
    }
  };

  const shouldRenderLoading = () => {
    return (
      isLoadingCollaborators ||
      isLoadingRequests ||
      isLoadingChildren ||
      isLoadingBlockLandingPage
    );
  };

  const getLoadErrors = () => {
    const loadErrors: any[] = [];

    if (loadCollaboratorsStatus && loadCollaboratorsStatus.error) {
      loadErrors.push(loadCollaboratorsStatus.error);
    }

    if (loadRequestsStatus && loadRequestsStatus.error) {
      loadErrors.push(loadRequestsStatus.error);
    }

    if (loadBlockLandingPageStatus && loadBlockLandingPageStatus.error) {
      loadErrors.push(loadBlockLandingPageStatus.error);
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
            block: getNewBlock(user, blockType, parentBlock),
            formType: "add-block-form"
          });
        }}
        onClickUpdateBlock={blockToUpdate =>
          setBlockForm({
            block: blockToUpdate,
            formType: "update-block-form"
          })
        }
        onClickAddCollaborator={() =>
          setBlockForm({ block, formType: "collaborator-form" })
        }
      />
    );

    return (
      <React.Fragment>
        {blockForm && renderForms()}
        {!blockForm && (
          <RenderForDevice
            renderForDesktop={() => renderBoardForBlock(false)}
            renderForMobile={() => renderBoardForBlock(true)}
          />
        )}
      </React.Fragment>
    );
  };

  return render();
};

export default BoardForBlock;
