import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Notifications from "../notification/Notifications";
import OrganizationListContainer from "../org/OrganizationListContainer";
import StyledContainer from "../styled/Container";
import HeaderOld from "./HeaderOld";

const MainLayoutOld: React.FC<{}> = () => {
  return (
    <StyledContainer s={{ flexDirection: "column", height: "100%" }}>
      <HeaderOld />
      <StyledContainer s={{ flex: 1, overflow: "hidden" }}>
        <Switch>
          <Route path="/app/notifications" component={Notifications} />
          <Route
            path="/app/organizations"
            component={OrganizationListContainer}
          />
          <Route
            exact
            path="*"
            render={() => <Redirect to="/app/organizations" />}
          />
        </Switch>
      </StyledContainer>
    </StyledContainer>
  );
};

export default MainLayoutOld;
