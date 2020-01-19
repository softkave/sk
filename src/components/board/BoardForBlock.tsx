import { Modal } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { useHistory, useRouteMatch } from "react-router";
import { IBlock } from "../../models/block/block";
import { getBlockTypeFullName } from "../../models/block/utils";
import { getBlocksAsArray } from "../../redux/blocks/selectors";
import deleteBlockOperationFunc from "../../redux/operations/block/deleteBlock";
import loadBlockChildrenOperationFunc from "../../redux/operations/block/loadBlockChildren";
import loadBlockCollaborationRequestsOperationFunc from "../../redux/operations/block/loadBlockCollaborationRequests";
import loadBlockCollaboratorsOperationFunc from "../../redux/operations/block/loadBlockCollaborators";
import {
  getBlockChildrenOperationID,
  getBlockCollaborationRequestsOperationID,
  getBlockCollaboratorsOperationID
} from "../../redux/operations/operationIDs";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import { IReduxState } from "../../redux/store";
import { pluralize } from "../../utils/utils";
import getNewBlock from "../block/getNewBlock";
import GeneralErrorList from "../GeneralErrorList";
import useOperation, { IUseOperationStatus } from "../hooks/useOperation";
import { concatPaths } from "../layout/path";
import StyledContainer from "../styled/Container";
import LoadingEllipsis from "../utilities/LoadingEllipsis";
import BoardBlockChildrenRoutes from "./BoardBlockChildrenRoutes";
import BoardBlockChildren from "./BoardChildren";
import BoardEntryForBlock from "./BoardForBlockEntry";
import BlockForms, { BlockFormType } from "./BoardForms";

interface IBlockFormState {
  block: IBlock;
  formType: BlockFormType;
}

interface IGroupChildPathMatch {
  groupID: string;
}

interface IProjectChildPathMatch {
  projectID: string;
}

export interface IBoardForBlockProps {
  block: IBlock;
}

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

  const parentIDs = Array.isArray(block.parents) ? block.parents : [];
  const parents = useSelector<IReduxState, IBlock[]>(state =>
    getBlocksAsArray(state, parentIDs)
  );

  const parentPath = `/app${parents.map(getPath).join("")}`;
  const blockPath = `${parentPath}${getPath(block)}`;
  const childGroupMatch = useRouteMatch<IGroupChildPathMatch>(
    `${blockPath}/groups/:groupID`
  );

  const childProjectMatch = useRouteMatch<IProjectChildPathMatch>(
    `${blockPath}/projects/:projectID`
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

  const onClickBlock = (clickedBlock: IBlock) => {
    const path = concatPaths(blockPath, getPath(clickedBlock));
    history.push(path);
  };

  const onNavigate = (route: string) => {
    history.push(concatPaths(blockPath, route));
  };

  const onNavigateBack = () => {
    const path = window.location.pathname;
    const pathArr = path.split("/");
    pathArr.pop();
    const destPath = pathArr.join("/");
    history.push(destPath);
  };

  const onDeleteBlock = (blockToDelete: IBlock) => {
    deleteBlockOperationFunc({ block });

    if (blockToDelete.customId === block.customId) {
      history.push(parentPath);
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
            parent={block}
          />
        </StyledContainer>
      );
    }
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

    return loadErrors;
  };

  const renderChild = () => {
    let childID: string | null = null;
    let message: string = "";
    let getChildrenIDsFunc: () => string[] = () => [];

    if (childGroupMatch) {
      childID = childGroupMatch.params.groupID;
      message = "Group not found.";
      getChildrenIDsFunc = () => block.groups || [];
    } else if (childProjectMatch) {
      childID = childProjectMatch.params.projectID;
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
          <BoardEntryForBlock blockID={childID!} notFoundMessage={message} />
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

    return (
      <React.Fragment>
        {blockForm && renderForms()}
        {!blockForm && (
          <BoardBlockChildrenRoutes
            block={block}
            onClickAddBlock={blockType => {
              setBlockForm({
                block: getNewBlock(user, blockType, block),
                formType: "add-block-form"
              });
            }}
            onClickUpdateBlock={blockToUpdate =>
              setBlockForm({
                block: blockToUpdate,
                formType: "update-block-form"
              })
            }
            onClickBlock={onClickBlock}
            onClickDeleteBlock={promptConfirmDelete}
            onNavigate={onNavigate}
            onNavigateBack={onNavigateBack}
            onClickAddCollaborator={() =>
              setBlockForm({ block, formType: "collaborator-form" })
            }
          />
        )}
      </React.Fragment>
    );
  };

  return render();
};

export default BoardForBlock;
