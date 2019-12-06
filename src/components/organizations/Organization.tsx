import styled from "@emotion/styled";
import { Badge, Drawer, Dropdown, Menu, Modal } from "antd";
import React from "react";
import { useHistory } from "react-router";
import { Redirect, Route, Switch } from "react-router-dom";
import { BlockType, IBlock } from "../../models/block/block";
import { getBlockValidChildrenTypes } from "../../models/block/utils";
import loadBlockCollaborationRequestsOperationFunc from "../../redux/operations/block/loadBlockCollaborationRequests";
import loadBlockCollaboratorsOperationFunc from "../../redux/operations/block/loadBlockCollaborators";
import {
  getBlockCollaborationRequestsOperationID,
  getBlockCollaboratorsOperationID
} from "../../redux/operations/operationIDs";
import BlockChildren from "../board/BC";
import C from "../collaborator/C";
import CR from "../collaborator/CR";
import DeleteButtonWithPrompt from "../DeleteButtonWithPrompt";
import GeneralErrorList from "../GeneralErrorList";
import GroupList from "../group/GroupList";
import useOperation, { IUseOperationStatus } from "../hooks/useOperation";
import Loading from "../Loading";
import ProjectList from "../project/ProjectList";
import StyledFlexColumnContainer from "../styled/ColumnContainer";
import StyledFlatButton from "../styled/FlatButton";
import StyledFlexContainer from "../styled/FlexContainer";
import List from "../styled/List";
import StyledCapitalizeText from "../StyledCapitalizeText";
import TaskList from "../task/TaskList";
import ProjectForm from "../project/ProjectForm";
import ProjectFormContainer from "../project/ProjectFormContainer";
import GroupFormContainer from "../group/GroupFormContainer";
import TaskFormContainer from "../task/TaskFormContainer";
import { INewBlock } from "../block/getNewBlock";

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

export interface IOrganizationProps {
  organization: IBlock;
}

