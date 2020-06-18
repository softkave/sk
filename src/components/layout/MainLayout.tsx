import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Notifications from "../notification/Notifications";
import OrganizationListContainer from "../org/OrganizationListContainer";
import StyledContainer from "../styled/Container";
import Header from "./Header";
import LayoutMenu from "./LayoutMenu";

const MainLayout: React.FC<{}> = () => {
  const [showMenu, setShowMenu] = React.useState(true);

  const toggleShowMenu = React.useCallback(() => setShowMenu(!showMenu), [
    showMenu,
  ]);

  return (
    <StyledContainer s={{ height: "100%" }}>
      {showMenu && <LayoutMenu onToggleMenu={toggleShowMenu} />}
      <StyledContainer s={{ flexDirection: "column", height: "100%" }}>
        <Header showMenuIcon={!showMenu} onToggleMenu={toggleShowMenu} />
        <StyledContainer s={{ flex: 1, overflow: "hidden" }}>
          <Switch>
            <Route path="/app/notifications" component={Notifications} />
            <Route
              path="/app/organizations"
              component={OrganizationListContainer}
            />
            {/* <Route exact path="/app" component={HomeMenu} /> */}
            <Route
              exact
              path="*"
              render={() => <Redirect to="/app/organizations" />}
            />
          </Switch>
        </StyledContainer>
      </StyledContainer>
    </StyledContainer>
  );
};

export default MainLayout;
