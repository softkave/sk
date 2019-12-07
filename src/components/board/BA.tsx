import styled from "@emotion/styled";
import { Badge, Dropdown, Menu, Modal } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Redirect, Route, Switch } from "react-router-dom";
import { BlockType, IBlock } from "../../models/block/block";
import { getBlockValidChildrenTypes } from "../../models/block/utils";
import { IUser } from "../../models/user/user";
import { getBlock, getBlocksAsArray } from "../../redux/blocks/selectors";
import deleteBlockOperationFunc from "../../redux/operations/block/deleteBlock";
import loadBlockCollaborationRequestsOperationFunc from "../../redux/operations/block/loadBlockCollaborationRequests";
import loadBlockCollaboratorsOperationFunc from "../../redux/operations/block/loadBlockCollaborators";
import { IOperationFuncOptions } from "../../redux/operations/operation";
import {
  addBlockOperationID,
  getBlockCollaborationRequestsOperationID,
  getBlockCollaboratorsOperationID,
  updateBlockOperationID
} from "../../redux/operations/operationIDs";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import { IReduxState } from "../../redux/store";
import { getUsersAsArray } from "../../redux/users/selectors";
import BlockChildren from "../board/BC";
import C from "../collaborator/C";
import CR from "../collaborator/CR";
import GeneralErrorList from "../GeneralErrorList";
import GroupFormContainer from "../group/GroupFormContainer";
import GroupList from "../group/GroupList";
import useOperation, { IUseOperationStatus } from "../hooks/useOperation";
import RenderForDevice from "../layout/RenderForDevice";
import Loading from "../Loading";
import ProjectFormContainer from "../project/ProjectFormContainer";
import ProjectList from "../project/ProjectList";
import StyledFlatButton from "../styled/FlatButton";
import StyledFlexContainer from "../styled/FlexContainer";
import List from "../styled/List";
import StyledCapitalizeText from "../StyledCapitalizeText";
import TaskFormContainer from "../task/TaskFormContainer";
import TaskList from "../task/TaskList";

type MenuType =
  | "groups"
  | "tasks"
  | "projects"
  | "collaborators"
  | "collaboration-requests";
interface IMenuItemType {
  key: MenuType;
  label: string;
}

interface IBlockFormState {
  block: IBlock;
  isAddBlock?: boolean;
  isUpdateBlock?: boolean;
}

export interface IBAProps {
  block: IBlock;
}

