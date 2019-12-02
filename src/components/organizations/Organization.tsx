import styled from "@emotion/styled";
import { Badge } from "antd";
import React from "react";
import { useHistory } from "react-router";
import { Redirect, Route, Switch } from "react-router-dom";
import { IBlock } from "../../models/block/block";
import loadBlockCollaborationRequestsOperationFunc from "../../redux/operations/block/loadBlockCollaborationRequests";
import loadBlockCollaboratorsOperationFunc from "../../redux/operations/block/loadBlockCollaborators";
import {
  getBlockCollaborationRequestsOperationID,
  getBlockCollaboratorsOperationID
} from "../../redux/operations/operationIDs";
import BlockChildren from "../board/BC";
import GeneralErrorList from "../GeneralErrorList";
import GroupList from "../group/GroupList";
import useOperation, { IUseOperationStatus } from "../hooks/useOperation";
import Loading from "../Loading";
import ProjectList from "../project/ProjectList";
import List from "../styled/List";
import TaskList from "../task/TaskList";

export interface IOrganizationProps {
  organization: IBlock;
}

const Organization: React.FC<IOrganizationProps> = props => {
  const { organization } = props;
  const history = useHistory();
  const organizationPath = "/app/organizations/:organizationID";
  console.log(props);

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
    type MenuType = "groups" | "tasks" | "projects" | "collaborators";
    const menuItems: MenuType[] = [
      "groups",
      "tasks",
      "projects",
      "collaborators"
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

        default:
          return null;
      }
    };

    const onClickItem = (item: MenuType) => {
      history.push(`${window.location.pathname}/${item}`);
    };

    return (
      <StyledMenuContainer>
        <List
          dataSource={menuItems}
          renderItem={item => (
            <StyledMenuItem onClick={() => onClickItem(item)}>
              <StyledMenuItemTitle>{item}</StyledMenuItemTitle>
              {renderBadge(item)}
            </StyledMenuItem>
          )}
        />
      </StyledMenuContainer>
    );
  };

  const renderHeader = () => {
    return null;
  };

  const renderTasks = () => {
    return (
      <BlockChildren
        parent={organization}
        getChildrenIDs={() => organization.tasks}
        renderChildren={tasks => <TaskList tasks={tasks} />}
      />
    );
  };

  const renderProjects = () => {
    return (
      <BlockChildren
        parent={organization}
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
        getChildrenIDs={() => organization.groups}
        renderChildren={groups => <GroupList groups={groups} />}
      />
    );
  };

  const renderCollaborators = () => {
    return null;
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
      <Switch>
        <Route
          exact
          path={organizationPath}
          render={renderOrganizationLandingMenu}
        />
        <Route path={`${organizationPath}/tasks`} render={renderTasks} />
        <Route path={`${organizationPath}/groups`} render={renderGroups} />
        <Route path={`${organizationPath}/projects`} render={renderProjects} />
        <Route
          path={`${organizationPath}/collaborators`}
          render={renderCollaborators}
        />
        <Route
          path={`${organizationPath}/*`}
          render={() => <Redirect to={organizationPath} />}
        />
      </Switch>
    );
  };

  return render();
};

export default Organization;

const StyledMenuContainer = styled.div({
  display: "flex",
  flexDirection: "column",
  width: "300px"
});

const StyledMenuItem = styled.div({
  padding: "12px",
  fontSize: "16px",
  textTransform: "capitalize",
  display: "flex"
});

const StyledMenuItemTitle = styled.div({
  display: "flex",
  flex: 1,
  marginRight: "16px"
});
