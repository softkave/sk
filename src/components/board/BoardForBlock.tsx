import styled from "@emotion/styled";
import { Modal } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { useHistory, useRouteMatch } from "react-router";
import { IBlock } from "../../models/block/block";
import { getBlockTypeFullName } from "../../models/block/utils";
import { INotification } from "../../models/notification/notification";
import { IUser } from "../../models/user/user";
import { getBlock, getBlocksAsArray } from "../../redux/blocks/selectors";
import { getNotificationsAsArray } from "../../redux/notifications/selectors";
import addCollaboratorsOperationFunc from "../../redux/operations/block/addCollaborators";
import deleteBlockOperationFunc from "../../redux/operations/block/deleteBlock";
import loadBlockChildrenOperationFunc from "../../redux/operations/block/loadBlockChildren";
import loadBlockCollaborationRequestsOperationFunc from "../../redux/operations/block/loadBlockCollaborationRequests";
import loadBlockCollaboratorsOperationFunc from "../../redux/operations/block/loadBlockCollaborators";
import {
  addCollaboratorsOperationID,
  getBlockChildrenOperationID,
  getBlockCollaborationRequestsOperationID,
  getBlockCollaboratorsOperationID
} from "../../redux/operations/operationIDs";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import { IReduxState } from "../../redux/store";
import { getUsersAsArray } from "../../redux/users/selectors";
import getNewBlock from "../block/getNewBlock";
import AddCollaboratorFormContainer from "../collaborator/AddCollaboratorFormContainer";
import GeneralErrorList from "../GeneralErrorList";
import useOperation, { IUseOperationStatus } from "../hooks/useOperation";
import Loading from "../Loading";
import RenderForDevice from "../RenderForDevice";
import StyledContainer from "../styled/Container";
import BoardBlockHeader from "./BoardBlockHeader";
import BoardBodyMobile from "./BoardBodyMobile";
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
  const [
    showAddCollaboratorsForm,
    setShowAddCollaboratorsForm
  ] = React.useState(false);

  const pluralize = (str: string) => {
    return `${str}s`;
  };

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

  const showBlockForm = !!blockForm;
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
  const organizationID = hasCollaborators ? block.customId : block.parents![0];
  const organization = useSelector<IReduxState, IBlock>(
    state => getBlock(state, organizationID)!
  );
  const collaboratorIDs = Array.isArray(organization.collaborators)
    ? organization.collaborators
    : [];
  const collaborators = useSelector<IReduxState, IUser[]>(state =>
    getUsersAsArray(state, collaboratorIDs)
  );
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

  const requestIDs = Array.isArray(organization.collaborationRequests)
    ? organization.collaborationRequests
    : [];
  const requests = useSelector<IReduxState, INotification[]>(state =>
    getNotificationsAsArray(state, requestIDs)
  );
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

  const blockTypeFullName = getBlockTypeFullName(block.type);

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

  const onDeleteBlock = () => {
    history.push(parentPath);
    deleteBlockOperationFunc({ block });
  };

  const resetBlockForm = () => {
    // TODO: prompt the user if she has unsaved changes
    setBlockForm(null);
  };

  const promptConfirmDelete = () => {
    const onDeletePromptMessage = (
      <div>Are you sure you want to delete this {blockTypeFullName}?</div>
    );

    Modal.confirm({
      title: onDeletePromptMessage,
      okText: "Yes",
      cancelText: "No",
      okType: "danger",
      onOk() {
        onDeleteBlock();
      },
      onCancel() {
        // do nothing
      }
    });
  };

  const renderAddCollaboratorForm = () => {
    return (
      <AddCollaboratorFormContainer
        customId={block.customId}
        existingCollaborationRequests={requests}
        existingCollaborators={collaborators}
        onClose={() => setShowAddCollaboratorsForm(false)}
        onSubmit={(data, options) =>
          addCollaboratorsOperationFunc({ block, ...data }, options)
        }
        operationID={addCollaboratorsOperationID}
      />
    );
  };

  const renderForms = () => (
    <BlockForms
      block={blockForm!.block}
      formType={blockForm!.formType}
      onClose={resetBlockForm}
    />
  );

  const renderHeader = () => (
    <BoardBlockHeader
      block={block}
      onClickAddCollaborator={() => setShowAddCollaboratorsForm(true)}
      onClickCreateNewBlock={blockType => {
        setBlockForm({
          block: getNewBlock(user, blockType, block),
          formType: "add-block-form"
        });
      }}
      onClickDeleteBlock={promptConfirmDelete}
      onClickEditBlock={() => {
        setBlockForm({
          block,
          formType: "update-block-form"
        });
      }}
      onNavigateBack={blockForm && resetBlockForm}
    />
  );

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

  const renderMobile = () => (
    <StyledContainer s={{ flex: 1, flexDirection: "column" }}>
      <StyledContainer s={{ padding: "0 24px" }}>
        {renderHeader()}
      </StyledContainer>
      {showBlockForm ? (
        renderForms()
      ) : showAddCollaboratorsForm ? (
        renderAddCollaboratorForm()
      ) : (
        <StyledContainer s={{ flex: 1, padding: "0 24px" }}>
          <BoardBodyMobile
            block={block}
            onClickUpdateBlock={blockToUpdate =>
              setBlockForm({
                block: blockToUpdate,
                formType: "update-block-form"
              })
            }
          />
        </StyledContainer>
      )}
    </StyledContainer>
  );

  const renderDesktop = () => {
    // TODO: render form without nav menu and have a back or cancelbutton
    return (
      <StyledFillContainer>
        {renderHeader()}
        <StyledBodyContainer>
          {showBlockForm
            ? renderForms()
            : showAddCollaboratorsForm
            ? renderAddCollaboratorForm()
            : null}
        </StyledBodyContainer>
      </StyledFillContainer>
    );
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
      return (
        <StyledContainer
          s={{
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Loading />
        </StyledContainer>
      );
    } else if (loadErrors.length > 0) {
      return (
        <StyledContainer
          s={{
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "16px"
          }}
        >
          <GeneralErrorList errors={loadErrors} />
        </StyledContainer>
      );
    }

    if (childGroupMatch || childProjectMatch) {
      return renderChild();
    }

    return (
      <RenderForDevice
        renderForDesktop={renderDesktop}
        renderForMobile={renderMobile}
      />
    );
  };

  return render();
};

export default BoardForBlock;

const StyledBodyContainer = styled.div({
  display: "flex",
  flex: 1,
  overflow: "auto"
});

const StyledFillContainer = styled.div({
  display: "flex",
  flexDirection: "column",
  flex: 1
});
