import styled from "@emotion/styled";
import { Dropdown, Icon, Menu, Modal } from "antd";
import React from "react";
import { useSelector, useStore } from "react-redux";
import { useHistory, useRouteMatch } from "react-router";
import { Redirect, Route, Switch } from "react-router-dom";
import { BlockType, IBlock } from "../../models/block/block";
import { getBlockValidChildrenTypes } from "../../models/block/utils";
import { INotification } from "../../models/notification/notification";
import { IUser } from "../../models/user/user";
import { getBlock, getBlocksAsArray } from "../../redux/blocks/selectors";
import { getNotificationsAsArray } from "../../redux/notifications/selectors";
import addBlockOperationFunc from "../../redux/operations/block/addBlock";
import addCollaboratorsOperationFunc from "../../redux/operations/block/addCollaborators";
import deleteBlockOperationFunc from "../../redux/operations/block/deleteBlock";
import loadBlockChildrenOperationFunc from "../../redux/operations/block/loadBlockChildren";
import loadBlockCollaborationRequestsOperationFunc from "../../redux/operations/block/loadBlockCollaborationRequests";
import loadBlockCollaboratorsOperationFunc from "../../redux/operations/block/loadBlockCollaborators";
import updateBlockOperationFunc from "../../redux/operations/block/updateBlock";
import { IOperationFuncOptions } from "../../redux/operations/operation";
import {
  addBlockOperationID,
  addCollaboratorsOperationID,
  getBlockChildrenOperationID,
  getBlockCollaborationRequestsOperationID,
  getBlockCollaboratorsOperationID,
  updateBlockOperationID
} from "../../redux/operations/operationIDs";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import { IReduxState } from "../../redux/store";
import { getUsersAsArray } from "../../redux/users/selectors";
import getNewBlock from "../block/getNewBlock";
import BlockChildren from "../board/BC";
import AddCollaboratorFormContainer from "../collaborator/AddCollaboratorFormContainer";
import C from "../collaborator/C";
import CR from "../collaborator/CR";
import GeneralErrorList from "../GeneralErrorList";
import GroupList from "../group/GL";
import GroupFormContainer from "../group/GroupFormContainer";
import useOperation, { IUseOperationStatus } from "../hooks/useOperation";
import { concatPaths } from "../layout/path";
import Loading from "../Loading";
import ProjectList from "../project/PL";
import ProjectFormContainer from "../project/ProjectFormContainer";
import RenderForDevice from "../RenderForDevice";
import StyledContainer from "../styled/Container";
import StyledFlatButton from "../styled/FlatButton";
import List from "../styled/List";
import StyledDrawerMenu from "../styled/StyledDrawerMenu";
import StyledCapitalizeText from "../StyledCapitalizeText";
import TaskFormContainer from "../task/TaskFormContainer";
import TaskList from "../task/TL";
import B, { IBBasket } from "./B";
import BD from "./BD";
import Column from "./C";

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

interface IGroupChildPathMatch {
  groupID: string;
}

interface IProjectChildPathMatch {
  projectID: string;
}

export interface IBAProps {
  block: IBlock;
}