const Organization: React.FC<IOrganizationProps> = props => {
  const { organization } = props;
  const history = useHistory();
  const [blockForm, setBlockForm] = React.useState<IBlockFormState | null>(
    null
  );

  const organizationPath = "/app/organizations/:organizationID";

  const loadOrgCollaborators = (loadProps: IUseOperationStatus) => {
    if (!!!loadProps.operation) {
      loadBlockCollaboratorsOperationFunc({ block: organization });
    }
  };

  const loadOrgCollaborationRequests = (loadProps: IUseOperationStatus) => {
    if (!!!loadProps.operation) {
      loadBlockCollaborationRequestsOperationFunc({ block: organization });
    }
  };

  const loadCollaboratorsStatus = useOperation(
    {
      operationID: getBlockCollaboratorsOperationID,
      resourceID: organization.customId
    },
    loadOrgCollaborators
  );

  const loadRequestsStatus = useOperation(
    {
      operationID: getBlockCollaborationRequestsOperationID,
      resourceID: organization.customId
    },
    loadOrgCollaborationRequests
  );

  const renderOrganizationLandingMenu = () => {
    const menuItems: IMenuItemType[] = [
      { key: "groups", label: "Groups" },
      { key: "tasks", label: "Tasks" },
      { key: "projects", label: "Projects" },
      { key: "collaborators", label: "Collaborators" },
      { key: "collaboration-requests", label: "Collaboration Requests" }
    ];

    const renderBadge = (item: MenuType) => {
      switch (item) {
        case "groups":
          return <Badge count={organization.groups.length} />;

        case "tasks":
          return <Badge count={organization.tasks.length} />;

        case "projects":
          return <Badge count={organization.projects.length} />;

        case "collaborators":
          return <Badge count={organization.collaborators.length} />;

        case "collaboration-requests":
          return <Badge count={organization.collaborationRequests.length} />;

        default:
          return null;
      }
    };

    const onClickItem = (item: MenuType) => {
      history.push(`${window.location.pathname}/${item}`);
    };

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

  const getBlockTypeName = (type: BlockType) => {
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

  const promptConfirmDelete = () => {
    const blockTypeFullName = getBlockTypeName(organization.type);
    const onDeletePromptMessage = (
      <div>
        Are you sure you want to delete{" "}
        <StyledCapitalizeText>{blockTypeFullName}</StyledCapitalizeText>?
      </div>
    );

    Modal.confirm({
      title: onDeletePromptMessage,
      okText: "Yes",
      cancelText: "No",
      okType: "danger",
      onOk() {},
      onCancel() {
        // do nothing
      }
    });
  };

  // const renderForms = () => {
  //   if (blockForm) {
  //     const blockTypeFullName = getBlockTypeName(organization.type);
  //     const showFormType = blockForm.block.type;
  //     const formType = blockForm.isAddBlock ? "create" : "edit";
  //     const formTitle = (
  //   <StyledCapitalizeText>{formType} {blockTypeFullName}</StyledCapitalizeText>
  //     )

  //     const availableParents = this.getAvailableParents();
  //     const formBlockParents = filterValidParentsForBlockType(
  //       availableParents,
  //       formBlock!.type
  //     );

  //     return (
  //       <React.Fragment>
  //         {showFormType === "project" && (
  //           <ProjectFormContainer
  //             customId={formBlock!.customId}
  //             existingProjects={this.getExistingNames(projects)}
  //             initialValues={formBlock}
  //             onClose={() => this.toggleForm(formType)}
  //             onSubmit={(data, options) => this.onSubmitData(data, options)}
  //             operationID={blockFormOperationId}
  //             submitLabel={formTitle}
  //             title={formTitle}
  //             parents={formBlockParents}
  //           />
  //         )}
  //         {showFormType === "group" && (
  //           <GroupFormContainer
  //             operationID={blockFormOperationId}
  //             customId={formBlock!.customId}
  //             onSubmit={(data, options) => this.onSubmitData(data, options)}
  //             onClose={() => this.toggleForm(formType)}
  //             initialValues={formBlock}
  //             existingGroups={this.getExistingNames(groups)}
  //             submitLabel={formTitle}
  //             title={formTitle}
  //             parents={formBlockParents}
  //           />
  //         )}
  //         {showFormType === "task" && (
  //           <TaskFormContainer
  //             operationID={blockFormOperationId}
  //             customId={formBlock!.customId}
  //             collaborators={collaborators}
  //             onSubmit={(data, options) => this.onSubmitData(data, options)}
  //             onClose={() => this.toggleForm(formType)}
  //             initialValues={
  //               isFormForAddBlock && actLikeRootBlock
  //                 ? {
  //                     ...formBlock!,
  //                     taskCollaborators: [assignTask(user)]
  //                   }
  //                 : formBlock
  //             }
  //             user={user}
  //             submitLabel={formTitle}
  //             title={formTitle}
  //             parents={formBlockParents}
  //           />
  //         )}
  //       </React.Fragment>
  //     );
  //   }
  // }

  const renderHeader = () => {
    type CreateMenuKey = BlockType | "collaborator";
    type SettingsMenuKey = "edit" | "delete";
    const onSelectCreateMenuItem = (key: CreateMenuKey) => {
      switch (key) {
      }
    };

    const childrenTypes = getBlockValidChildrenTypes(organization.type);
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

    const blockTypeFullName = getBlockTypeName(organization.type);
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
        <StyledHeaderName>{organization.name}</StyledHeaderName>
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
        parent={organization}
        emptyMessage="No tasks yet."
        getChildrenIDs={() => organization.tasks}
        renderChildren={tasks => <TaskList tasks={tasks} />}
      />
    );
  };

  const renderProjects = () => {
    return (
      <BlockChildren
        parent={organization}
        emptyMessage="No projects yet."
        getChildrenIDs={() => organization.projects}
        renderChildren={projects => (
          <ProjectList projects={projects} setCurrentProject={() => null} />
        )}
      />
    );
  };

  const renderGroups = () => {
    return (
      <BlockChildren
        parent={organization}
        emptyMessage="No groups yet."
        getChildrenIDs={() => organization.groups}
        renderChildren={groups => <GroupList groups={groups} />}
      />
    );
  };

  const renderCollaborators = () => {
    return <C organization={organization} />;
  };

  const renderCollaborationRequests = () => {
    return <CR organization={organization} />;
  };

  const shouldRenderLoading = () => {
    return (
      loadCollaboratorsStatus.isLoading ||
      !!!loadCollaboratorsStatus.operation ||
      loadRequestsStatus.isLoading ||
      !!!loadRequestsStatus.operation
    );
  };

  const getLoadErrors = () => {
    const loadErrors: any[] = [];

    if (loadCollaboratorsStatus.error) {
      loadErrors.push(loadCollaboratorsStatus.error);
    }

    if (loadRequestsStatus.error) {
      loadErrors.push(loadRequestsStatus.error);
    }

    return loadErrors;
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
      <StyledContainer>
        {renderHeader()}
        <StyledBodyContainer>
          <Switch>
            <Route
              exact
              path={organizationPath}
              render={renderOrganizationLandingMenu}
            />
            <Route path={`${organizationPath}/tasks`} render={renderTasks} />
            <Route path={`${organizationPath}/groups`} render={renderGroups} />
            <Route
              path={`${organizationPath}/projects`}
              render={renderProjects}
            />
            <Route
              path={`${organizationPath}/collaborators`}
              render={renderCollaborators}
            />
            <Route
              path={`${organizationPath}/collaboration-requests`}
              render={renderCollaborationRequests}
            />
            <Route
              path={`${organizationPath}/*`}
              render={() => <Redirect to={organizationPath} />}
            />
          </Switch>
        </StyledBodyContainer>
      </StyledContainer>
    );
  };

  return render();
};

export default Organization;

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

const StyledHeaderName = styled.div({
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
