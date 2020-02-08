import React from "react";
import { Route, Switch } from "react-router-dom";
import Notifications from "../notification/Notifications";
import OrganizationListContainer from "../org/OrganizationListContainer";
import StyledContainer from "../styled/Container";
import Header from "./Header";
import HomeMenu from "./HomeMenu";

const MainLayout: React.FC<{}> = () => {
  return (
    <StyledContainer s={{ flexDirection: "column", height: "100%" }}>
      <Header />
      <StyledContainer s={{ flex: 1 }}>
        <Switch>
          <Route path="/app/notifications" component={Notifications} />
          <Route
            path="/app/organizations"
            component={OrganizationListContainer}
          />
          <Route exact path="/app" component={HomeMenu} />
        </Switch>
      </StyledContainer>
    </StyledContainer>
  );
};

export default MainLayout;