const BA: React.FC<IBAProps> = props => {
  const { block } = props;
  const history = useHistory();
  const store = useStore();
  const [blockForm, setBlockForm] = React.useState<IBlockFormState | null>(
    null
  );
  const [
    showAddCollaboratorsForm,
    setShowAddCollaboratorsForm
  ] = React.useState(false);

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
  const parentPath = `/app${parents.map(getPath).join("")}`;
  const blockPath = `${parentPath}${getPath(block)}`;
  const hasParents = parents.length > 0;

  // immediate parent
  const parent0 = hasParents ? parents[parents.length - 1] : null;
  const hasParent0 = !!parent0;

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

  let childrenTypes = getBlockValidChildrenTypes(block.type);

  if (block.type === "group") {
    if (parent0 && parent0.type === "project") {
      childrenTypes = childrenTypes.filter(type => type !== "project");
    }
  }

  const hasTasks = childrenTypes.includes("task");
  const hasProjects = childrenTypes.includes("project");
  const hasGroups = childrenTypes.includes("group");
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

  const getFormParents = (formBlock: IBlock) => {
    if (formBlock.customId !== block.customId) {
      const blockGroups = getBlocksAsArray(
        store.getState(),
        block.groups || []
      );
      return [block].concat(blockGroups);
    }

    if (hasParents) {
      if (hasParent0) {
        const parent0Groups =
          hasParent0 && formBlock.type !== "group"
            ? getBlocksAsArray(store.getState(), parent0!.groups || [])
            : [];

        // immediate parent's parent
        const parent1 =
          parent0 && parent0.type === "group"
            ? parents[parents.length - 2]
            : null;
        const hasParent1 = !!parent1;

        if (hasParent1) {
          const parent1Groups =
            hasParent1 && formBlock.type !== "group"
              ? getBlocksAsArray(store.getState(), parent1!.groups || [])
              : [];
          return [parent1!].concat(parent1Groups);
        }

        return [parent0!].concat(parent0Groups);
      }
    }

    return [];
  };

  const onCompleteEditBlock = (values: any, options: IOperationFuncOptions) => {
    if (blockForm) {
      if (blockForm.isAddBlock) {
        const newBlock = { ...blockForm.block, ...values };
        addBlockOperationFunc(
          { user, block: newBlock, parent: block },
          options
        );
      } else {
        updateBlockOperationFunc(
          { block: blockForm.block, data: values },
          options
        );
      }
    }
  };

  const onDeleteBlock = () => {
    history.push(parentPath);
    deleteBlockOperationFunc({ block });
  };

  const resetBlockForm = () => {
    // TODO: prompt the user if she has unsaved changes
    setBlockForm(null);
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

    // const renderBadge = (item: MenuType) => {
    //   switch (item) {
    //     case "groups":
    //       return <Badge count={block.groups!.length} />;

    //     case "tasks":
    //       return <Badge count={block.tasks!.length} />;

    //     case "projects":
    //       return <Badge count={block.projects!.length} />;

    //     case "collaborators":
    //       return <Badge count={block.collaborators!.length} />;

    //     case "collaboration-requests":
    //       return <Badge count={block.collaborationRequests!.length} />;

    //     default:
    //       return null;
    //   }
    // };

    const renderCount = (item: MenuType) => {
      switch (item) {
        case "groups":
          return block.groups!.length;

        case "tasks":
          return block.tasks!.length;

        case "projects":
          return block.projects!.length;

        case "collaborators":
          return block.collaborators!.length;

        case "collaboration-requests":
          return block.collaborationRequests!.length;

        default:
          return null;
      }
    };

    const onClickItem = (item: MenuType) => {
      history.push(`${blockPath}/${item}`);
    };

    // TODO: show selected child route, like by adding background color or something
    // TODO: show count and use badges only for new unseen entries
    return (
      <StyledNavContainer>
        <List
          dataSource={menuItems}
          renderItem={item => (
            <StyledNavItem onClick={() => onClickItem(item.key)}>
              <StyledMenuItemTitle>{item.label}</StyledMenuItemTitle>
              {/* {renderBadge(item.key)} */}
              {renderCount(item.key) || null}
            </StyledNavItem>
          )}
        />
      </StyledNavContainer>
    );
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

  const renderForms = () => {
    if (blockForm) {
      const formBlock = blockForm.block;
      const showFormType = blockForm.block.type;
      const formType = blockForm.isAddBlock ? "create" : "edit";
      const blockFormTypeFullName = getBlockTypeFullName(formBlock.type);
      const blockFormOperationId = blockForm.isAddBlock
        ? addBlockOperationID
        : updateBlockOperationID;
      const formLabel = (
        <StyledCapitalizeText>
          {formType} {blockFormTypeFullName}
        </StyledCapitalizeText>
      );
      const formParents = getFormParents(formBlock);

      return (
        <StyledFlexColumnContainer>
          <h3 style={{ padding: "0 24px" }}>{formLabel}</h3>
          <StyledFormContainer>
            {showFormType === "project" && (
              <ProjectFormContainer
                customId={formBlock.customId}
                initialValues={formBlock}
                onClose={resetBlockForm}
                onSubmit={onCompleteEditBlock}
                operationID={blockFormOperationId}
                submitLabel={formLabel}
                parents={formParents}
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
                parents={formParents}
              />
            )}
            {showFormType === "task" && (
              <TaskFormContainer
                operationID={blockFormOperationId}
                customId={formBlock.customId}
                onClose={resetBlockForm}
                onSubmit={onCompleteEditBlock}
                initialValues={formBlock as any}
                user={user}
                submitLabel={formLabel}
                collaborators={collaborators}
                parents={formParents}
              />
            )}
          </StyledFormContainer>
        </StyledFlexColumnContainer>
      );
    }
  };

  const renderHeader = () => {
    type CreateMenuKey = BlockType | "collaborator";
    type SettingsMenuKey = "edit" | "delete";
    const onSelectCreateMenuItem = (key: CreateMenuKey) => {
      switch (key) {
        case "group":
        case "project":
        case "task":
        case "org":
          setBlockForm({
            block: getNewBlock(user, key, block),
            isAddBlock: true
          });
          break;

        case "collaborator":
          setShowAddCollaboratorsForm(true);
          break;
      }
    };

    const createMenuItems = childrenTypes.map(type => (
      <StyledMenuItem key={type}>Create {type}</StyledMenuItem>
    ));

    if (hasCollaborators) {
      createMenuItems.push(<Menu.Divider key="menu-divider-1" />);
      createMenuItems.push(
        <StyledMenuItem key="collaborator">Add Collaborator</StyledMenuItem>
      );
    }

    const createMenu = (
      <StyledDrawerMenu
        onClick={event => onSelectCreateMenuItem(event.key as CreateMenuKey)}
      >
        {createMenuItems}
      </StyledDrawerMenu>
    );

    const onSelectSettingsMenuItem = (key: SettingsMenuKey) => {
      switch (key) {
        case "edit":
          setBlockForm({
            block,
            isUpdateBlock: true
          });
          break;

        case "delete":
          promptConfirmDelete();
          break;
      }
    };

    const settingsMenu = (
      <StyledDrawerMenu
        onClick={event =>
          onSelectSettingsMenuItem(event.key as SettingsMenuKey)
        }
      >
        <StyledMenuItem key="edit">
          {/* <Icon type="edit" /> */}
          Edit {blockTypeFullName}
        </StyledMenuItem>
        <StyledMenuItem key="delete">
          {/* <Icon type="delete" /> */}
          Delete {blockTypeFullName}
        </StyledMenuItem>
      </StyledDrawerMenu>
    );

    return (
      <StyledContainer
        s={{ width: "100%", alignItems: "center", marginBottom: "12px" }}
      >
        {blockForm && (
          <StyledFlatButton
            style={{ paddingRight: "16px" }}
            onClick={resetBlockForm}
          >
            <Icon type="caret-left" theme="filled" />
          </StyledFlatButton>
        )}
        <StyledHeaderName>{block.name}</StyledHeaderName>
        <div>
          <Dropdown overlay={createMenu} trigger={["click"]}>
            <StyledFlatButton icon="plus" />
          </Dropdown>
          <Dropdown overlay={settingsMenu} trigger={["click"]}>
            <StyledFlatButton style={{ paddingLeft: "16px" }}>
              <Icon type="setting" />
            </StyledFlatButton>
          </Dropdown>
        </div>
      </StyledContainer>
    );
  };

  const onClickChild = (childBlock: IBlock) => {
    const path = concatPaths(window.location.pathname, childBlock.customId);
    history.push(path);
  };

  const renderChildrenGroup = (
    blocks: IBlock[],
    emptyMessage: string,
    renderBasketFunc: (basket: IBBasket) => React.ReactNode
  ) => {
    return (
      <B
        blocks={blocks}
        emptyMessage={emptyMessage}
        getBaskets={() =>
          blocks.length > 0 ? [{ key: "blocks", blocks }] : []
        }
        renderBasket={basket => <Column body={renderBasketFunc(basket)} />}
      />
    );
  };

  const renderTasks = () => {
    return (
      <BlockChildren
        parent={block}
        getChildrenIDs={() => block.tasks || []}
        render={tasks =>
          renderChildrenGroup(tasks, "No tasks yet.", () => (
            <TaskList
              tasks={tasks}
              toggleForm={task =>
                setBlockForm({ block: task, isUpdateBlock: true })
              }
            />
          ))
        }
      />
    );
  };

  const renderProjects = () => {
    return (
      <BlockChildren
        parent={block}
        getChildrenIDs={() => block.projects || []}
        render={projects =>
          renderChildrenGroup(projects, "No projects yet.", () => (
            <ProjectList projects={projects} onClick={onClickChild} />
          ))
        }
      />
    );
  };

  const renderGroups = () => {
    return (
      <BlockChildren
        parent={block}
        getChildrenIDs={() => block.groups || []}
        render={groups =>
          renderChildrenGroup(groups, "No groups yet.", () => (
            <GroupList groups={groups} onClick={onClickChild} />
          ))
        }
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
            {renderChildrenRoutes()}
          </StyledContainer>
        )}
      </StyledContainer>
    );
  };

  const renderDesktop = () => {
    // TODO: render form without nav menu and have a back or cancelbutton
    return (
      <StyledFillContainer>
        {renderHeader()}
        <StyledBodyContainer>
          {showBlockForm ? (
            renderForms()
          ) : showAddCollaboratorsForm ? (
            renderAddCollaboratorForm()
          ) : (
            <React.Fragment>
              <div>{renderLandingMenu()}</div>
              <StyledChildrenContainer>
                {renderChildrenRoutes(false)}
              </StyledChildrenContainer>
            </React.Fragment>
          )}
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
      <BlockChildren
        parent={block}
        getChildrenIDs={getChildrenIDsFunc}
        render={() => <BD blockID={childID!} notFoundMessage={message} />}
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

export default BA;

const StyledNavContainer = styled.div({
  display: "flex",
  flexDirection: "column",
  maxWidth: "500px",
  width: "100%"
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
  marginRight: "16px",
  fontSize: "24px",
  marginBottom: "0"
});

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

const StyledChildrenContainer = styled.div({
  display: "flex",
  flex: 1
});

const StyledFormContainer = styled.div({
  maxWidth: "400px"
});

const StyledFlexColumnContainer = styled.div({
  display: "flex",
  flexDirection: "column"
});
