import { Drawer } from "antd";
import React from "react";
import Media from "react-media";
import { useStore } from "react-redux";
import { useHistory, useRouteMatch } from "react-router";
import { Route, Switch } from "react-router-dom";
import logoutUserOperationFunc from "../../redux/operations/session/logoutUser";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import { IReduxState } from "../../redux/store";
import AssignedTasksMain from "../assigned-tasks/AssignedTasksMain";
import NotificationsMain from "../notifications/NotificationsMain";
import OrganizationsMain from "../organizations/OrganizationsMain";
import StyledFlexFillContainer from "../styled/FillContainer";
import theme from "../theme";
import Header from "./Header";
import NavigationMenuList, {
  getCurrentBaseNavPath
} from "./NavigationMenuList";

const Layout: React.SFC<{}> = props => {
  const store = useStore<IReduxState>();
  const history = useHistory();
  const routeMatch = useRouteMatch()!;
  const [isMobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isDesktopMenuOpen, setDesktopMenuOpen] = React.useState(true);
  const state = store.getState();
  const user = getSignedInUserRequired(state);
  const currentBaseNav = getCurrentBaseNavPath();

  const onLogout = () => {
    logoutUserOperationFunc(state, store.dispatch);
  };

  const renderBody = () => {
    return (
      <Switch>
        <Route path="/notifications" component={NotificationsMain} />
        <Route path="/assigned-tasks" component={AssignedTasksMain} />
        <Route path="/organizations" component={OrganizationsMain} />
      </Switch>
    );
  };

  const renderForMobile = () => {
    const toggleMobileMenu = () => {
      setMobileMenuOpen(!isMobileMenuOpen);
    };

    const navigateToPath = (path: string) => {
      toggleMobileMenu();
      history.push(`${routeMatch.url}/${path}`);
    };

    return (
      <div>
        <Header
          user={user}
          onLogout={onLogout}
          onToggleMenu={toggleMobileMenu}
        />
        <StyledFlexFillContainer>
          <Drawer visible={isMobileMenuOpen} onClose={toggleMobileMenu}>
            <NavigationMenuList
              currentItemKey={currentBaseNav}
              onClick={navigateToPath}
            />
          </Drawer>
          <StyledFlexFillContainer>{renderBody()}</StyledFlexFillContainer>
        </StyledFlexFillContainer>
      </div>
    );
  };

  const renderForDesktop = () => {
    const toggleDesktopMenu = () => {
      setDesktopMenuOpen(!isMobileMenuOpen);
    };

    const navigateToPath = (path: string) => {
      toggleDesktopMenu();
      history.push(`${routeMatch.url}/${path}`);
    };

    return (
      <div>
        <Header
          user={user}
          onLogout={onLogout}
          onToggleMenu={toggleDesktopMenu}
        />
        <StyledFlexFillContainer>
          {isDesktopMenuOpen && (
            <div>
              <NavigationMenuList
                currentItemKey={currentBaseNav}
                onClick={navigateToPath}
              />
            </div>
          )}
          <StyledFlexFillContainer>{renderBody()}</StyledFlexFillContainer>
        </StyledFlexFillContainer>
      </div>
    );
  };

  const render = () => {
    return (
      <Media queries={{ mobile: `(min-width: ${theme.breakpoints.md})` }}>
        {matches => (
          <React.Fragment>
            {matches.mobile && renderForMobile()}
            {!matches.mobile && renderForDesktop()}
          </React.Fragment>
        )}
      </Media>
    );
  };

  return render();
};

export default Layout;
