import styled from "@emotion/styled";
import { Badge } from "antd";
import React from "react";
import { useHistory } from "react-router";
import { Redirect, Route, Switch } from "react-router-dom";
import { IBlock } from "../../models/block/block";
import StyledFlexFillContainer from "../styled/FillContainer";
import List from "../styled/List";

export interface IOrganizationProps {
  organization: IBlock;
}

const Organization: React.SFC<IOrganizationProps> = props => {
  const { organization } = props;
  const history = useHistory();
  const organizationPath = "/app/organizations/:organizationID";

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
