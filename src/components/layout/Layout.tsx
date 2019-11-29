import styled from "@emotion/styled";
import { Drawer } from "antd";
import React from "react";
import Media from "react-media";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useRouteMatch } from "react-router";
import { Route, Switch } from "react-router-dom";
import { IUser } from "../../models/user/user";
import logoutUserOperationFunc from "../../redux/operations/session/logoutUser";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import { IReduxState } from "../../redux/store";
import AssignedTasksMain from "../assigned-tasks/AssignedTasksMain";
import NotificationsMain from "../notifications/NotificationsMain";
import OrganizationsMain from "../organizations/OrganizationsMain";
import StyledFlexColumnContainer from "../styled/ColumnContainer";
import StyledFlexFillContainer from "../styled/FillContainer";
import theme from "../theme";
import Header from "./Header";
import NavigationMenuList from "./NavigationMenuList";
import { getCurrentBaseNavPath } from "./path";

const Layout: React.SFC<{}> = props => {
  const dispatch = useDispatch();
  const history = useHistory();
  const routeMatch = useRouteMatch()!;
  const [isMobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isDesktopMenuOpen, setDesktopMenuOpen] = React.useState(true);
  const user = useSelector<IReduxState, IUser>(getSignedInUserRequired);
  const currentBaseNav = getCurrentBaseNavPath();

  const onLogout = () => {
    dispatch(logoutUserOperationFunc());
  };

  const renderBody = () => {
    return (
      <Switch>
        <Route path="/app/notifications" component={NotificationsMain} />
        <Route path="/app/assigned-tasks" component={AssignedTasksMain} />
        <Route path="/app/organizations" component={OrganizationsMain} />
      </Switch>
    );
  };

  const renderForMobile = () => {
    const toggleMobileMenu = () => {
      setMobileMenuOpen(!isMobileMenuOpen);
    };

    const navigateToPath = (path: string) => {
      toggleMobileMenu();
      history.push(`/app/${path}`);
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
      setDesktopMenuOpen(!isDesktopMenuOpen);
    };

    const navigateToPath = (path: string) => {
      history.push(`/app/${path}`);
    };

    return (
      <StyledFlexFillContainer>
        <StyledFlexColumnContainer>
          <Header
            user={user}
            onLogout={onLogout}
            onToggleMenu={toggleDesktopMenu}
          />
          <StyledFlexFillContainer>
            {isDesktopMenuOpen && (
              <StyledDesktopMenuContainer>
                <NavigationMenuList
                  currentItemKey={currentBaseNav}
                  onClick={navigateToPath}
                />
              </StyledDesktopMenuContainer>
            )}
            <StyledFlexFillContainer>{renderBody()}</StyledFlexFillContainer>
          </StyledFlexFillContainer>
        </StyledFlexColumnContainer>
      </StyledFlexFillContainer>
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

const StyledDesktopMenuContainer = styled.div({
  marginTop: "64px",
  width: "240px"
});
