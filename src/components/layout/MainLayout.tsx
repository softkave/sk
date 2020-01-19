import React from "react";
import { Route, Switch } from "react-router-dom";
import AssignedTasksMain from "../assigned-tasks/AT";
import Notifications from "../notification/A";
import OrganizationListContainer from "../org/OLC";
import StyledContainer from "../styled/Container";
import Header from "./Header";
import HomeMenu from "./HomeMenu";

const MainLayout: React.FC<{}> = () => {
  return (
    <StyledContainer s={{ flexDirection: "column", height: "100%" }}>
      <Header />
      <Switch>
        <Route path="/app/notifications" component={Notifications} />
        <Route path="/app/assigned-tasks" component={AssignedTasksMain} />
        <Route
          path="/app/organizations"
          component={OrganizationListContainer}
        />
        <Route exact path="/app" component={HomeMenu} />
      </Switch>
    </StyledContainer>
  );
};

export default MainLayout;