const BA: React.FC<IBAProps> = props => {
  const { block } = props;
  const history = useHistory();
  const [blockForm, setBlockForm] = React.useState<IBlockFormState | null>(
    null
  );

  const getBlockTypeFullName = (type: BlockType) => {
    switch (type) {
      case "org":
        return "organization";
      case "group":
        return "group";
      case "project":
        return "project";
      case "task":
        return "task";
      default:
        return "block";
    }
  };

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
  const parentPath = parents.map(getPath).join("");
  const blockPath = `/app${parentPath}${getPath(block)}`;

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
  const blockWithCollaboratorsID = hasCollaborators
    ? block.customId
    : block.parents[0];
  const blockWithCollaborators = useSelector<IReduxState, IBlock>(
    state => getBlock(state, blockWithCollaboratorsID)!
  );
  const collaboratorIDs = Array.isArray(blockWithCollaborators.collaborators)
    ? blockWithCollaborators.collaborators
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
    loadCollaboratorsStatus &&
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
    loadRequestsStatus &&
    (loadRequestsStatus.isLoading || !!!loadRequestsStatus.operation);

  const childrenTypes = getBlockValidChildrenTypes(block.type);
  const hasTasks = childrenTypes.includes("task");
  const hasProjects = childrenTypes.includes("project");
  const hasGroups = childrenTypes.includes("group");
  const blockTypeFullName = getBlockTypeFullName(block.type);

  const onBeginCreateBlock = () => {};

  const onCompleteCreateBlock = () => {};

  const onBeginEditBlock = () => {};

  const onCompleteEditBlock = (
    values: any,
    options: IOperationFuncOptions
  ) => {};

  const onDeleteBlock = () => {
    deleteBlockOperationFunc({ block });
  };

  const resetBlockForm = () => {
    // TODO: prompt the user if she has unsaved changes
  };

  const renderLandingMenu = () => {
    const menuItems: IMenuItemType[] = [];

    if (hasGroups) {
      menuItems.push({ key: "groups", label: "Groups" });
    }

    if (hasTasks) {
      menuItems.push({ key: "tasks", label: "Tasks" });
    }

    if (hasProjects) {
      menuItems.push({ key: "projects", label: "Projects" });
    }

    if (hasCollaborators) {
      menuItems.push({ key: "collaborators", label: "Collaborators" });
    }

    if (hasRequests) {
      menuItems.push({
        key: "collaboration-requests",
        label: "Collaboration Requests"
      });
    }

    const renderBadge = (item: MenuType) => {
      switch (item) {
        case "groups":
          return <Badge count={block.groups.length} />;

        case "tasks":
          return <Badge count={block.tasks.length} />;

        case "projects":
          return <Badge count={block.projects.length} />;

        case "collaborators":
          return <Badge count={block.collaborators.length} />;

        case "collaboration-requests":
          return <Badge count={block.collaborationRequests.length} />;

        default:
          return null;
      }
    };

    const onClickItem = (item: MenuType) => {
      history.push(`${blockPath}/${item}`);
    };

    // TODO: show selected child route, like by adding background color or something
    return (
      <StyledNavContainer>
        <List
          dataSource={menuItems}
          renderItem={item => (
            <StyledNavItem onClick={() => onClickItem(item.key)}>
              <StyledMenuItemTitle>{item.label}</StyledMenuItemTitle>
              {renderBadge(item.key)}
            </StyledNavItem>
          )}
        />
      </StyledNavContainer>
    );
  };

  const promptConfirmDelete = () => {
    const onDeletePromptMessage = (
      <div>
        Are you sure you want to delete this{" "}
        <StyledCapitalizeText>{blockTypeFullName}</StyledCapitalizeText>?
      </div>
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

  const renderForms = () => {
    if (blockForm) {
      const formBlock = blockForm.block;
      const showFormType = blockForm.block.type;
      const formType = blockForm.isAddBlock ? "create" : "edit";
      const blockFormOperationId = blockForm.isAddBlock
        ? addBlockOperationID
        : updateBlockOperationID;
      const formLabel = (
        <StyledCapitalizeText>
          {formType} {blockTypeFullName}
        </StyledCapitalizeText>
      );

      return (
        <div>
          <h1>{formLabel}</h1>
          {showFormType === "project" && (
            <ProjectFormContainer
              customId={formBlock.customId}
              initialValues={formBlock}
              onClose={resetBlockForm}
              onSubmit={onCompleteEditBlock}
              operationID={blockFormOperationId}
              submitLabel={formLabel}
            />
          )}
          {showFormType === "group" && (
            <GroupFormContainer
              operationID={blockFormOperationId}
              customId={formBlock.customId}
              onClose={resetBlockForm}
              onSubmit={onCompleteEditBlock}
              initialValues={formBlock}
              submitLabel={formLabel}
            />
          )}
          {showFormType === "task" && (
            <TaskFormContainer
              operationID={blockFormOperationId}
              customId={formBlock.customId}
              onClose={resetBlockForm}
              onSubmit={onCompleteEditBlock}
              initialValues={formBlock}
              user={user}
              submitLabel={formLabel}
              collaborators={collaborators}
            />
          )}
        </div>
      );
    }
  };

  const renderHeader = () => {
    type CreateMenuKey = BlockType | "collaborator";
    type SettingsMenuKey = "edit" | "delete";
    const onSelectCreateMenuItem = (key: CreateMenuKey) => {
      switch (key) {
      }
    };

    const createMenu = (
      <Menu
        onClick={event => onSelectCreateMenuItem(event.key as CreateMenuKey)}
      >
        {childrenTypes.map(type => (
          <StyledMenuItem key={type}>Create {type}</StyledMenuItem>
        ))}
        <Menu.Divider />
        <StyledMenuItem key="collaborator">Add Collaborator</StyledMenuItem>
      </Menu>
    );

    const onSelectSettingsMenuItem = (key: SettingsMenuKey) => {
      switch (key) {
        case "delete":
          promptConfirmDelete();
          return;
      }
    };

    const settingsMenu = (
      <Menu
        onClick={event =>
          onSelectSettingsMenuItem(event.key as SettingsMenuKey)
        }
      >
        <StyledMenuItem key="edit">Edit {blockTypeFullName}</StyledMenuItem>
        <StyledMenuItem key="delete">Delete {blockTypeFullName}</StyledMenuItem>
      </Menu>
    );

    return (
      <StyledFlexContainer>
        <StyledHeaderName>{block.name}</StyledHeaderName>
        <div>
          <Dropdown overlay={createMenu} trigger={["click"]}>
            <StyledFlatButton icon="plus" />
          </Dropdown>
          <Dropdown overlay={settingsMenu} trigger={["click"]}>
            <StyledFlatButton icon="setting" />
          </Dropdown>
        </div>
      </StyledFlexContainer>
    );
  };

  const renderTasks = () => {
    return (
      <BlockChildren
        hideTitle
        parent={block}
        emptyMessage="No tasks yet."
        getChildrenIDs={() => block.tasks}
        renderChildren={tasks => <TaskList tasks={tasks} />}
      />
    );
  };

  const renderProjects = () => {
    return (
      <BlockChildren
        hideTitle
        parent={block}
        emptyMessage="No projects yet."
        getChildrenIDs={() => block.projects}
        renderChildren={projects => <ProjectList projects={projects} />}
      />
    );
  };

  const renderGroups = () => {
    return (
      <BlockChildren
        hideTitle
        parent={block}
        emptyMessage="No groups yet."
        getChildrenIDs={() => block.groups}
        renderChildren={groups => <GroupList groups={groups} />}
      />
    );
  };

  const renderCollaborators = () => {
    return <C organization={block} />;
  };

  const renderCollaborationRequests = () => {
    return <CR organization={block} />;
  };

  const shouldRenderLoading = () => {
    return isLoadingCollaborators || isLoadingRequests;
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

  console.log({ hasGroups, showBlockForm, blockPath });

  const renderChildrenRoutes = (addLandingMenu: boolean = true) => {
    const routes = (
      <Switch>
        {addLandingMenu ? (
          <Route exact path={blockPath} render={renderLandingMenu} />
        ) : null}
        {hasTasks && <Route path={`${blockPath}/tasks`} render={renderTasks} />}
        {hasGroups && (
          <Route path={`${blockPath}/groups`} render={renderGroups} />
        )}
        {hasProjects && (
          <Route path={`${blockPath}/projects`} render={renderProjects} />
        )}
        {hasCollaborators && (
          <Route
            path={`${blockPath}/collaborators`}
            render={renderCollaborators}
          />
        )}
        {hasRequests && (
          <Route
            path={`${blockPath}/collaboration-requests`}
            render={renderCollaborationRequests}
          />
        )}
        <Route
          path={`${blockPath}/*`}
          render={() => <Redirect to={blockPath} />}
        />
      </Switch>
    );

    return routes;
  };

  const renderMobile = () => {
    return (
      <StyledContainer>
        {renderHeader()}
        {showBlockForm ? (
          renderForms()
        ) : (
          <StyledBodyContainer>{renderChildrenRoutes()}</StyledBodyContainer>
        )}
      </StyledContainer>
    );
  };

  const renderDesktop = () => {
    // TODO: render form without nav menu and have a back or cancelbutton
    return (
      <StyledContainer>
        {renderHeader()}
        <StyledBodyContainer>
          <div>{renderLandingMenu()}</div>
          <StyledChildrenContainer>
            {showBlockForm ? renderForms() : renderChildrenRoutes(false)}
          </StyledChildrenContainer>
        </StyledBodyContainer>
      </StyledContainer>
    );
  };

  const render = () => {
    const showLoading = shouldRenderLoading();
    const loadErrors = getLoadErrors();

    if (showLoading) {
      return <Loading />;
    } else if (loadErrors.length > 0) {
      return <GeneralErrorList errors={loadErrors} />;
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

export default BA;

const StyledNavContainer = styled.div({
  display: "flex",
  flexDirection: "column",
  width: "300px"
});

const StyledNavItem = styled.div({
  fontSize: "14px",
  textTransform: "capitalize",
  display: "flex",
  padding: "14px 8px 14px 0"
});

const StyledMenuItem = styled(Menu.Item)({
  fontSize: "14px",
  textTransform: "capitalize",
  display: "flex"
});

const StyledMenuItemTitle = styled.div({
  display: "flex",
  flex: 1,
  marginRight: "16px"
});

const StyledHeaderName = styled.h1({
  display: "flex",
  flex: 1,
  marginRight: "16px"
});

const StyledBodyContainer = styled.div({
  display: "flex",
  flex: 1
});

const StyledContainer = styled.div({
  display: "flex",
  flexDirection: "column",
  padding: "0 16px",
  flex: 1
});

const StyledChildrenContainer = styled.div({
  display: "flex",
  flex: 1
});
