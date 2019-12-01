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
import GeneralErrorList from "../GeneralErrorList";
import useOperation, { IUseOperationStatus } from "../hooks/useOperation";
import Loading from "../Loading";
import List from "../styled/List";

export interface IOrganizationProps {
  organization: IBlock;
}

const Organization: React.SFC<IOrganizationProps> = props => {
  const { organization } = props;
  const history = useHistory();
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

  const loadCollaboratorsOperation = useOperation(
    {
      operationID: getBlockCollaboratorsOperationID,
      resourceID: organization.customId
    },
    loadOrgCollaborators
  );

  const loadCollaborationRequestsOperation = useOperation(
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
    return null;
  };

  const renderProjects = () => {
    return null;
  };

  const renderGroups = () => {
    return null;
  };

  const renderCollaborators = () => {
    return null;
  };

  const shouldRenderLoading = () => {
    return (
      loadCollaboratorsOperation.isLoading ||
      !!!loadCollaboratorsOperation.operation ||
      loadCollaborationRequestsOperation.isLoading ||
      !!!loadCollaborationRequestsOperation.operation
    );
  };

  const getLoadErrors = () => {
    const loadErrors: any[] = [];

    if (loadCollaboratorsOperation.error) {
      loadErrors.push(loadCollaboratorsOperation.error);
    }

    if (loadCollaborationRequestsOperation.error) {
      loadErrors.push(loadCollaborationRequestsOperation.error);
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
